// 히라가나 심화 학습 및 카테고리별 학습 모듈 (StudyModule)
const StudyModule = (() => {
  let currentCategory = 'hiragana';
  let currentMode = 'chart'; // 'chart' | 'flashcard' | 'stroke' | 'mnemonic' | 'examples'
  let activeCharId = 'h_a';
  let fcIndex = 0;
  let fcFlipped = false;

  // SVG 획순 애니메이션 제어 상태
  let strokeAnimTimer = null;
  let strokePaused = false;
  let strokeCurrentStep = 0;

  // 행별 50음도 표준 슬롯 (2차원 그리드 매핑용: 5열 기준, 빈칸은 null)
  const HIRAGANA_ROWS_SLOTS = [
    { row: 'あ행', slots: ['h_a', 'h_i', 'h_u', 'h_e', 'h_o'] },
    { row: 'か행', slots: ['h_ka', 'h_ki', 'h_ku', 'h_ke', 'h_ko'] },
    { row: 'さ행', slots: ['h_sa', 'h_shi', 'h_su', 'h_se', 'h_so'] },
    { row: 'た행', slots: ['h_ta', 'h_chi', 'h_tsu', 'h_te', 'h_to'] },
    { row: 'な행', slots: ['h_na', 'h_ni', 'h_nu', 'h_ne', 'h_no'] },
    { row: 'は행', slots: ['h_ha', 'h_hi', 'h_fu', 'h_he', 'h_ho'] },
    { row: 'ま행', slots: ['h_ma', 'h_mi', 'h_mu', 'h_me', 'h_mo'] },
    { row: 'や행', slots: ['h_ya', null, 'h_yu', null, 'h_yo'] },
    { row: 'ら행', slots: ['h_ra', 'h_ri', 'h_ru', 'h_re', 'h_ro'] },
    { row: 'わ행', slots: ['h_wa', null, 'h_n', null, 'h_wo'] }
  ];

  function getAllItems() {
    if (window.ContentDB && typeof window.ContentDB.getAllItems === 'function') {
      return window.ContentDB.getAllItems();
    }
    return (window.JP_DATA && window.JP_DATA.items) || [];
  }

  function getHiraganaList() {
    return getAllItems().filter(item => item.category === 'hiragana');
  }

  function getItemsByCategory(category) {
    const all = getAllItems();
    if (!category || category === 'all') return all;
    return all.filter(item => item.category === category);
  }

  function getItemById(id) {
    return getAllItems().find(item => item.id === id) || null;
  }

  function speakText(text) {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = 0.92;
    window.speechSynthesis.speak(utter);
  }

  function setCategory(category) {
    currentCategory = category || 'hiragana';
    fcIndex = 0;
    fcFlipped = false;
    stopStrokeAnimation();

    const hiraTabs = document.getElementById('hiraganaSubTabs');
    const genTabs = document.getElementById('generalSubTabs');

    if (currentCategory === 'hiragana') {
      hiraTabs?.classList.remove('hidden');
      genTabs?.classList.add('hidden');
      if (!['chart', 'flashcard', 'stroke', 'mnemonic', 'examples'].includes(currentMode)) {
        currentMode = 'chart';
      }
    } else {
      hiraTabs?.classList.add('hidden');
      genTabs?.classList.remove('hidden');
      if (!['chart', 'flashcard', 'stroke'].includes(currentMode)) {
        currentMode = 'chart';
      }
    }

    syncSubTabActive();
  }

  function setMode(mode, charId = null) {
    currentMode = mode;
    fcFlipped = false;
    stopStrokeAnimation();
    if (charId) {
      activeCharId = charId;
      const hiraList = getHiraganaList();
      const idx = hiraList.findIndex(item => item.id === charId);
      if (idx !== -1) fcIndex = idx;
    }
    syncSubTabActive();
  }

  function syncSubTabActive() {
    const activeBar = currentCategory === 'hiragana'
      ? document.getElementById('hiraganaSubTabs')
      : document.getElementById('generalSubTabs');
    activeBar?.querySelectorAll('.sub-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === currentMode);
    });
  }

  function getActiveSpeakingText() {
    const item = getItemById(activeCharId) || getHiraganaList()[fcIndex];
    return item ? item.jp : 'あ';
  }

  function stepItem(delta) {
    const list = currentCategory === 'hiragana'
      ? getHiraganaList()
      : getItemsByCategory(currentCategory);
    if (!list.length) return;

    const curIdx = Math.max(0, list.findIndex(i => i.id === activeCharId));
    const nextIdx = (curIdx + delta + list.length) % list.length;
    activeCharId = list[nextIdx].id;
    fcIndex = nextIdx;
    fcFlipped = false;
    DB.touchItemAsSeen(activeCharId);
    stopStrokeAnimation();
    render(currentCategory, window.AppController?.refreshDashboard);
  }

  function toggleCurrentFavorite() {
    const item = getItemById(activeCharId);
    if (!item) return;
    DB.toggleFavorite(item.id);
    render(currentCategory, window.AppController?.refreshDashboard);
  }

  function toggleFlashcardOrStrokeAction() {
    if (currentMode === 'flashcard') {
      fcFlipped = !fcFlipped;
      render(currentCategory, window.AppController?.refreshDashboard);
    } else if (currentMode === 'stroke') {
      if (strokePaused) {
        resumeStrokeAnimation();
      } else {
        pauseStrokeAnimation();
      }
    }
  }

  // 상단 요약 진도표(히라가나 암기율·즐겨찾기·복습필요) 렌더링
  function renderSummaryBanner(category) {
    const banner = document.getElementById('studySummaryBanner');
    if (!banner) return;

    const allItems = getAllItems();
    const targetItems = category === 'hiragana' ? getHiraganaList() : getItemsByCategory(category);
    const state = DB.load();

    let masteredCount = 0;
    let learningCount = 0;
    let hardCount = 0;

    targetItems.forEach(item => {
      const st = state.statuses[item.id] || DB.STATUS.UNLEARNED;
      if (st === DB.STATUS.MASTERED) masteredCount += 1;
      else if (st === DB.STATUS.HARD) hardCount += 1;
      else if (st === DB.STATUS.LEARNING) learningCount += 1;
    });

    const total = targetItems.length || 1;
    const memorizedPercent = Math.round((masteredCount / total) * 100);
    const favCount = targetItems.filter(item => state.favorites.includes(item.id)).length;
    const reviewCount = DB.getReviewNeededItems(targetItems).length;

    const catTitleMap = {
      hiragana: '히라가나 (50음도)',
      katakana: '가타카나',
      noun: '명사',
      i_adj: 'い형용사',
      na_adj: 'な형용사',
      verb: '동사'
    };

    banner.innerHTML = `
      <div class="summary-top-row">
        <div>
          <strong>${catTitleMap[category] || '학습 영역'} 진도표</strong>
          <span class="hint-text"> · 암기완료 ${masteredCount}/${targetItems.length}자 (${memorizedPercent}%)</span>
        </div>
        <div class="summary-pills">
          <span class="summary-pill">🎯 암기율 ${memorizedPercent}%</span>
          <span class="summary-pill">📘 학습중 ${learningCount}</span>
          <span class="summary-pill">⭐ 즐겨찾기 ${favCount}</span>
          <span class="summary-pill">🔁 복습필요 ${reviewCount}</span>
        </div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${memorizedPercent}%"></div>
      </div>
    `;
  }

  function render(category = currentCategory, onProgressChange = null) {
    currentCategory = category || 'hiragana';
    const container = document.getElementById('studyContainer');
    if (!container) return;

    renderSummaryBanner(currentCategory);
    syncSubTabActive();

    if (currentCategory === 'hiragana') {
      if (currentMode === 'chart') renderHiraganaChart(container, onProgressChange);
      else if (currentMode === 'flashcard') renderFlashcard(container, getHiraganaList(), onProgressChange);
      else if (currentMode === 'stroke') renderStrokeAndTrace(container, getHiraganaList(), onProgressChange);
      else if (currentMode === 'mnemonic') renderMnemonicTab(container, getHiraganaList(), onProgressChange);
      else if (currentMode === 'examples') renderWordsAndExamplesTab(container, getHiraganaList(), onProgressChange);
    } else {
      const items = getItemsByCategory(currentCategory);
      if (currentMode === 'chart') renderGeneralList(container, items, onProgressChange);
      else if (currentMode === 'flashcard') renderFlashcard(container, items, onProgressChange);
      else if (currentMode === 'stroke') renderStrokeAndTrace(container, items, onProgressChange);
    }
  }

  // 5.1 히라가나 50음도 타일 그리드
  function renderHiraganaChart(container, onProgressChange) {
    const hiraList = getHiraganaList();
    const mapById = new Map(hiraList.map(item => [item.id, item]));

    const tilesHtml = HIRAGANA_ROWS_SLOTS.map(rowObj => {
      return rowObj.slots.map(slotId => {
        if (!slotId || !mapById.has(slotId)) {
          return `<div class="char-card empty" aria-hidden="true"></div>`;
        }
        const item = mapById.get(slotId);
        const st = DB.getStatus(item.id);
        const fav = DB.isFavorite(item.id);
        return `
          <div class="char-card status-${st}" data-id="${item.id}">
            <button type="button" class="tile-fav-btn ${fav ? 'active' : ''}" data-fav-id="${item.id}" title="즐겨찾기" aria-label="${item.jp} 즐겨찾기">
              ${fav ? '★' : '☆'}
            </button>
            <div class="char-jp jp-font">${item.jp}</div>
            <div class="char-romaji">${item.romaji} · <span class="meaning-mask">${item.meaning}</span></div>
            <span class="tile-status-tag">${DB.STATUS_LABEL[st]}</span>
          </div>
        `;
      }).join('');
    }).join('');

    container.innerHTML = `
      <div class="card">
        <div class="card-title-row">
          <h3>히라가나 50음도 타일</h3>
          <span class="hint-text">타일을 누르면 상세 팝업이 열리며 '미학습' 문자는 자동으로 '학습중'이 됩니다.</span>
        </div>

        <div class="kana-legend">
          <span class="legend-item"><i class="dot unlearned"></i>미학습</span>
          <span class="legend-item"><i class="dot learning"></i>학습중</span>
          <span class="legend-item"><i class="dot hard"></i>어려움</span>
          <span class="legend-item"><i class="dot mastered"></i>암기완료</span>
        </div>

        <div class="char-grid">${tilesHtml}</div>
      </div>
    `;

    container.querySelectorAll('.tile-fav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        DB.toggleFavorite(btn.dataset.favId);
        renderHiraganaChart(container, onProgressChange);
        if (onProgressChange) onProgressChange();
      });
    });

    container.querySelectorAll('.char-card:not(.empty)').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        DB.touchItemAsSeen(id);
        activeCharId = id;
        openCharDetailModal(id, onProgressChange);
        renderSummaryBanner(currentCategory);
        // 타일 시각 상태 갱신
        const st = DB.getStatus(id);
        card.className = `char-card status-${st}`;
        const tag = card.querySelector('.tile-status-tag');
        if (tag) tag.textContent = DB.STATUS_LABEL[st];
        if (onProgressChange) onProgressChange();
      });
    });
  }

  // 5.1 문자 상세 팝업 (우측 상단 닫기 버튼 + 4단계 상태 + 획순/연상 탭 이동 + 암기팁 + 예시 단어 2~3개)
  function openCharDetailModal(id, onProgressChange) {
    const item = getItemById(id);
    const modal = document.getElementById('charDetailModal');
    const body = document.getElementById('charModalBody');
    if (!item || !modal || !body) return;

    const currentStatus = DB.getStatus(item.id);
    const isFav = DB.isFavorite(item.id);
    const strokeCount = (item.strokes && item.strokes.length) || 1;
    const sampleWords = (item.words || []).slice(0, 3);

    body.innerHTML = `
      <div class="modal-hero">
        <div class="modal-big-char jp-font">${item.jp}</div>
        <div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <h3 id="modalCharTitle" style="font-size:1.4rem;">
              <span class="jp-font">${item.jp}</span> (${item.romaji}) · <span class="meaning-mask">${item.meaning}</span>
            </h3>
            <button type="button" class="secondary-btn" id="modalSpeakBtn">🔊 발음 듣기</button>
            <button type="button" class="secondary-btn" id="modalFavBtn">${isFav ? '★ 즐겨찾기됨' : '☆ 즐겨찾기'}</button>
          </div>
          <p style="font-size:0.86rem; color:var(--text-secondary); margin-top:6px;">
            ${item.row} · 획순: <strong>${strokeCount}획</strong>
          </p>
        </div>
      </div>

      <div style="margin-bottom:10px;">
        <strong>🗣️ 발음 방법</strong>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:3px;">${item.pronTip || '자연스럽고 명확하게 발음하세요.'}</p>
      </div>

      <div style="margin-bottom:10px;">
        <strong>💡 연상 기법</strong>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:3px;">${item.mnemonic}</p>
      </div>

      <div style="margin-top:12px;">
        <strong style="font-size:0.86rem;">학습 상태 설정</strong>
        <div class="status-selector">
          ${Object.entries(DB.STATUS_LABEL).map(([stKey, label]) => `
            <button type="button" class="status-opt-btn ${currentStatus === stKey ? 'active' : ''}" data-st="${stKey}">
              ${label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- 팝업 내 이동 탭: 획순 및 따라 쓰기 / 그림·모양 연상 -->
      <div class="modal-inner-tabs">
        <button type="button" class="primary-btn" id="jumpToStrokeBtn" style="flex:1;">✍️ 획순 및 따라 쓰기 탭으로 이동</button>
        <button type="button" class="secondary-btn" id="jumpToMnemonicBtn" style="flex:1;">🎨 그림·모양 연상 탭으로 이동</button>
      </div>

      <!-- 하단 암기 팁 및 예시 단어 2~3개 -->
      <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--border);">
        <p style="font-size:0.86rem; margin-bottom:10px;">
          <strong>📌 암기 팁:</strong> ${item.mnemonic}
        </p>
        <strong style="font-size:0.88rem; display:block; margin-bottom:8px;">이 문자가 포함된 단어</strong>
        ${sampleWords.map(w => `
          <div class="word-sample-row">
            <div>
              <span class="jp-font" style="font-size:1.1rem; font-weight:700;">
                ${w.emoji ? w.emoji + ' ' : ''}${w.jp}
              </span>
              <span style="font-size:0.84rem; color:var(--text-secondary); margin-left:6px;">[${w.romaji}]</span>
              <span class="meaning-mask" style="font-size:0.9rem; margin-left:6px;">- ${w.meaning}</span>
            </div>
            <button type="button" class="secondary-btn sample-tts-btn" data-tts="${w.jp}" style="padding:5px 10px; font-size:0.78rem;">🔊</button>
          </div>
        `).join('')}
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('modalSpeakBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('modalFavBtn')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id);
      openCharDetailModal(item.id, onProgressChange);
      if (currentMode === 'chart') renderHiraganaChart(document.getElementById('studyContainer'), onProgressChange);
      if (onProgressChange) onProgressChange();
    });

    body.querySelectorAll('.status-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.setStatus(item.id, btn.dataset.st);
        openCharDetailModal(item.id, onProgressChange);
        renderSummaryBanner(currentCategory);
        if (currentMode === 'chart') renderHiraganaChart(document.getElementById('studyContainer'), onProgressChange);
        if (onProgressChange) onProgressChange();
      });
    });

    body.querySelectorAll('.sample-tts-btn').forEach(btn => {
      btn.addEventListener('click', () => speakText(btn.dataset.tts));
    });

    document.getElementById('jumpToStrokeBtn')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      setMode('stroke', item.id);
      render(currentCategory, onProgressChange);
    });

    document.getElementById('jumpToMnemonicBtn')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      setMode('mnemonic', item.id);
      render(currentCategory, onProgressChange);
    });
  }

  // 5.2 문자별 플래시카드 (앞면: 문자만 / 뒷면: 모든 정보 / 어려움·학습중·학습완료 버튼)
  function renderFlashcard(container, items, onProgressChange) {
    if (!items.length) return;
    if (fcIndex >= items.length) fcIndex = 0;
    const item = items[fcIndex];
    activeCharId = item.id;
    DB.touchItemAsSeen(item.id);

    const sampleWords = (item.words || []).slice(0, 3);

    container.innerHTML = `
      <div class="flashcard-wrap">
        <p style="margin-bottom:10px; color:var(--text-secondary); font-size:0.88rem;">
          카드 ${fcIndex + 1} / ${items.length} · 앞면은 문자만 표시됩니다. 카드를 눌러 뒷면 정보를 확인하세요.
        </p>

        <div class="flashcard" id="fcCard">
          ${!fcFlipped ? `
            <div class="fc-main jp-font">${item.jp}</div>
            <span style="font-size:0.85rem; color:var(--text-secondary);">터치하여 뜻·발음·연상·단어 보기</span>
          ` : `
            <div style="font-size:2.4rem; font-weight:900; color:var(--accent);" class="jp-font">${item.jp}</div>
            <div style="font-size:1.1rem; font-weight:700; margin:6px 0;">
              ${item.romaji} · <span class="meaning-mask">${item.meaning}</span>
            </div>
            <button type="button" class="secondary-btn" id="fcSpeakBtn" style="margin-bottom:10px;">🔊 발음 듣기</button>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:8px;">${item.pronTip || ''}</p>
            <div class="fc-mnemonic">💡 ${item.mnemonic}</div>
            <div style="width:100%; text-align:left; margin-top:12px; font-size:0.84rem;">
              ${sampleWords.map(w => `
                <div style="padding:4px 0;">
                  ${w.emoji ? w.emoji + ' ' : ''}<strong class="jp-font">${w.jp}</strong> (${w.romaji}) - <span class="meaning-mask">${w.meaning}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="btn-row" style="margin-bottom:10px;">
          <button type="button" class="warning-btn" id="fcHardBtn">어려움</button>
          <button type="button" class="primary-btn" id="fcLearningBtn">학습중</button>
          <button type="button" class="success-btn" id="fcMasteredBtn">학습완료</button>
        </div>

        <div class="btn-row">
          <button type="button" class="secondary-btn" id="fcPrevBtn">◀ 이전</button>
          <button type="button" class="secondary-btn" id="fcNextBtn">다음 ▶</button>
        </div>
      </div>
    `;

    document.getElementById('fcCard')?.addEventListener('click', e => {
      if (e.target.closest('#fcSpeakBtn')) return;
      fcFlipped = !fcFlipped;
      renderFlashcard(container, items, onProgressChange);
    });

    document.getElementById('fcSpeakBtn')?.addEventListener('click', e => {
      e.stopPropagation();
      speakText(item.jp);
    });

    const markAndNext = st => {
      DB.setStatus(item.id, st);
      fcIndex = (fcIndex + 1) % items.length;
      fcFlipped = false;
      renderSummaryBanner(currentCategory);
      if (onProgressChange) onProgressChange();
      renderFlashcard(container, items, onProgressChange);
    };

    document.getElementById('fcHardBtn')?.addEventListener('click', () => markAndNext(DB.STATUS.HARD));
    document.getElementById('fcLearningBtn')?.addEventListener('click', () => markAndNext(DB.STATUS.LEARNING));
    document.getElementById('fcMasteredBtn')?.addEventListener('click', () => markAndNext(DB.STATUS.MASTERED));

    document.getElementById('fcPrevBtn')?.addEventListener('click', () => {
      fcIndex = (fcIndex - 1 + items.length) % items.length;
      fcFlipped = false;
      renderFlashcard(container, items, onProgressChange);
    });

    document.getElementById('fcNextBtn')?.addEventListener('click', () => {
      fcIndex = (fcIndex + 1) % items.length;
      fcFlipped = false;
      renderFlashcard(container, items, onProgressChange);
    });
  }

  // 5.3 획순 & 따라쓰기 (정밀 SVG 획순 애니메이션 + 손글씨 캔버스 + 컨트롤 버튼 + 획별 가이드)
  function renderStrokeAndTrace(container, items, onProgressChange) {
    if (!items.length) return;
    const item = getItemById(activeCharId) || items[0];
    activeCharId = item.id;
    DB.touchItemAsSeen(item.id);

    const strokes = item.strokes && item.strokes.length
      ? item.strokes
      : [{ d: 'M 25 25 L 75 75', tip: '1획: 가이드 문자를 따라 순서대로 써보세요.' }];
    const isFav = DB.isFavorite(item.id);

    container.innerHTML = `
      <div class="card">
        <div class="card-title-row">
          <div>
            <h3>획순 & 따라쓰기: <span class="jp-font" style="color:var(--accent); font-size:1.5rem;">${item.jp}</span> (${item.romaji} · <span class="meaning-mask">${item.meaning}</span>)</h3>
            <p style="font-size:0.88rem; color:var(--text-secondary); margin-top:4px;">${item.pronTip || item.mnemonic}</p>
          </div>
          <div class="btn-row">
            <button type="button" class="secondary-btn" id="strokeSpeakBtn">🔊 TTS</button>
            <button type="button" class="secondary-btn" id="strokeFavBtn">${isFav ? '★ 즐겨찾기됨' : '☆ 즐겨찾기'}</button>
            <button type="button" class="secondary-btn" id="strokePrevBtn">◀ 이전 문자</button>
            <button type="button" class="primary-btn" id="strokeNextBtn">다음 문자 ▶</button>
          </div>
        </div>

        <div class="stroke-workspace">
          <!-- 왼쪽: 정밀 SVG 획순 애니메이션 -->
          <div style="text-align:center;">
            <p style="font-size:0.84rem; font-weight:700; margin-bottom:8px;">정밀 SVG 획순 애니메이션 (${strokes.length}획)</p>
            <div class="stroke-box">
              <div class="stroke-grid-lines"></div>
              <svg id="strokeSvg" viewBox="0 0 100 100" aria-label="${item.jp} 획순 가이드">
                ${strokes.map(s => `<path class="stroke-path-bg" d="${s.d}"></path>`).join('')}
                ${strokes.map((s, i) => `<path class="stroke-path" id="animStroke_${i}" d="${s.d}"></path>`).join('')}
              </svg>
            </div>
            <div class="btn-row" style="margin-top:10px;">
              <button type="button" class="primary-btn" id="playStrokeBtn">▶ 재생</button>
              <button type="button" class="secondary-btn" id="pauseStrokeBtn">⏸ 일시정지</button>
              <button type="button" class="secondary-btn" id="restartStrokeBtn">↺ 처음부터 다시보기</button>
            </div>
          </div>

          <!-- 오른쪽: 손글씨 따라쓰기 캔버스 -->
          <div style="text-align:center;">
            <p style="font-size:0.84rem; font-weight:700; margin-bottom:8px;">손글씨 따라쓰기 캔버스</p>
            <div class="stroke-box">
              <div class="stroke-grid-lines"></div>
              <canvas id="traceCanvas" width="260" height="260"></canvas>
            </div>
            <div class="btn-row" style="margin-top:10px;">
              <button type="button" class="secondary-btn" id="clearTraceBtn">🧹 내가 쓴 획 지우기</button>
            </div>
          </div>
        </div>

        <!-- 하단: 각 획당 쓰는 방법 시각·이미지 가이드 -->
        <div style="margin-top:20px; padding-top:14px; border-top:1px solid var(--border);">
          <strong style="font-size:0.9rem; display:block; margin-bottom:8px;">각 획당 쓰는 방법</strong>
          <div class="stroke-step-cards">
            ${strokes.map((s, idx) => `
              <div class="stroke-step-item" style="width:auto; min-width:150px; max-width:240px; text-align:left;">
                <svg viewBox="0 0 100 100" width="64" height="64" style="display:block; margin:0 auto 6px; border:1px solid var(--border); border-radius:8px;">
                  ${strokes.map((prevS, pIdx) => `
                    <path d="${prevS.d}" fill="none" stroke="${pIdx === idx ? 'var(--accent)' : 'var(--watermark-color)'}" stroke-width="${pIdx === idx ? '9' : '6'}" stroke-linecap="round" stroke-linejoin="round"></path>
                  `).join('')}
                </svg>
                <div style="font-size:0.8rem; color:var(--text-primary);">${s.tip}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('strokeSpeakBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('strokeFavBtn')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id);
      renderStrokeAndTrace(container, items, onProgressChange);
      if (onProgressChange) onProgressChange();
    });
    document.getElementById('strokePrevBtn')?.addEventListener('click', () => stepItem(-1));
    document.getElementById('strokeNextBtn')?.addEventListener('click', () => stepItem(1));

    // SVG 획순 애니메이션 준비 및 재생
    setupStrokeAnimation(strokes.length);
    document.getElementById('playStrokeBtn')?.addEventListener('click', () => {
      if (strokePaused) resumeStrokeAnimation();
      else playStrokeAnimation(strokes.length, 0);
    });
    document.getElementById('pauseStrokeBtn')?.addEventListener('click', pauseStrokeAnimation);
    document.getElementById('restartStrokeBtn')?.addEventListener('click', () => {
      stopStrokeAnimation();
      playStrokeAnimation(strokes.length, 0);
    });

    // 손글씨 캔버스 설정
    const canvas = document.getElementById('traceCanvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4f46e5';

    let drawing = false;
    const getXY = e => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((cx - rect.left) / rect.width) * canvas.width,
        y: ((cy - rect.top) / rect.height) * canvas.height
      };
    };

    const onStart = e => {
      e.preventDefault();
      drawing = true;
      const pt = getXY(e);
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
    };
    const onMove = e => {
      if (!drawing) return;
      e.preventDefault();
      const pt = getXY(e);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    };
    const onEnd = () => { drawing = false; };

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);

    document.getElementById('clearTraceBtn')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // 자동 첫 재생
    playStrokeAnimation(strokes.length, 0);
  }

  function setupStrokeAnimation(count) {
    for (let i = 0; i < count; i += 1) {
      const el = document.getElementById(`animStroke_${i}`);
      if (!el) continue;
      const len = el.getTotalLength ? el.getTotalLength() : 160;
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.transition = 'none';
    }
  }

  function stopStrokeAnimation() {
    if (strokeAnimTimer) {
      clearTimeout(strokeAnimTimer);
      strokeAnimTimer = null;
    }
    strokePaused = false;
    strokeCurrentStep = 0;
  }

  function pauseStrokeAnimation() {
    if (strokeAnimTimer) {
      clearTimeout(strokeAnimTimer);
      strokeAnimTimer = null;
    }
    strokePaused = true;
  }

  function resumeStrokeAnimation() {
    const item = getItemById(activeCharId);
    const total = (item && item.strokes && item.strokes.length) || 1;
    strokePaused = false;
    playStrokeAnimation(total, strokeCurrentStep);
  }

  function playStrokeAnimation(total, startIdx) {
    if (startIdx === 0) setupStrokeAnimation(total);
    strokePaused = false;

    const runStep = idx => {
      strokeCurrentStep = idx;
      if (idx >= total) {
        strokeAnimTimer = null;
        return;
      }
      const el = document.getElementById(`animStroke_${idx}`);
      if (el) {
        const len = el.getTotalLength ? el.getTotalLength() : 160;
        el.style.transition = 'stroke-dashoffset 0.65s ease-in-out';
        el.style.strokeDashoffset = '0';
      }
      strokeAnimTimer = setTimeout(() => runStep(idx + 1), 750);
    };

    runStep(startIdx);
  }

  // 5.4 연상 암기법 탭 (모양·발음 연상 스토리 + 간단한 3지선다 확인 문제)
  function renderMnemonicTab(container, items, onProgressChange) {
    const item = getItemById(activeCharId) || items[0];
    activeCharId = item.id;
    DB.touchItemAsSeen(item.id);

    const mq = item.mnemonicQuiz || {
      q: `「${item.jp}」의 발음으로 알맞은 것은?`,
      choices: [`${item.romaji} (${item.meaning})`, 'ka (카)', 'so (소)'],
      answer: 0
    };

    container.innerHTML = `
      <div class="card" style="max-width:640px; margin:0 auto;">
        <div class="card-title-row">
          <h3>💡 연상 암기법: <span class="jp-font" style="color:var(--accent); font-size:1.5rem;">${item.jp}</span> (${item.romaji})</h3>
          <div class="btn-row">
            <button type="button" class="secondary-btn" id="mnPrevBtn">◀ 이전</button>
            <button type="button" class="secondary-btn" id="mnNextBtn">다음 ▶</button>
          </div>
        </div>

        <p style="margin-bottom:8px;"><strong>🗣️ 발음 가이드:</strong> ${item.pronTip || ''}</p>
        <div class="fc-mnemonic" style="margin-bottom:18px;">
          <strong>🎨 모양·발음 연상 스토리:</strong> ${item.mnemonic}
        </div>

        <div style="border-top:1px solid var(--border); padding-top:14px;">
          <strong style="display:block; margin-bottom:10px;">확인 문제 (3지선다)</strong>
          <p style="margin-bottom:10px;">${mq.q}</p>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${mq.choices.map((ch, idx) => `
              <button type="button" class="secondary-btn mn-choice-btn" data-idx="${idx}" style="text-align:left;">
                ${idx + 1}. ${ch}
              </button>
            `).join('')}
          </div>
          <div id="mnQuizResult" style="margin-top:12px; font-weight:700;"></div>
        </div>
      </div>
    `;

    document.getElementById('mnPrevBtn')?.addEventListener('click', () => stepItem(-1));
    document.getElementById('mnNextBtn')?.addEventListener('click', () => stepItem(1));

    container.querySelectorAll('.mn-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const picked = Number(btn.dataset.idx);
        const res = document.getElementById('mnQuizResult');
        if (picked === mq.answer) {
          res.style.color = 'var(--st-mastered)';
          res.textContent = '🎉 정답입니다! 연상 이미지가 머릿속에 잘 남았네요.';
          DB.recordQuiz(true, item, '연상 퀴즈');
        } else {
          res.style.color = 'var(--danger)';
          res.textContent = `❌ 정답은 "${mq.choices[mq.answer]}" 입니다.`;
          DB.recordQuiz(false, item, '연상 퀴즈 오답');
        }
        renderSummaryBanner(currentCategory);
        if (onProgressChange) onProgressChange();
      });
    });
  }

  // 5.5 문자 및 문자 관련 단어·예문 탭 (あ~ん 이전/다음 + 행 위치 이동 목록 + 단어 2개+ & 예문 2개+)
  function renderWordsAndExamplesTab(container, items, onProgressChange) {
    const item = getItemById(activeCharId) || items[0];
    activeCharId = item.id;
    DB.touchItemAsSeen(item.id);

    const rows = window.ContentDB?.getRows
      ? window.ContentDB.getRows()
      : ['あ행', 'か행', 'さ행', 'た행', 'な행', 'は행', 'ま행', 'や행', 'ら행', 'わ행'];

    const words = item.words || [];
    const examples = item.examples || [];

    container.innerHTML = `
      <div class="card">
        <div class="row-jump-bar" aria-label="행 위치 이동">
          ${rows.map(r => `
            <button type="button" class="row-chip ${item.row === r ? 'active' : ''}" data-row="${r}">${r}</button>
          `).join('')}
        </div>

        <div class="card-title-row">
          <div>
            <h3 style="font-size:1.35rem;">
              <span class="jp-font" style="color:var(--accent);">${item.jp}</span> (${item.romaji}) · <span class="meaning-mask">${item.meaning}</span>
            </h3>
            <span class="hint-text">${item.row}</span>
          </div>
          <div class="btn-row">
            <button type="button" class="secondary-btn" id="exSpeakCharBtn">🔊 문자 듣기</button>
            <button type="button" class="secondary-btn" id="exPrevBtn">◀ 이전 문자</button>
            <button type="button" class="primary-btn" id="exNextBtn">다음 문자 ▶</button>
          </div>
        </div>

        <h4 style="margin:12px 0 8px;">📝 관련 단어 (${words.length}개)</h4>
        ${words.map(w => `
          <div class="word-sample-row">
            <div>
              <strong class="jp-font" style="font-size:1.08rem;">${w.emoji ? w.emoji + ' ' : ''}${w.jp}</strong>
              <span style="color:var(--text-secondary); font-size:0.84rem; margin-left:6px;">[${w.romaji}]</span>
              <span class="meaning-mask" style="margin-left:6px;">- ${w.meaning}</span>
            </div>
            <button type="button" class="secondary-btn tts-item-btn" data-tts="${w.jp}">🔊 듣기</button>
          </div>
        `).join('')}

        <h4 style="margin:16px 0 8px;">💬 관련 예문 (${examples.length}개)</h4>
        ${examples.map(ex => `
          <div class="word-sample-row" style="flex-direction:column; align-items:stretch;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <strong class="jp-font" style="font-size:1.05rem;">${ex.jp}</strong>
              <button type="button" class="secondary-btn tts-item-btn" data-tts="${ex.jp}">🔊 예문 듣기</button>
            </div>
            <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:2px;">${ex.romaji}</div>
            <div class="meaning-mask" style="font-size:0.9rem; margin-top:3px;">→ ${ex.meaning}</div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.row-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetRow = chip.dataset.row;
        const firstInRow = items.find(i => i.row === targetRow);
        if (firstInRow) {
          activeCharId = firstInRow.id;
          renderWordsAndExamplesTab(container, items, onProgressChange);
          if (onProgressChange) onProgressChange();
        }
      });
    });

    document.getElementById('exSpeakCharBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('exPrevBtn')?.addEventListener('click', () => stepItem(-1));
    document.getElementById('exNextBtn')?.addEventListener('click', () => stepItem(1));

    container.querySelectorAll('.tts-item-btn').forEach(btn => {
      btn.addEventListener('click', () => speakText(btn.dataset.tts));
    });
  }

  // 타 카테고리 목록 뷰
  function renderGeneralList(container, items, onProgressChange) {
    container.innerHTML = `
      <div class="card">
        <div class="vocab-grid">
          ${items.map(item => {
            const st = DB.getStatus(item.id);
            const fav = DB.isFavorite(item.id);
            return `
              <div class="char-card status-${st}" data-id="${item.id}" style="text-align:left; padding:14px;">
                <button type="button" class="tile-fav-btn ${fav ? 'active' : ''}" data-fav-id="${item.id}">${fav ? '★' : '☆'}</button>
                <div class="char-jp jp-font" style="font-size:1.45rem;">${item.emoji ? item.emoji + ' ' : ''}${item.jp}</div>
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
        DB.toggleFavorite(btn.dataset.favId);
        renderGeneralList(container, items, onProgressChange);
        if (onProgressChange) onProgressChange();
      });
    });

    container.querySelectorAll('.char-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        DB.touchItemAsSeen(id);
        activeCharId = id;
        openCharDetailModal(id, onProgressChange);
        if (onProgressChange) onProgressChange();
      });
    });
  }

  return {
    setCategory,
    setMode,
    render,
    speakText,
    stepItem,
    toggleCurrentFavorite,
    toggleFlashcardOrStrokeAction,
    getActiveSpeakingText
  };
})();
