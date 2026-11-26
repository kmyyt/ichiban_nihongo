// 히라가나 심화 학습 및 타 카테고리 학습 모듈
const StudyModule = (() => {
  let currentCategory = 'hiragana';
  let currentMode = 'chart';
  let itemIndex = 0;
  let fcFlipped = false;
  let selectedRow = 'all';
  let strokeAnimTimer = null;
  let strokePaused = false;
  let activeStrokeStep = -1;
  let mnemonicQuizSelection = {}; // { [itemId]: choiceIdx }

  const ROWS = ['あ행', 'か행', 'さ행', 'た행', 'な행', 'は행', 'ま행', 'や행', 'ら행', 'わ행'];

  function getAllItems() {
    if (window.ContentDB && typeof window.ContentDB.getAllItems === 'function') {
      return window.ContentDB.getAllItems();
    }
    return (window.JP_DATA && window.JP_DATA.items) || [];
  }

  function getFilteredItems(category = currentCategory) {
    const all = getAllItems();
    if (!category || category === 'all') return all;
    return all.filter(item => item.category === category);
  }

  function clearStrokeAnimation() {
    if (strokeAnimTimer) {
      clearTimeout(strokeAnimTimer);
      strokeAnimTimer = null;
    }
    strokePaused = false;
  }

  function speakText(text) {
    if (!text) return;
    if (!('speechSynthesis' in window)) {
      alert(`발음 안내: ${text} (현재 브라우저는 음성 합성을 지원하지 않습니다.)`);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.rate = 0.92;
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ja'));
      if (jaVoice) utter.voice = jaVoice;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('TTS 재생 실패:', e);
    }
  }

  function setCategory(cat) {
    clearStrokeAnimation();
    currentCategory = cat || 'hiragana';
    itemIndex = 0;
    fcFlipped = false;
    selectedRow = 'all';
    syncSubTabVisibility();
  }

  function setMode(mode, targetId = null) {
    clearStrokeAnimation();
    currentMode = mode || 'chart';
    fcFlipped = false;

    const items = getFilteredItems(currentCategory);
    if (targetId && items.length) {
      const foundIdx = items.findIndex(i => i.id === targetId);
      itemIndex = foundIdx >= 0 ? foundIdx : 0;
    } else {
      itemIndex = 0;
    }

    const activeTabBar = currentCategory === 'hiragana'
      ? document.getElementById('hiraganaSubTabs')
      : document.getElementById('generalSubTabs');

    activeTabBar?.querySelectorAll('.sub-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === currentMode);
    });
  }

  function syncSubTabVisibility() {
    const hiraBar = document.getElementById('hiraganaSubTabs');
    const genBar = document.getElementById('generalSubTabs');
    const isHira = currentCategory === 'hiragana';

    hiraBar?.classList.toggle('hidden', !isHira);
    genBar?.classList.toggle('hidden', isHira);

    const visibleBar = isHira ? hiraBar : genBar;
    const buttons = Array.from(visibleBar?.querySelectorAll('.sub-btn') || []);
    const hasCurrent = buttons.some(b => b.dataset.mode === currentMode);
    if (!hasCurrent && buttons.length) {
      currentMode = buttons[0].dataset.mode;
    }
    buttons.forEach(b => b.classList.toggle('active', b.dataset.mode === currentMode));
  }

  function renderSummaryBanner(items, onProgressChange) {
    const banner = document.getElementById('studySummaryBanner');
    if (!banner) return;

    const catLabelMap = {
      hiragana: '히라가나',
      katakana: '가타카나',
      noun: '명사',
      i_adj: 'い형용사',
      na_adj: 'な형용사',
      verb: '동사'
    };
    const label = catLabelMap[currentCategory] || currentCategory;
    const total = items.length;
    const masteredCount = items.filter(i => DB.getStatus(i.id) === DB.STATUS.MASTERED).length;
    const learningCount = items.filter(i => DB.getStatus(i.id) === DB.STATUS.LEARNING).length;
    const hardCount = items.filter(i => DB.getStatus(i.id) === DB.STATUS.HARD).length;
    const favCount = items.filter(i => DB.isFavorite(i.id)).length;
    const reviewCount = DB.getReviewNeededItems(items).length;
    const masteredRate = total === 0 ? 0 : Math.round((masteredCount / total) * 100);
    const overallRate = total === 0
      ? 0
      : Math.round(((masteredCount + (learningCount + hardCount) * 0.5) / total) * 100);

    banner.innerHTML = `
      <div class="summary-top-row">
        <div>
          <strong>${label} 진도 요약</strong>
          <span class="hint-text" style="margin-left:8px;">암기완료 ${masteredRate}% (${masteredCount}/${total}) · 전체 진도 ${overallRate}%</span>
        </div>
        <div class="summary-pills">
          <span class="summary-pill">⭐ 즐겨찾기 ${favCount}</span>
          <span class="summary-pill">🔁 복습필요 ${reviewCount}</span>
          <span class="summary-pill">📘 학습중 ${learningCount}</span>
          <span class="summary-pill">✅ 암기완료 ${masteredCount}</span>
        </div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${masteredRate}%"></div>
      </div>
    `;
    if (onProgressChange) {
      // 요약 배지 갱신 시 대시보드 상태는 필요 시 외부에서 호출
    }
  }

  function render(category = currentCategory, onProgressChange) {
    currentCategory = category || 'hiragana';
    syncSubTabVisibility();
    clearStrokeAnimation();

    const container = document.getElementById('studyContainer');
    const items = getFilteredItems(currentCategory);
    renderSummaryBanner(items, onProgressChange);

    if (!container) return;

    if (!items.length) {
      container.innerHTML = `
        <div class="card">
          <h3>아직 준비 중인 학습 영역입니다</h3>
          <p class="hint-text" style="margin-top:6px;">
            현재 히라가나 46자 학습 기능이 우선 구현되어 있습니다. 상단 또는 사이드바에서 <strong>히라가나</strong>를 선택하거나, 추후 데이터 파일을 추가해 확장할 수 있습니다.
          </p>
        </div>
      `;
      return;
    }

    if (itemIndex >= items.length) itemIndex = 0;

    if (currentMode === 'chart') {
      renderChart(container, items, onProgressChange);
    } else if (currentMode === 'flashcard') {
      DB.touchItemAsSeen(items[itemIndex].id);
      renderFlashcard(container, items, onProgressChange);
    } else if (currentMode === 'stroke') {
      DB.touchItemAsSeen(items[itemIndex].id);
      renderStrokeAndTrace(container, items, onProgressChange);
    } else if (currentMode === 'mnemonic') {
      DB.touchItemAsSeen(items[itemIndex].id);
      renderMnemonicTab(container, items, onProgressChange);
    } else if (currentMode === 'examples') {
      DB.touchItemAsSeen(items[itemIndex].id);
      renderWordsAndExamplesTab(container, items, onProgressChange);
    } else {
      renderChart(container, items, onProgressChange);
    }
  }

  // ==================== 1. 50음도 / 목록 타일 ====================
  function renderChart(container, items, onProgressChange) {
    const isKana = currentCategory === 'hiragana' || currentCategory === 'katakana';
    const gridClass = isKana ? 'char-grid' : 'vocab-grid';

    container.innerHTML = `
      <div class="card">
        <div class="kana-legend">
          <span class="legend-item"><i class="dot unlearned"></i>미학습</span>
          <span class="legend-item"><i class="dot learning"></i>학습중</span>
          <span class="legend-item"><i class="dot hard"></i>어려움</span>
          <span class="legend-item"><i class="dot mastered"></i>암기완료</span>
          <span class="hint-text">· 타일을 누르면 상세 팝업이 열리고, ☆로 즐겨찾기를 저장할 수 있습니다.</span>
        </div>

        <div class="${gridClass}">
          ${items.map((item, idx) => {
            const st = DB.getStatus(item.id);
            const fav = DB.isFavorite(item.id);
            return `
              <div class="char-card status-${st}" data-id="${item.id}" data-idx="${idx}">
                <button type="button" class="tile-fav-btn ${fav ? 'active' : ''}" data-fav-id="${item.id}" title="즐겨찾기">${fav ? '★' : '☆'}</button>
                <div class="char-jp jp-font">${item.emoji ? item.emoji + ' ' : ''}${item.jp}</div>
                <div class="char-romaji">${item.romaji} · <span class="meaning-mask"><strong>${item.meaning}</strong></span></div>
                <span class="tile-status-tag">${DB.STATUS_LABEL[st]}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.tile-fav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.favId;
        const active = DB.toggleFavorite(id);
        btn.classList.toggle('active', active);
        btn.textContent = active ? '★' : '☆';
        renderSummaryBanner(items, onProgressChange);
        if (onProgressChange) onProgressChange();
      });
    });

    container.querySelectorAll('.char-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = Number(card.dataset.idx);
        itemIndex = idx;
        const item = items[idx];
        DB.touchItemAsSeen(item.id);
        openCharDetailModal(item, items, onProgressChange);
        renderChart(container, items, onProgressChange);
        if (onProgressChange) onProgressChange();
      });
    });
  }

  // ==================== 50음도 문자 상세 팝업 ====================
  function openCharDetailModal(item, items, onProgressChange) {
    const modal = document.getElementById('charDetailModal');
    const body = document.getElementById('charModalBody');
    if (!modal || !body || !item) return;

    const currentStatus = DB.getStatus(item.id);
    const isFav = DB.isFavorite(item.id);
    const strokeCount = Array.isArray(item.strokes) ? item.strokes.length : 1;
    const words = Array.isArray(item.words) ? item.words : [];

    body.innerHTML = `
      <div class="modal-hero">
        <div class="modal-big-char jp-font">${item.jp}</div>
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <h3 id="modalCharTitle" style="font-size:1.35rem;">${item.jp} <span style="font-size:0.95rem; color:var(--text-secondary);">(${item.romaji} · <span class="meaning-mask">${item.meaning}</span>)</span></h3>
            <button type="button" class="secondary-btn" id="modalTtsBtn" style="padding:5px 10px;">🔊 듣기</button>
            <button type="button" class="secondary-btn" id="modalFavBtn" style="padding:5px 10px;">${isFav ? '★ 즐겨찾기됨' : '☆ 즐겨찾기'}</button>
          </div>
          <p class="hint-text" style="margin-top:6px;">${item.row} · 총 <strong>${strokeCount}획</strong></p>
          <p style="font-size:0.9rem; margin-top:6px;"><strong>발음 팁:</strong> ${item.pronTip || '자연스럽게 발음해 보세요.'}</p>
        </div>
      </div>

      <div style="font-size:0.84rem; font-weight:700; color:var(--text-secondary);">학습 상태 설정</div>
      <div class="status-selector">
        ${['unlearned', 'learning', 'hard', 'mastered'].map(st => `
          <button type="button" class="status-opt-btn ${currentStatus === st ? 'active' : ''}" data-st="${st}">
            ${DB.STATUS_LABEL[st]}
          </button>
        `).join('')}
      </div>

      <div class="modal-inner-tabs">
        <button type="button" class="primary-btn" id="modalGoStrokeBtn">✍️ 획순 및 따라 쓰기</button>
        <button type="button" class="secondary-btn" id="modalToggleVisualBtn">🎨 그림/모양 연상 보기</button>
      </div>

      <div id="modalVisualBox" class="hidden" style="padding:12px; border-radius:12px; background:var(--accent-soft); margin-bottom:14px; font-size:0.9rem;">
        <strong>모양 연상:</strong> ${item.mnemonic || ''}
      </div>

      <div style="padding:12px; border-radius:12px; background:var(--bg-subtle); margin-bottom:14px; font-size:0.88rem;">
        <strong>💡 암기 팁:</strong> ${item.mnemonic || ''}
      </div>

      <div>
        <h4 style="margin-bottom:8px; font-size:0.95rem;">예시 단어</h4>
        ${words.length ? words.map(w => `
          <div class="word-sample-row">
            <div>
              <strong class="jp-font" style="font-size:1.05rem;">${w.emoji ? w.emoji + ' ' : ''}${w.jp}</strong>
              <span class="hint-text" style="margin-left:6px;">${w.romaji}</span>
              <span class="meaning-mask" style="margin-left:6px; font-weight:600;">· ${w.meaning}</span>
            </div>
            <button type="button" class="secondary-btn sample-tts-btn" data-tts="${w.jp}" style="padding:5px 9px; font-size:0.78rem;">🔊</button>
          </div>
        `).join('') : `<p class="hint-text">등록된 예시 단어가 없습니다.</p>`}
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('modalTtsBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('modalFavBtn')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id);
      openCharDetailModal(item, items, onProgressChange);
      if (currentMode === 'chart') renderChart(document.getElementById('studyContainer'), items, onProgressChange);
      if (onProgressChange) onProgressChange();
    });

    body.querySelectorAll('.status-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.setStatus(item.id, btn.dataset.st);
        openCharDetailModal(item, items, onProgressChange);
        if (currentMode === 'chart') renderChart(document.getElementById('studyContainer'), items, onProgressChange);
        if (onProgressChange) onProgressChange();
      });
    });

    document.getElementById('modalGoStrokeBtn')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      setMode('stroke', item.id);
      render(currentCategory, onProgressChange);
    });

    document.getElementById('modalToggleVisualBtn')?.addEventListener('click', () => {
      document.getElementById('modalVisualBox')?.classList.toggle('hidden');
    });

    body.querySelectorAll('.sample-tts-btn').forEach(btn => {
      btn.addEventListener('click', () => speakText(btn.dataset.tts));
    });
  }

  // ==================== 2. 문자별 플래시카드 ====================
  function renderFlashcard(container, items, onProgressChange) {
    const item = items[itemIndex];
    const st = DB.getStatus(item.id);
    const fav = DB.isFavorite(item.id);
    const words = Array.isArray(item.words) ? item.words : [];

    container.innerHTML = `
      <div class="flashcard-wrap">
        <p style="margin-bottom:10px; color:var(--text-secondary); font-size:0.88rem;">
          카드 ${itemIndex + 1} / ${items.length} · 현재 상태: <strong>${DB.STATUS_LABEL[st]}</strong>
        </p>

        <div class="flashcard" id="fcCard">
          ${!fcFlipped ? `
            <div class="fc-main jp-font">${item.jp}</div>
            <div class="hint-text" style="margin-top:12px;">터치 또는 Space 키로 뒤집기</div>
          ` : `
            <div class="jp-font" style="font-size:2.4rem; font-weight:900; color:var(--accent);">${item.jp}</div>
            <div class="meaning-mask" style="font-size:1.15rem; font-weight:700; margin:8px 0;">${item.romaji} — ${item.meaning}</div>
            <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:8px;">${item.pronTip || ''}</p>
            <p style="font-size:0.9rem; margin-bottom:10px;">💡 ${item.mnemonic || ''}</p>
            <div style="width:100%; text-align:left; font-size:0.84rem;">
              ${words.slice(0, 2).map(w => `
                <div style="padding:4px 0;">• <strong class="jp-font">${w.jp}</strong> (${w.romaji}) — <span class="meaning-mask">${w.meaning}</span></div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="btn-row" style="margin-bottom:10px;">
          <button type="button" class="secondary-btn" id="fcPrev">◀ 이전</button>
          <button type="button" class="secondary-btn" id="fcTts">🔊 듣기</button>
          <button type="button" class="secondary-btn" id="fcFav">${fav ? '★ 즐겨찾기' : '☆ 즐겨찾기'}</button>
          <button type="button" class="primary-btn" id="fcNext">다음 ▶</button>
        </div>

        <div class="btn-row">
          <button type="button" class="warning-btn" id="fcHardBtn">어려움</button>
          <button type="button" class="secondary-btn" id="fcLearningBtn">학습중</button>
          <button type="button" class="success-btn" id="fcMasteredBtn">학습완료</button>
        </div>
      </div>
    `;

    const advanceNext = () => {
      itemIndex = (itemIndex + 1) % items.length;
      fcFlipped = false;
      DB.touchItemAsSeen(items[itemIndex].id);
      renderFlashcard(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
      if (onProgressChange) onProgressChange();
    };

    document.getElementById('fcCard')?.addEventListener('click', () => {
      fcFlipped = !fcFlipped;
      renderFlashcard(container, items, onProgressChange);
    });

    document.getElementById('fcPrev')?.addEventListener('click', () => {
      itemIndex = (itemIndex - 1 + items.length) % items.length;
      fcFlipped = false;
      DB.touchItemAsSeen(items[itemIndex].id);
      renderFlashcard(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
    });

    document.getElementById('fcNext')?.addEventListener('click', advanceNext);
    document.getElementById('fcTts')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('fcFav')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id);
      renderFlashcard(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
      if (onProgressChange) onProgressChange();
    });

    document.getElementById('fcHardBtn')?.addEventListener('click', () => {
      DB.setStatus(item.id, DB.STATUS.HARD);
      advanceNext();
    });
    document.getElementById('fcLearningBtn')?.addEventListener('click', () => {
      DB.setStatus(item.id, DB.STATUS.LEARNING);
      advanceNext();
    });
    document.getElementById('fcMasteredBtn')?.addEventListener('click', () => {
      DB.setStatus(item.id, DB.STATUS.MASTERED);
      advanceNext();
    });
  }

  // ==================== 3. 정밀 SVG 획순 & 캔버스 따라쓰기 ====================
  function renderStrokeAndTrace(container, items, onProgressChange) {
    const item = items[itemIndex];
    const strokes = Array.isArray(item.strokes) && item.strokes.length
      ? item.strokes
      : [{ d: 'M 25 50 L 75 50', tip: '1획: 가이드에 맞춰 긋습니다.' }];
    const fav = DB.isFavorite(item.id);

    container.innerHTML = `
      <div class="card">
        <div class="card-title-row">
          <div>
            <h3>획순 & 따라쓰기: <span class="jp-font" style="color:var(--accent); font-size:1.5rem;">${item.jp}</span> (${item.romaji} · <span class="meaning-mask">${item.meaning}</span>)</h3>
            <p class="hint-text" style="margin-top:4px;">${item.pronTip || ''} ${item.mnemonic || ''}</p>
          </div>
          <span class="hint-text">${itemIndex + 1} / ${items.length} · 총 ${strokes.length}획</span>
        </div>

        <div class="stroke-workspace">
          <div>
            <div class="stroke-box">
              <div class="stroke-grid-lines"></div>
              <svg id="strokeSvg" viewBox="0 0 100 100" aria-label="${item.jp} 획순 가이드">
                ${strokes.map((s, idx) => `<path class="stroke-path-bg" d="${s.d}"></path>`).join('')}
                ${strokes.map((s, idx) => `
                  <path class="stroke-path" id="animStroke_${idx}" d="${s.d}" pathLength="100" style="stroke-dasharray:100; stroke-dashoffset:100;"></path>
                `).join('')}
              </svg>
            </div>
            <div id="strokeActiveTip" class="hint-text" style="text-align:center; margin-top:8px; min-height:20px;">
              획순 애니메이션 버튼을 눌러 순서를 확인하세요.
            </div>
          </div>

          <div>
            <div class="stroke-box" style="display:flex; align-items:center; justify-content:center;">
              <div class="stroke-grid-lines"></div>
              <canvas id="traceCanvas" width="260" height="260"></canvas>
            </div>
            <div class="hint-text" style="text-align:center; margin-top:8px;">
              마우스 또는 손가락으로 직접 따라 써보세요.
            </div>
          </div>
        </div>

        <div class="btn-row" style="margin-top:16px;">
          <button type="button" class="primary-btn" id="playStrokeBtn">▶ 획순 애니메이션 재생</button>
          <button type="button" class="secondary-btn" id="pauseStrokeBtn">⏸ 일시정지</button>
          <button type="button" class="secondary-btn" id="restartStrokeBtn">↺ 처음부터 다시보기</button>
          <button type="button" class="secondary-btn" id="clearTraceBtn">내가 쓴 획 지우기</button>
        </div>

        <div class="btn-row" style="margin-top:10px;">
          <button type="button" class="secondary-btn" id="prevStrokeItemBtn">◀ 이전 문자</button>
          <button type="button" class="secondary-btn" id="strokeTtsBtn">🔊 TTS 듣기</button>
          <button type="button" class="secondary-btn" id="strokeFavBtn">${fav ? '★ 즐겨찾기' : '☆ 즐겨찾기'}</button>
          <button type="button" class="success-btn" id="strokeDoneBtn">암기완료 체크</button>
          <button type="button" class="primary-btn" id="nextStrokeItemBtn">다음 문자 ▶</button>
        </div>

        <div class="stroke-step-cards">
          ${strokes.map((s, idx) => `
            <div class="stroke-step-item" data-step="${idx}">
              <svg viewBox="0 0 100 100" width="56" height="56">
                <path class="stroke-path-bg" d="${s.d}"></path>
                <path class="stroke-path" d="${s.d}" style="stroke-width:10;"></path>
              </svg>
              <div style="font-weight:700; margin-top:2px;">${idx + 1}획</div>
              <div style="font-size:0.7rem; color:var(--text-secondary);">${s.tip.replace(/^\d+획:\s*/, '')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const resetPaths = () => {
      clearStrokeAnimation();
      activeStrokeStep = -1;
      strokes.forEach((_, idx) => {
        const p = document.getElementById(`animStroke_${idx}`);
        if (p) {
          p.style.transition = 'none';
          p.style.strokeDashoffset = '100';
        }
      });
    };

    const runAnimationFrom = (startStep = 0) => {
      clearStrokeAnimation();
      if (startStep === 0) {
        strokes.forEach((_, idx) => {
          const p = document.getElementById(`animStroke_${idx}`);
          if (p) {
            p.style.transition = 'none';
            p.style.strokeDashoffset = '100';
          }
        });
      }

      const step = i => {
        if (i >= strokes.length) {
          activeStrokeStep = -1;
          return;
        }
        if (strokePaused) {
          activeStrokeStep = i;
          return;
        }
        activeStrokeStep = i;
        const pathEl = document.getElementById(`animStroke_${i}`);
        const tipEl = document.getElementById('strokeActiveTip');
        if (tipEl) tipEl.textContent = strokes[i].tip;
        if (pathEl) {
          pathEl.style.transition = 'stroke-dashoffset 0.65s ease-in-out';
          pathEl.style.strokeDashoffset = '0';
        }
        strokeAnimTimer = setTimeout(() => step(i + 1), 750);
      };

      step(startStep);
    };

    document.getElementById('playStrokeBtn')?.addEventListener('click', () => {
      if (strokePaused && activeStrokeStep >= 0) {
        strokePaused = false;
        runAnimationFrom(activeStrokeStep);
      } else {
        runAnimationFrom(0);
      }
    });

    document.getElementById('pauseStrokeBtn')?.addEventListener('click', () => {
      strokePaused = true;
      if (strokeAnimTimer) {
        clearTimeout(strokeAnimTimer);
        strokeAnimTimer = null;
      }
    });

    document.getElementById('restartStrokeBtn')?.addEventListener('click', () => {
      resetPaths();
      runAnimationFrom(0);
    });

    // 캔버스 손글씨 세팅
    const canvas = document.getElementById('traceCanvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4f46e5';

    let drawing = false;
    const getPos = e => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const startDraw = e => {
      e.preventDefault();
      drawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };
    const moveDraw = e => {
      if (!drawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };
    const endDraw = () => {
      drawing = false;
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    document.getElementById('clearTraceBtn')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('prevStrokeItemBtn')?.addEventListener('click', () => {
      itemIndex = (itemIndex - 1 + items.length) % items.length;
      DB.touchItemAsSeen(items[itemIndex].id);
      renderStrokeAndTrace(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
    });

    document.getElementById('nextStrokeItemBtn')?.addEventListener('click', () => {
      itemIndex = (itemIndex + 1) % items.length;
      DB.touchItemAsSeen(items[itemIndex].id);
      renderStrokeAndTrace(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
    });

    document.getElementById('strokeTtsBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('strokeFavBtn')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id);
      renderStrokeAndTrace(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
      if (onProgressChange) onProgressChange();
    });

    document.getElementById('strokeDoneBtn')?.addEventListener('click', () => {
      DB.setStatus(item.id, DB.STATUS.MASTERED);
      renderSummaryBanner(items, onProgressChange);
      if (onProgressChange) onProgressChange();
      alert(`'${item.jp}' 암기완료로 저장되었습니다.`);
    });

    // 진입 시 1회 자동 재생
    runAnimationFrom(0);
  }

  // ==================== 4. 연상 암기법 + 3지선다 확인 문제 ====================
  function renderMnemonicTab(container, items, onProgressChange) {
    const item = items[itemIndex];
    const mq = item.mnemonicQuiz || {
      q: `「${item.jp}」의 발음은 무엇인가요?`,
      choices: [item.romaji, 'ka', 'sa'],
      answer: 0
    };
    const picked = mnemonicQuizSelection[item.id];

    container.innerHTML = `
      <div class="card">
        <div class="card-title-row">
          <h3>💡 연상 암기법: <span class="jp-font" style="color:var(--accent); font-size:1.4rem;">${item.jp}</span> (${item.romaji} · <span class="meaning-mask">${item.meaning}</span>)</h3>
          <span class="hint-text">${itemIndex + 1} / ${items.length}</span>
        </div>

        <div style="padding:14px; border-radius:12px; background:var(--accent-soft); margin-bottom:12px;">
          <strong>모양·스토리 연상:</strong> ${item.mnemonic || ''}
        </div>

        <div style="padding:14px; border-radius:12px; background:var(--bg-subtle); margin-bottom:16px;">
          <strong>발음 팁:</strong> ${item.pronTip || ''}
        </div>

        <div style="border-top:1px solid var(--border); padding-top:16px;">
          <h4 style="margin-bottom:8px;">연상 이해도 확인 (3지선다)</h4>
          <p style="font-weight:700; margin-bottom:10px;">${mq.q}</p>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${mq.choices.map((ch, idx) => {
              const isSelected = picked === idx;
              return `
                <button type="button" class="choice-btn mq-choice-btn" data-cidx="${idx}" style="text-align:left; ${isSelected ? 'border-color:var(--accent); background:var(--accent-soft);' : ''}">
                  ${idx + 1}. ${ch}
                </button>
              `;
            }).join('')}
          </div>
          <div id="mqFeedback" style="margin-top:10px; font-weight:700; min-height:22px;">
            ${typeof picked === 'number'
              ? (picked === mq.answer
                ? `<span style="color:var(--st-mastered);">🎉 정답입니다! 연상 포인트를 잘 기억하셨어요.</span>`
                : `<span style="color:var(--danger);">❌ 다시 생각해 보세요. 정답은 '${mq.choices[mq.answer]}' 입니다.</span>`)
              : ''}
          </div>
        </div>

        <div class="btn-row" style="margin-top:16px;">
          <button type="button" class="secondary-btn" id="mnPrevBtn">◀ 이전 문자</button>
          <button type="button" class="secondary-btn" id="mnTtsBtn">🔊 발음 듣기</button>
          <button type="button" class="primary-btn" id="mnNextBtn">다음 문자 ▶</button>
        </div>
      </div>
    `;

    container.querySelectorAll('.mq-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cidx = Number(btn.dataset.cidx);
        mnemonicQuizSelection[item.id] = cidx;
        if (cidx === mq.answer) {
          DB.recordQuiz(true, item, '연상 퀴즈');
        } else {
          DB.recordQuiz(false, item, '연상 퀴즈 오답');
        }
        renderMnemonicTab(container, items, onProgressChange);
        renderSummaryBanner(items, onProgressChange);
        if (onProgressChange) onProgressChange();
      });
    });

    document.getElementById('mnPrevBtn')?.addEventListener('click', () => {
      itemIndex = (itemIndex - 1 + items.length) % items.length;
      DB.touchItemAsSeen(items[itemIndex].id);
      renderMnemonicTab(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
    });

    document.getElementById('mnNextBtn')?.addEventListener('click', () => {
      itemIndex = (itemIndex + 1) % items.length;
      DB.touchItemAsSeen(items[itemIndex].id);
      renderMnemonicTab(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
    });

    document.getElementById('mnTtsBtn')?.addEventListener('click', () => speakText(item.jp));
  }

  // ==================== 5. 문자별 단어·예문 + 행 위치 이동 ====================
  function renderWordsAndExamplesTab(container, items, onProgressChange) {
    const rowFiltered = selectedRow === 'all'
      ? items
      : items.filter(i => i.row === selectedRow);
    const list = rowFiltered.length ? rowFiltered : items;
    const currentInListIdx = list.findIndex(i => i.id === items[itemIndex]?.id);
    const activeIdx = currentInListIdx >= 0 ? currentInListIdx : 0;
    const item = list[activeIdx];
    itemIndex = Math.max(0, items.findIndex(i => i.id === item.id));

    const words = Array.isArray(item.words) ? item.words : [];
    const examples = Array.isArray(item.examples) ? item.examples : [];

    container.innerHTML = `
      <div class="row-jump-bar" aria-label="행 빠른 이동">
        <button type="button" class="row-chip ${selectedRow === 'all' ? 'active' : ''}" data-row="all">전체</button>
        ${ROWS.map(r => `
          <button type="button" class="row-chip ${selectedRow === r ? 'active' : ''}" data-row="${r}">${r}</button>
        `).join('')}
      </div>

      <div class="card">
        <div class="card-title-row">
          <div>
            <span class="hint-text">${item.row} · ${activeIdx + 1} / ${list.length}</span>
            <h3 style="margin-top:4px;">
              <span class="jp-font" style="font-size:1.7rem; color:var(--accent);">${item.jp}</span>
              (${item.romaji} · <span class="meaning-mask">${item.meaning}</span>)
            </h3>
          </div>
          <div class="btn-row">
            <button type="button" class="secondary-btn" id="exPrevBtn">◀ 이전</button>
            <button type="button" class="secondary-btn" id="exCharTtsBtn">🔊 문자 듣기</button>
            <button type="button" class="primary-btn" id="exNextBtn">다음 ▶</button>
          </div>
        </div>

        <h4 style="margin:12px 0 8px;">관련 단어</h4>
        ${words.map(w => `
          <div class="word-sample-row">
            <div>
              <strong class="jp-font" style="font-size:1.1rem;">${w.emoji ? w.emoji + ' ' : ''}${w.jp}</strong>
              <span class="hint-text" style="margin-left:8px;">[${w.romaji}]</span>
              <span class="meaning-mask" style="margin-left:8px; font-weight:700;">${w.meaning}</span>
            </div>
            <button type="button" class="secondary-btn ex-speak-btn" data-tts="${w.jp}" style="padding:6px 10px;">🔊 듣기</button>
          </div>
        `).join('')}

        <h4 style="margin:16px 0 8px;">예문</h4>
        ${examples.map(ex => `
          <div style="padding:12px 14px; border-left:4px solid var(--accent); background:var(--bg-subtle); border-radius:10px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <div class="jp-font" style="font-size:1.12rem; font-weight:700;">${ex.jp}</div>
              <button type="button" class="secondary-btn ex-speak-btn" data-tts="${ex.jp}" style="padding:5px 10px;">🔊 예문</button>
            </div>
            <div class="hint-text" style="margin:3px 0;">${ex.romaji}</div>
            <div class="meaning-mask" style="font-size:0.92rem; font-weight:600;">→ ${ex.meaning}</div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.row-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        selectedRow = chip.dataset.row;
        const targetList = selectedRow === 'all'
          ? items
          : items.filter(i => i.row === selectedRow);
        if (targetList.length) {
          itemIndex = items.findIndex(i => i.id === targetList[0].id);
          DB.touchItemAsSeen(items[itemIndex].id);
        }
        renderWordsAndExamplesTab(container, items, onProgressChange);
        renderSummaryBanner(items, onProgressChange);
      });
    });

    document.getElementById('exPrevBtn')?.addEventListener('click', () => {
      const nextIdx = (activeIdx - 1 + list.length) % list.length;
      itemIndex = items.findIndex(i => i.id === list[nextIdx].id);
      DB.touchItemAsSeen(items[itemIndex].id);
      renderWordsAndExamplesTab(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
    });

    document.getElementById('exNextBtn')?.addEventListener('click', () => {
      const nextIdx = (activeIdx + 1) % list.length;
      itemIndex = items.findIndex(i => i.id === list[nextIdx].id);
      DB.touchItemAsSeen(items[itemIndex].id);
      renderWordsAndExamplesTab(container, items, onProgressChange);
      renderSummaryBanner(items, onProgressChange);
    });

    document.getElementById('exCharTtsBtn')?.addEventListener('click', () => speakText(item.jp));
    container.querySelectorAll('.ex-speak-btn').forEach(btn => {
      btn.addEventListener('click', () => speakText(btn.dataset.tts));
    });
  }

  // ==================== 외부 단축키·헤더 연동 API ====================
  function stepItem(delta) {
    const items = getFilteredItems(currentCategory);
    if (!items.length) return;
    itemIndex = (itemIndex + delta + items.length) % items.length;
    DB.touchItemAsSeen(items[itemIndex].id);
    render(currentCategory, window.AppController?.refreshDashboard);
  }

  function toggleFlashcardOrStrokeAction() {
    if (currentMode === 'flashcard') {
      fcFlipped = !fcFlipped;
      render(currentCategory, window.AppController?.refreshDashboard);
    } else if (currentMode === 'stroke') {
      document.getElementById('playStrokeBtn')?.click();
    }
  }

  function toggleCurrentFavorite() {
    const items = getFilteredItems(currentCategory);
    if (!items.length) return;
    const target = items[itemIndex] || items[0];
    DB.toggleFavorite(target.id);
    render(currentCategory, window.AppController?.refreshDashboard);
  }

  function getActiveSpeakingText() {
    const items = getFilteredItems(currentCategory);
    if (!items.length) return 'あ';
    const current = items[itemIndex] || items[0];
    if (currentMode === 'examples' && Array.isArray(current.words) && current.words[0]) {
      return current.words[0].jp;
    }
    return current.jp;
  }

  return {
    setCategory,
    setMode,
    render,
    stepItem,
    toggleFlashcardOrStrokeAction,
    toggleCurrentFavorite,
    getActiveSpeakingText,
    speakText
  };
})();
