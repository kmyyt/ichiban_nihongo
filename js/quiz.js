// 퀴즈 및 미니게임 모듈 (글자타일 단어 비중 상향 + 중복 출제 방지 + 타임어택/직접입력/짝맞추기)
const QuizModule = (() => {
  let qMode = 'timeattack'; // 'timeattack' | 'tile' | 'input' | 'memory'
  let currentQuestion = null;
  let mcChoices = [];
  let selectedTiles = [];
  let tilePool = [];
  let customPool = null;

  // 글자타일 퀴즈 중복 출제 방지용 이력 관리
  let usedTileQuestionKeys = new Set();
  let lastTilePoolSignature = '';
  let tileCycleResetNotice = '';

  // 타임어택 설정 및 상태 (20초 / 30초 / 60초)
  const DURATION_OPTIONS = [
    { sec: 20, label: '20초' },
    { sec: 30, label: '30초' },
    { sec: 60, label: '1분' }
  ];
  let selectedDuration = 60;
  let timeLeft = 60;
  let score = 0;
  let combo = 0;
  let timerId = null;
  let timerRunning = false;

  // 메모리 게임 비동기 타이머 관리
  let memoryFlipTimer = null;

  // 타일 보완용 히라가나 은행
  const KANA_TILE_BANK = [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
    'さ', 'し', 'す', 'せ', 'そ',
    'た', 'ち', 'つ', 'て', 'と',
    'な', 'に', 'ぬ', 'ね', 'の',
    'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ま', 'み', 'む', 'め', 'も',
    'や', 'ゆ', 'よ',
    'ら', 'り', 'る', 'れ', 'ろ',
    'わ', 'を', 'ん',
    'が', 'ぎ', 'ぐ', 'げ', 'ご',
    'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
    'だ', 'ぢ', 'づ', 'で', 'ど',
    'ば', 'び', 'ぶ', 'べ', 'ぼ',
    'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'
  ];

  function clearMemoryTimer() {
    if (memoryFlipTimer) {
      clearTimeout(memoryFlipTimer);
      memoryFlipTimer = null;
    }
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    timerRunning = false;
  }

  function getAllItems() {
    if (window.ContentDB && typeof window.ContentDB.getAllItems === 'function') {
      const items = window.ContentDB.getAllItems();
      if (Array.isArray(items)) return items.filter(Boolean);
    }
    return Array.isArray(window.JP_DATA && window.JP_DATA.items)
      ? window.JP_DATA.items.filter(Boolean)
      : [];
  }

  function resetTileHistory() {
    usedTileQuestionKeys = new Set();
    tileCycleResetNotice = '';
  }

  function setCustomPool(itemsList) {
    customPool = Array.isArray(itemsList) && itemsList.length ? [...itemsList] : null;
    currentQuestion = null;
    mcChoices = [];
    selectedTiles = [];
    tilePool = [];
    resetTileHistory();
  }

  function clearCustomPool() {
    customPool = null;
    currentQuestion = null;
    mcChoices = [];
    selectedTiles = [];
    tilePool = [];
    resetTileHistory();
  }

  function resolvePool(categoryOrPool) {
    if (Array.isArray(categoryOrPool) && categoryOrPool.length) {
      return categoryOrPool.filter(item => item && item.id);
    }
    if (Array.isArray(customPool) && customPool.length) {
      return customPool.filter(item => item && item.id);
    }
    if (
      window.ListFilterModule &&
      typeof window.ListFilterModule.getActivePool === 'function'
    ) {
      const filterPool = window.ListFilterModule.getActivePool();
      if (Array.isArray(filterPool) && filterPool.length) {
        return filterPool.filter(item => item && item.id);
      }
    }

    const all = getAllItems().filter(item => item && item.id);
    if (!all.length) return [];
    const category = categoryOrPool;
    if (!category || category === 'all') return all;
    const filtered = all.filter(i => i.category === category);
    if (filtered.length) return filtered;
    const hiraFallback = all.filter(i => i.category === 'hiragana');
    return hiraFallback.length ? hiraFallback : all;
  }

  function setDuration(sec) {
    const valid = DURATION_OPTIONS.some(opt => opt.sec === Number(sec));
    selectedDuration = valid ? Number(sec) : 60;
    stopTimer();
    timeLeft = selectedDuration;
    score = 0;
    combo = 0;
  }

  function setMode(mode) {
    stopTimer();
    clearMemoryTimer();
    qMode = mode || 'timeattack';
    currentQuestion = null;
    mcChoices = [];
    selectedTiles = [];
    tilePool = [];
  }

  function cleanTarget(jp) {
    return String(jp || '')
      .replace('(な)', '')
      .replace(/[。、.\s]/g, '')
      .trim();
  }

  function formatMeaningCard(item) {
    const romaji = String(item?.romaji || '').trim();
    const meaning = String(item?.meaning || '').trim();
    if (romaji && meaning) return `${romaji} · ${meaning}`;
    return romaji || meaning || cleanTarget(item?.jp) || '학습 카드';
  }

  // 글자타일 전용: 단어 비중을 크게 높인 문제 후보군 생성
  function buildTileQuestionCandidates(pool) {
    const uniqueCandidates = [];
    const seenKeys = new Set();

    const registerCandidate = (cand, weight) => {
      const targetJp = cleanTarget(cand.jp);
      const meaning = String(cand.meaning || '').trim();
      if (!targetJp || !meaning) return;

      const key = `${targetJp}__${meaning}`;
      if (seenKeys.has(key)) return;
      seenKeys.add(key);

      uniqueCandidates.push({
        ...cand,
        questionKey: key,
        jp: targetJp,
        meaning,
        weight: Math.max(1, weight)
      });
    };

    // 1) 선택된 풀의 words 배열 내 단어를 높은 가중치로 등록
    pool.forEach(item => {
      const words = Array.isArray(item.words) ? item.words : [];
      words.forEach((w, idx) => {
        const wJp = cleanTarget(w?.jp);
        const wMeaning = String(w?.meaning || '').trim();
        if (!wJp || !wMeaning) return;

        registerCandidate(
          {
            id: item.id,
            sourceItem: item,
            category: item.category,
            row: item.row,
            emoji: w.emoji || item.emoji || '📝',
            meaning: wMeaning,
            jp: wJp,
            romaji: w.romaji || item.romaji || '',
            isWord: true,
            wordIndex: idx
          },
          wJp.length >= 2 ? 7 : 4
        );
      });
    });

    // 2) 선택된 풀의 항목 중 단어(2글자 이상 또는 vocab 카테고리)는 중간 가중치, 단문자는 낮은 가중치로 등록
    pool.forEach(item => {
      const iJp = cleanTarget(item.jp);
      const iMeaning = String(item.meaning || '').trim();
      if (!iJp || !iMeaning) return;

      const isMultiChar = iJp.length >= 2;
      const isVocabCategory = ['noun', 'i_adj', 'na_adj', 'verb'].includes(item.category);
      const weight = isVocabCategory ? 6 : (isMultiChar ? 5 : 1);

      registerCandidate(
        {
          id: item.id,
          sourceItem: item,
          category: item.category,
          row: item.row,
          emoji: item.emoji || (isMultiChar ? '📝' : '🔤'),
          meaning: iMeaning,
          jp: iJp,
          romaji: item.romaji || '',
          isWord: isMultiChar || isVocabCategory,
          wordIndex: -1
        },
        weight
      );
    });

    // 3) 단어 후보가 거의 없으면 전체 항목의 words에서 추가 보완
    const wordCount = uniqueCandidates.filter(c => c.isWord).length;
    if (wordCount < 5) {
      getAllItems().forEach(item => {
        const words = Array.isArray(item.words) ? item.words : [];
        words.forEach((w, idx) => {
          const wJp = cleanTarget(w?.jp);
          const wMeaning = String(w?.meaning || '').trim();
          if (!wJp || !wMeaning) return;

          registerCandidate(
            {
              id: item.id,
              sourceItem: item,
              category: item.category,
              row: item.row,
              emoji: w.emoji || item.emoji || '📝',
              meaning: wMeaning,
              jp: wJp,
              romaji: w.romaji || item.romaji || '',
              isWord: true,
              wordIndex: idx
            },
            4
          );
        });
      });
    }

    return uniqueCandidates;
  }

  function pickWeightedCandidate(candidates) {
    const totalWeight = candidates.reduce((acc, c) => acc + (c.weight || 1), 0);
    let r = Math.random() * totalWeight;
    for (const cand of candidates) {
      r -= (cand.weight || 1);
      if (r <= 0) return cand;
    }
    return candidates[candidates.length - 1];
  }

  // 글자타일 퀴즈 문제 생성 (중복 출제 방지 적용)
  function buildTileQuestion(pool) {
    if (!pool.length) {
      currentQuestion = null;
      tilePool = [];
      selectedTiles = [];
      return;
    }

    const poolSig = pool.map(i => i.id).join('|');
    if (poolSig !== lastTilePoolSignature) {
      lastTilePoolSignature = poolSig;
      resetTileHistory();
    }

    const allCandidates = buildTileQuestionCandidates(pool);
    if (!allCandidates.length) {
      currentQuestion = null;
      tilePool = [];
      selectedTiles = [];
      return;
    }

    let unusedCandidates = allCandidates.filter(c => !usedTileQuestionKeys.has(c.questionKey));
    if (!unusedCandidates.length) {
      usedTileQuestionKeys.clear();
      unusedCandidates = allCandidates;
      tileCycleResetNotice = '준비된 문제를 모두 풀어서 이력을 초기화하고 새 라운드를 시작했습니다!';
    } else {
      tileCycleResetNotice = '';
    }

    const picked = pickWeightedCandidate(unusedCandidates);
    usedTileQuestionKeys.add(picked.questionKey);

    const remainingCount = allCandidates.filter(c => !usedTileQuestionKeys.has(c.questionKey)).length;
    currentQuestion = {
      ...picked,
      remainingCount,
      totalCount: allCandidates.length
    };

    if (window.DB && typeof window.DB.touchItemAsSeen === 'function') {
      window.DB.touchItemAsSeen(picked.id);
    }

    const target = cleanTarget(currentQuestion.jp) || 'あ';
    const targetChars = target.split('').filter(Boolean);

    const poolChars = pool
      .flatMap(item => {
        const base = cleanTarget(item.jp).split('');
        const subWords = Array.isArray(item.words)
          ? item.words.flatMap(w => cleanTarget(w?.jp).split(''))
          : [];
        return [...base, ...subWords];
      })
      .filter(ch => ch && !targetChars.includes(ch));

    const allChars = getAllItems()
      .flatMap(item => {
        const base = cleanTarget(item.jp).split('');
        const subWords = Array.isArray(item.words)
          ? item.words.flatMap(w => cleanTarget(w?.jp).split(''))
          : [];
        return [...base, ...subWords];
      })
      .filter(ch => ch && !targetChars.includes(ch));

    const bank = Array.from(
      new Set([...poolChars, ...allChars, ...KANA_TILE_BANK])
    ).filter(ch => !targetChars.includes(ch));

    const combined = [...targetChars];
    const desiredTotal = Math.max(8, targetChars.length + 4);
    let safety = 0;

    while (combined.length < desiredTotal && safety < 120) {
      safety += 1;
      const sourceBank = bank.length ? bank : KANA_TILE_BANK;
      const candidateChar = sourceBank[Math.floor(Math.random() * sourceBank.length)];
      if (candidateChar) combined.push(candidateChar);
    }

    tilePool = combined
      .map((ch, idx) => ({ id: idx, char: ch, used: false }))
      .sort(() => Math.random() - 0.5);
    selectedTiles = [];
  }

  function buildUniquePairSource(pool, maxPairs = 6) {
    const safePool = resolvePool(pool);
    const seenIds = new Set();
    const uniqueItems = [];

    for (const item of safePool) {
      if (!item || !item.id || seenIds.has(item.id)) continue;
      const jpText = cleanTarget(item.jp);
      const subText = formatMeaningCard(item);
      if (!jpText && !subText) continue;
      seenIds.add(item.id);
      uniqueItems.push(item);
    }

    const shuffled = [...uniqueItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(maxPairs, shuffled.length));
  }

  function buildMemoryDeck(chosenItems) {
    const deck = [];
    chosenItems.forEach((item, pairIndex) => {
      const pairKey = `${item.id}_${pairIndex}`;
      const jpText = cleanTarget(item.jp) || item.romaji || item.meaning || '일본어';
      const subText = formatMeaningCard(item);

      if (window.DB && typeof window.DB.touchItemAsSeen === 'function') {
        window.DB.touchItemAsSeen(item.id);
      }

      deck.push({
        uid: `${pairKey}_a`,
        pairId: pairKey,
        item,
        text: jpText,
        isJp: true
      });
      deck.push({
        uid: `${pairKey}_b`,
        pairId: pairKey,
        item,
        text: subText,
        isJp: false
      });
    });

    return deck.sort(() => Math.random() - 0.5);
  }

  function buildMultipleChoice(pool) {
    if (!pool.length) {
      currentQuestion = null;
      mcChoices = [];
      return;
    }
    const targetItem = pool[Math.floor(Math.random() * pool.length)];
    currentQuestion = targetItem;
    if (window.DB && typeof window.DB.touchItemAsSeen === 'function') {
      window.DB.touchItemAsSeen(targetItem.id);
    }

    const others = pool
      .filter(i => i.id !== targetItem.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [targetItem, ...others].sort(() => Math.random() - 0.5);
    mcChoices = options.map(opt => ({
      id: opt.id,
      label: formatMeaningCard(opt),
      isCorrect: opt.id === targetItem.id
    }));
  }

  function buildInputQuestion(pool) {
    if (!pool.length) {
      currentQuestion = null;
      return;
    }
    const withEmoji = pool.filter(
      i => i.emoji || (Array.isArray(i.words) && i.words.some(w => w.emoji))
    );
    const candidatePool = withEmoji.length ? withEmoji : pool;
    const rawPicked = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const wordWithEmoji = Array.isArray(rawPicked.words)
      ? rawPicked.words.find(w => w.emoji && cleanTarget(w.jp))
      : null;

    currentQuestion = {
      ...rawPicked,
      emoji: rawPicked.emoji || (wordWithEmoji ? wordWithEmoji.emoji : '🖼️'),
      meaning: rawPicked.emoji
        ? (rawPicked.meaning || '')
        : (wordWithEmoji ? (wordWithEmoji.meaning || '') : (rawPicked.meaning || '')),
      jp: rawPicked.emoji
        ? (rawPicked.jp || '')
        : (wordWithEmoji ? (wordWithEmoji.jp || '') : (rawPicked.jp || '')),
      romaji: rawPicked.emoji
        ? (rawPicked.romaji || '')
        : (wordWithEmoji ? (wordWithEmoji.romaji || '') : (rawPicked.romaji || ''))
    };
    if (window.DB && typeof window.DB.touchItemAsSeen === 'function') {
      window.DB.touchItemAsSeen(rawPicked.id);
    }
  }

  function render(category, onProgressChange) {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    const pool = resolvePool(category);
    if (!pool.length) {
      clearMemoryTimer();
      container.innerHTML = `<div class="card"><p class="hint-text">퀴즈를 출제할 데이터가 없습니다. 필터 조건을 확인해 주세요.</p></div>`;
      return;
    }

    if (qMode === 'timeattack') {
      clearMemoryTimer();
      if (!currentQuestion || !mcChoices.length) buildMultipleChoice(pool);
      renderTimeAttack(container, pool, onProgressChange);
    } else if (qMode === 'tile') {
      stopTimer();
      clearMemoryTimer();
      if (!currentQuestion || !tilePool.length || !currentQuestion.questionKey) {
        buildTileQuestion(pool);
      }
      renderTileQuiz(container, pool, onProgressChange);
    } else if (qMode === 'input') {
      stopTimer();
      clearMemoryTimer();
      if (!currentQuestion) buildInputQuestion(pool);
      renderInputQuiz(container, pool, onProgressChange);
    } else if (qMode === 'memory') {
      stopTimer();
      renderMemoryGame(container, pool, onProgressChange);
    }
  }

  function renderDurationSelectorHtml() {
    return `
      <div class="btn-row" style="justify-content:flex-start; margin-bottom:10px; gap:6px;" role="group" aria-label="타임어택 제한시간 선택">
        <span class="hint-text" style="font-weight:700;">⏱️ 제한시간:</span>
        ${DURATION_OPTIONS.map(opt => `
          <button
            type="button"
            class="btn ta-dur-btn ${selectedDuration === opt.sec ? 'primary' : ''}"
            data-sec="${opt.sec}"
            style="padding:5px 10px; font-size:0.76rem;"
          >${opt.label}</button>
        `).join('')}
      </div>
    `;
  }

  function renderTimeAttack(container, pool, onProgressChange) {
    if (!currentQuestion) return;
    const totalSec = selectedDuration || 60;
    const shownTime = timerRunning ? Math.max(0, timeLeft) : totalSec;
    const pct = Math.max(0, Math.min(100, Math.round((shownTime / totalSec) * 100)));

    container.innerHTML = `
      <div class="card quiz-box">
        ${renderDurationSelectorHtml()}

        <div style="display:flex; justify-content:space-between; align-items:center; font-weight:700; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
          <span>⏱️ 남은 시간: <span id="taTimeText">${shownTime}</span>초 (${totalSec}초 모드)</span>
          <span>점수: <span id="taScoreText">${score}</span>점 · 콤보: <span id="taComboText">${combo}</span></span>
        </div>

        <div class="progress-track" style="margin-bottom:12px;">
          <div class="progress-fill" id="taTimerBar" style="width:${pct}%;"></div>
        </div>

        <div class="jp-font" style="font-size:4rem; font-weight:900; margin:12px 0;">
          ${currentQuestion.jp || 'あ'}
        </div>
        <p class="hint-text">알맞은 발음과 뜻을 4지선다에서 고르세요 (문제 풀: ${pool.length}개)</p>

        <div class="choice-grid">
          ${mcChoices.map((c, idx) => `
            <button type="button" class="choice-btn ta-choice-btn" data-idx="${idx}">${c.label}</button>
          `).join('')}
        </div>

        <div id="taFeedback" style="min-height:24px; font-weight:700; margin-top:12px;"></div>

        <div class="btn-row" style="margin-top:12px;">
          <button type="button" class="primary-btn" id="taStartBtn">
            ${timerRunning ? '↺ 재시작' : `▶ ${totalSec}초 타임어택 시작`}
          </button>
          <button type="button" class="secondary-btn" id="taSpeakBtn">🔊 듣기</button>
        </div>
      </div>
    `;

    container.querySelectorAll('.ta-dur-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setDuration(Number(btn.dataset.sec));
        buildMultipleChoice(pool);
        renderTimeAttack(container, pool, onProgressChange);
      });
    });

    const startCountdown = () => {
      stopTimer();
      timeLeft = selectedDuration;
      score = 0;
      combo = 0;
      timerRunning = true;
      buildMultipleChoice(pool);
      renderTimeAttack(container, pool, onProgressChange);

      timerId = setInterval(() => {
        timeLeft -= 1;
        const safeLeft = Math.max(0, timeLeft);
        const tEl = document.getElementById('taTimeText');
        const bEl = document.getElementById('taTimerBar');
        if (tEl) tEl.textContent = String(safeLeft);
        if (bEl) {
          bEl.style.width = `${Math.max(0, Math.round((safeLeft / selectedDuration) * 100))}%`;
        }

        if (timeLeft <= 0) {
          stopTimer();
          if (window.DB && typeof window.DB.recordGameClear === 'function') {
            window.DB.recordGameClear(score, true);
          }
          if (typeof onProgressChange === 'function') onProgressChange();
          const fb = document.getElementById('taFeedback');
          if (fb) {
            fb.style.color = 'var(--accent)';
            fb.textContent = `⏰ ${selectedDuration}초 종료! 최종 점수: ${score}점`;
          }
          const startBtn = document.getElementById('taStartBtn');
          if (startBtn) startBtn.textContent = `▶ ${selectedDuration}초 타임어택 시작`;
        }
      }, 1000);
    };

    document.getElementById('taStartBtn')?.addEventListener('click', startCountdown);
    document.getElementById('taSpeakBtn')?.addEventListener('click', () => {
      if (window.StudyModule && typeof window.StudyModule.speakText === 'function') {
        window.StudyModule.speakText(currentQuestion.jp);
      }
    });

    container.querySelectorAll('.ta-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!timerRunning && timeLeft <= 0) return;
        const idx = Number(btn.dataset.idx);
        const choice = mcChoices[idx];
        const fb = document.getElementById('taFeedback');

        if (choice && choice.isCorrect) {
          combo += 1;
          score += 10 + Math.min(20, combo * 2);
          if (window.DB && typeof window.DB.recordQuiz === 'function') {
            window.DB.recordQuiz(true, currentQuestion, `타임어택(${selectedDuration}초)`);
          }
          if (fb) {
            fb.style.color = 'var(--st-mastered)';
            fb.textContent = `⭕ 정답! (${currentQuestion.jp} = ${formatMeaningCard(currentQuestion)})`;
          }
        } else {
          combo = 0;
          if (window.DB && typeof window.DB.recordQuiz === 'function') {
            window.DB.recordQuiz(false, currentQuestion, `타임어택(${selectedDuration}초) 오답`);
          }
          if (fb) {
            fb.style.color = 'var(--danger)';
            fb.textContent = `❌ 오답! '${currentQuestion.jp}'는 ${formatMeaningCard(currentQuestion)}입니다.`;
          }
        }

        if (typeof onProgressChange === 'function') onProgressChange();
        setTimeout(() => {
          if (qMode !== 'timeattack') return;
          buildMultipleChoice(pool);
          renderTimeAttack(container, pool, onProgressChange);
        }, 420);
      });
    });
  }

  // 2. 그림·한글 보고 히라가나 글자타일 선택 (단어 비중 강화 + 중복 방지)
  function renderTileQuiz(container, pool, onProgressChange) {
    if (!currentQuestion) return;
    const target = cleanTarget(currentQuestion.jp);
    const total = currentQuestion.totalCount || 1;
    const remaining = currentQuestion.remainingCount ?? 0;
    const solved = Math.max(0, total - remaining);

    container.innerHTML = `
      <div class="card quiz-box">
        <div class="card-title-row" style="margin-bottom:4px;">
          <span class="metric-pill">${currentQuestion.isWord ? '📖 단어 중심 출제' : '🔤 문자 출제'}</span>
          <span class="hint-text">미출제 ${remaining}문제 남음 (${solved}/${total} 완료)</span>
        </div>

        ${tileCycleResetNotice ? `
          <div style="margin-bottom:8px; padding:6px 10px; border-radius:8px; background:var(--accent-soft); color:var(--accent); font-size:0.76rem; font-weight:700;">
            ${tileCycleResetNotice}
          </div>
        ` : ''}

        <div class="quiz-emoji">${currentQuestion.emoji || '🖼️'}</div>
        <h3>뜻: <span class="meaning-mask">${currentQuestion.meaning || ''}</span></h3>
        <p class="hint-text" style="margin-top:4px;">
          그림과 한글 뜻을 보고 히라가나 타일을 순서대로 눌러 단어를 완성하세요 (${target.length}글자)
        </p>

        <div class="answer-slots">
          ${Array.from({ length: Math.max(1, target.length) }).map((_, idx) => `
            <div class="slot-box jp-font">${selectedTiles[idx] ? selectedTiles[idx].char : ''}</div>
          `).join('')}
        </div>

        <div class="tile-pool">
          ${tilePool.map(t => `
            <button type="button" class="tile-btn jp-font" data-tid="${t.id}" ${t.used ? 'disabled' : ''}>${t.char}</button>
          `).join('')}
        </div>

        <div id="tileFeedback" style="min-height:24px; font-weight:700; margin-bottom:12px;"></div>

        <div class="btn-row">
          <button type="button" class="secondary-btn" id="clearTilesBtn">다시 선택</button>
          <button type="button" class="primary-btn" id="checkTileBtn">정답 확인</button>
          <button type="button" class="secondary-btn" id="nextTileBtn">다음 문제 ▶</button>
          <button type="button" class="btn" id="resetTileHistoryBtn" style="font-size:0.74rem;">출제 이력 초기화</button>
        </div>
      </div>
    `;

    container.querySelectorAll('.tile-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (selectedTiles.length >= target.length) return;
        const tid = Number(btn.dataset.tid);
        const tile = tilePool.find(t => t.id === tid);
        if (tile && !tile.used) {
          tile.used = true;
          selectedTiles.push(tile);
          renderTileQuiz(container, pool, onProgressChange);
        }
      });
    });

    document.getElementById('clearTilesBtn')?.addEventListener('click', () => {
      tilePool.forEach(t => (t.used = false));
      selectedTiles = [];
      renderTileQuiz(container, pool, onProgressChange);
    });

    document.getElementById('checkTileBtn')?.addEventListener('click', () => {
      const answer = selectedTiles.map(t => t.char).join('');
      const fb = document.getElementById('tileFeedback');
      const recordTarget = currentQuestion.sourceItem || currentQuestion;
      if (answer === target) {
        if (window.DB && typeof window.DB.recordQuiz === 'function') {
          window.DB.recordQuiz(true, recordTarget, '글자타일 퀴즈');
        }
        if (fb) {
          fb.style.color = 'var(--st-mastered)';
          fb.textContent = `🎉 정답입니다! (${target} · ${currentQuestion.romaji || ''})`;
        }
      } else {
        if (window.DB && typeof window.DB.recordQuiz === 'function') {
          window.DB.recordQuiz(false, recordTarget, '글자타일 퀴즈 오답');
        }
        if (fb) {
          fb.style.color = 'var(--danger)';
          fb.textContent = `❌ 아쉬워요! 정답은 '${target}' (${currentQuestion.romaji || ''}) 입니다.`;
        }
      }
      if (typeof onProgressChange === 'function') onProgressChange();
    });

    document.getElementById('nextTileBtn')?.addEventListener('click', () => {
      buildTileQuestion(pool);
      renderTileQuiz(container, pool, onProgressChange);
    });

    document.getElementById('resetTileHistoryBtn')?.addEventListener('click', () => {
      resetTileHistory();
      buildTileQuestion(pool);
      renderTileQuiz(container, pool, onProgressChange);
    });
  }

  // 3. 그림 보고 직접 입력
  function renderInputQuiz(container, pool, onProgressChange) {
    if (!currentQuestion) return;
    const target = cleanTarget(currentQuestion.jp);

    container.innerHTML = `
      <div class="card quiz-box">
        <div class="quiz-emoji">${currentQuestion.emoji || '⌨️'}</div>
        <h3>뜻: <span class="meaning-mask">${currentQuestion.meaning || ''}</span></h3>
        <p class="hint-text" style="margin-top:4px;">히라가나 또는 로마자(${currentQuestion.romaji || ''})를 직접 입력하세요</p>

        <input type="text" id="directInput" class="quiz-input jp-font" placeholder="예: あさ 또는 asa" autocomplete="off" />
        <div id="inputFeedback" style="min-height:24px; font-weight:700; margin-bottom:12px;"></div>

        <div class="btn-row">
          <button type="button" class="primary-btn" id="submitInputBtn">제출하기</button>
          <button type="button" class="secondary-btn" id="nextInputBtn">다음 문제 ▶</button>
        </div>
      </div>
    `;

    const inputEl = document.getElementById('directInput');
    const checkAnswer = () => {
      const val = (inputEl?.value || '').trim().toLowerCase();
      const fb = document.getElementById('inputFeedback');
      if (!val) return;

      if (val === target || val === String(currentQuestion.romaji || '').toLowerCase()) {
        if (window.DB && typeof window.DB.recordQuiz === 'function') {
          window.DB.recordQuiz(true, currentQuestion, '직접 입력 퀴즈');
        }
        if (fb) {
          fb.style.color = 'var(--st-mastered)';
          fb.textContent = `🎉 정답입니다! (${target} / ${currentQuestion.romaji || ''})`;
        }
      } else {
        if (window.DB && typeof window.DB.recordQuiz === 'function') {
          window.DB.recordQuiz(false, currentQuestion, '직접 입력 퀴즈 오답');
        }
        if (fb) {
          fb.style.color = 'var(--danger)';
          fb.textContent = `❌ 오답입니다! 정답은 '${target}' (${currentQuestion.romaji || ''}) 입니다.`;
        }
      }
      if (typeof onProgressChange === 'function') onProgressChange();
    };

    document.getElementById('submitInputBtn')?.addEventListener('click', checkAnswer);
    inputEl?.addEventListener('keydown', e => {
      if (e.key === 'Enter') checkAnswer();
    });

    document.getElementById('nextInputBtn')?.addEventListener('click', () => {
      buildInputQuestion(pool);
      renderInputQuiz(container, pool, onProgressChange);
    });
  }

  // 4. 카드 짝 맞추기 미니게임
  function renderMemoryGame(container, categoryOrPool, onProgressChange) {
    clearMemoryTimer();
    const pool = resolvePool(categoryOrPool);
    const chosen = buildUniquePairSource(pool, 6);

    if (!chosen.length) {
      container.innerHTML = `
        <div class="card" style="text-align:center;">
          <h3 style="margin-bottom:6px;">🃏 카드 짝 맞추기 미니게임</h3>
          <p class="hint-text" style="margin-bottom:14px;">짝 맞추기 카드를 구성할 학습 데이터가 없습니다.</p>
          <div class="btn-row">
            <button type="button" class="secondary-btn" id="restartMemBtn">다시 시도</button>
          </div>
        </div>
      `;
      document.getElementById('restartMemBtn')?.addEventListener('click', () => {
        renderMemoryGame(container, categoryOrPool, onProgressChange);
      });
      return;
    }

    const deck = buildMemoryDeck(chosen);
    let flipped = [];
    let matchedCount = 0;

    container.innerHTML = `
      <div class="card" style="text-align:center;">
        <h3 style="margin-bottom:6px;">🃏 카드 짝 맞추기 미니게임</h3>
        <p class="hint-text" style="margin-bottom:14px;">
          일본어 카드와 발음/뜻 카드를 뒤집어 짝을 맞춰 보세요. (<span id="memProgressText">0 / ${chosen.length}</span>)
        </p>
        <div class="memory-grid" id="memGrid">
          ${deck.map((card, idx) => `
            <button type="button" class="mem-card ${card.isJp ? 'jp-font' : ''}" data-idx="${idx}" aria-label="카드 ${idx + 1}">?</button>
          `).join('')}
        </div>
        <div id="gameStatus" style="margin-top:14px; font-weight:700;"></div>
        <div class="btn-row" style="margin-top:12px;">
          <button type="button" class="secondary-btn" id="restartMemBtn">새 판 시작</button>
        </div>
      </div>
    `;

    const buttons = Array.from(container.querySelectorAll('.mem-card'));
    const progressEl = document.getElementById('memProgressText');
    const statusEl = document.getElementById('gameStatus');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (memoryFlipTimer) return;
        const idx = Number(btn.dataset.idx);
        const cardData = deck[idx];
        if (!cardData) return;
        if (btn.classList.contains('matched') || btn.classList.contains('flipped') || flipped.length >= 2) return;

        btn.classList.add('flipped');
        btn.innerHTML = cardData.isJp
          ? `<span>${cardData.text}</span>`
          : `<span class="meaning-mask">${cardData.text}</span>`;

        if (cardData.isJp && window.StudyModule && typeof window.StudyModule.speakText === 'function') {
          window.StudyModule.speakText(cardData.text);
        }

        flipped.push({ idx, btn, card: cardData });

        if (flipped.length === 2) {
          const [first, second] = flipped;
          if (first.card.pairId === second.card.pairId) {
            first.btn.classList.add('matched');
            second.btn.classList.add('matched');
            matchedCount += 1;
            flipped = [];

            if (progressEl) {
              progressEl.textContent = `${matchedCount} / ${chosen.length}`;
            }

            if (matchedCount === chosen.length) {
              if (window.DB && typeof window.DB.recordGameClear === 'function') {
                window.DB.recordGameClear();
              }
              if (statusEl) {
                statusEl.textContent = '🎊 모든 짝을 맞혔습니다! 미니게임 클리어!';
              }
              if (typeof onProgressChange === 'function') {
                onProgressChange();
              }
            }
          } else {
            if (window.DB && typeof window.DB.recordQuiz === 'function') {
              window.DB.recordQuiz(false, first.card.item, '카드 짝 맞추기 오답');
            }
            if (typeof onProgressChange === 'function') {
              onProgressChange();
            }
            memoryFlipTimer = setTimeout(() => {
              first.btn.classList.remove('flipped');
              second.btn.classList.remove('flipped');
              first.btn.textContent = '?';
              second.btn.textContent = '?';
              flipped = [];
              memoryFlipTimer = null;
            }, 650);
          }
        }
      });
    });

    document.getElementById('restartMemBtn')?.addEventListener('click', () => {
      renderMemoryGame(container, categoryOrPool, onProgressChange);
    });
  }

  function getActiveSpeakingText() {
    return currentQuestion && currentQuestion.jp ? currentQuestion.jp : 'あ';
  }

  return {
    setMode,
    setDuration,
    setCustomPool,
    clearCustomPool,
    resetTileHistory,
    render,
    stopTimer,
    getActiveSpeakingText
  };
})();
