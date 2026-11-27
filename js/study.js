// 히라가나 기본·심화 학습, 정밀 SVG 획순 애니메이션, 카테고리별 학습 모듈 (StudyModule)
const StudyModule = (() => {
  let currentCategory = 'hiragana';
  let currentMode = 'chart'; // 'chart' | 'advanced_chart' | 'flashcard' | 'stroke' | 'mnemonic' | 'examples'
  let activeCharId = 'h_a';
  let fcIndex = 0;
  let fcFlipped = false;
  let selectedRow = 'all';
  let advSubFilter = 'all'; // 'all' | 'dakuon' | 'handakuon' | 'yoon'
  let customPool = null;

  let strokeAnimTimer = null;
  let strokeAnimRafId = null;
  let strokeAnimSession = 0;
  let strokePaused = false;
  let strokeCurrentStep = 0;
  let mnemonicQuizSelection = {};

  const ROWS = ['あ행', 'か행', 'さ행', 'た행', 'な행', 'は행', 'ま행', 'や행', 'ら행', 'わ행'];

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

  // 첨부된 '획순 참고 파일.html' 기준 히라가나 기본 46자 표준 SVG 획순 데이터
  const BASE_STROKE_MAP = {
    'あ': ['M 24 32 Q 50 30 76 28', 'M 48 14 Q 45 50 47 84', 'M 64 42 C 54 68 30 82 24 68 C 18 54 44 38 66 48 C 82 55 80 78 60 86'],
    'い': ['M 30 24 C 28 50 30 72 36 80 L 44 68', 'M 68 28 C 74 44 76 62 72 76'],
    'う': ['M 38 16 Q 52 20 62 24', 'M 28 42 C 56 32 76 46 68 68 C 62 82 44 88 30 88'],
    'え': ['M 40 16 Q 52 20 62 24', 'M 26 42 L 68 38 L 30 78 C 44 62 56 62 58 76 C 60 84 68 86 82 84'],
    'お': ['M 24 34 Q 44 32 62 30', 'M 44 16 L 44 78 C 44 86 24 80 24 68 C 24 54 52 46 68 56 C 80 64 76 84 58 88', 'M 74 24 Q 82 30 86 38'],
    'か': ['M 20 40 L 56 36 C 58 58 54 78 44 84 L 34 74', 'M 40 16 C 36 46 28 70 18 86', 'M 72 32 C 80 44 86 58 88 70'],
    'き': ['M 26 28 Q 50 26 72 22', 'M 24 44 Q 52 42 76 38', 'M 46 14 L 58 58', 'M 30 68 C 36 84 56 88 74 84'],
    'く': ['M 64 16 L 30 50 L 66 86'],
    'け': ['M 26 20 C 22 46 22 68 28 84 L 34 72', 'M 46 40 Q 64 38 82 36', 'M 66 16 C 68 48 64 72 46 88'],
    'こ': ['M 28 28 Q 52 26 72 28 L 62 38', 'M 26 68 C 36 80 56 80 76 76'],
    'さ': ['M 24 34 Q 52 32 76 28', 'M 46 14 L 58 56', 'M 28 66 C 36 82 56 86 74 82'],
    'し': ['M 38 16 L 38 66 C 38 84 62 86 78 68'],
    'す': ['M 20 32 Q 52 30 80 28', 'M 56 14 L 56 62 C 56 76 36 74 36 58 C 36 44 58 44 58 64 C 58 76 52 86 42 92'],
    'せ': ['M 18 42 Q 52 40 84 36', 'M 66 18 L 66 56 L 56 50', 'M 34 22 L 34 72 C 34 84 48 84 76 82'],
    'そ': ['M 30 20 L 68 18 L 24 52 L 76 48 C 46 58 38 84 72 86'],
    'た': ['M 20 32 Q 40 30 58 28', 'M 40 14 C 36 44 26 70 18 86', 'M 54 50 Q 70 48 84 48', 'M 52 74 C 62 82 74 84 86 80'],
    'ち': ['M 24 30 Q 50 28 74 26', 'M 46 14 L 36 54 C 54 44 78 52 74 72 C 70 86 52 88 34 86'],
    'つ': ['M 20 42 C 48 28 82 36 78 62 C 74 80 54 86 38 86'],
    'て': ['M 20 26 L 78 22 C 46 38 38 78 72 86'],
    'と': ['M 38 16 L 46 50', 'M 76 34 C 32 46 24 84 74 84'],
    'な': ['M 18 30 Q 38 28 54 26', 'M 38 14 C 34 40 26 62 18 78', 'M 68 24 Q 78 32 84 40', 'M 62 44 L 62 76 C 62 86 42 84 42 72 C 42 60 64 62 82 78'],
    'に': ['M 26 20 C 22 46 22 70 28 84 L 34 72', 'M 50 34 Q 66 32 82 34', 'M 48 68 C 58 76 70 78 84 74'],
    'ぬ': ['M 28 24 C 34 50 40 70 48 82', 'M 62 18 C 56 54 34 80 24 70 C 16 60 38 38 64 46 C 80 52 78 78 62 78 C 52 78 56 64 70 68 C 78 70 84 76 88 82'],
    'ね': ['M 32 16 L 32 86', 'M 18 36 L 46 30 L 22 68 L 54 44 C 76 34 82 68 68 78 C 58 84 58 68 72 70 C 80 72 86 78 90 84'],
    'の': ['M 54 22 C 48 54 34 76 24 68 C 14 58 26 26 56 26 C 80 26 84 68 58 84'],
    'は': ['M 26 20 C 22 46 22 70 28 84 L 34 72', 'M 46 38 Q 66 36 84 34', 'M 66 16 L 66 74 C 66 84 46 82 46 70 C 46 58 68 60 86 78'],
    'ひ': ['M 22 30 L 46 26 C 28 54 32 84 56 84 C 76 84 78 52 72 26 C 78 44 84 58 90 68'],
    'ふ': ['M 46 16 Q 56 22 62 28', 'M 44 42 C 62 52 66 72 52 82 C 42 88 36 80 34 74', 'M 20 56 C 16 66 16 76 22 82', 'M 76 54 C 82 64 86 74 84 82'],
    'へ': ['M 16 62 L 42 32 L 86 72'],
    'ほ': ['M 24 20 C 20 46 20 70 26 84 L 32 72', 'M 46 26 Q 66 24 84 22', 'M 46 46 Q 66 44 84 42', 'M 66 26 L 66 76 C 66 86 46 84 46 72 C 46 60 68 62 86 78'],
    'ま': ['M 22 28 Q 50 26 78 24', 'M 24 48 Q 50 46 76 44', 'M 52 14 L 52 76 C 52 86 30 84 30 72 C 30 60 56 62 80 78'],
    'み': ['M 28 24 L 62 20 L 34 74 C 22 80 18 64 32 56 C 52 46 78 58 86 72', 'M 76 42 C 74 62 66 78 52 88'],
    'む': ['M 22 30 Q 40 28 56 26', 'M 42 14 L 42 60 C 42 72 24 70 24 56 C 24 44 44 46 44 64 C 44 82 68 84 78 72 L 76 58', 'M 74 28 Q 82 36 86 44'],
    'め': ['M 28 24 C 34 50 40 70 48 82', 'M 62 18 C 56 54 34 80 24 70 C 16 60 40 36 68 46 C 84 52 80 78 58 86'],
    'も': ['M 44 16 C 40 50 40 84 62 84 C 78 84 82 68 76 54', 'M 22 36 Q 46 36 68 34', 'M 22 56 Q 46 56 68 54'],
    'や': ['M 18 46 C 46 32 78 32 76 52 C 74 64 58 66 48 60', 'M 52 16 Q 58 22 64 28', 'M 34 20 L 54 88'],
    'ゆ': ['M 24 24 L 28 74 C 36 42 78 34 78 58 C 78 76 62 82 48 76', 'M 56 14 C 58 48 56 74 44 90'],
    'よ': ['M 54 34 L 78 32', 'M 52 16 L 52 76 C 52 86 30 84 30 72 C 30 60 56 62 82 78'],
    'ら': ['M 38 16 Q 52 20 64 26', 'M 32 36 L 28 60 C 46 46 76 52 72 72 C 68 86 50 88 34 86'],
    'り': ['M 32 22 C 28 46 28 64 34 72 L 42 60', 'M 66 20 C 70 48 68 74 48 88'],
    'る': ['M 28 22 L 66 20 L 28 56 C 54 44 80 52 76 74 C 72 88 46 88 44 76 C 42 66 56 66 66 78'],
    'れ': ['M 32 16 L 32 86', 'M 18 36 L 46 30 L 22 68 L 56 42 C 74 32 76 68 72 78 C 70 84 80 86 90 80'],
    'ろ': ['M 28 22 L 66 20 L 28 56 C 54 44 80 54 74 74 C 68 86 50 88 36 86'],
    'わ': ['M 32 16 L 32 86', 'M 18 36 L 46 30 L 22 68 L 54 42 C 78 32 84 68 62 84'],
    'を': ['M 22 26 Q 48 24 72 22', 'M 44 12 L 32 48 L 54 42 C 60 40 62 54 60 72', 'M 76 46 C 32 56 26 84 78 84'],
    'ん': ['M 48 16 L 24 74 C 34 54 54 52 56 68 C 58 84 76 84 86 64']
  };

  const DAKUTEN_MAP = {
    'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
    'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
    'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
    'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ'
  };
  const HANDAKUTEN_MAP = { 'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ' };
  const SMALL_KANA_MAP = { 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'っ': 'つ', 'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お' };

  function scaleSvgPath(pathStr, scale = 0.66, offsetX = 16, offsetY = 26) {
    return pathStr.replace(/(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)/g, (match, x, _, y) => {
      const nx = (parseFloat(x) * scale + offsetX).toFixed(1);
      const ny = (parseFloat(y) * scale + offsetY).toFixed(1);
      return `${nx} ${ny}`;
    });
  }

  function getSingleCharStrokes(ch) {
    if (BASE_STROKE_MAP[ch]) return [...BASE_STROKE_MAP[ch]];
    if (DAKUTEN_MAP[ch]) {
      return [...(BASE_STROKE_MAP[DAKUTEN_MAP[ch]] || []), 'M 76 14 L 83 24', 'M 86 10 L 93 20'];
    }
    if (HANDAKUTEN_MAP[ch]) {
      return [...(BASE_STROKE_MAP[HANDAKUTEN_MAP[ch]] || []), 'M 80 16 C 80 10 92 10 92 16 C 92 22 80 22 80 16'];
    }
    if (SMALL_KANA_MAP[ch]) {
      return (BASE_STROKE_MAP[SMALL_KANA_MAP[ch]] || []).map(p => scaleSvgPath(p, 0.66, 16, 26));
    }
    return ['M 22 30 L 78 30', 'M 50 18 L 50 82'];
  }

  function getStrokeStartCoord(pathStr) {
    const m = String(pathStr || '').match(/M\s*([\d.-]+)\s+([\d.-]+)/);
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 20, y: 20 };
  }

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

  function getHiraganaBasicList() {
    if (window.ContentDB && typeof window.ContentDB.getHiraganaBasic === 'function') {
      return window.ContentDB.getHiraganaBasic();
    }
    return getAllItems().filter(item => item.category === 'hiragana' && item.subType !== 'dakuon' && item.subType !== 'handakuon' && item.subType !== 'yoon');
  }

  function getHiraganaAdvancedList(subType = 'all') {
    if (window.ContentDB && typeof window.ContentDB.getHiraganaAdvanced === 'function') {
      return window.ContentDB.getHiraganaAdvanced(subType);
    }
    return [];
  }

  function getHiraganaAllList() {
    return [...getHiraganaBasicList(), ...getHiraganaAdvancedList('all')];
  }

  function getItemsByCategory(category) {
    if (Array.isArray(customPool) && customPool.length) {
      return customPool;
    }
    if (category === 'hiragana') {
      return getHiraganaAllList();
    }
    const all = getAllItems();
    if (!category || category === 'all') return all;
    return all.filter(item => item.category === category);
  }

  function getItemById(id) {
    if (!id) return null;
    return getAllItems().find(item => item.id === id) || null;
  }

  function setFilteredPool(itemsList, targetId = null) {
    customPool = Array.isArray(itemsList) && itemsList.length ? [...itemsList] : null;
    if (customPool && targetId) {
      activeCharId = targetId;
      const foundIdx = customPool.findIndex(i => i.id === targetId);
      if (foundIdx >= 0) fcIndex = foundIdx;
    } else if (customPool && customPool.length) {
      activeCharId = customPool[0].id;
      fcIndex = 0;
    }
  }

  function clearFilteredPool() {
    customPool = null;
  }

  // 글자(단일 히라가나 / 탁음·반탁음 / 요음 2글자 등)의 획순 목록 생성
  function buildCharacterStrokeList(item) {
    const cleanText = String(item?.jp || 'あ').replace('(な)', '').replace(/\s+/g, '').trim();
    const chars = Array.from(cleanText || 'あ');
    const result = [];

    chars.forEach((ch, charIdx) => {
      const paths = getSingleCharStrokes(ch);
      const isDakuten = Boolean(DAKUTEN_MAP[ch]);
      const isHandakuten = Boolean(HANDAKUTEN_MAP[ch]);
      const isSmall = Boolean(SMALL_KANA_MAP[ch]);

      paths.forEach((d, pIdx) => {
        const strokeNum = result.length + 1;
        let tip = `${strokeNum}획: 「${ch}」의 ${pIdx + 1}번째 획을 방향에 맞게 긋습니다.`;
        if (isDakuten && pIdx >= paths.length - 2) {
          tip = `${strokeNum}획: 오른쪽 상단에 탁점(゛)을 찍습니다.`;
        } else if (isHandakuten && pIdx === paths.length - 1) {
          tip = `${strokeNum}획: 오른쪽 상단에 반탁점(゜) 동그라미를 그립니다.`;
        } else if (isSmall) {
          tip = `${strokeNum}획: 작은 글자 「${ch}」의 ${pIdx + 1}번째 획을 오른쪽 아래 크기로 씁니다.`;
        }
        result.push({
          charIndex: charIdx,
          char: ch,
          d,
          tip
        });
      });
    });

    return { chars, strokes: result };
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
    const isHira = currentCategory === 'hiragana' && !customPool;

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

  function setCategory(category, resetCustom = true) {
    stopStrokeAnimation();
    if (resetCustom) customPool = null;
    currentCategory = category || 'hiragana';
    fcIndex = 0;
    fcFlipped = false;
    selectedRow = 'all';

    const list = currentCategory === 'hiragana' && !customPool
      ? getHiraganaBasicList()
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

    const list = getActiveStudyList();
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

  function getActiveStudyList() {
    if (customPool && customPool.length) return customPool;
    if (currentCategory === 'hiragana') {
      if (currentMode === 'advanced_chart') return getHiraganaAdvancedList(advSubFilter);
      if (currentMode === 'examples' || currentMode === 'stroke') return getHiraganaAllList();
      return getHiraganaBasicList();
    }
    return getItemsByCategory(currentCategory);
  }

  function getActiveSpeakingText() {
    const list = getActiveStudyList();
    const item = getItemById(activeCharId) || list[fcIndex] || list[0];
    if (!item) return 'あ';
    if (currentMode === 'examples' && Array.isArray(item.words) && item.words[0]) {
      return item.words[0].jp;
    }
    return item.jp;
  }

  function stepItem(delta) {
    const list = getActiveStudyList();
    if (!list.length) return;

    const curIdx = Math.max(0, list.findIndex(i => i.id === activeCharId));
    const nextIdx = (curIdx + delta + list.length) % list.length;
    activeCharId = list[nextIdx].id;
    fcIndex = nextIdx;
    fcFlipped = false;
    DB.touchItemAsSeen(activeCharId, currentCategory);
    stopStrokeAnimation();
    render(currentCategory, window.AppController?.refreshDashboard);
  }

  function toggleCurrentFavorite() {
    const item = getItemById(activeCharId);
    if (!item) return;
    DB.toggleFavorite(item.id, currentCategory);
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

  function renderSummaryBanner(category) {
    const banner = document.getElementById('studySummaryBanner');
    if (!banner) return;

    const targetItems = customPool && customPool.length
      ? customPool
      : getItemsByCategory(category);
    const prog = DB.getCategoryProgress(targetItems, category);
    const reviewCount = DB.getReviewNeededItems(targetItems, category).length;

    const catTitleMap = {
      all: '필터 선택 항목',
      hiragana: '히라가나 (기본 46자 + 심화 58자)',
      katakana: '가타카나',
      noun: '명사',
      i_adj: 'い형용사',
      na_adj: 'な형용사',
      verb: '동사'
    };

    const titleText = customPool && customPool.length
      ? `필터 선택 항목 (${prog.total}개)`
      : (catTitleMap[category] || '학습 영역');

    banner.innerHTML = `
      <div style="width:100%;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
          <div>
            <strong>${titleText} 진도표</strong>
            <span class="hint-text"> · 학습완료 ${prog.mastered}/${prog.total} (${prog.percent}%)</span>
            ${customPool && customPool.length ? `<button type="button" class="btn" id="clearCustomPoolBtn" style="margin-left:8px; padding:3px 8px; font-size:0.72rem;">전체 보기 복귀</button>` : ''}
          </div>
          <div class="summary-metrics">
            <span class="metric-pill">🎯 완료율 ${prog.percent}%</span>
            <span class="metric-pill">⭐ 즐겨찾기 ${prog.favoritesCount}</span>
            <span class="metric-pill">🔁 복습필요 ${reviewCount}</span>
            <span class="metric-pill">❗️ 학습중 ${prog.learning}</span>
          </div>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${prog.percent}%"></div>
        </div>
      </div>
    `;

    document.getElementById('clearCustomPoolBtn')?.addEventListener('click', () => {
      clearFilteredPool();
      render(currentCategory, window.AppController?.refreshDashboard);
    });
  }

  function render(category = currentCategory, onProgressChange = null) {
    currentCategory = category || 'hiragana';
    syncSubTabVisibility();
    stopStrokeAnimation();

    const container = document.getElementById('studyContainer');
    if (!container) return;

    renderSummaryBanner(currentCategory);

    const items = getActiveStudyList();
    if (!items.length) {
      container.innerHTML = `
        <div class="card">
          <h3>아직 등록된 학습 항목이 없습니다</h3>
          <p class="hint-text" style="margin-top:6px;">
            다른 학습 영역을 선택하거나 필터 조건을 초기화해 보세요.
          </p>
        </div>
      `;
      return;
    }

    if (currentCategory === 'hiragana' && !customPool) {
      if (currentMode === 'chart') renderHiraganaChart(container, onProgressChange);
      else if (currentMode === 'advanced_chart') renderAdvancedHiraganaChart(container, onProgressChange);
      else if (currentMode === 'flashcard') renderFlashcard(container, items, onProgressChange);
      else if (currentMode === 'stroke') renderStrokeAndTrace(container, items, onProgressChange);
      else if (currentMode === 'mnemonic') renderMnemonicTab(container, items, onProgressChange);
      else if (currentMode === 'examples') renderWordsAndExamplesTab(container, items, onProgressChange);
    } else {
      if (currentMode === 'chart') renderGeneralList(container, items, onProgressChange);
      else if (currentMode === 'flashcard') renderFlashcard(container, items, onProgressChange);
      else if (currentMode === 'stroke') renderStrokeAndTrace(container, items, onProgressChange);
      else renderGeneralList(container, items, onProgressChange);
    }
  }

  // 1. 기본 50음도 표
  function renderHiraganaChart(container, onProgressChange) {
    const hiraList = getHiraganaBasicList();
    const mapById = new Map(hiraList.map(item => [item.id, item]));

    const tilesHtml = HIRAGANA_ROWS_SLOTS.map(rowObj => {
      return rowObj.slots.map(slotId => {
        if (!slotId || !mapById.has(slotId)) {
          return `<div class="char-tile empty-slot" aria-hidden="true"></div>`;
        }
        const item = mapById.get(slotId);
        const st = DB.getStatus(item.id, 'hiragana');
        const fav = DB.isFavorite(item.id, 'hiragana');
        return `
          <div class="char-tile st-${st}" data-id="${item.id}">
            <button type="button" class="tile-fav-btn ${fav ? 'active' : ''}" data-fav-id="${item.id}" title="즐겨찾기" aria-label="${item.jp} 즐겨찾기">
              ${fav ? '★' : '☆'}
            </button>
            <div class="tile-jp jp-font">${item.jp}</div>
            <div class="tile-romaji"><span class="hint-mask">${item.romaji}</span> · <span class="meaning-mask">${item.meaning}</span></div>
            <span class="chart-status-icon" aria-label="${getStatusDisplay(st, { chartOnly: false })}">${getStatusDisplay(st, { chartOnly: true })}</span>
          </div>
        `;
      }).join('');
    }).join('');

    container.innerHTML = `
      <div class="card gojuon-card">
        <div class="card-title-row">
          <h3>히라가나 기본 50음도 표 (46자)</h3>
          <span class="hint-text">❌️ 미학습 · ❗️ 학습중 · ✅️ 학습완료 · 🔥 어려움</span>
        </div>
        <div class="gojuon-grid">${tilesHtml}</div>
      </div>
    `;

    bindTileInteractions(container, () => renderHiraganaChart(container, onProgressChange), onProgressChange);
  }

  // 1-2. 심화 50음도 표 (탁음 · 반탁음 · 요음)
  function renderAdvancedHiraganaChart(container, onProgressChange) {
    const advList = getHiraganaAdvancedList(advSubFilter);
    const gridClass = advSubFilter === 'yoon' ? 'adv-grid-3' : 'gojuon-grid';

    const filterBtns = [
      { key: 'all', label: '전체 심화 (58자)' },
      { key: 'dakuon', label: '탁음 ゛ (20자)' },
      { key: 'handakuon', label: '반탁음 ゜ (5자)' },
      { key: 'yoon', label: '요음 ゃゅょ (33자)' }
    ];

    container.innerHTML = `
      <div class="card gojuon-card">
        <div class="card-title-row">
          <div>
            <h3>✨ 심화 50음도 표 (탁음 · 반탁음 · 요음)</h3>
            <span class="hint-text">타일을 누르면 단어·예문과 정밀 획순 쓰는 법을 바로 확인할 수 있습니다. (규칙 설명은 📐 문법 탭에 정리되어 있습니다)</span>
          </div>
        </div>

        <div class="adv-filter-row">
          ${filterBtns.map(b => `
            <button type="button" class="btn adv-sub-btn ${advSubFilter === b.key ? 'primary' : ''}" data-adv="${b.key}">${b.label}</button>
          `).join('')}
        </div>

        <div class="${gridClass}">
          ${advList.map(item => {
            const st = DB.getStatus(item.id, 'hiragana');
            const fav = DB.isFavorite(item.id, 'hiragana');
            return `
              <div class="char-tile st-${st}" data-id="${item.id}">
                <button type="button" class="tile-fav-btn ${fav ? 'active' : ''}" data-fav-id="${item.id}" title="즐겨찾기">
                  ${fav ? '★' : '☆'}
                </button>
                <div style="font-size:0.66rem; color:var(--text-muted); font-weight:700;">${item.row || ''}</div>
                <div class="tile-jp jp-font">${item.jp}</div>
                <div class="tile-romaji"><span class="hint-mask">${item.romaji}</span> · <span class="meaning-mask">${item.meaning}</span></div>
                <span class="chart-status-icon">${getStatusDisplay(st, { chartOnly: true })}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.adv-sub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        advSubFilter = btn.dataset.adv;
        renderAdvancedHiraganaChart(container, onProgressChange);
      });
    });

    bindTileInteractions(container, () => renderAdvancedHiraganaChart(container, onProgressChange), onProgressChange);
  }

  function bindTileInteractions(container, rerenderFn, onProgressChange) {
    container.querySelectorAll('.tile-fav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        DB.toggleFavorite(btn.dataset.favId, currentCategory);
        rerenderFn();
        renderSummaryBanner(currentCategory);
        if (onProgressChange) onProgressChange();
      });
    });

    container.querySelectorAll('.char-tile:not(.empty-slot)').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = tile.dataset.id;
        DB.touchItemAsSeen(id, currentCategory);
        activeCharId = id;
        openCharDetailModal(id, onProgressChange);
        renderSummaryBanner(currentCategory);

        const st = DB.getStatus(id, currentCategory);
        tile.className = `char-tile st-${st}`;
        const iconEl = tile.querySelector('.chart-status-icon');
        if (iconEl) {
          iconEl.textContent = getStatusDisplay(st, { chartOnly: true });
        }
        if (onProgressChange) onProgressChange();
      });
    });
  }

  function openCharDetailById(id, onProgressChange) {
    openCharDetailModal(id, onProgressChange);
  }

  function openCharDetailModal(id, onProgressChange) {
    const item = getItemById(id);
    const modal = document.getElementById('charDetailModal');
    const body = document.getElementById('charModalBody');
    if (!item || !modal || !body) return;

    const targetCat = item.category || currentCategory;
    const currentStatus = DB.getStatus(item.id, targetCat);
    const isFav = DB.isFavorite(item.id, targetCat);
    const { strokes } = buildCharacterStrokeList(item);
    const sampleWords = (item.words || []).slice(0, 4);
    const sampleExamples = (item.examples || []).slice(0, 2);

    body.innerHTML = `
      <div style="display:flex; align-items:center; gap:14px; margin-bottom:14px; flex-wrap:wrap;">
        <div class="jp-font" style="font-size:3.2rem; font-weight:900; line-height:1; color:var(--accent);">${item.jp}</div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <h3 id="modalCharTitle" style="font-size:1.2rem;">
              <span class="jp-font">${item.jp}</span> (<span class="hint-mask">${item.romaji}</span>) · <span class="meaning-mask">${item.meaning}</span>
            </h3>
            <button type="button" class="btn" id="modalSpeakBtn">🔊 발음 듣기</button>
            <button type="button" class="btn" id="modalFavBtn">${isFav ? '★ 즐겨찾기됨' : '☆ 즐겨찾기'}</button>
          </div>
          <p class="hint-text" style="margin-top:4px;">
            ${item.row || ''} · 총 <strong>${strokes.length}획</strong> · <span class="status-badge status-${currentStatus}">${getStatusDisplay(currentStatus, { chartOnly: false })}</span>
          </p>
        </div>
      </div>

      <div style="margin-bottom:10px;">
        <strong>🗣️ 발음 및 쓰는 법</strong>
        <p class="hint-mask" style="font-size:0.88rem; color:var(--text-secondary); margin-top:3px;">${item.pronTip || '자연스럽고 명확하게 발음하세요.'}</p>
      </div>

      <div style="margin-bottom:12px;">
        <strong>💡 암기·구성 팁</strong>
        <p class="hint-mask" style="font-size:0.88rem; color:var(--text-secondary); margin-top:3px;">${item.mnemonic || ''}</p>
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
        <button type="button" class="btn primary" id="jumpToStrokeBtn">✍️ 획순 & 따라쓰기 탭에서 연습</button>
        ${targetCat === 'hiragana' ? `<button type="button" class="btn" id="jumpToExamplesBtn">📖 단어·예문 더보기</button>` : ''}
      </div>

      <div style="border-top:1px solid var(--border); padding-top:12px;">
        <strong style="font-size:0.88rem; display:block; margin-bottom:8px;">예시 단어</strong>
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:10px;">
          ${sampleWords.map(w => `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:7px 10px; border-radius:10px; background:var(--bg-elevated);">
              <div style="min-width:0;">
                <strong class="jp-font" style="font-size:1.02rem;">${w.emoji ? w.emoji + ' ' : ''}${w.jp}</strong>
                <span class="hint-text hint-mask" style="margin-left:6px;">${w.romaji}</span>
                <span class="meaning-mask" style="margin-left:6px; font-weight:600;">/ ${w.meaning}</span>
              </div>
              <button type="button" class="btn sample-tts-btn" data-tts="${w.jp}" style="padding:4px 9px;">🔊</button>
            </div>
          `).join('')}
        </div>

        ${sampleExamples.length ? `
          <strong style="font-size:0.88rem; display:block; margin-bottom:6px;">예문</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${sampleExamples.map(ex => `
              <div style="padding:8px 10px; border-radius:10px; background:var(--bg-elevated); border-left:3px solid var(--accent);">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                  <strong class="jp-font">${ex.jp}</strong>
                  <button type="button" class="btn sample-tts-btn" data-tts="${ex.jp}" style="padding:3px 8px;">🔊</button>
                </div>
                <div class="hint-text hint-mask">${ex.romaji}</div>
                <div class="meaning-mask" style="font-size:0.84rem;">→ ${ex.meaning}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('modalSpeakBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('modalFavBtn')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id, targetCat);
      openCharDetailModal(item.id, onProgressChange);
      if (currentMode === 'chart' || currentMode === 'advanced_chart') render(currentCategory, onProgressChange);
      renderSummaryBanner(currentCategory);
      if (onProgressChange) onProgressChange();
    });

    body.querySelectorAll('.status-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.setStatus(item.id, btn.dataset.st, targetCat);
        openCharDetailModal(item.id, onProgressChange);
        renderSummaryBanner(currentCategory);
        if (currentMode === 'chart' || currentMode === 'advanced_chart') render(currentCategory, onProgressChange);
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

    document.getElementById('jumpToExamplesBtn')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      setMode('examples', item.id);
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
    DB.touchItemAsSeen(item.id, currentCategory);

    const st = DB.getStatus(item.id, currentCategory);
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
              <span class="hint-mask">${item.romaji}</span> · <span class="meaning-mask">${item.meaning}</span>
            </div>
            <button type="button" class="btn" id="fcSpeakBtn" style="margin-bottom:10px;">🔊 발음 듣기</button>
            <p class="hint-text hint-mask" style="margin-bottom:8px;">${item.pronTip || ''}</p>
            <div class="hint-mask" style="font-size:0.9rem; margin-bottom:10px;">💡 ${item.mnemonic || ''}</div>
            <div style="width:100%; text-align:left; font-size:0.84rem;">
              ${sampleWords.map(w => `
                <div style="padding:3px 0;">
                  ${w.emoji ? w.emoji + ' ' : ''}<strong class="jp-font">${w.jp}</strong> (<span class="hint-mask">${w.romaji}</span>) - <span class="meaning-mask">${w.meaning}</span>
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
      DB.setStatus(item.id, nextStatus, currentCategory);
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
  }

  // 3. 정밀 SVG 획순 & 손글씨 따라쓰기 (첨부 '획순 참고 파일.html' 방식 적용)
  function renderStrokeAndTrace(container, items, onProgressChange) {
    if (!items.length) return;
    const item = getItemById(activeCharId) || items[0];
    if (!item) return;

    activeCharId = item.id;
    fcIndex = Math.max(0, items.findIndex(i => i.id === item.id));
    DB.touchItemAsSeen(item.id, currentCategory);

    const { chars, strokes } = buildCharacterStrokeList(item);
    const isFav = DB.isFavorite(item.id, currentCategory);
    const st = DB.getStatus(item.id, currentCategory);
    const viewBoxWidth = Math.max(100, chars.length * 100);
    const colors = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#0284c7'];

    // 배경 가이드 격자 + 회색 바탕 획
    const bgLayerHtml = chars.map((ch, cIdx) => {
      const charStrokes = strokes.filter(s => s.charIndex === cIdx);
      return `
        <g transform="translate(${cIdx * 100}, 0)">
          <rect x="3" y="3" width="94" height="94" rx="10" fill="none" stroke="var(--border)" stroke-width="1.2" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="var(--border)" stroke-width="0.9" stroke-dasharray="3,3" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="var(--border)" stroke-width="0.9" stroke-dasharray="3,3" />
          ${charStrokes.map(s => `<path d="${s.d}" fill="none" stroke="var(--border)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round" />`).join('')}
        </g>
      `;
    }).join('');

    // 순차 애니메이션될 컬러 획 + 시작점 번호 원
    const animLayerHtml = strokes.map((s, globalIdx) => {
      const pt = getStrokeStartCoord(s.d);
      const col = colors[globalIdx % colors.length];
      return `
        <g transform="translate(${s.charIndex * 100}, 0)">
          <path id="animStroke_${globalIdx}" d="${s.d}" fill="none" stroke="${col}" stroke-width="7.5"
                stroke-linecap="round" stroke-linejoin="round" />
          <g id="animMarker_${globalIdx}" style="opacity:0.28;">
            <circle cx="${pt.x}" cy="${pt.y}" r="6.8" fill="${col}" />
            <text x="${pt.x}" y="${pt.y + 3}" font-size="8.5" fill="#ffffff" text-anchor="middle" font-weight="bold">${globalIdx + 1}</text>
          </g>
        </g>
      `;
    }).join('');

    container.innerHTML = `
      <div class="card">
        <div class="stroke-kana-tabs-wrap">
          <div class="stroke-kana-tabs-header">
            <span class="hint-text">↔ 좌우 스와이프/스크롤로 문자·단어 선택 (${items.length}개)</span>
            <span class="status-badge status-${st}">${getStatusDisplay(st, { chartOnly: false })}</span>
          </div>
          <div class="kana-swipe-tabs" id="strokeKanaTabs" role="tablist" aria-label="문자 목록 탭">
            ${items.map(ch => {
              const isActive = ch.id === item.id;
              const chStatus = DB.getStatus(ch.id, currentCategory);
              return `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${isActive}"
                  class="kana-swipe-tab ${isActive ? 'active' : ''}"
                  data-char-id="${ch.id}"
                >
                  <span class="kana-tab-jp jp-font">${ch.jp}</span>
                  <span class="kana-tab-romaji hint-mask">${ch.romaji}</span>
                  <span class="kana-tab-dot" aria-hidden="true">${getStatusDisplay(chStatus, { chartOnly: true })}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card-title-row">
          <div>
            <h3>획순 & 따라쓰기: <span class="jp-font" style="color:var(--accent); font-size:1.5rem;">${item.jp}</span> (<span class="hint-mask">${item.romaji}</span> · <span class="meaning-mask">${item.meaning}</span>)</h3>
            <p class="hint-text hint-mask" style="margin-top:4px;">${item.pronTip || ''} ${item.mnemonic || ''}</p>
          </div>
          <div class="btn-row">
            <button type="button" class="btn" id="strokeSpeakBtn">🔊 TTS 듣기</button>
            <button type="button" class="btn" id="strokeFavBtn">${isFav ? '★ 즐겨찾기' : '☆ 즐겨찾기'}</button>
            <button type="button" class="btn" id="strokePrevBtn">◀ 이전</button>
            <button type="button" class="btn primary" id="strokeNextBtn">다음 ▶</button>
          </div>
        </div>

        <div class="stroke-stage-grid">
          <div class="stroke-box">
            <strong style="font-size:0.88rem;">정밀 SVG 획순 애니메이션 (${strokes.length}획)</strong>
            <svg id="strokeSvg" class="${chars.length > 1 ? 'stroke-svg-wide' : 'stroke-svg'}" viewBox="0 0 ${viewBoxWidth} 100" preserveAspectRatio="xMidYMid meet" aria-label="${item.jp} 획순 가이드">
              ${bgLayerHtml}
              ${animLayerHtml}
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
                <svg viewBox="0 0 ${viewBoxWidth} 100" width="${chars.length > 1 ? 84 : 56}" height="56" style="display:block; margin:0 auto 6px;">
                  ${strokes.map((prevS, pIdx) => `
                    <g transform="translate(${prevS.charIndex * 100}, 0)">
                      <path d="${prevS.d}" fill="none" stroke="${pIdx === idx ? colors[idx % colors.length] : 'var(--border)'}" stroke-width="${pIdx === idx ? '9' : '6'}" stroke-linecap="round" stroke-linejoin="round"></path>
                    </g>
                  `).join('')}
                </svg>
                <div>${s.tip}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    attachSwipeableKanaTabs(document.getElementById('strokeKanaTabs'), items, targetCharId => {
      stopStrokeAnimation();
      activeCharId = targetCharId;
      fcIndex = Math.max(0, items.findIndex(i => i.id === targetCharId));
      DB.touchItemAsSeen(targetCharId, currentCategory);
      renderStrokeAndTrace(container, items, onProgressChange);
      renderSummaryBanner(currentCategory);
      if (onProgressChange) onProgressChange();
    });

    document.getElementById('strokeSpeakBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('strokeFavBtn')?.addEventListener('click', () => {
      DB.toggleFavorite(item.id, currentCategory);
      renderStrokeAndTrace(container, items, onProgressChange);
      renderSummaryBanner(currentCategory);
      if (onProgressChange) onProgressChange();
    });
    document.getElementById('strokePrevBtn')?.addEventListener('click', () => stepItem(-1));
    document.getElementById('strokeNextBtn')?.addEventListener('click', () => stepItem(1));

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

  function getSafePathLength(pathEl) {
    if (!pathEl || typeof pathEl.getTotalLength !== 'function') return 240;
    try {
      const len = pathEl.getTotalLength();
      return Number.isFinite(len) && len > 0 ? Math.ceil(len) + 4 : 240;
    } catch (e) {
      return 240;
    }
  }

  function setupStrokeAnimation(count) {
    for (let i = 0; i < count; i += 1) {
      const el = document.getElementById(`animStroke_${i}`);
      const marker = document.getElementById(`animMarker_${i}`);
      if (marker) marker.style.opacity = '0.28';
      if (!el) continue;
      const len = getSafePathLength(el);
      el.dataset.pathLen = String(len);
      el.style.transition = 'none';
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
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
    const total = buildCharacterStrokeList(item).strokes.length;
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
      const marker = document.getElementById(`animMarker_${idx}`);
      if (marker) marker.style.opacity = '1';

      if (!el) {
        strokeAnimTimer = setTimeout(() => runStep(idx + 1), 120);
        return;
      }

      const len = Number(el.dataset.pathLen) || getSafePathLength(el);
      const durationMs = Math.min(750, Math.max(420, Math.round(len * 3.8)));

      el.style.transition = 'none';
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.getBoundingClientRect();

      strokeAnimRafId = requestAnimationFrame(() => {
        if (sessionToken !== strokeAnimSession || strokePaused) return;
        el.style.transition = `stroke-dashoffset ${durationMs}ms ease-in-out`;
        el.style.strokeDashoffset = '0';

        strokeAnimTimer = setTimeout(() => {
          if (sessionToken !== strokeAnimSession || strokePaused) return;
          runStep(idx + 1);
        }, durationMs + 120);
      });
    };

    strokeAnimRafId = requestAnimationFrame(() => runStep(startIdx));
  }

  // 4. 연상 암기법 탭 (기본 규칙은 문법 탭으로 이동 완료, 연상 스토리 + 3지선다 퀴즈 집중)
  function renderMnemonicTab(container, items, onProgressChange) {
    if (!items.length) return;
    const item = getItemById(activeCharId) || items[0];
    if (!item) return;

    activeCharId = item.id;
    DB.touchItemAsSeen(item.id, 'hiragana');

    const mq = item.mnemonicQuiz || {
      q: `「${item.jp}」의 발음으로 알맞은 것은?`,
      choices: [`${item.romaji} (${item.meaning})`, 'ka (카)', 'so (소)'],
      answer: 0
    };
    const picked = mnemonicQuizSelection[item.id];

    container.innerHTML = `
      <div class="card" style="max-width:680px; margin:0 auto;">
        <div class="card-title-row">
          <h3>💡 연상 암기법: <span class="jp-font" style="color:var(--accent); font-size:1.5rem;">${item.jp}</span> (<span class="hint-mask">${item.romaji}</span>)</h3>
          <div class="btn-row">
            <button type="button" class="btn" id="mnPrevBtn">◀ 이전</button>
            <button type="button" class="btn" id="mnNextBtn">다음 ▶</button>
          </div>
        </div>

        <p style="margin-bottom:8px;"><strong>🗣️ 발음 가이드:</strong> <span class="hint-mask">${item.pronTip || ''}</span></p>
        <div style="padding:12px 14px; border-radius:12px; background:var(--accent-soft); margin-bottom:16px;">
          <strong>🎨 모양·발음 연상 스토리:</strong> <span class="hint-mask">${item.mnemonic || ''}</span>
        </div>

        <div style="border-top:1px solid var(--border); padding-top:14px;">
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
      </div>
    `;

    document.getElementById('mnPrevBtn')?.addEventListener('click', () => stepItem(-1));
    document.getElementById('mnNextBtn')?.addEventListener('click', () => stepItem(1));

    container.querySelectorAll('.mn-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cIdx = Number(btn.dataset.idx);
        mnemonicQuizSelection[item.id] = cIdx;
        if (cIdx === mq.answer) {
          DB.recordQuiz(true, item, '연상 퀴즈', 'hiragana');
        } else {
          DB.recordQuiz(false, item, '연상 퀴즈 오답', 'hiragana');
        }
        renderMnemonicTab(container, items, onProgressChange);
        renderSummaryBanner(currentCategory);
        if (onProgressChange) onProgressChange();
      });
    });
  }

  // 5. 문자별 단어·예문 탭 (기본 50음도 + 심화 50음도 전체 지원)
  function renderWordsAndExamplesTab(container, items, onProgressChange) {
    if (!items.length) return;
    const item = getItemById(activeCharId) || items[0];
    if (!item) return;

    activeCharId = item.id;
    selectedRow = item.row || selectedRow;
    DB.touchItemAsSeen(item.id, 'hiragana');

    const rows = window.ContentDB?.getRows ? window.ContentDB.getRows() : ROWS;
    const advGroups = [
      { key: 'dakuon', label: '탁음(が~ぼ)' },
      { key: 'handakuon', label: '반탁음(ぱ~ぽ)' },
      { key: 'yoon', label: '요음(きゃ~ぴょ)' }
    ];
    const words = item.words || [];
    const examples = item.examples || [];

    container.innerHTML = `
      <div class="card">
        <div class="btn-row" style="justify-content:flex-start; margin-bottom:8px;">
          ${rows.map(r => `
            <button type="button" class="btn row-chip ${item.row === r ? 'primary' : ''}" data-row="${r}">${r}</button>
          `).join('')}
        </div>

        <div class="btn-row" style="justify-content:flex-start; margin-bottom:14px;">
          <span class="hint-text" style="font-weight:700;">✨ 심화 50음도 바로가기:</span>
          ${advGroups.map(g => `
            <button type="button" class="btn adv-group-chip ${item.subType === g.key ? 'primary' : ''}" data-subtype="${g.key}">${g.label}</button>
          `).join('')}
        </div>

        <div class="card-title-row">
          <div>
            <h3 style="font-size:1.35rem;">
              <span class="jp-font" style="color:var(--accent);">${item.jp}</span> (<span class="hint-mask">${item.romaji}</span>) · <span class="meaning-mask">${item.meaning}</span>
            </h3>
            <span class="hint-text">${item.row || ''}</span>
          </div>
          <div class="btn-row">
            <button type="button" class="btn" id="exSpeakCharBtn">🔊 문자 듣기</button>
            <button type="button" class="btn" id="exToStrokeBtn">✍️ 획순 보기</button>
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
                <span class="hint-text hint-mask" style="margin-left:6px;">[${w.romaji}]</span>
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
              <div class="hint-text hint-mask" style="margin-top:2px;">${ex.romaji}</div>
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

    container.querySelectorAll('.adv-group-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetSub = chip.dataset.subtype;
        const firstAdv = items.find(i => i.subType === targetSub);
        if (firstAdv) {
          activeCharId = firstAdv.id;
          renderWordsAndExamplesTab(container, items, onProgressChange);
          renderSummaryBanner(currentCategory);
          if (onProgressChange) onProgressChange();
        }
      });
    });

    document.getElementById('exSpeakCharBtn')?.addEventListener('click', () => speakText(item.jp));
    document.getElementById('exToStrokeBtn')?.addEventListener('click', () => {
      setMode('stroke', item.id);
      render(currentCategory, onProgressChange);
    });
    document.getElementById('exPrevBtn')?.addEventListener('click', () => stepItem(-1));
    document.getElementById('exNextBtn')?.addEventListener('click', () => stepItem(1));

    container.querySelectorAll('.tts-item-btn').forEach(btn => {
      btn.addEventListener('click', () => speakText(btn.dataset.tts));
    });
  }

  function renderGeneralList(container, items, onProgressChange) {
    container.innerHTML = `
      <div class="card">
        <div class="gojuon-grid">
          ${items.map(item => {
            const st = DB.getStatus(item.id, currentCategory);
            const fav = DB.isFavorite(item.id, currentCategory);
            return `
              <div class="char-tile st-${st}" data-id="${item.id}">
                <button type="button" class="tile-fav-btn ${fav ? 'active' : ''}" data-fav-id="${item.id}">${fav ? '★' : '☆'}</button>
                <div class="tile-jp jp-font" style="font-size:1.35rem;">${item.emoji ? item.emoji + ' ' : ''}${item.jp}</div>
                <div class="tile-romaji"><span class="hint-mask">${item.romaji}</span> · <span class="meaning-mask"><strong>${item.meaning}</strong></span></div>
                <span class="status-badge status-${st}">${getStatusDisplay(st, { chartOnly: false })}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    bindTileInteractions(container, () => renderGeneralList(container, items, onProgressChange), onProgressChange);
  }

  return {
    setCategory,
    setMode,
    setFilteredPool,
    clearFilteredPool,
    openCharDetailById,
    render,
    speakText,
    stepItem,
    toggleCurrentFavorite,
    toggleFlashcardOrStrokeAction,
    getActiveSpeakingText
  };
})();
