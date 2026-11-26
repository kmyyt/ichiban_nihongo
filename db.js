// 학습 현황, 완료 항목, 퀴즈 점수, 테마 설정을 관리하는 로컬 DB 모듈
const DB = (() => {
  const STORAGE_KEY = 'jp_master_progress_v1';

  const defaultState = {
    theme: 'light',
    learnedIds: [],      // 학습 완료한 항목 ID 목록
    quizSolved: 0,       // 맞힌 퀴즈 수
    quizTotal: 0,        // 전체 푼 퀴즈 수
    gameClears: 0,       // 미니게임 클리어 횟수
    streakDays: 1,
    lastStudyDate: new Date().toISOString().slice(0, 10)
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      return { ...defaultState, ...JSON.parse(raw) };
    } catch (e) {
      return { ...defaultState };
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function toggleLearned(id) {
    const state = load();
    const idx = state.learnedIds.indexOf(id);
    if (idx === -1) {
      state.learnedIds.push(id);
    } else {
      state.learnedIds.splice(idx, 1);
    }
    state.lastStudyDate = new Date().toISOString().slice(0, 10);
    save(state);
    return state.learnedIds.includes(id);
  }

  function markLearned(id) {
    const state = load();
    if (!state.learnedIds.includes(id)) {
      state.learnedIds.push(id);
      save(state);
    }
  }

  function isLearned(id) {
    return load().learnedIds.includes(id);
  }

  function recordQuiz(isCorrect) {
    const state = load();
    state.quizTotal += 1;
    if (isCorrect) state.quizSolved += 1;
    save(state);
  }

  function recordGameClear() {
    const state = load();
    state.gameClears += 1;
    save(state);
  }

  function setTheme(theme) {
    const state = load();
    state.theme = theme;
    save(state);
  }

  function resetAll() {
    const currentTheme = load().theme;
    const fresh = { ...defaultState, theme: currentTheme };
    save(fresh);
    return fresh;
  }

  function getCategoryStats(allItems) {
    const state = load();
    const categories = [
      { key: 'all', label: '전체 학습 영역' },
      { key: 'hiragana', label: '히라가나' },
      { key: 'katakana', label: '가타카나' },
      { key: 'noun', label: '명사' },
      { key: 'i_adj', label: 'い형용사' },
      { key: 'na_adj', label: 'な형용사' },
      { key: 'verb', label: '동사' }
    ];

    return categories.map(cat => {
      const items = cat.key === 'all'
        ? allItems
        : allItems.filter(item => item.category === cat.key);
      const done = items.filter(item => state.learnedIds.includes(item.id)).length;
      const total = items.length;
      const percent = total === 0 ? 0 : Math.round((done / total) * 100);
      return { ...cat, done, total, percent };
    });
  }

  return {
    load,
    toggleLearned,
    markLearned,
    isLearned,
    recordQuiz,
    recordGameClear,
    setTheme,
    resetAll,
    getCategoryStats
  };
})();