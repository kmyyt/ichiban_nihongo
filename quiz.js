// 히라가나 및 학습 영역 퀴즈·미니게임 모듈 (QuizModule)
const QuizModule = (() => {
  let qMode = 'timeattack'; // 'timeattack' | 'tile' | 'input' | 'memory'
  let currentQuestion = null;
  let currentChoices = [];
  let selectedTiles = [];
  let tilePool = [];

  // 60초 타임어택 상태
  let timerId = null;
  let timeLeft = 60;
  let score = 0;
  let isPlayingAttack = false;

  function getAllItems() {
    if (window.ContentDB && typeof window.ContentDB.getAllItems === 'function') {
      return window.ContentDB.getAllItems();
    }
    return (window.JP_DATA && window.JP_DATA.items) || [];
  }

  function getPool(category) {
    const all = getAllItems();
    if (category === 'hiragana') {
      return all.filter(i => i.category === 'hiragana');
    }
    if (category && category !== 'all') {
      const filtered = all.filter(i => i.category === category);
      if (filtered.length >= 4) return filtered;
    }
    return all;
  }

  function getVisualPool(category) {
    const pool = getPool(category);
    const withWords = pool.filter(item =>
      item.emoji || (item.words && item.words.some(w => w.emoji))
    );
    return withWords.length ? withWords : pool;
  }

  function extractVisualPrompt(item) {
    if (item.emoji) {
      return {
        emoji: item.emoji,
        meaning: item.meaning,
        targetJp: item.jp.replace('(な)', ''),
        romaji: item.romaji,
        sourceItem: item
      };
    }
    const wordWithEmoji = (item.words || []).find(w => w.emoji);
    if (wordWithEmoji) {
      return {
        emoji: wordWithEmoji.emoji,
        meaning: wordWithEmoji.meaning,
        targetJp: wordWithEmoji.jp,
        romaji: wordWithEmoji.romaji,
        sourceItem: item
      };
    }
    return {
      emoji: '🔤',
      meaning: item.meaning,
      targetJp: item.jp.replace('(な)', ''),
      romaji: item.romaji,
      sourceItem: item
    };
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    isPlayingAttack = false;
  }

  function setMode(mode) {
    stopTimer();
    qMode = mode || 'timeattack';
    currentQuestion = null;
    currentChoices = [];
    selectedTiles = [];
    tilePool = [];
  }

  function getActiveSpeakingText() {
    if (currentQuestion && currentQuestion.targetJp) return currentQuestion.targetJp;
    if (currentQuestion && currentQuestion.jp) return currentQuestion.jp;
    return 'あ';
  }

  function buildMultipleChoice(category) {
    const pool = getPool(category);
    const target = pool[Math.floor(Math.random() * pool.length)];
    DB.touchItemAsSeen(target.id);

    const others = pool.filter(i => i.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const askRomaji = Math.random() < 0.5;

    const options = [target, ...others]
      .sort(() => Math.random() - 0.5)
      .map(opt => ({
        id: opt.id,
        label: askRomaji ? `${opt.romaji} (${opt.meaning})` : opt.jp,
        isCorrect: opt.id === target.id,
        item: opt
      }));

    currentQuestion = {
      ...target,
      targetJp: target.jp,
      promptMain: askRomaji ? target.jp : `${target.romaji} · ${target.meaning}`,
      promptSub: askRomaji ? '이 히라가나의 발음과 뜻을 고르세요' : '이 발음·뜻에 해당하는 히라가나를 고르세요',
      isJpPrompt: askRomaji
    };
    currentChoices = options;
  }

  function buildVisualPuzzle(category) {
    const pool = getVisualPool(category);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    DB.touchItemAsSeen(picked.id);

    const promptData = extractVisualPrompt(picked);
    currentQuestion = { ...picked, ...promptData };

    const hiraChars = getAllItems()
      .filter(i => i.category === 'hiragana')
      .map(i => i.jp);

    const targetChars = promptData.targetJp.split('');
    const totalCount = Math.max(6, targetChars.length + 3);
    const poolChars = [...targetChars];

    while (poolChars.length < totalCount) {
      const rand = hiraChars[Math.floor(Math.random() * hiraChars.length)];
      poolChars.push(rand);
    }

    tilePool = poolChars
      .map((ch, idx) => ({ id: idx, char: ch, used: false }))
      .sort(() => Math.random() - 0.5);
    selectedTiles = [];
  }

  function render(category, onProgressChange) {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    if (qMode === 'timeattack') {
      renderTimeAttack(container, category, onProgressChange);
    } else if (qMode === 'tile') {
      if (!currentQuestion || !currentQuestion.targetJp) buildVisualPuzzle(category);
      renderTileQuiz(container, category, onProgressChange);
    } else if (qMode === 'input') {
      if (!currentQuestion || !currentQuestion.targetJp) buildVisualPuzzle(category);
      renderInputQuiz(container, category, onProgressChange);
    } else if (qMode === 'memory') {
      stopTimer();
      renderMemoryGame(container, category, onProgressChange);
    }
  }

  // 1. 4지선다 60초 타임어택
  function renderTimeAttack(container, category, onProgressChange) {
    if (!isPlayingAttack && !currentQuestion) {
      timeLeft = 60;
      score = 0;
      buildMultipleChoice(category);
    }

    const startOrRestart = () => {
      stopTimer();
      timeLeft = 60;
      score = 0;
      isPlayingAttack = true;
      buildMultipleChoice(category);
      renderTimeAttack(container, category, onProgressChange);

      timerId = setInterval(() => {
        timeLeft -= 1;
        const bar = document.getElementById('attackTimerBar');
        const txt = document.getElementById('attackTimerText');
        if (bar) bar.style.width = `${Math.max(0, (timeLeft / 60) * 100)}%`;
        if (txt) txt.textContent = `⏱️ 남은 시간: ${timeLeft}초 | 점수: ${score}점`;

        if (timeLeft <= 0) {
          stopTimer();
          if (score > 0) DB.recordGameClear();
          if (onProgressChange) onProgressChange();
          renderTimeAttackEnd(container, category, onProgressChange);
        }
      }, 1000);
    };

    if (!isPlayingAttack && timeLeft <= 0) {
      renderTimeAttackEnd(container, category, onProgressChange);
      return;
    }

    container.innerHTML = `
      <div class="card quiz-box">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <span class="badge-v2">4지선다 60초 타임어택</span>
          <button type="button" class="secondary-btn" id="restartAttackBtn" style="padding:5px 10px; font-size:0.78rem;">
            ${isPlayingAttack ? '↺ 다시 시작' : '▶ 60초 도전 시작'}
          </button>
        </div>

        <div id="attackTimerText" style="font-weight:700; margin-top:8px;">
          ⏱️ 남은 시간: ${timeLeft}초 | 점수: ${score}점
        </div>
        <div class="timer-bar-wrap">
          <div id="attackTimerBar" class="timer-bar-fill" style="width:${(timeLeft / 60) * 100}%"></div>
        </div>

        <div class="quiz-hint">${currentQuestion.promptSub}</div>
        <div class="${currentQuestion.isJpPrompt ? 'fc-main jp-font' : 'quiz-emoji'}" style="font-size:${currentQuestion.isJpPrompt ? '3.8rem' : '1.8rem'};">
          ${currentQuestion.promptMain}
        </div>

        <div class="choice-grid">
          ${currentChoices.map((c, idx) => `
            <button type="button" class="choice-btn ${!currentQuestion.isJpPrompt ? 'jp-font' : ''}" data-cidx="${idx}">
              ${c.label}
            </button>
          `).join('')}
        </div>

        <div id="attackFeedback" style="min-height:24px; font-weight:700; margin-top:12px;"></div>
      </div>
    `;

    document.getElementById('restartAttackBtn')?.addEventListener('click', startOrRestart);

    container.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!isPlayingAttack) startOrRestart();
        const picked = currentChoices[Number(btn.dataset.cidx)];
        const fb = document.getElementById('attackFeedback');

        if (picked.isCorrect) {
          score += 10;
          DB.recordQuiz(true, currentQuestion, '60초 타임어택 정답');
          if (fb) {
            fb.style.color = 'var(--st-mastered)';
            fb.textContent = `⭕ 정답! (+10점) ${currentQuestion.jp} = ${currentQuestion.romaji}`;
          }
        } else {
          DB.recordQuiz(false, currentQuestion, '60초 타임어택 오답');
          if (fb) {
            fb.style.color = 'var(--danger)';
            fb.textContent = `❌ 오답! 정답은 '${currentQuestion.jp}' (${currentQuestion.romaji}) · 오답노트에 기록됨`;
          }
        }

        if (onProgressChange) onProgressChange();
        setTimeout(() => {
          if (!isPlayingAttack && timeLeft <= 0) return;
          buildMultipleChoice(category);
          renderTimeAttack(container, category, onProgressChange);
        }, 420);
      });
    });
  }

  function renderTimeAttackEnd(container, category, onProgressChange) {
    container.innerHTML = `
      <div class="card quiz-box">
        <span class="badge-v2">타임어택 종료</span>
        <h3 style="font-size:1.5rem; margin:12px 0;">최종 점수: ${score}점</h3>
        <p class="quiz-hint">틀린 문제는 대시보드의 오답노트 및 복습필요 목록에 자동 저장되었습니다.</p>
        <button type="button" class="primary-btn" id="playAgainAttackBtn">다시 도전하기</button>
      </div>
    `;
    document.getElementById('playAgainAttackBtn')?.addEventListener('click', () => {
      timeLeft = 60;
      score = 0;
      isPlayingAttack = true;
      buildMultipleChoice(category);
      renderTimeAttack(container, category, onProgressChange);
    });
  }

  // 2. 그림·한국어 보고 히라가나 글자타일 선택
  function renderTileQuiz(container, category, onProgressChange) {
    const target = currentQuestion.targetJp;

    container.innerHTML = `
      <div class="card quiz-box">
        <span class="badge-v2">그림·한국어 보고 히라가나 글자타일 선택</span>
        <div class="quiz-emoji">${currentQuestion.emoji}</div>
        <h3>한국어 뜻: ${currentQuestion.meaning}</h3>
        <p class="quiz-hint">제시된 그림과 한국어 뜻을 보고 히라가나 글자 타일을 순서대로 선택하세요 (${target.length}자)</p>

        <div class="answer-slots">
          ${Array.from({ length: target.length }).map((_, idx) => `
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
        const tile = tilePool.find(t => t.id === Number(btn.dataset.tid));
        if (tile && !tile.used) {
          tile.used = true;
          selectedTiles.push(tile);
          renderTileQuiz(container, category, onProgressChange);
        }
      });
    });

    document.getElementById('clearTilesBtn')?.addEventListener('click', () => {
      tilePool.forEach(t => (t.used = false));
      selectedTiles = [];
      renderTileQuiz(container, category, onProgressChange);
    });

    document.getElementById('checkTileBtn')?.addEventListener('click', () => {
      const answer = selectedTiles.map(t => t.char).join('');
      const fb = document.getElementById('tileFeedback');
      if (answer === target) {
        fb.style.color = 'var(--st-mastered)';
        fb.textContent = `🎉 정답입니다! (${target} · ${currentQuestion.romaji})`;
        DB.recordQuiz(true, currentQuestion, '글자타일 퀴즈 정답');
      } else {
        fb.style.color = 'var(--danger)';
        fb.textContent = `❌ 정답은 '${target}' (${currentQuestion.romaji}) 입니다. 오답노트에 기록되었습니다.`;
        DB.recordQuiz(false, currentQuestion, '글자타일 퀴즈 오답');
      }
      if (onProgressChange) onProgressChange();
    });

    document.getElementById('nextTileBtn')?.addEventListener('click', () => {
      buildVisualPuzzle(category);
      renderTileQuiz(container, category, onProgressChange);
    });
  }

  // 3. 그림 보고 직접 입력
  function renderInputQuiz(container, category, onProgressChange) {
    const target = currentQuestion.targetJp;

    container.innerHTML = `
      <div class="card quiz-box">
        <span class="badge-v2">그림 보고 직접 입력</span>
        <div class="quiz-emoji">${currentQuestion.emoji}</div>
        <h3>한국어 뜻: ${currentQuestion.meaning}</h3>
        <p class="quiz-hint">그림을 보고 히라가나 또는 로마자(${currentQuestion.romaji})를 직접 입력하세요</p>

        <input type="text" id="directInput" class="quiz-input jp-font" placeholder="히라가나 또는 로마자 입력" autocomplete="off" />
        <div id="inputFeedback" style="min-height:24px; font-weight:700; margin-bottom:12px;"></div>

        <div class="btn-row">
          <button type="button" class="primary-btn" id="submitInputBtn">제출하기</button>
          <button type="button" class="secondary-btn" id="nextInputBtn">다음 문제 ▶</button>
        </div>
      </div>
    `;

    const inputEl = document.getElementById('directInput');
    const checkAnswer = () => {
      const val = inputEl.value.trim().toLowerCase();
      const fb = document.getElementById('inputFeedback');
      if (!val) return;

      if (val === target || val === currentQuestion.romaji.toLowerCase()) {
        fb.style.color = 'var(--st-mastered)';
        fb.textContent = `🎉 정답입니다! (${target} / ${currentQuestion.romaji})`;
        DB.recordQuiz(true, currentQuestion, '직접 입력 퀴즈 정답');
      } else {
        fb.style.color = 'var(--danger)';
        fb.textContent = `❌ 정답은 '${target}' (${currentQuestion.romaji}) 입니다. 오답노트에 기록되었습니다.`;
        DB.recordQuiz(false, currentQuestion, '직접 입력 퀴즈 오답');
      }
      if (onProgressChange) onProgressChange();
    };

    document.getElementById('submitInputBtn')?.addEventListener('click', checkAnswer);
    inputEl?.addEventListener('keydown', e => {
      if (e.key === 'Enter') checkAnswer();
    });

    document.getElementById('nextInputBtn')?.addEventListener('click', () => {
      buildVisualPuzzle(category);
      renderInputQuiz(container, category, onProgressChange);
    });
  }

  // 4. 카드 짝 맞추기 미니게임
  function renderMemoryGame(container, category, onProgressChange) {
    const source = getPool(category);
    const chosen = [...source].sort(() => Math.random() - 0.5).slice(0, 6);

    const deck = [];
    chosen.forEach(item => {
      deck.push({ pairId: item.id, item, text: item.jp.replace('(な)', ''), isJp: true });
      deck.push({ pairId: item.id, item, text: `${item.romaji} · ${item.meaning}`, isJp: false });
    });
    deck.sort(() => Math.random() - 0.5);

    let flipped = [];
    let matchedPairs = 0;

    container.innerHTML = `
      <div class="card" style="text-align:center;">
        <h3 style="margin-bottom:6px;">🃏 카드 짝 맞추기 미니게임</h3>
        <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:16px;">
          히라가나 카드와 발음·뜻 카드를 뒤집어 짝을 맞추세요! 틀린 짝은 복습필요에 기록됩니다.
        </p>
        <div class="memory-grid" id="memGrid">
          ${deck.map((card, idx) => `
            <button type="button" class="mem-card ${card.isJp ? 'jp-font' : ''}" data-idx="${idx}">?</button>
          `).join('')}
        </div>
        <div id="gameStatus" style="margin-top:14px; font-weight:700;"></div>
        <div class="btn-row" style="margin-top:12px;">
          <button type="button" class="secondary-btn" id="rematchBtn">🔄 새 카드 배치</button>
        </div>
      </div>
    `;

    document.getElementById('rematchBtn')?.addEventListener('click', () => {
      renderMemoryGame(container, category, onProgressChange);
    });

    const buttons = container.querySelectorAll('.mem-card');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        if (btn.classList.contains('matched') || btn.classList.contains('flipped') || flipped.length >= 2) return;

        DB.touchItemAsSeen(deck[idx].pairId);
        btn.classList.add('flipped');
        btn.textContent = deck[idx].text;
        flipped.push({ idx, btn, card: deck[idx] });

        if (flipped.length === 2) {
          const [a, b] = flipped;
          if (a.card.pairId === b.card.pairId) {
            a.btn.classList.add('matched');
            b.btn.classList.add('matched');
            matchedPairs += 1;
            flipped = [];

            if (matchedPairs === chosen.length) {
              DB.recordGameClear();
              document.getElementById('gameStatus').textContent = '🎊 모든 카드를 맞혔습니다! 미니게임 클리어!';
              if (onProgressChange) onProgressChange();
            }
          } else {
            DB.recordWrongAnswer(a.card.item, '카드 짝 맞추기 오답');
            if (onProgressChange) onProgressChange();
            setTimeout(() => {
              a.btn.classList.remove('flipped');
              b.btn.classList.remove('flipped');
              a.btn.textContent = '?';
              b.btn.textContent = '?';
              flipped = [];
            }, 650);
          }
        }
      });
    });
  }

  return {
    setMode,
    render,
    getActiveSpeakingText
  };
})();
