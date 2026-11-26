// 학습 상태(4단계), 즐겨찾기, 오답노트, 복습필요, 진도율을 관리하는 로컬 DB 모듈
const DB = (() => {
  const STORAGE_KEY = 'jp_master_progress_v2';

  // 상태 상수: unlearned(미학습) -> learning(학습중) / hard(어려움) / mastered(암기완료)
  const STATUS = {
    UNLEARNED: 'unlearned',
    LEARNING: 'learning',
    HARD: 'hard',
    MASTERED: 'mastered'
  };

  const STATUS_LABEL = {
    unlearned: '미학습',
    learning: '학습중',
    hard: '어려움',
    mastered: '암기완료'
  };

  const defaultState = {
    theme: 'light',
    hideMeaning: false,
    sidebarCollapsed: false,
    statuses: {},        // { [itemId]: 'unlearned' | 'learning' | 'hard' | 'mastered' }
    favorites: [],       // 즐겨찾기 itemId 배열
    wrongNotes: {},      // { [itemId]: { id, jp, romaji, meaning, category, wrongCount, lastWrongAt, reason } }
    quizSolved: 0,
    quizTotal: 0,
    gameClears: 0,
    lastStudyDate: new Date().toISOString().slice(0, 10)
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        statuses: { ...(parsed.statuses || {}) },
        wrongNotes: { ...(parsed.wrongNotes || {}) },
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : []
      };
    } catch (e) {
      return { ...defaultState };
    }
  }

  function save(state) {
    state.lastStudyDate = new Date().toISOString().slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getStatus(id) {
    const state = load();
    return state.statuses[id] || STATUS.UNLEARNED;
  }

  function setStatus(id, nextStatus) {
    if (!id || !STATUS_LABEL[nextStatus]) return;
    const state = load();
    state.statuses[id] = nextStatus;
    // 암기완료로 전환 시 오답노트에서 제거할지 선택 가능(여기서는 복습필요/어려움과 별도로 관리)
    save(state);
    return nextStatus;
  }

  // 미학습 항목을 퀴즈·상세팝업·학습탭 등에서 한 번이라도 확인하면 자동으로 '학습중'으로 전환
  function touchItemAsSeen(id) {
    if (!id) return STATUS.UNLEARNED;
    const state = load();
    const current = state.statuses[id] || STATUS.UNLEARNED;
    if (current === STATUS.UNLEARNED) {
      state.statuses[id] = STATUS.LEARNING;
      save(state);
      return STATUS.LEARNING;
    }
    return current;
  }

  function isLearned(id) {
    const st = getStatus(id);
    return st === STATUS.MASTERED;
  }

  function toggleLearned(id) {
    const current = getStatus(id);
    const next = current === STATUS.MASTERED ? STATUS.LEARNING : STATUS.MASTERED;
    setStatus(id, next);
    return next === STATUS.MASTERED;
  }

  function isFavorite(id) {
    return load().favorites.includes(id);
  }

  function toggleFavorite(id) {
    const state = load();
    const idx = state.favorites.indexOf(id);
    let active = false;
    if (idx === -1) {
      state.favorites.push(id);
      active = true;
    } else {
      state.favorites.splice(idx, 1);
      active = false;
    }
    save(state);
    return active;
  }

  function recordWrongAnswer(item, reason = '퀴즈 오답') {
    if (!item || !item.id) return;
    const state = load();
    const prev = state.wrongNotes[item.id];
    state.wrongNotes[item.id] = {
      id: item.id,
      jp: item.jp,
      romaji: item.romaji || '',
      meaning: item.meaning || '',
      category: item.category || 'hiragana',
      wrongCount: prev ? prev.wrongCount + 1 : 1,
      lastWrongAt: new Date().toISOString().slice(0, 10),
      reason
    };
    // 틀린 항목은 최소 '어려움' 상태로 기록
    if ((state.statuses[item.id] || STATUS.UNLEARNED) !== STATUS.MASTERED) {
      state.statuses[item.id] = STATUS.HARD;
    }
    save(state);
  }

  function removeWrongNote(id) {
    const state = load();
    delete state.wrongNotes[id];
    save(state);
  }

  function getWrongNotes() {
    return Object.values(load().wrongNotes).sort((a, b) => b.wrongCount - a.wrongCount);
  }

  // 복습필요 항목: 상태가 'hard(어려움)'이거나 wrongNotes에 등록된 항목
  function getReviewNeededItems(allItems) {
    const state = load();
    const wrongIds = new Set(Object.keys(state.wrongNotes));
    return allItems.filter(item => {
      const st = state.statuses[item.id] || STATUS.UNLEARNED;
      return st === STATUS.HARD || wrongIds.has(item.id);
    });
  }

  function recordQuiz(isCorrect, item = null, reason = '퀴즈 오답') {
    const state = load();
    state.quizTotal += 1;
    if (isCorrect) {
      state.quizSolved += 1;
      if (item && (state.statuses[item.id] || STATUS.UNLEARNED) === STATUS.UNLEARNED) {
        state.statuses[item.id] = STATUS.LEARNING;
      }
    } else if (item) {
      const prev = state.wrongNotes[item.id];
      state.wrongNotes[item.id] = {
        id: item.id,
        jp: item.jp,
        romaji: item.romaji || '',
        meaning: item.meaning || '',
        category: item.category || 'hiragana',
        wrongCount: prev ? prev.wrongCount + 1 : 1,
        lastWrongAt: new Date().toISOString().slice(0, 10),
        reason
      };
      if ((state.statuses[item.id] || STATUS.UNLEARNED) !== STATUS.MASTERED) {
        state.statuses[item.id] = STATUS.HARD;
      }
    }
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

  function setHideMeaning(hidden) {
    const state = load();
    state.hideMeaning = !!hidden;
    save(state);
  }

  function setSidebarCollapsed(collapsed) {
    const state = load();
    state.sidebarCollapsed = !!collapsed;
    save(state);
  }

  function resetAll() {
    const prev = load();
    const fresh = {
      ...defaultState,
      theme: prev.theme,
      hideMeaning: prev.hideMeaning,
      sidebarCollapsed: prev.sidebarCollapsed,
      statuses: {},
      favorites: [],
      wrongNotes: {}
    };
    save(fresh);
    return fresh;
  }

  // 진도율 계산: 암기완료(1.0 가중치) + 학습중/어려움(0.5 가중치)을 기준으로 숙련도/암기율 산출
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

      let unlearned = 0;
      let learning = 0;
      let hard = 0;
      let mastered = 0;

      items.forEach(item => {
        const st = state.statuses[item.id] || STATUS.UNLEARNED;
        if (st === STATUS.MASTERED) mastered += 1;
        else if (st === STATUS.HARD) hard += 1;
        else if (st === STATUS.LEARNING) learning += 1;
        else unlearned += 1;
      });

      const total = items.length;
      // 순수 암기완료율과 학습참여(학습중/어려움 50% + 암기완료 100%) 진도율 모두 제공
      const masteredPercent = total === 0 ? 0 : Math.round((mastered / total) * 100);
      const progressPercent = total === 0
        ? 0
        : Math.round(((mastered + (learning + hard) * 0.5) / total) * 100);

      return {
        ...cat,
        done: mastered,
        learning,
        hard,
        unlearned,
        mastered,
        total,
        percent: progressPercent,
        masteredPercent
      };
    });
  }

  return {
    STATUS,
    STATUS_LABEL,
    load,
    getStatus,
    setStatus,
    touchItemAsSeen,
    toggleLearned,
    isLearned,
    toggleFavorite,
    isFavorite,
    recordWrongAnswer,
    removeWrongNote,
    getWrongNotes,
    getReviewNeededItems,
    recordQuiz,
    recordGameClear,
    setTheme,
    setHideMeaning,
    setSidebarCollapsed,
    resetAll,
    getCategoryStats
  };
})();
