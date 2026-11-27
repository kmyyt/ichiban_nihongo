// 히라가나 심화 학습 및 카테고리별 학습 모듈 (StudyModule — 3~6단계 통합 전체 코드)
const StudyModule = (() => {
  let currentCategory = 'hiragana';
  let currentMode = 'chart'; // 'chart' | 'flashcard' | 'stroke' | 'mnemonic' | 'examples'
  let activeCharId = 'h_a';
  let fcIndex = 0;
  let fcFlipped = false;
  let selectedRow = 'all';

  // SVG 획순 애니메이션 제어 상태 (5단계: RAF + 타이머 통합 관리)
  let strokeAnimTimer = null;
  let strokeAnimRafId = null;
  let strokeAnimSession = 0;
  let strokePaused = false;
  let strokeCurrentStep = 0;
  let mnemonicQuizSelection = {}; // { [itemId]: choiceIdx }

  const ROWS = ['あ행', 'か행', 'さ행', 'た행', 'な행', 'は행', 'ま행', 'や행', 'ら행', 'わ행'];

  // 행별 50음도 표준 5열 슬롯 (빈칸은 null)
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

  // 3단계: 50음도표 전용(아이콘만) vs 그 외 화면(이모지 + 상태명) 표기 헬퍼
  function getStatusDisplay(statusKey, { chartOnly = false } = {}) {
    const st = statusKey || DB.STATUS.UNLEARNED;
    const map = {
      [DB.STATUS.UNLEARNED]: { chartIcon: '❌️', icon: '❌', label: '미학습' },
      [DB.STATUS.LEARNING]:  { chartIcon: '❗️', icon: '❗️', label: '학습중' },
      [DB.STATUS.MASTERED]:  { chartIcon: '✅️', icon: '✅', label: '학습완료' },
      [DB.STATUS.HARD]:      { chartIcon: '🔥', icon: '🔥', label: '어려움' }
    };
    const info = map[st] || map[DB.STATUS.UNLEARNED];
    return chartOnly ? info.chartIcon : `${info.icon} ${info.label}`;
  }

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
    if (!id) return null;
    return getAllItems().find(item => item.id === id) || null;
  }

  // 5단계: 다중 서브패스(M ... M ...) 분리 및 유효 경로 정규화
  function splitSvgSubPaths(d) {
    const raw = String(d || '').trim();
    if (!raw) return [];
    const parts = raw
      .split(/(?=[Mm]\s*[-+0-9.])/)
      .map(s => s.trim())
      .filter(Boolean);
    return parts.length ? parts : [raw];
  }

  function normalizeStrokeList(item) {
    const rawStrokes = Array.isArray(item?.strokes) ? item.strokes : [];
    const normalized = [];

    rawStrokes.forEach((strokeObj, rawIdx) => {
      const dStr = typeof strokeObj === 'string' ? strokeObj : strokeObj?.d;
      const tipStr = typeof strokeObj === 'object' && strokeObj?.tip ? String(strokeObj.tip) : '';
      const subPaths = splitSvgSubPaths(dStr);

      subPaths.forEach((subD, subIdx) => {
        const strokeNum = normalized.length + 1;
        let cleanTip = tipStr.replace(/^\d+\s*획\s*:\s*/u, '').trim();
        if (!cleanTip) {
          cleanTip = '화살표 흐름을 따라 부드럽게 이어 그립니다.';
        } else if (subPaths.length > 1 && subIdx > 0) {
          cleanTip = `${cleanTip} (이어지는 ${subIdx + 1}번째 선)`;
        }
        normalized.push({
          d: subD,
          tip: `${strokeNum}획: ${cleanTip}`,
          rawIndex: rawIdx
        });
      });
    });

    if (!normalized.length) {
      normalized.push({
        d: 'M 25 25 L 75 75',
        tip: '1획: 가이드 문자를 따라 순서대로 써보세요.',
        rawIndex: 0
      });
    }
    return normalized;
  }

  function stopStrokeAnimation() {
    strokeAnimSession += 1;
    if (strokeAnimTimer) {
      clearTimeout(strokeAnimTimer);
      strokeAnimTimer = null;
    }
    if (strokeAnimRafId) {
      cancelAnimationFrame(strokeAnimRafId);
      strokeAnimRafId = null;
    }
    strokePaused = false;
    strokeCurrentStep = 0;
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

  function setCategory(category) {
    stopStrokeAnimation();
    currentCategory = category || 'hiragana';
    fcIndex = 0;
    fcFlipped = false;
    selectedRow = 'all';

    const list = currentCategory === 'hiragana'
      ? getHiraganaList()
      : getItemsByCategory(currentCategory);
    if (list.length) {
      activeCharId = list[0].id;
    }
    syncSubTabVisibility();
  }

  function setMode(mode, charId = null) {
    stopStrokeAnimation();
    currentMode = mode || 'chart';
    fcFlipped = false;

    const list = currentCategory === 'hiragana'
      ? getHiraganaList()
      : getItemsByCategory(currentCategory);

    if (charId && list.length) {
      activeCharId = charId;
      const idx = list.findIndex(item => item.id === charId);
      if (idx >= 0) fcIndex = idx;
    } else if (list.length && !list.some(i => i.id === activeCharId)) {
      activeCharId = list[0].id;
      fcIndex = 0;
    }

    syncSubTabVisibility();
  }

  function getActiveSpeakingText() {
    const list = currentCategory === 'hiragana'
      ? getHiraganaList()
      : getItemsByCategory(currentCategory);
    const item = getItemById(activeCharId) || list[fcIndex] || list[0];
    if (!item) return 'あ';
    if (currentMode === 'examples' && Array.isArray(item.words) && item.words[0]) {
      return item.words[0].jp;
    }
    return item.jp;
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
      if (strokePaused) resumeStrokeAnimation();
      else pauseStrokeAnimation();
    }
  }

  // 상단 요약 진도표 렌더링
  function renderSummaryBanner(category) {
    const banner = document.getElementById('studySummaryBanner');
    if (!banner) return;

    const targetItems = category === 'hiragana' ? getHiraganaList() : getItemsByCategory(category);
    const state = DB.load();

    let masteredCount = 0;
    let learningCount = 0;

    targetItems.forEach(item => {
      const st = state.statuses[item.id] || DB.STATUS.UNLEARNED;
      if (st === DB.STATUS.MASTERED) masteredCount += 1;
      else if (st === DB.STATUS.LEARNING) learningCount += 1;
    });

    const total = targetItems.length;
    const memorizedPercent = total === 0 ? 0 : Math.round((masteredCount / total) * 100);
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
      <div style="width:100%;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
          <div>
            <strong>${catTitleMap[category] || '학습 영역'} 진도표</strong>
            <span class="hint-text"> · 학습완료 ${masteredCount}/${total} (${memorizedPercent}%)</span>
          </div>
          <div class="summary-metrics">
            <span class="metric-pill">🎯 완료율 ${memorizedPercent}%</span>
            <span class="metric-pill">⭐ 즐겨찾기 ${favCount}</span>
            <span class="metric-pill">🔁 복습필요 ${reviewCount}</span>
            <span class="metric-pill">❗️ 학습중 ${learningCount}</span>
          </div>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${memorizedPercent}%"></div>
        </div>
      </div>
    `;
  }

  function render(category = currentCategory, onProgressChange = null) {
    currentCategory = category || 'hiragana';
    syncSubTabVisibility();
    stopStrokeAnimation();

    const container = document.getElementById('studyContainer');
    if (!container) return;

    renderSummaryBanner(currentCategory);

    const items = currentCategory === 'hiragana'
      ? getHiraganaList()
      : getItemsByCategory(currentCategory);

    if (!items.length) {
      container.innerHTML = `
        <div class="card">
          <h3>아직 준비 중인 학습 영역입니다</h3>
          <p class="hint-text" style="margin-top:6px;">
            현재 히라가나 46자 학습 기능이 우선 탑재되어 있습니다. 상단 또는 사이드바에서 <strong>히라가나</strong>를 선택해 학습을 시작해 보세요!
          </p>
        </div>
      `;
      return;
    }

    if (currentCategory === 'hiragana') {
      if (currentMode === 'chart') renderHiraganaChart(container, onProgressChange);
      else if (currentMode === 'flashcard') renderFlashcard(container, items, onProgressChange);
      else if (currentMode === 'stroke') renderStrokeAndTrace(container, items, onProgressChange);
      else if (currentMode === 'mnemonic') renderMnemonicTab(container, items, onProgressChange);
      else if (currentMode === 'examples') renderWordsAndExamplesTab(container, items, onProgressChange);
    } else {
      if (currentMode === 'chart') renderGeneralList(container, items, onProgressChange);
      else if (currentMode === 'flashcard') renderFlashcard(container, items, onProgressChange);
      else if (currentMode === 'stroke') renderStrokeAndTrace(container, items, onProgressChange);
    }
  }

  // 1. 히라가나 50음도 2차원 그리드 (3단계: 50음도표 전용 아이콘만 표시)
  function renderHiraganaChart(container, onProgressChange) {
    const hiraList = getHiraganaList();
    const mapById = new Map(hiraList.map(item => [item.id, item]));

    const tilesHtml = HIRAGANA_ROWS_SLOTS.map(rowObj => {
      return rowObj.slots.map(slotId => {
        if (!slotId || !mapById.has(slotId)) {
          return `<div class="char-tile empty-slot" aria-hidden="true"></div>`;
        }
        const item = mapById.get(slotId);
        const st = DB.getStatus(item.id);
        const fav = DB.isFavorite(item.id);
        return `
          <div class="char-tile st-${st}" data-id="${item.id}">
            <button type="button" class="tile-fav-btn ${fav ? 'active' : ''}" data-fav-id="${item.id}" title="즐겨찾기" aria-label="${item.jp} 즐겨찾기">
              ${fav ? '★' : '☆'}
            </button>
            <div class="tile-jp jp-font">${item.jp}</div>
            <div class="tile-romaji">${item.romaji} · <span class="meaning-mask">${item.meaning}</span></div>
            <span class="chart-status-icon" aria-label="${getStatusDisplay(st, { chartOnly: false })}">${getStatusDisplay(st, { chartOnly: true })}</span>
          </div>
        `;
      }).join('');
    }).join('');

    container.innerHTML = `
      <div class="card gojuon-card">
        <div class="card-title-row">
          <h3>히라가나 50음도 표</h3>
          <span class="hint-text">❌️ 미학습 · ❗️ 학습중 · ✅️ 학습완료 · 🔥 어려움</span>
        </div>

        <div class="gojuon-grid">${tilesHtml}</div>
      </div>
    `;

    container.querySelectorAll('.tile-fav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        DB.toggleFavorite(btn.dataset.favId);
        renderHiraganaChart(container, onProgressChange);
        renderSummaryBanner(currentCategory);
        if (onProgressChange) onProgressChange();
      });
    });

    container.querySelectorAll('.char-tile:not(.empty-slot)').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = tile.dataset.id;
        DB.touchItemAsSeen(id);
        activeCharId = id;
        openCharDetailModal(id, onProgressChange);
        renderSummaryBanner(currentCategory);

        const st = DB.getStatus(id);
        tile.className = `char-tile st-${st}`;
        const iconEl = tile.querySelector('.chart-status-icon');
        if (iconEl) {
          iconEl.textContent = getStatusDisplay(st, { chartOnly: true });
          iconEl.setAttribute('aria-label', getStatusDisplay(st, { chartOnly: false }));
        }
        if (onProgressChange) onProgressChange();
      });
    });
  }

  // 문자 상세 팝업
  function openCharDetailModal(id, onProgressChange) {
    const item = getItemById(id);
    const modal = document.getElementById('charDetailModal');
    const body = document.getElementById('charModalBody');
    if (!item || !modal || !body) return;

    const currentStatus = DB.getStatus(item.id);
    const isFav = DB.isFavorite(item.id);
    const normalizedStrokes = normalizeStrokeList(item);
    const sampleWords = (item.words || []).slice(0, 3);

    body.innerHTML = `
      <div style="display:flex; align-items:center; gap:14px; margin-bottom:14px; flex-wrap:wrap;">
        <div class="jp-font" style="font-size:3.6rem; font-weight:900; line-height:1; color:var(--accent);">${item.jp}</div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <h3 id="modalCharTitle" style="font-size:1.25rem;">
              <span class="jp-font">${item.jp}</span> (${item.romaji}) · <span class="meaning-mask">${item.meaning}</span>
            </h3>
            <button type="button" class="btn" id="modalSpeakBtn">🔊 발음 듣기</button>
            <button type="button" class="btn" id="modalFavBtn">${isFav ? '★ 즐겨찾기됨' : '☆ 즐겨찾기'}</button>
          </div>
          <p class="hint-text" style="margin-top:4px;">
            ${item.row || ''} · 획순: <strong>${normalizedStrokes.length}획</strong> · <span class="status-badge status-${currentStatus}">${getStatusDisplay(currentStatus, { chartOnly: false })}</span>
          </p>
        </div>
      </div>

      <div style="margin-bottom:10px;">
        <strong>🗣️ 발음 방법</strong>
        <p style="font-size:0.88rem; color:var(--text-secondary); margin-top:3px;">${item.pronTip || '자연스럽고 명확하게 발음하세요.'}</p>
      </div>

      <div style="margin-bottom:12px;">
        <strong>💡 연상 기법</strong>
        <p style="font-size:0.88rem; color:var(--text-secondary); margin-top:3px;">${item.mnemonic || ''}</p>
      </div>

      <div style="margin-bottom:14px;">
        <strong style="font-size:0.85rem; display:block; margin-bottom:6px;">학습 상태 설정</strong>
        <div class="btn-row" style="justify-content:flex-start;">
          ${Object.keys(DB.STATUS_LABEL).map(stKey => `
            <button type="button" class="btn status-opt-btn ${currentStatus === stKey ? 'primary' : ''}" data-st="${stKey}">
              ${getStatusDisplay(stKey, { chartOnly: false })}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="btn-row" style="justify-content:flex-start; margin-bottom:14px;">
        <button type="button" class="btn primary" id="jumpToStrokeBtn">✍️ 획순 및 따라 쓰기 탭</button>
        <button type="button" class="btn" id="jumpToMnemonicBtn">🎨 그림/모양 연상 탭</button>
      </div>

      <div style="border-top:1px solid var(--border); padding-top:12px;">
        <p style="font-size:0.86rem; margin-bottom:10px;">
          <strong>📌 암기 팁:</strong> ${item.mnemonic || ''}
        </p>
        <strong style="font-size:0.88rem; display:block; margin-bottom:8px;">예시 단어</strong>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${sampleWords.map(w => `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 12px; border-radius:10px; background:var(--bg-elevated);">
              <div style="min-width:0;">
                <strong class="jp-font" style="font-size:1.05rem;">${w.emoji ? w.emoji + ' ' : ''}${w.jp}</strong>
                <span class="hint-text" style="margin-left:6px;">${w.romaji}</span>
                <span class="meaning-mask" style="margin-left:6px; font-weight:600;">/ ${w.meaning}</span>
              </div>
              <button type="button" class="btn sample-tts-btn" data-tts="${w.jp}" style="padding:5px 10px;">🔊 듣기</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('modalSpeakBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('modalFavBtn')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id);
      openCharDetailModal(item.id, onProgressChange);
      if (currentMode === 'chart') renderHiraganaChart(document.getElementById('studyContainer'), onProgressChange);
      renderSummaryBanner(currentCategory);
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

  // 2. 문자별 플래시카드
  function renderFlashcard(container, items, onProgressChange) {
    if (!items.length) return;
    if (fcIndex >= items.length) fcIndex = 0;
    const item = items[fcIndex];
    if (!item) return;

    activeCharId = item.id;
    DB.touchItemAsSeen(item.id);

    const st = DB.getStatus(item.id);
    const sampleWords = (item.words || []).slice(0, 3);

    container.innerHTML = `
      <div class="flashcard-wrap">
        <p class="hint-text" style="text-align:center;">
          카드 ${fcIndex + 1} / ${items.length} · <span class="status-badge status-${st}">${getStatusDisplay(st, { chartOnly: false })}</span>
        </p>

        <div class="flashcard-box" id="fcCard">
          ${!fcFlipped ? `
            <div class="fc-front-char jp-font">${item.jp}</div>
            <span class="hint-text" style="margin-top:12px;">터치 또는 Space 키로 뒤집기</span>
          ` : `
            <div class="jp-font" style="font-size:2.4rem; font-weight:900; color:var(--accent);">${item.jp}</div>
            <div style="font-size:1.1rem; font-weight:700; margin:6px 0;">
              ${item.romaji} · <span class="meaning-mask">${item.meaning}</span>
            </div>
            <button type="button" class="btn" id="fcSpeakBtn" style="margin-bottom:10px;">🔊 발음 듣기</button>
            <p class="hint-text" style="margin-bottom:8px;">${item.pronTip || ''}</p>
            <div style="font-size:0.9rem; margin-bottom:10px;">💡 ${item.mnemonic || ''}</div>
            <div style="width:100%; text-align:left; font-size:0.84rem;">
              ${sampleWords.map(w => `
                <div style="padding:3px 0;">
                  ${w.emoji ? w.emoji + ' ' : ''}<strong class="jp-font">${w.jp}</strong> (${w.romaji}) - <span class="meaning-mask">${w.meaning}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="btn-row">
          <button type="button" class="btn" id="fcHardBtn">${getStatusDisplay(DB.STATUS.HARD, { chartOnly: false })}</button>
          <button type="button" class="btn" id="fcLearningBtn">${getStatusDisplay(DB.STATUS.LEARNING, { chartOnly: false })}</button>
          <button type="button" class="btn primary" id="fcMasteredBtn">${getStatusDisplay(DB.STATUS.MASTERED, { chartOnly: false })}</button>
        </div>

        <div class="btn-row">
          <button type="button" class="btn" id="fcPrevBtn">◀ 이전</button>
          <button type="button" class="btn" id="fcNextBtn">다음 ▶</button>
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

    const markAndNext = nextStatus => {
      DB.setStatus(item.id, nextStatus);
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

  // 4단계: 스와이프/스크롤 가능한 히라가나 목록 탭 바 바인딩
  function attachSwipeableKanaTabs(tabBarEl, items, onSelectItem) {
    if (!tabBarEl) return;

    const activeTab = tabBarEl.querySelector('.kana-swipe-tab.active');
    if (activeTab && typeof activeTab.scrollIntoView === 'function') {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    tabBarEl.querySelectorAll('.kana-swipe-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (tabBarEl.dataset.wasDragging === 'true') {
          tabBarEl.dataset.wasDragging = 'false';
          return;
        }
        const targetId = tab.dataset.charId;
        if (!targetId || targetId === activeCharId) return;
        onSelectItem(targetId);
      });
    });

    let isPointerDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let movedDistance = 0;

    tabBarEl.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      isPointerDown = true;
      movedDistance = 0;
      startX = e.pageX - tabBarEl.offsetLeft;
      startScrollLeft = tabBarEl.scrollLeft;
      tabBarEl.classList.add('dragging');
    });

    window.addEventListener('mousemove', e => {
      if (!isPointerDown) return;
      const x = e.pageX - tabBarEl.offsetLeft;
      const walk = (x - startX) * 1.15;
      movedDistance = Math.max(movedDistance, Math.abs(walk));
      if (movedDistance > 5) {
        tabBarEl.dataset.wasDragging = 'true';
      }
      tabBarEl.scrollLeft = startScrollLeft - walk;
    });

    window.addEventListener('mouseup', () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      tabBarEl.classList.remove('dragging');
      setTimeout(() => {
        tabBarEl.dataset.wasDragging = 'false';
      }, 0);
    });

    let touchStartX = 0;
    let touchStartY = 0;

    tabBarEl.addEventListener('touchstart', e => {
      const t = e.touches?.[0];
      if (!t) return;
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });

    tabBarEl.addEventListener('touchend', e => {
      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) {
        const atLeftEdge = tabBarEl.scrollLeft <= 2 && dx > 70;
        const atRightEdge = tabBarEl.scrollLeft + tabBarEl.clientWidth >= tabBarEl.scrollWidth - 2 && dx < -70;
        if (atLeftEdge || atRightEdge) {
          const curIdx = Math.max(0, items.findIndex(i => i.id === activeCharId));
          const delta = dx > 0 ? -1 : 1;
          const nextItem = items[(curIdx + delta + items.length) % items.length];
          if (nextItem) onSelectItem(nextItem.id);
        }
      }
    }, { passive: true });
  }

  // 3. 획순 & 따라쓰기 (4단계 스와이프 탭 + 5단계 정밀 SVG 획순 애니메이션 & 시작점 번호 마커)
  function renderStrokeAndTrace(container, items, onProgressChange) {
    if (!items.length) return;
    const item = getItemById(activeCharId) || items[0];
    if (!item) return;

    activeCharId = item.id;
    fcIndex = Math.max(0, items.findIndex(i => i.id === item.id));
    DB.touchItemAsSeen(item.id);

    const strokes = normalizeStrokeList(item);
    const isFav = DB.isFavorite(item.id);
    const st = DB.getStatus(item.id);
    const hiraTabsSource = currentCategory === 'hiragana' ? getHiraganaList() : items;

    container.innerHTML = `
      <div class="card">
        <div class="stroke-kana-tabs-wrap">
          <div class="stroke-kana-tabs-header">
            <span class="hint-text">↔ 좌우 스와이프/스크롤로 문자 선택 (${hiraTabsSource.length}자)</span>
            <span class="status-badge status-${st}">${getStatusDisplay(st, { chartOnly: false })}</span>
          </div>
          <div class="kana-swipe-tabs" id="strokeKanaTabs" role="tablist" aria-label="히라가나 문자 목록 탭">
            ${hiraTabsSource.map(ch => {
              const isActive = ch.id === item.id;
              const chStatus = DB.getStatus(ch.id);
              return `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${isActive}"
                  class="kana-swipe-tab ${isActive ? 'active' : ''}"
                  data-char-id="${ch.id}"
                >
                  <span class="kana-tab-jp jp-font">${ch.jp}</span>
                  <span class="kana-tab-romaji">${ch.romaji}</span>
                  <span class="kana-tab-dot" aria-hidden="true">${getStatusDisplay(chStatus, { chartOnly: true })}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card-title-row">
          <div>
            <h3>획순 & 따라쓰기: <span class="jp-font" style="color:var(--accent); font-size:1.5rem;">${item.jp}</span> (${item.romaji} · <span class="meaning-mask">${item.meaning}</span>)</h3>
            <p class="hint-text" style="margin-top:4px;">${item.pronTip || ''} ${item.mnemonic || ''}</p>
          </div>
          <div class="btn-row">
            <button type="button" class="btn" id="strokeSpeakBtn">🔊 TTS 듣기</button>
            <button type="button" class="btn" id="strokeFavBtn">${isFav ? '★ 즐겨찾기' : '☆ 즐겨찾기'}</button>
            <button type="button" class="btn" id="strokePrevBtn">◀ 이전 문자</button>
            <button type="button" class="btn primary" id="strokeNextBtn">다음 문자 ▶</button>
          </div>
        </div>

        <div class="stroke-stage-grid">
          <div class="stroke-box">
            <strong style="font-size:0.88rem;">정밀 SVG 획순 애니메이션 (${strokes.length}획)</strong>
            <svg id="strokeSvg" class="stroke-svg" viewBox="0 0 100 100" aria-label="${item.jp} 획순 가이드">
              <line x1="50" y1="6" x2="50" y2="94" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3 3" />
              <line x1="6" y1="50" x2="94" y2="50" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="3 3" />
              ${strokes.map(s => `<path class="stroke-path-bg" d="${s.d}"></path>`).join('')}
              ${strokes.map((s, i) => `<path class="stroke-path-anim" id="animStroke_${i}" d="${s.d}"></path>`).join('')}
              <g id="strokeStartMarkers"></g>
            </svg>
            <div class="btn-row">
              <button type="button" class="btn primary" id="playStrokeBtn">재생</button>
              <button type="button" class="btn" id="pauseStrokeBtn">일시정지</button>
              <button type="button" class="btn" id="restartStrokeBtn">처음부터 다시보기</button>
            </div>
          </div>

          <div class="stroke-box">
            <strong style="font-size:0.88rem;">손글씨 따라쓰기 캔버스</strong>
            <canvas id="traceCanvas" class="draw-canvas" width="220" height="220"></canvas>
            <div class="btn-row">
              <button type="button" class="btn" id="clearTraceBtn">내가 쓴 획 지우기</button>
            </div>
          </div>
        </div>

        <div style="margin-top:16px;">
          <strong style="font-size:0.9rem;">각 획당 쓰는 방법</strong>
          <div class="stroke-step-cards">
            ${strokes.map((s, idx) => `
              <div class="stroke-step-card">
                <svg viewBox="0 0 100 100" width="56" height="56" style="display:block; margin:0 auto 6px;">
                  ${strokes.map((prevS, pIdx) => `
                    <path d="${prevS.d}" fill="none" stroke="${pIdx === idx ? 'var(--accent)' : 'var(--border)'}" stroke-width="${pIdx === idx ? '9' : '6'}" stroke-linecap="round" stroke-linejoin="round"></path>
                  `).join('')}
                </svg>
                <div>${s.tip}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    attachSwipeableKanaTabs(document.getElementById('strokeKanaTabs'), hiraTabsSource, targetCharId => {
      stopStrokeAnimation();
      activeCharId = targetCharId;
      fcIndex = Math.max(0, items.findIndex(i => i.id === targetCharId));
      DB.touchItemAsSeen(targetCharId);
      renderStrokeAndTrace(container, items, onProgressChange);
      renderSummaryBanner(currentCategory);
      if (onProgressChange) onProgressChange();
    });

    document.getElementById('strokeSpeakBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('strokeFavBtn')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id);
      renderStrokeAndTrace(container, items, onProgressChange);
      renderSummaryBanner(currentCategory);
      if (onProgressChange) onProgressChange();
    });
    document.getElementById('strokePrevBtn')?.addEventListener('click', () => stepItem(-1));
    document.getElementById('strokeNextBtn')?.addEventListener('click', () => stepItem(1));

    renderStrokeStartMarkers(strokes.length);
    setupStrokeAnimation(strokes.length);

    document.getElementById('playStrokeBtn')?.addEventListener('click', () => {
      if (strokePaused) {
        resumeStrokeAnimation();
      } else {
        stopStrokeAnimation();
        playStrokeAnimation(strokes.length, 0);
      }
    });
    document.getElementById('pauseStrokeBtn')?.addEventListener('click', pauseStrokeAnimation);
    document.getElementById('restartStrokeBtn')?.addEventListener('click', () => {
      stopStrokeAnimation();
      playStrokeAnimation(strokes.length, 0);
    });

    const canvas = document.getElementById('traceCanvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b6ef6';

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

    playStrokeAnimation(strokes.length, 0);
  }

  function renderStrokeStartMarkers(count) {
    const markerLayer = document.getElementById('strokeStartMarkers');
    if (!markerLayer) return;
    let html = '';

    for (let i = 0; i < count; i += 1) {
      const pathEl = document.getElementById(`animStroke_${i}`);
      if (!pathEl || typeof pathEl.getPointAtLength !== 'function') continue;
      try {
        const pt = pathEl.getPointAtLength(0);
        const cx = Math.min(92, Math.max(8, pt.x));
        const cy = Math.min(92, Math.max(8, pt.y));
        html += `
          <g class="stroke-marker" data-marker-idx="${i}">
            <circle cx="${cx}" cy="${cy}" r="5.5" fill="var(--accent)" stroke="#ffffff" stroke-width="1.2"></circle>
            <text x="${cx}" y="${cy + 2.3}" text-anchor="middle" font-size="6.5" font-weight="800" fill="#ffffff">${i + 1}</text>
          </g>
        `;
      } catch (e) {
        // 유효하지 않은 경로 방어
      }
    }
    markerLayer.innerHTML = html;
  }

  function getSafePathLength(pathEl) {
    if (!pathEl || typeof pathEl.getTotalLength !== 'function') return 160;
    try {
      const len = pathEl.getTotalLength();
      return Number.isFinite(len) && len > 0 ? Math.ceil(len) + 2 : 160;
    } catch (e) {
      return 160;
    }
  }

  function setupStrokeAnimation(count) {
    for (let i = 0; i < count; i += 1) {
      const el = document.getElementById(`animStroke_${i}`);
      if (!el) continue;
      const len = getSafePathLength(el);
      el.dataset.pathLen = String(len);
      el.style.transition = 'none';
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.opacity = '0';
      el.getBoundingClientRect();
    }
  }

  function pauseStrokeAnimation() {
    strokeAnimSession += 1;
    if (strokeAnimTimer) {
      clearTimeout(strokeAnimTimer);
      strokeAnimTimer = null;
    }
    if (strokeAnimRafId) {
      cancelAnimationFrame(strokeAnimRafId);
      strokeAnimRafId = null;
    }
    strokePaused = true;
  }

  function resumeStrokeAnimation() {
    const item = getItemById(activeCharId);
    const total = normalizeStrokeList(item).length;
    strokePaused = false;
    playStrokeAnimation(total, strokeCurrentStep);
  }

  function playStrokeAnimation(total, startIdx) {
    if (startIdx === 0) {
      setupStrokeAnimation(total);
    }
    strokePaused = false;
    const sessionToken = ++strokeAnimSession;

    const runStep = idx => {
      if (sessionToken !== strokeAnimSession || strokePaused) return;
      strokeCurrentStep = idx;
      if (idx >= total) {
        strokeAnimTimer = null;
        return;
      }

      const el = document.getElementById(`animStroke_${idx}`);
      if (!el) {
        strokeAnimTimer = setTimeout(() => runStep(idx + 1), 100);
        return;
      }

      const len = Number(el.dataset.pathLen) || getSafePathLength(el);
      const durationMs = Math.min(900, Math.max(420, Math.round(len * 4.5)));

      el.style.transition = 'none';
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.opacity = '1';
      el.getBoundingClientRect();

      strokeAnimRafId = requestAnimationFrame(() => {
        if (sessionToken !== strokeAnimSession || strokePaused) return;
        el.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
        el.style.strokeDashoffset = '0';

        strokeAnimTimer = setTimeout(() => {
          if (sessionToken !== strokeAnimSession || strokePaused) return;
          runStep(idx + 1);
        }, durationMs + 140);
      });
    };

    strokeAnimRafId = requestAnimationFrame(() => runStep(startIdx));
  }

  // 4. 연상 암기법 + 3지선다 확인 문제 + 히라가나 심화 규칙 정리 (6단계)
  function renderMnemonicTab(container, items, onProgressChange) {
    if (!items.length) return;
    const item = getItemById(activeCharId) || items[0];
    if (!item) return;

    activeCharId = item.id;
    DB.touchItemAsSeen(item.id);

    const mq = item.mnemonicQuiz || {
      q: `「${item.jp}」의 발음으로 알맞은 것은?`,
      choices: [`${item.romaji} (${item.meaning})`, 'ka (카)', 'so (소)'],
      answer: 0
    };
    const picked = mnemonicQuizSelection[item.id];
    const rules = (window.ContentDB && typeof window.ContentDB.getAdvancedRules === 'function')
      ? window.ContentDB.getAdvancedRules()
      : (window.HIRAGANA_ADVANCED_RULES || []);

    container.innerHTML = `
      <div class="card" style="max-width:720px; margin:0 auto;">
        <div class="card-title-row">
          <h3>💡 연상 암기법: <span class="jp-font" style="color:var(--accent); font-size:1.5rem;">${item.jp}</span> (${item.romaji})</h3>
          <div class="btn-row">
            <button type="button" class="btn" id="mnPrevBtn">◀ 이전</button>
            <button type="button" class="btn" id="mnNextBtn">다음 ▶</button>
          </div>
        </div>

        <p style="margin-bottom:8px;"><strong>🗣️ 발음 가이드:</strong> ${item.pronTip || ''}</p>
        <div style="padding:12px 14px; border-radius:12px; background:var(--accent-soft); margin-bottom:16px;">
          <strong>🎨 모양·발음 연상 스토리:</strong> ${item.mnemonic || ''}
        </div>

        <div style="border-top:1px solid var(--border); padding-top:14px; margin-bottom:18px;">
          <strong style="display:block; margin-bottom:8px;">이해도 확인 (3지선다)</strong>
          <p style="margin-bottom:10px;">${mq.q}</p>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${mq.choices.map((ch, idx) => `
              <button type="button" class="btn mn-choice-btn" data-idx="${idx}" style="text-align:left; ${picked === idx ? 'border-color:var(--accent); background:var(--accent-soft);' : ''}">
                ${idx + 1}. ${ch}
              </button>
            `).join('')}
          </div>
          <div id="mnQuizResult" style="margin-top:10px; font-weight:700;">
            ${typeof picked === 'number'
              ? (picked === mq.answer
                ? '<span style="color:var(--st-mastered-fg);">🎉 정답입니다!</span>'
                : `<span style="color:#dc2626;">❌ 정답은 "${mq.choices[mq.answer]}" 입니다.</span>`)
              : ''}
          </div>
        </div>

        <div style="border-top:1px solid var(--border); padding-top:16px;">
          <div class="card-title-row" style="margin-bottom:8px;">
            <h3>📚 히라가나 심화 규칙 정리</h3>
            <span class="hint-text">탁음 · 반탁음 · 요음 · 특수발음 · 장음</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${rules.map(rule => `
              <div style="padding:12px 14px; border-radius:12px; background:var(--bg-elevated); border:1px solid var(--border);">
                <div style="font-size:0.74rem; font-weight:700; color:var(--accent); margin-bottom:2px;">${rule.badge}</div>
                <strong style="display:block; margin-bottom:4px;">${rule.title}</strong>
                <p class="hint-text" style="margin-bottom:8px;">${rule.summary}</p>
                <div style="display:flex; flex-direction:column; gap:4px; font-size:0.82rem;">
                  ${(rule.items || []).map(row => `
                    <div><strong>• ${row.pair}:</strong> <span class="jp-font">${row.example}</span></div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('mnPrevBtn')?.addEventListener('click', () => stepItem(-1));
    document.getElementById('mnNextBtn')?.addEventListener('click', () => stepItem(1));

    container.querySelectorAll('.mn-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cIdx = Number(btn.dataset.idx);
        mnemonicQuizSelection[item.id] = cIdx;
        if (cIdx === mq.answer) {
          DB.recordQuiz(true, item, '연상 퀴즈');
        } else {
          DB.recordQuiz(false, item, '연상 퀴즈 오답');
        }
        renderMnemonicTab(container, items, onProgressChange);
        renderSummaryBanner(currentCategory);
        if (onProgressChange) onProgressChange();
      });
    });
  }

  // 5. 문자별 단어·예문 + 행 이동
  function renderWordsAndExamplesTab(container, items, onProgressChange) {
    if (!items.length) return;
    const item = getItemById(activeCharId) || items[0];
    if (!item) return;

    activeCharId = item.id;
    selectedRow = item.row || selectedRow;
    DB.touchItemAsSeen(item.id);

    const rows = window.ContentDB?.getRows ? window.ContentDB.getRows() : ROWS;
    const words = item.words || [];
    const examples = item.examples || [];

    container.innerHTML = `
      <div class="card">
        <div class="btn-row" style="justify-content:flex-start; margin-bottom:14px;">
          ${rows.map(r => `
            <button type="button" class="btn row-chip ${item.row === r ? 'primary' : ''}" data-row="${r}">${r}</button>
          `).join('')}
        </div>

        <div class="card-title-row">
          <div>
            <h3 style="font-size:1.35rem;">
              <span class="jp-font" style="color:var(--accent);">${item.jp}</span> (${item.romaji}) · <span class="meaning-mask">${item.meaning}</span>
            </h3>
            <span class="hint-text">${item.row || ''}</span>
          </div>
          <div class="btn-row">
            <button type="button" class="btn" id="exSpeakCharBtn">🔊 문자 듣기</button>
            <button type="button" class="btn" id="exPrevBtn">◀ 이전 문자</button>
            <button type="button" class="btn primary" id="exNextBtn">다음 문자 ▶</button>
          </div>
        </div>

        <h4 style="margin:12px 0 8px;">📝 관련 단어 (${words.length}개)</h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${words.map(w => `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 12px; border-radius:10px; background:var(--bg-elevated);">
              <div>
                <strong class="jp-font" style="font-size:1.08rem;">${w.emoji ? w.emoji + ' ' : ''}${w.jp}</strong>
                <span class="hint-text" style="margin-left:6px;">[${w.romaji}]</span>
                <span class="meaning-mask" style="margin-left:6px;">- ${w.meaning}</span>
              </div>
              <button type="button" class="btn tts-item-btn" data-tts="${w.jp}">🔊 듣기</button>
            </div>
          `).join('')}
        </div>

        <h4 style="margin:16px 0 8px;">💬 관련 예문 (${examples.length}개)</h4>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${examples.map(ex => `
            <div style="padding:12px 14px; border-left:4px solid var(--accent); background:var(--bg-elevated); border-radius:10px;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <strong class="jp-font" style="font-size:1.05rem;">${ex.jp}</strong>
                <button type="button" class="btn tts-item-btn" data-tts="${ex.jp}">🔊 예문 듣기</button>
              </div>
              <div class="hint-text" style="margin-top:2px;">${ex.romaji}</div>
              <div class="meaning-mask" style="font-size:0.9rem; margin-top:3px;">→ ${ex.meaning}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.row-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetRow = chip.dataset.row;
        const firstInRow = items.find(i => i.row === targetRow);
        if (firstInRow) {
          activeCharId = firstInRow.id;
          renderWordsAndExamplesTab(container, items, onProgressChange);
          renderSummaryBanner(currentCategory);
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

  // 타 카테고리 목록 뷰 (50음도 외 화면: ❌ / ❗️ / ✅ / 🔥 + 상태명)
  function renderGeneralList(container, items, onProgressChange) {
    container.innerHTML = `
      <div class="card">
        <div class="gojuon-grid">
          ${items.map(item => {
            const st = DB.getStatus(item.id);
            const fav = DB.isFavorite(item.id);
            return `
              <div class="char-tile st-${st}" data-id="${item.id}">
                <button type="button" class="tile-fav-btn ${fav ? 'active' : ''}" data-fav-id="${item.id}">${fav ? '★' : '☆'}</button>
                <div class="tile-jp jp-font" style="font-size:1.35rem;">${item.emoji ? item.emoji + ' ' : ''}${item.jp}</div>
                <div class="tile-romaji">${item.romaji} · <span class="meaning-mask"><strong>${item.meaning}</strong></span></div>
                <span class="status-badge status-${st}">${getStatusDisplay(st, { chartOnly: false })}</span>
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
        renderSummaryBanner(currentCategory);
        if (onProgressChange) onProgressChange();
      });
    });

    container.querySelectorAll('.char-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = tile.dataset.id;
        DB.touchItemAsSeen(id);
        activeCharId = id;
        openCharDetailModal(id, onProgressChange);
        renderSummaryBanner(currentCategory);
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
