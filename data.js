// LocalStorage 기반 학습 상태·즐겨찾기·오답노트·복습필요·통계 관리 모듈
const DB = (() => {
  const STORAGE_KEY = 'jp_master_v2_db_v1';

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

  function createDefaultState() {
    return {
      theme: 'light',
      hideMeaning: false,
      sidebarCollapsed: false,
      statuses: {},     // { [itemId]: 'unlearned' | 'learning' | 'hard' | 'mastered' }
      favorites: [],    // [itemId, ...]
      wrongNotes: {},   // { [itemId]: { id, jp, romaji, meaning, category, wrongCount, lastReason, updatedAt } }
      quizTotal: 0,
      quizSolved: 0,
      gameClears: 0,
      bestTimeAttackScore: 0
    };
  }

  function load() {
    const base = createDefaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      return {
        ...base,
        ...parsed,
        statuses: { ...(parsed.statuses || {}) },
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
        wrongNotes: { ...(parsed.wrongNotes || {}) }
      };
    } catch (e) {
      console.warn('DB 로드 실패, 기본값 사용:', e);
      return base;
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('DB 저장 실패:', e);
    }
  }

  function setTheme(theme) {
    const st = load();
    st.theme = theme === 'dark' ? 'dark' : 'light';
    save(st);
  }

  function setHideMeaning(hidden) {
    const st = load();
    st.hideMeaning = !!hidden;
    save(st);
  }

  function setSidebarCollapsed(collapsed) {
    const st = load();
    st.sidebarCollapsed = !!collapsed;
    save(st);
  }

  function getStatus(id) {
    const st = load();
    return st.statuses[id] || STATUS.UNLEARNED;
  }

  function setStatus(id, nextStatus) {
    if (!id || !STATUS_LABEL[nextStatus]) return;
    const st = load();
    if (nextStatus === STATUS.UNLEARNED) {
      delete st.statuses[id];
    } else {
      st.statuses[id] = nextStatus;
    }
    save(st);
  }

  // '미학습' 상태 항목을 확인/학습했을 때 자동으로 '학습중' 전환 (어려움·암기완료는 유지)
  function touchItemAsSeen(id) {
    if (!id) return STATUS.LEARNING;
    const st = load();
    const cur = st.statuses[id] || STATUS.UNLEARNED;
    if (cur === STATUS.UNLEARNED) {
      st.statuses[id] = STATUS.LEARNING;
      save(st);
      return STATUS.LEARNING;
    }
    return cur;
  }

  function isFavorite(id) {
    const st = load();
    return st.favorites.includes(id);
  }

  function toggleFavorite(id) {
    if (!id) return false;
    const st = load();
    const idx = st.favorites.indexOf(id);
    let active = false;
    if (idx >= 0) {
      st.favorites.splice(idx, 1);
      active = false;
    } else {
      st.favorites.push(id);
      active = true;
    }
    save(st);
    return active;
  }

  function recordQuiz(isCorrect, item, reason = '퀴즈') {
    const st = load();
    st.quizTotal += 1;

    if (isCorrect) {
      st.quizSolved += 1;
      if (item && item.id) {
        const cur = st.statuses[item.id] || STATUS.UNLEARNED;
        if (cur === STATUS.UNLEARNED) {
          st.statuses[item.id] = STATUS.LEARNING;
        }
      }
    } else if (item && item.id) {
      const prev = st.wrongNotes[item.id] || {
        id: item.id,
        jp: item.jp,
        romaji: item.romaji || '',
        meaning: item.meaning || '',
        category: item.category || 'hiragana',
        wrongCount: 0,
        lastReason: reason,
        updatedAt: Date.now()
      };
      st.wrongNotes[item.id] = {
        ...prev,
        jp: item.jp || prev.jp,
        romaji: item.romaji || prev.romaji,
        meaning: item.meaning || prev.meaning,
        category: item.category || prev.category,
        wrongCount: prev.wrongCount + 1,
        lastReason: reason,
        updatedAt: Date.now()
      };

      // 오답 발생 시 '암기완료'가 아니라면 '어려움'으로 승격해 복습 대상에 포함
      const curStatus = st.statuses[item.id] || STATUS.UNLEARNED;
      if (curStatus !== STATUS.MASTERED) {
        st.statuses[item.id] = STATUS.HARD;
      }
    }

    save(st);
  }

  function removeWrongNote(id) {
    const st = load();
    if (st.wrongNotes[id]) {
      delete st.wrongNotes[id];
      save(st);
    }
  }

  function getWrongNotes() {
    const st = load();
    return Object.values(st.wrongNotes).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  function recordGameClear(score = 0, isTimeAttack = false) {
    const st = load();
    st.gameClears += 1;
    if (isTimeAttack && score > (st.bestTimeAttackScore || 0)) {
      st.bestTimeAttackScore = score;
    }
    save(st);
  }

  // '어려움' 상태이거나 오답노트에 기록된 복습필요 항목 반환
  function getReviewNeededItems(allItems = []) {
    const st = load();
    const wrongIds = new Set(Object.keys(st.wrongNotes));
    return allItems.filter(item => {
      const status = st.statuses[item.id] || STATUS.UNLEARNED;
      return status === STATUS.HARD || wrongIds.has(item.id);
    });
  }

  // 전체 및 카테고리별 진도율 계산 (암기완료 1.0, 학습중·어려움 0.5 가중치 반영 + 암기완료 비율 병기 가능)
  function getCategoryStats(allItems = []) {
    const st = load();
    const categories = [
      { key: 'all', label: '전체 학습' },
      { key: 'hiragana', label: '히라가나' },
      { key: 'katakana', label: '가타카나' },
      { key: 'noun', label: '명사' },
      { key: 'i_adj', label: 'い형용사' },
      { key: 'na_adj', label: 'な형용사' },
      { key: 'verb', label: '동사' }
    ];

    return categories.map(cat => {
      const list = cat.key === 'all'
        ? allItems
        : allItems.filter(item => item.category === cat.key);
      const total = list.length;
      let mastered = 0;
      let learning = 0;
      let hard = 0;

      list.forEach(item => {
        const s = st.statuses[item.id] || STATUS.UNLEARNED;
        if (s === STATUS.MASTERED) mastered += 1;
        else if (s === STATUS.LEARNING) learning += 1;
        else if (s === STATUS.HARD) hard += 1;
      });

      const weighted = mastered + (learning + hard) * 0.5;
      const percent = total === 0 ? 0 : Math.round((weighted / total) * 100);
      const masteredPercent = total === 0 ? 0 : Math.round((mastered / total) * 100);

      return {
        key: cat.key,
        label: cat.label,
        total,
        done: mastered,
        learning,
        hard,
        percent,
        masteredPercent
      };
    });
  }

  function resetAll() {
    const currentTheme = load().theme;
    const fresh = createDefaultState();
    fresh.theme = currentTheme;
    save(fresh);
  }

  return {
    STATUS,
    STATUS_LABEL,
    load,
    save,
    setTheme,
    setHideMeaning,
    setSidebarCollapsed,
    getStatus,
    setStatus,
    touchItemAsSeen,
    isFavorite,
    toggleFavorite,
    recordQuiz,
    removeWrongNote,
    getWrongNotes,
    recordGameClear,
    getReviewNeededItems,
    getCategoryStats,
    resetAll
  };
})();
