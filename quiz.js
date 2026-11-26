// 그림 보고 글자 타일 선택, 직접 입력 퀴즈, 카드 짝맞추기 미니게임 모듈
const QuizModule = (() => {
  let qMode = 'tile';
  let currentQuestion = null;
  let selectedTiles = [];
  let tilePool = [];

  function setMode(mode) {
    qMode = mode;
    currentQuestion = null;
  }

  function getQuizPool(category) {
    const vocabItems = JP_DATA.items.filter(i => i.emoji);
    if (category === 'all' || category === 'hiragana' || category === 'katakana') {
      return vocabItems;
    }
    const filtered = vocabItems.filter(i => i.category === category);
    return filtered.length ? filtered : vocabItems;
  }

  function cleanTarget(jp) {
    return jp.replace('(な)', '');
  }

  function pickQuestion(category) {
    const pool = getQuizPool(category);
    currentQuestion = pool[Math.floor(Math.random() * pool.length)];
    const target = cleanTarget(currentQuestion.jp);
    const distractors = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'さ', 'し', 'た', 'て', 'な', 'に', 'の', 'ま', 'み', 'る', 'ん'];

    const chars = target.split('');
    while (chars.length < Math.max(6, target.length + 3)) {
      const rand = distractors[Math.floor(Math.random() * distractors.length)];
      chars.push(rand);
    }

    tilePool = chars
      .map((ch, idx) => ({ id: idx, char: ch, used: false }))
      .sort(() => Math.random() - 0.5);
    selectedTiles = [];
  }

  function render(category, onProgressChange) {
    const container = document.getElementById('quizContainer');
    if (qMode === 'tile') {
      if (!currentQuestion) pickQuestion(category);
      renderTileQuiz(container, category, onProgressChange);
    } else if (qMode === 'input') {
      if (!currentQuestion) pickQuestion(category);
      renderInputQuiz(container, category, onProgressChange);
    } else if (qMode === 'game') {
      renderMemoryGame(container, category, onProgressChange);
    }
  }

  // 1. 그림 보고 히라가나 글자 타일 선택
  function renderTileQuiz(container, category, onProgressChange) {
    const target = cleanTarget(currentQuestion.jp);

    container.innerHTML = `
      <div class="card quiz-box">
        <span class="badge-v2">그림 보고 글자 타일 선택</span>
        <div class="quiz-emoji">${currentQuestion.emoji}</div>
        <h3>뜻: ${currentQuestion.meaning}</h3>
        <p class="quiz-hint">아래 히라가나 타일을 순서대로 눌러 단어를 완성하세요 (${target.length}글자)</p>

        <div class="answer-slots">
          ${Array.from({ length: target.length }).map((_, idx) => `
            <div class="slot-box jp-font">${selectedTiles[idx] ? selectedTiles[idx].char : ''}</div>
          `).join('')}
        </div>

        <div class="tile-pool">
          ${tilePool.map(t => `
            <button class="tile-btn jp-font" data-tid="${t.id}" ${t.used ? 'disabled' : ''}>${t.char}</button>
          `).join('')}
        </div>

        <div id="quizFeedback" style="min-height:24px; font-weight:700; margin-bottom:12px;"></div>

        <div class="btn-row">
          <button class="secondary-btn" id="clearTilesBtn">다시 선택</button>
          <button class="primary-btn" id="checkTileBtn">정답 확인</button>
          <button class="secondary-btn" id="nextTileBtn">다음 문제 ▶</button>
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
          renderTileQuiz(container, category, onProgressChange);
        }
      });
    });

    document.getElementById('clearTilesBtn').addEventListener('click', () => {
      tilePool.forEach(t => (t.used = false));
      selectedTiles = [];
      renderTileQuiz(container, category, onProgressChange);
    });

    document.getElementById('checkTileBtn').addEventListener('click', () => {
      const answer = selectedTiles.map(t => t.char).join('');
      const fb = document.getElementById('quizFeedback');
      if (answer === target) {
        fb.style.color = 'var(--success)';
        fb.textContent = `🎉 정답입니다! (${target} · ${currentQuestion.romaji})`;
        DB.recordQuiz(true);
        DB.markLearned(currentQuestion.id);
      } else {
        fb.style.color = 'var(--danger)';
        fb.textContent = `❌ 아쉬워요! 정답은 '${target}' (${currentQuestion.romaji}) 입니다.`;
        DB.recordQuiz(false);
      }
      if (onProgressChange) onProgressChange();
    });

    document.getElementById('nextTileBtn').addEventListener('click', () => {
      pickQuestion(category);
      renderTileQuiz(container, category, onProgressChange);
    });
  }

  // 2. 그림 보고 히라가나 직접 입력
  function renderInputQuiz(container, category, onProgressChange) {
    const target = cleanTarget(currentQuestion.jp);

    container.innerHTML = `
      <div class="card quiz-box">
        <span class="badge-v2">그림 보고 히라가나 직접 입력</span>
        <div class="quiz-emoji">${currentQuestion.emoji}</div>
        <h3>뜻: ${currentQuestion.meaning}</h3>
        <p class="quiz-hint">일본어 키보드 또는 로마자(${currentQuestion.romaji})로 정답을 입력하세요</p>

        <input type="text" id="directInput" class="quiz-input jp-font" placeholder="예: ねこ 또는 neko" autocomplete="off" />
        <div id="inputFeedback" style="min-height:24px; font-weight:700; margin-bottom:12px;"></div>

        <div class="btn-row">
          <button class="primary-btn" id="submitInputBtn">제출하기</button>
          <button class="secondary-btn" id="nextInputBtn">다음 문제 ▶</button>
        </div>
      </div>
    `;

    const inputEl = document.getElementById('directInput');
    const checkAnswer = () => {
      const val = inputEl.value.trim().toLowerCase();
      const fb = document.getElementById('inputFeedback');
      if (!val) return;

      if (val === target || val === currentQuestion.romaji.toLowerCase()) {
        fb.style.color = 'var(--success)';
        fb.textContent = `🎉 정답입니다! (${target} / ${currentQuestion.romaji})`;
        DB.recordQuiz(true);
        DB.markLearned(currentQuestion.id);
      } else {
        fb.style.color = 'var(--danger)';
        fb.textContent = `❌ 오답입니다! 정답은 '${target}' (${currentQuestion.romaji}) 입니다.`;
        DB.recordQuiz(false);
      }
      if (onProgressChange) onProgressChange();
    };

    document.getElementById('submitInputBtn').addEventListener('click', checkAnswer);
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') checkAnswer();
    });

    document.getElementById('nextInputBtn').addEventListener('click', () => {
      pickQuestion(category);
      renderInputQuiz(container, category, onProgressChange);
    });
  }

  // 3. 일본어-한국어 뜻 짝맞추기 미니 게임
  function renderMemoryGame(container, category, onProgressChange) {
    const source = category === 'all'
      ? JP_DATA.items
      : JP_DATA.items.filter(i => i.category === category);
    const chosen = [...source].sort(() => Math.random() - 0.5).slice(0, 6);

    const deck = [];
    chosen.forEach(item => {
      deck.push({ pairId: item.id, text: cleanTarget(item.jp), isJp: true });
      deck.push({ pairId: item.id, text: item.meaning, isJp: false });
    });
    deck.sort(() => Math.random() - 0.5);

    let flipped = [];
    let matchedCount = 0;

    container.innerHTML = `
      <div class="card" style="text-align:center;">
        <h3 style="margin-bottom:6px;">🃏 일본어 ↔ 뜻 짝맞추기 미니게임</h3>
        <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:16px;">같은 의미의 일본어 카드와 한국어 카드를 짝지어 보세요!</p>
        <div class="memory-grid" id="memGrid">
          ${deck.map((card, idx) => `
            <button class="mem-card ${card.isJp ? 'jp-font' : ''}" data-idx="${idx}">?</button>
          `).join('')}
        </div>
        <div id="gameStatus" style="margin-top:14px; font-weight:700;"></div>
      </div>
    `;

    const buttons = container.querySelectorAll('.mem-card');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        if (btn.classList.contains('matched') || btn.classList.contains('flipped') || flipped.length >= 2) return;

        btn.classList.add('flipped');
        btn.textContent = deck[idx].text;
        flipped.push({ idx, btn, card: deck[idx] });

        if (flipped.length === 2) {
          const [a, b] = flipped;
          if (a.card.pairId === b.card.pairId) {
            a.btn.classList.add('matched');
            b.btn.classList.add('matched');
            DB.markLearned(a.card.pairId);
            matchedCount += 1;
            flipped = [];

            if (matchedCount === chosen.length) {
              DB.recordGameClear();
              document.getElementById('gameStatus').textContent = '🎊 모든 카드를 맞혔습니다! 클리어!';
              if (onProgressChange) onProgressChange();
            }
          } else {
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

  return { setMode, render };
})();