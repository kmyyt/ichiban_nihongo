// 퀴즈 및 미니게임 모듈 (1단계: 카드 짝 맞추기 memory 버그 수정 및 안전 가드)
const QuizModule = (() => {
  let qMode = 'timeattack';
  let currentQuestion = null;
  let mcChoices = [];
  let selectedTiles = [];
  let tilePool = [];

  // 60초 타임어택 상태
  let timeLeft = 60;
  let score = 0;
  let combo = 0;
  let timerId = null;
  let timerRunning = false;

  // 메모리 게임 비동기 타이머 관리
  let memoryFlipTimer = null;

  function clearMemoryTimer() {
    if (memoryFlipTimer) {
      clearTimeout(memoryFlipTimer);
      memoryFlipTimer = null;
    }
  }

  function getAllItems() {
    if (window.ContentDB && typeof window.ContentDB.getAllItems === 'function') {
      const items = window.ContentDB.getAllItems();
      if (Array.isArray(items)) return items;
    }
    return Array.isArray(window.JP_DATA && window.JP_DATA.items) ? window.JP_DATA.items : [];
  }

  function resolvePool(categoryOrPool) {
    if (Array.isArray(categoryOrPool)) {
      return categoryOrPool.filter(item => item && item.id);
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

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    timerRunning = false;
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
    return String(jp || '').replace('(な)', '').trim();
  }

  function formatMeaningCard(item) {
    const romaji = String(item?.romaji || '').trim();
    const meaning = String(item?.meaning || '').trim();
    if (romaji && meaning) return `${romaji} · ${meaning}`;
    return romaji || meaning || cleanTarget(item?.jp) || '학습 카드';
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

    const others = pool.filter(i => i.id !== targetItem.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [targetItem, ...others].sort(() => Math.random() - 0.5);
    mcChoices = options.map(opt => ({
      id: opt.id,
      label: formatMeaningCard(opt),
      isCorrect: opt.id === targetItem.id
    }));
  }

  function buildTileOrInputQuestion(pool) {
    if (!pool.length) {
      currentQuestion = null;
      tilePool = [];
      selectedTiles = [];
      return;
    }
    const withEmoji = pool.filter(i => i.emoji || (Array.isArray(i.words) && i.words.some(w => w.emoji)));
    const candidatePool = withEmoji.length ? withEmoji : pool;
    const rawPicked = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const wordWithEmoji = Array.isArray(rawPicked.words) ? rawPicked.words.find(w => w.emoji) : null;

    currentQuestion = {
      ...rawPicked,
      emoji: rawPicked.emoji || (wordWithEmoji ? wordWithEmoji.emoji : '📝'),
      meaning: rawPicked.emoji ? (rawPicked.meaning || '') : (wordWithEmoji ? (wordWithEmoji.meaning || '') : (rawPicked.meaning || '')),
      jp: rawPicked.emoji ? (rawPicked.jp || '') : (wordWithEmoji ? (wordWithEmoji.jp || '') : (rawPicked.jp || '')),
      romaji: rawPicked.emoji ? (rawPicked.romaji || '') : (wordWithEmoji ? (wordWithEmoji.romaji || '') : (rawPicked.romaji || ''))
    };
    if (window.DB && typeof window.DB.touchItemAsSeen === 'function') {
      window.DB.touchItemAsSeen(rawPicked.id);
    }

    const target = cleanTarget(currentQuestion.jp);
    const kanaBank = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'さ', 'し', 'す', 'た', 'ち', 'つ', 'な', 'に', 'の', 'は', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'ん'];
    const chars = target.split('').filter(Boolean);

    while (chars.length < Math.max(6, target.length + 3)) {
      chars.push(kanaBank[Math.floor(Math.random() * kanaBank.length)]);
    }

    tilePool = chars
      .map((ch, idx) => ({ id: idx, char: ch, used: false }))
      .sort(() => Math.random() - 0.5);
    selectedTiles = [];
  }

  function render(category, onProgressChange) {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    const pool = resolvePool(category);
    if (!pool.length) {
      clearMemoryTimer();
      container.innerHTML = `<div class="card"><p class="hint-text">퀴즈를 출제할 데이터가 없습니다.</p></div>`;
      return;
    }

    if (qMode === 'timeattack') {
      clearMemoryTimer();
      if (!currentQuestion || !mcChoices.length) buildMultipleChoice(pool);
      renderTimeAttack(container, pool, onProgressChange);
    } else if (qMode === 'tile') {
      stopTimer();
      clearMemoryTimer();
      if (!currentQuestion || !tilePool.length) buildTileOrInputQuestion(pool);
      renderTileQuiz(container, pool, onProgressChange);
    } else if (qMode === 'input') {
      stopTimer();
      clearMemoryTimer();
      if (!currentQuestion) buildTileOrInputQuestion(pool);
      renderInputQuiz(container, pool, onProgressChange);
    } else if (qMode === 'memory') {
      stopTimer();
      renderMemoryGame(container, pool, onProgressChange);
    }
  }

  // 1. 4지선다 타임어택
  function renderTimeAttack(container, pool, onProgressChange) {
    if (!currentQuestion) return;
    const pct = Math.max(0, Math.round((timeLeft / 60) * 100));

    container.innerHTML = `
      <div class="card quiz-box">
        <div style="display:flex; justify-content:space-between; align-items:center; font-weight:700; margin-bottom:6px;">
          <span>⏱️ 남은 시간: <span id="taTimeText">${timeLeft}</span>초</span>
          <span>점수: <span id="taScoreText">${score}</span>점 · 콤보: <span id="taComboText">${combo}</span></span>
        </div>

        <div class="progress-track" style="margin-bottom:12px;">
          <div class="progress-fill" id="taTimerBar" style="width:${pct}%;"></div>
        </div>

        <div class="jp-font" style="font-size:4.2rem; font-weight:900; margin:12px 0;">
          ${currentQuestion.jp || 'あ'}
        </div>
        <p class="hint-text">알맞은 발음과 뜻을 4지선다에서 고르세요</p>

        <div class="choice-grid">
          ${mcChoices.map((c, idx) => `
            <button type="button" class="choice-btn ta-choice-btn" data-idx="${idx}">${c.label}</button>
          `).join('')}
        </div>

        <div id="taFeedback" style="min-height:24px; font-weight:700; margin-top:12px;"></div>

        <div class="btn-row" style="margin-top:12px;">
          <button type="button" class="primary-btn" id="taStartBtn">${timerRunning ? '진행 중...' : '타임어택 시작/재시작'}</button>
          <button type="button" class="secondary-btn" id="taSpeakBtn">🔊 듣기</button>
        </div>
      </div>
    `;

    const startCountdown = () => {
      stopTimer();
      timeLeft = 60;
      score = 0;
      combo = 0;
      timerRunning = true;
      buildMultipleChoice(pool);
      renderTimeAttack(container, pool, onProgressChange);

      timerId = setInterval(() => {
        timeLeft -= 1;
        const tEl = document.getElementById('taTimeText');
        const bEl = document.getElementById('taTimerBar');
        if (tEl) tEl.textContent = String(Math.max(0, timeLeft));
        if (bEl) bEl.style.width = `${Math.max(0, Math.round((timeLeft / 60) * 100))}%`;

        if (timeLeft <= 0) {
          stopTimer();
          if (window.DB && typeof window.DB.recordGameClear === 'function') {
            window.DB.recordGameClear(score, true);
          }
          if (typeof onProgressChange === 'function') onProgressChange();
          const fb = document.getElementById('taFeedback');
          if (fb) {
            fb.style.color = 'var(--accent)';
            fb.textContent = `⏰ 시간 종료! 최종 점수: ${score}점`;
          }
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
            window.DB.recordQuiz(true, currentQuestion, '타임어택');
          }
          if (fb) {
            fb.style.color = 'var(--st-mastered)';
            fb.textContent = `⭕ 정답! (${currentQuestion.jp} = ${formatMeaningCard(currentQuestion)})`;
          }
        } else {
          combo = 0;
          if (window.DB && typeof window.DB.recordQuiz === 'function') {
            window.DB.recordQuiz(false, currentQuestion, '타임어택 오답');
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

  // 2. 그림·한국어 보고 글자타일 선택
  function renderTileQuiz(container, pool, onProgressChange) {
    if (!currentQuestion) return;
    const target = cleanTarget(currentQuestion.jp);

    container.innerHTML = `
      <div class="card quiz-box">
        <div class="quiz-emoji">${currentQuestion.emoji || '📝'}</div>
        <h3>뜻: <span class="meaning-mask">${currentQuestion.meaning || ''}</span></h3>
        <p class="hint-text" style="margin-top:4px;">글자 타일을 순서대로 눌러 단어를 완성하세요 (${target.length}글자)</p>

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
      if (answer === target) {
        if (window.DB && typeof window.DB.recordQuiz === 'function') {
          window.DB.recordQuiz(true, currentQuestion, '글자타일 퀴즈');
        }
        if (fb) {
          fb.style.color = 'var(--st-mastered)';
          fb.textContent = `🎉 정답입니다! (${target} · ${currentQuestion.romaji || ''})`;
        }
      } else {
        if (window.DB && typeof window.DB.recordQuiz === 'function') {
          window.DB.recordQuiz(false, currentQuestion, '글자타일 퀴즈 오답');
        }
        if (fb) {
          fb.style.color = 'var(--danger)';
          fb.textContent = `❌ 아쉬워요! 정답은 '${target}' (${currentQuestion.romaji || ''}) 입니다.`;
        }
      }
      if (typeof onProgressChange === 'function') onProgressChange();
    });

    document.getElementById('nextTileBtn')?.addEventListener('click', () => {
      buildTileOrInputQuestion(pool);
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

        <input type="text" id="directInput" class="quiz-input jp-font" placeholder="예: あめ 또는 ame" autocomplete="off" />
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
      buildTileOrInputQuestion(pool);
      renderInputQuiz(container, pool, onProgressChange);
    });
  }

  // 4. 카드 짝 맞추기 미니게임 (1단계 핵심 수정)
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
    render,
    stopTimer,
    getActiveSpeakingText
  };
})();
