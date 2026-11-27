// 학습 상태·진도·퀴즈 기록을 localStorage에 관리하는 DB 모듈
const DB = (() => {
  const STORAGE_KEY = 'jp_study_db_v1';

  const STATUS = {
    UNLEARNED: 'unlearned',
    LEARNING: 'learning',
    HARD: 'hard',
    MASTERED: 'mastered'
  };

  // 기존 라벨 유지
  const STATUS_LABEL = {
    [STATUS.UNLEARNED]: '미학습',
    [STATUS.LEARNING]: '학습중',
    [STATUS.HARD]: '어려움',
    [STATUS.MASTERED]: '암기완료'
  };

  // 문맥별 상태 표기 설정
  // 50음도표(isChart = true): 아이콘만 표시 (❌️, ❗️, ✅️, 🔥)
  // 그 외 화면(isChart = false): ❌ 미학습 / ❗️ 학습중 / ✅ 학습완료 / 🔥 어려움
  const STATUS_DISPLAY = {
    [STATUS.UNLEARNED]: { chartIcon: '❌️', icon: '❌', text: '미학습' },
    [STATUS.LEARNING]:  { chartIcon: '❗️', icon: '❗️', text: '학습중' },
    [STATUS.HARD]:      { chartIcon: '🔥', icon: '🔥', text: '어려움' },
    [STATUS.MASTERED]:  { chartIcon: '✅️', icon: '✅', text: '학습완료' }
  };

  function getStatusDisplay(statusKey, isChart = false) {
    const key = Object.prototype.hasOwnProperty.call(STATUS_DISPLAY, statusKey)
      ? statusKey
      : STATUS.UNLEARNED;
    const entry = STATUS_DISPLAY[key];
    return isChart ? entry.chartIcon : `${entry.icon} ${entry.text}`;
  }

  function getStatusIcon(statusKey, isChart = false) {
    const key = Object.prototype.hasOwnProperty.call(STATUS_DISPLAY, statusKey)
      ? statusKey
      : STATUS.UNLEARNED;
    const entry = STATUS_DISPLAY[key];
    return isChart ? entry.chartIcon : entry.icon;
  }

  function getTodayKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function createDefaultState() {
    return {
      statuses: {},       // { [itemId]: 'unlearned' | 'learning' | 'hard' | 'mastered' }
      favorites: [],      // [itemId, ...]
      lastReviewed: {},   // { [itemId]: timestamp }
      wrongNotes: [],     // [{ id, itemId, jp, romaji, meaning, reason, timestamp }]
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
      },
      preferences: {
        theme: 'light',
        hideMeaning: false,
        sidebarCollapsed: false
      }
    };
  }

  function normalizeState(raw) {
    const def = createDefaultState();
    if (!raw || typeof raw !== 'object') return def;

    const merged = {
      ...def,
      ...raw,
      statuses: raw.statuses && typeof raw.statuses === 'object' ? raw.statuses : {},
      favorites: Array.isArray(raw.favorites) ? raw.favorites : [],
      lastReviewed: raw.lastReviewed && typeof raw.lastReviewed === 'object' ? raw.lastReviewed : {},
      wrongNotes: Array.isArray(raw.wrongNotes) ? raw.wrongNotes : [],
      quizStats: {
        ...def.quizStats,
        ...(raw.quizStats && typeof raw.quizStats === 'object' ? raw.quizStats : {})
      },
      studyLog: {
        ...def.studyLog,
        ...(raw.studyLog && typeof raw.studyLog === 'object' ? raw.studyLog : {})
      },
      preferences: {
        ...def.preferences,
        ...(raw.preferences && typeof raw.preferences === 'object' ? raw.preferences : {})
      }
    };

    const today = getTodayKey();
    if (merged.studyLog.lastStudyDate !== today) {
      const prevDate = merged.studyLog.lastStudyDate ? new Date(`${merged.studyLog.lastStudyDate}T00:00:00`) : null;
      const curDate = new Date(`${today}T00:00:00`);
      const diffDays = prevDate ? Math.round((curDate - prevDate) / 86400000) : 0;

      if (diffDays === 1) {
        merged.studyLog.streakDays = (merged.studyLog.streakDays || 0) + 1;
      } else if (diffDays > 1) {
        merged.studyLog.streakDays = 1;
      } else if (!merged.studyLog.streakDays) {
        merged.studyLog.streakDays = 1;
      }
      merged.studyLog.lastStudyDate = today;
      merged.studyLog.todayCount = 0;
    }

    return merged;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      return normalizeState(JSON.parse(raw));
    } catch (e) {
      console.warn('DB 불러오기 오류, 기본값으로 복구합니다:', e);
      return createDefaultState();
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('DB 저장 오류:', e);
    }
  }

  function bumpTodayStudy(state, amount = 1) {
    const today = getTodayKey();
    if (state.studyLog.lastStudyDate !== today) {
      state.studyLog.lastStudyDate = today;
      state.studyLog.todayCount = 0;
    }
    state.studyLog.todayCount = (state.studyLog.todayCount || 0) + amount;
    if (!state.studyLog.streakDays || state.studyLog.streakDays < 1) {
      state.studyLog.streakDays = 1;
    }
  }

  function getStatus(itemId) {
    const state = load();
    return state.statuses[itemId] || STATUS.UNLEARNED;
  }

  function setStatus(itemId, nextStatus) {
    if (!itemId || !Object.values(STATUS).includes(nextStatus)) return;
    const state = load();
    state.statuses[itemId] = nextStatus;
    state.lastReviewed[itemId] = Date.now();
    bumpTodayStudy(state, 1);
    save(state);
  }

  function touchItemAsSeen(itemId) {
    if (!itemId) return;
    const state = load();
    state.lastReviewed[itemId] = Date.now();
    if (!state.statuses[itemId] || state.statuses[itemId] === STATUS.UNLEARNED) {
      state.statuses[itemId] = STATUS.LEARNING;
      bumpTodayStudy(state, 1);
    }
    save(state);
  }

  function isFavorite(itemId) {
    const state = load();
    return state.favorites.includes(itemId);
  }

  function toggleFavorite(itemId) {
    if (!itemId) return false;
    const state = load();
    const idx = state.favorites.indexOf(itemId);
    let active = false;
    if (idx >= 0) {
      state.favorites.splice(idx, 1);
      active = false;
    } else {
      state.favorites.push(itemId);
      active = true;
    }
    save(state);
    return active;
  }

  function recordQuiz(isCorrect, item, reason = '퀴즈 오답') {
    const state = load();
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
      const entry = {
        id: existingIdx >= 0 ? state.wrongNotes[existingIdx].id : `${item.id}_${Date.now()}`,
        itemId: item.id,
        jp: item.jp || '',
        romaji: item.romaji || '',
        meaning: item.meaning || '',
        reason,
        timestamp: Date.now()
      };
      if (existingIdx >= 0) {
        state.wrongNotes[existingIdx] = entry;
      } else {
        state.wrongNotes.unshift(entry);
      }
    }
    bumpTodayStudy(state, 1);
    save(state);
  }

  function removeWrongNote(itemId) {
    const state = load();
    state.wrongNotes = state.wrongNotes.filter(w => w.itemId !== itemId);
    save(state);
  }

  function recordGameClear(score = 0, isTimeAttack = false) {
    const state = load();
    state.quizStats.gameClears = (state.quizStats.gameClears || 0) + 1;
    if (isTimeAttack && typeof score === 'number') {
      state.quizStats.bestScore = Math.max(state.quizStats.bestScore || 0, score);
    }
    bumpTodayStudy(state, 1);
    save(state);
  }

  function getReviewNeededItems(allItems = []) {
    const state = load();
    const now = Date.now();
    const oneDayMs = 86400000;
    const wrongSet = new Set(state.wrongNotes.map(w => w.itemId));

    return allItems.filter(item => {
      const st = state.statuses[item.id] || STATUS.UNLEARNED;
      if (st === STATUS.HARD || wrongSet.has(item.id)) return true;
      if (st === STATUS.LEARNING) {
        const last = state.lastReviewed[item.id] || 0;
        return now - last >= oneDayMs;
      }
      return false;
    });
  }

  function getProgressSummary(allItems = []) {
    const state = load();
    const total = allItems.length;
    let mastered = 0;
    let learning = 0;
    let hard = 0;
    let unlearned = 0;

    allItems.forEach(item => {
      const st = state.statuses[item.id] || STATUS.UNLEARNED;
      if (st === STATUS.MASTERED) mastered += 1;
      else if (st === STATUS.LEARNING) learning += 1;
      else if (st === STATUS.HARD) hard += 1;
      else unlearned += 1;
    });

    const accuracy = state.quizStats.totalAttempts > 0
      ? Math.round((state.quizStats.correctCount / state.quizStats.totalAttempts) * 100)
      : 0;

    return {
      total,
      mastered,
      learning,
      hard,
      unlearned,
      masteredPercent: total > 0 ? Math.round((mastered / total) * 100) : 0,
      overallPercent: total > 0 ? Math.round(((mastered + (learning + hard) * 0.5) / total) * 100) : 0,
      favoritesCount: state.favorites.length,
      wrongCount: state.wrongNotes.length,
      accuracy,
      streakDays: state.studyLog.streakDays || 1,
      todayCount: state.studyLog.todayCount || 0,
      gameClears: state.quizStats.gameClears || 0,
      bestScore: state.quizStats.bestScore || 0
    };
  }

  function getCategoryProgress(allItems = []) {
    const categories = [
      { key: 'hiragana', label: '히라가나 (50음도)' },
      { key: 'katakana', label: '가타카나' },
      { key: 'noun', label: '명사' },
      { key: 'i_adj', label: 'い형용사' },
      { key: 'na_adj', label: 'な형용사' },
      { key: 'verb', label: '동사' }
    ];

    return categories.map(cat => {
      const list = allItems.filter(i => i.category === cat.key);
      const summary = getProgressSummary(list);
      return {
        ...cat,
        ...summary
      };
    });
  }

  function getPreferences() {
    return load().preferences;
  }

  function updatePreferences(partial = {}) {
    const state = load();
    state.preferences = {
      ...state.preferences,
      ...partial
    };
    save(state);
    return state.preferences;
  }

  function exportData() {
    return JSON.stringify(load(), null, 2);
  }

  function importData(jsonText) {
    const parsed = JSON.parse(jsonText);
    const normalized = normalizeState(parsed);
    save(normalized);
    return normalized;
  }

  function resetAll() {
    const fresh = createDefaultState();
    save(fresh);
    return fresh;
  }

  return {
    STATUS,
    STATUS_LABEL,
    STATUS_DISPLAY,
    getStatusDisplay,
    getStatusIcon,
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
    getReviewNeededItems,
    getProgressSummary,
    getCategoryProgress,
    getPreferences,
    updatePreferences,
    exportData,
    importData,
    resetAll
  };
})();
