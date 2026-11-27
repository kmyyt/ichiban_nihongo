// 학습 영역별 독립 localStorage 저장소 및 진도·퀴즈·작문 통계 DB 모듈
const DB = (() => {
  const PREFS_KEY = 'jp_study_v2_prefs';
  const CAT_PREFIX = 'jp_study_v2_cat_';
  const CATEGORIES = ['hiragana', 'katakana', 'noun', 'i_adj', 'na_adj', 'verb'];

  const STATUS = {
    UNLEARNED: 'unlearned',
    LEARNING: 'learning',
    HARD: 'hard',
    MASTERED: 'mastered'
  };

  const STATUS_LABEL = {
    [STATUS.UNLEARNED]: '미학습',
    [STATUS.LEARNING]: '학습중',
    [STATUS.HARD]: '어려움',
    [STATUS.MASTERED]: '암기완료'
  };

  const STATUS_DISPLAY = {
    [STATUS.UNLEARNED]: { chartIcon: '❌️', icon: '❌', text: '미학습' },
    [STATUS.LEARNING]:  { chartIcon: '❗️', icon: '❗️', text: '학습중' },
    [STATUS.HARD]:      { chartIcon: '🔥', icon: '🔥', text: '어려움' },
    [STATUS.MASTERED]:  { chartIcon: '✅️', icon: '✅', text: '학습완료' }
  };

  let activeCategory = 'hiragana';

  function normalizeCategory(cat) {
    return CATEGORIES.includes(cat) ? cat : activeCategory || 'hiragana';
  }

  function setActiveCategory(cat) {
    if (CATEGORIES.includes(cat)) activeCategory = cat;
  }

  function getActiveCategory() {
    return activeCategory;
  }

  function getStatusDisplay(statusKey, isChart = false) {
    const key = Object.prototype.hasOwnProperty.call(STATUS_DISPLAY, statusKey)
      ? statusKey
      : STATUS.UNLEARNED;
    const entry = STATUS_DISPLAY[key];
    return isChart ? entry.chartIcon : `${entry.icon} ${entry.text}`;
  }

  function getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function createDefaultCategoryState() {
    return {
      statuses: {},
      favorites: [],
      lastReviewed: {},
      wrongNotes: [],
      writingSolved: {},
      quizStats: {
        totalAttempts: 0,
        correctCount: 0,
        gameClears: 0,
        bestScore: 0
      },
      studyLog: {
        streakDays: 1,
        lastStudyDate: getTodayKey(),
        todayCount: 0
      }
    };
  }

  function createDefaultPrefs() {
    return {
      theme: 'light',
      hideMeanings: false,
      hideHints: false,
      sidebarCollapsed: false
    };
  }

  function loadPreferences() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return createDefaultPrefs();
      return { ...createDefaultPrefs(), ...JSON.parse(raw) };
    } catch (e) {
      return createDefaultPrefs();
    }
  }

  function savePreferences(partial = {}) {
    const next = { ...loadPreferences(), ...partial };
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('설정 저장 오류:', e);
    }
    return next;
  }

  function loadCategory(cat = activeCategory) {
    const key = CAT_PREFIX + normalizeCategory(cat);
    const def = createDefaultCategoryState();
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return def;
      const parsed = JSON.parse(raw);
      return {
        ...def,
        ...parsed,
        statuses: parsed?.statuses && typeof parsed.statuses === 'object' ? parsed.statuses : {},
        favorites: Array.isArray(parsed?.favorites) ? parsed.favorites : [],
        lastReviewed: parsed?.lastReviewed && typeof parsed.lastReviewed === 'object' ? parsed.lastReviewed : {},
        wrongNotes: Array.isArray(parsed?.wrongNotes) ? parsed.wrongNotes : [],
        writingSolved: parsed?.writingSolved && typeof parsed.writingSolved === 'object' ? parsed.writingSolved : {},
        quizStats: { ...def.quizStats, ...(parsed?.quizStats || {}) },
        studyLog: { ...def.studyLog, ...(parsed?.studyLog || {}) }
      };
    } catch (e) {
      return def;
    }
  }

  function saveCategory(state, cat = activeCategory) {
    const key = CAT_PREFIX + normalizeCategory(cat);
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn('카테고리 DB 저장 오류:', e);
    }
  }

  // 기존 호환용 load/save (현재 활성 영역 기준)
  function load(cat = activeCategory) {
    return loadCategory(cat);
  }

  function save(state, cat = activeCategory) {
    saveCategory(state, cat);
  }

  function bumpTodayStudy(state, amount = 1) {
    const today = getTodayKey();
    if (state.studyLog.lastStudyDate !== today) {
      state.studyLog.lastStudyDate = today;
      state.studyLog.todayCount = 0;
    }
    state.studyLog.todayCount = (state.studyLog.todayCount || 0) + amount;
  }

  function getStatus(itemId, cat = activeCategory) {
    if (!itemId) return STATUS.UNLEARNED;
    const state = loadCategory(cat);
    return state.statuses[itemId] || STATUS.UNLEARNED;
  }

  function setStatus(itemId, nextStatus, cat = activeCategory) {
    if (!itemId || !Object.values(STATUS).includes(nextStatus)) return;
    const state = loadCategory(cat);
    state.statuses[itemId] = nextStatus;
    state.lastReviewed[itemId] = Date.now();
    bumpTodayStudy(state, 1);
    saveCategory(state, cat);
  }

  function touchItemAsSeen(itemId, cat = activeCategory) {
    if (!itemId) return;
    const state = loadCategory(cat);
    state.lastReviewed[itemId] = Date.now();
    if (!state.statuses[itemId] || state.statuses[itemId] === STATUS.UNLEARNED) {
      state.statuses[itemId] = STATUS.LEARNING;
      bumpTodayStudy(state, 1);
    }
    saveCategory(state, cat);
  }

  function isFavorite(itemId, cat = activeCategory) {
    return loadCategory(cat).favorites.includes(itemId);
  }

  function toggleFavorite(itemId, cat = activeCategory) {
    if (!itemId) return false;
    const state = loadCategory(cat);
    const idx = state.favorites.indexOf(itemId);
    const active = idx < 0;
    if (active) state.favorites.push(itemId);
    else state.favorites.splice(idx, 1);
    saveCategory(state, cat);
    return active;
  }

  function recordQuiz(isCorrect, item, reason = '퀴즈 오답', cat = null) {
    const targetCat = normalizeCategory(cat || item?.category || activeCategory);
    const state = loadCategory(targetCat);
    state.quizStats.totalAttempts = (state.quizStats.totalAttempts || 0) + 1;

    if (isCorrect) {
      state.quizStats.correctCount = (state.quizStats.correctCount || 0) + 1;
      if (item && item.id) {
        state.lastReviewed[item.id] = Date.now();
        if (state.statuses[item.id] === STATUS.HARD) {
          state.statuses[item.id] = STATUS.LEARNING;
        }
      }
    } else if (item && item.id) {
      state.lastReviewed[item.id] = Date.now();
      if (state.statuses[item.id] !== STATUS.MASTERED) {
        state.statuses[item.id] = STATUS.HARD;
      }
      const existingIdx = state.wrongNotes.findIndex(w => w.itemId === item.id);
      const prevCount = existingIdx >= 0 ? (state.wrongNotes[existingIdx].wrongCount || 1) : 0;
      const entry = {
        id: item.id,
        itemId: item.id,
        jp: item.jp || '',
        romaji: item.romaji || '',
        meaning: item.meaning || '',
        reason,
        wrongCount: prevCount + 1,
        timestamp: Date.now()
      };
      if (existingIdx >= 0) state.wrongNotes[existingIdx] = entry;
      else state.wrongNotes.unshift(entry);
    }
    bumpTodayStudy(state, 1);
    saveCategory(state, targetCat);
  }

  function removeWrongNote(itemId, cat = activeCategory) {
    const state = loadCategory(cat);
    state.wrongNotes = state.wrongNotes.filter(w => w.itemId !== itemId && w.id !== itemId);
    saveCategory(state, cat);
  }

  function recordGameClear(score = 0, isTimeAttack = false, cat = activeCategory) {
    const state = loadCategory(cat);
    state.quizStats.gameClears = (state.quizStats.gameClears || 0) + 1;
    if (isTimeAttack && Number.isFinite(score)) {
      state.quizStats.bestScore = Math.max(state.quizStats.bestScore || 0, score);
    }
    bumpTodayStudy(state, 1);
    saveCategory(state, cat);
  }

  function markWritingSolved(index, cat = activeCategory) {
    const state = loadCategory(cat);
    state.writingSolved[String(index)] = true;
    bumpTodayStudy(state, 1);
    saveCategory(state, cat);
  }

  function getWritingSolvedCount(cat = activeCategory) {
    const solved = loadCategory(cat).writingSolved || {};
    return Object.values(solved).filter(Boolean).length;
  }

  function getReviewNeededItems(items = [], cat = activeCategory) {
    const state = loadCategory(cat);
    const wrongSet = new Set(state.wrongNotes.map(w => w.itemId || w.id));
    return (Array.isArray(items) ? items : []).filter(item => {
      if (!item || !item.id) return false;
      const st = state.statuses[item.id] || STATUS.UNLEARNED;
      return st === STATUS.HARD || wrongSet.has(item.id);
    });
  }

  // 핵심 수정: 단일 영역(또는 전달된 items)의 진도율 객체를 안전하게 반환 (NaN/undefined 원천 차단)
  function getCategoryProgress(items = [], cat = activeCategory) {
    const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
    const state = loadCategory(cat);
    const total = safeItems.length;
    let mastered = 0;
    let learning = 0;
    let hard = 0;
    let unlearned = 0;

    safeItems.forEach(item => {
      const st = state.statuses[item.id] || STATUS.UNLEARNED;
      if (st === STATUS.MASTERED) mastered += 1;
      else if (st === STATUS.LEARNING) learning += 1;
      else if (st === STATUS.HARD) hard += 1;
      else unlearned += 1;
    });

    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    const weightedPercent = total > 0 ? Math.round(((mastered + learning * 0.4 + hard * 0.2) / total) * 100) : 0;
    const totalAttempts = Number(state.quizStats.totalAttempts) || 0;
    const correctCount = Number(state.quizStats.correctCount) || 0;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

    return {
      total,
      mastered,
      learning,
      hard,
      unlearned,
      percent,
      weightedPercent,
      accuracy,
      totalAttempts,
      correctCount,
      bestScore: Number(state.quizStats.bestScore) || 0,
      favoritesCount: state.favorites.length,
      wrongCount: state.wrongNotes.length
    };
  }

  function resetCategory(cat = activeCategory) {
    const fresh = createDefaultCategoryState();
    saveCategory(fresh, cat);
    return fresh;
  }

  function resetAll() {
    CATEGORIES.forEach(c => saveCategory(createDefaultCategoryState(), c));
  }

  return {
    STATUS,
    STATUS_LABEL,
    STATUS_DISPLAY,
    CATEGORIES,
    setActiveCategory,
    getActiveCategory,
    getStatusDisplay,
    loadPreferences,
    savePreferences,
    loadCategory,
    saveCategory,
    load,
    save,
    getStatus,
    setStatus,
    touchItemAsSeen,
    isFavorite,
    toggleFavorite,
    recordQuiz,
    removeWrongNote,
    recordGameClear,
    markWritingSolved,
    getWritingSolvedCount,
    getReviewNeededItems,
    getCategoryProgress,
    resetCategory,
    resetAll
  };
})();
