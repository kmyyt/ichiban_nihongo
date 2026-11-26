// 탐색·암기·쓰기·행별 예문 학습 모듈
const StudyModule = (() => {
  let currentMode = 'chart';
  let fcIndex = 0;
  let fcFlipped = false;
  let writeIndex = 0;

  function getFilteredItems(category) {
    if (category === 'all') return JP_DATA.items;
    return JP_DATA.items.filter(item => item.category === category);
  }

  function setMode(mode) {
    currentMode = mode;
    fcIndex = 0;
    fcFlipped = false;
    writeIndex = 0;
  }

  function render(category, onProgressChange) {
    const container = document.getElementById('studyContainer');
    const items = getFilteredItems(category);

    if (currentMode === 'chart') {
      renderChart(container, items, category, onProgressChange);
    } else if (currentMode === 'flashcard') {
      renderFlashcard(container, items, onProgressChange);
    } else if (currentMode === 'writing') {
      renderWriting(container, items, onProgressChange);
    } else if (currentMode === 'row') {
      renderRowLessons(container);
    }
  }

  // 1. 문자표 및 품사별 단어 목록
  function renderChart(container, items, category, onProgressChange) {
    const isKana = category === 'hiragana' || category === 'katakana';
    const gridClass = isKana ? 'char-grid' : 'vocab-grid';

    container.innerHTML = `
      <div class="card">
        <p style="margin-bottom:14px; color:var(--text-secondary); font-size:0.9rem;">
          카드를 클릭하면 <strong>학습 완료</strong>로 체크됩니다. (초록색 테두리 = 암기 완료)
        </p>
        <div class="${gridClass}">
          ${items.map(item => {
            const learned = DB.isLearned(item.id);
            return `
              <div class="char-card ${learned ? 'learned' : ''}" data-id="${item.id}">
                <div class="char-jp jp-font">${item.emoji ? item.emoji + ' ' : ''}${item.jp}</div>
                <div class="char-romaji">${item.romaji} · <strong>${item.meaning}</strong></div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">${item.row}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.char-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const nowLearned = DB.toggleLearned(id);
        card.classList.toggle('learned', nowLearned);
        if (onProgressChange) onProgressChange();
      });
    });
  }

  // 2. 플래시카드 & 연상 암기
  function renderFlashcard(container, items, onProgressChange) {
    if (!items.length) return;
    if (fcIndex >= items.length) fcIndex = 0;
    const item = items[fcIndex];
    const learned = DB.isLearned(item.id);

    container.innerHTML = `
      <div class="flashcard-wrap">
        <p style="margin-bottom:10px; color:var(--text-secondary); font-size:0.88rem;">
          카드 ${fcIndex + 1} / ${items.length} · 카드를 눌러 뜻과 연상 암기법을 확인하세요
        </p>
        <div class="flashcard" id="fcCard">
          <div class="fc-main jp-font">${item.emoji ? item.emoji + ' ' : ''}${item.jp}</div>
          ${fcFlipped ? `
            <div class="fc-sub">${item.romaji} — ${item.meaning}</div>
            <div class="fc-mnemonic">💡 연상 암기: ${item.mnemonic}</div>
          ` : `
            <div style="color:var(--text-secondary); font-size:0.95rem;">터치하여 뒤집기</div>
          `}
        </div>
        <div class="btn-row">
          <button class="secondary-btn" id="fcPrev">◀ 이전</button>
          <button class="success-btn" id="fcMark">${learned ? '✅ 암기 완료됨' : '암기 완료 체크'}</button>
          <button class="primary-btn" id="fcNext">다음 ▶</button>
        </div>
      </div>
    `;

    document.getElementById('fcCard').addEventListener('click', () => {
      fcFlipped = !fcFlipped;
      renderFlashcard(container, items, onProgressChange);
    });

    document.getElementById('fcPrev').addEventListener('click', () => {
      fcIndex = (fcIndex - 1 + items.length) % items.length;
      fcFlipped = false;
      renderFlashcard(container, items, onProgressChange);
    });

    document.getElementById('fcNext').addEventListener('click', () => {
      fcIndex = (fcIndex + 1) % items.length;
      fcFlipped = false;
      renderFlashcard(container, items, onProgressChange);
    });

    document.getElementById('fcMark').addEventListener('click', () => {
      DB.toggleLearned(item.id);
      if (onProgressChange) onProgressChange();
      renderFlashcard(container, items, onProgressChange);
    });
  }

  // 3. 쓰기 연습 (터치 & 마우스 지원 Canvas)
  function renderWriting(container, items, onProgressChange) {
    if (!items.length) return;
    if (writeIndex >= items.length) writeIndex = 0;
    const item = items[writeIndex];

    container.innerHTML = `
      <div class="card writing-box">
        <div style="text-align:center;">
          <span style="font-size:0.85rem; color:var(--text-secondary);">${writeIndex + 1} / ${items.length}</span>
          <h3 style="margin-top:4px;">따라 쓰기: <span class="jp-font" style="color:var(--accent);">${item.jp}</span> (${item.romaji} · ${item.meaning})</h3>
        </div>

        <div class="canvas-stage">
          <div class="canvas-guide jp-font" style="${item.jp.length > 1 ? 'font-size:4.5rem;' : ''}">${item.jp}</div>
          <canvas id="drawCanvas" width="280" height="280"></canvas>
        </div>

        <div class="btn-row">
          <button class="secondary-btn" id="clearCanvasBtn">지우기</button>
          <button class="success-btn" id="completeWriteBtn">쓰기 완료 체크</button>
          <button class="primary-btn" id="nextWriteBtn">다음 글자 ▶</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4f46e5';

    let drawing = false;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function startDraw(e) {
      e.preventDefault();
      drawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function moveDraw(e) {
      if (!drawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function endDraw() {
      drawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    document.getElementById('clearCanvasBtn').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('completeWriteBtn').addEventListener('click', () => {
      DB.markLearned(item.id);
      if (onProgressChange) onProgressChange();
      alert(`'${item.jp}' 쓰기 학습이 완료 체크되었습니다!`);
    });

    document.getElementById('nextWriteBtn').addEventListener('click', () => {
      writeIndex = (writeIndex + 1) % items.length;
      renderWriting(container, items, onProgressChange);
    });
  }

  // 4. 행별(あかさた...) 단어 및 예문
  function renderRowLessons(container) {
    container.innerHTML = JP_DATA.rowLessons.map(lesson => `
      <div class="card">
        <h3 style="color:var(--accent); margin-bottom:12px;">${lesson.row}</h3>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
          ${lesson.words.map(w => `
            <span style="padding:6px 12px; border-radius:10px; background:var(--accent-soft); font-size:0.9rem;">
              <strong class="jp-font">${w.jp}</strong> (${w.reading}) : ${w.ko}
            </span>
          `).join('')}
        </div>
        <div style="padding:12px 14px; border-left:4px solid var(--accent); background:rgba(127,127,127,0.06); border-radius:8px;">
          <div class="jp-font" style="font-size:1.15rem; font-weight:700;">${lesson.example.jp}</div>
          <div style="font-size:0.84rem; color:var(--text-secondary); margin:2px 0;">${lesson.example.reading}</div>
          <div style="font-size:0.92rem; font-weight:500;">→ ${lesson.example.ko}</div>
        </div>
      </div>
    `).join('');
  }

  return { setMode, render };
})();