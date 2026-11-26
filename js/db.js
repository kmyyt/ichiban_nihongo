// 사용자 학습 기록·상태·즐겨찾기·오답노트·통계 관리 모듈 (DB)
(function (global) {
  const STORAGE_KEY = 'jp_master_db_v3';

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

  const DEFAULT_STATE = {
    theme: 'light',
    hideMeanings: false,
    sidebarCollapsed: false,
    statuses: {},     // { [itemId]: 'unlearned' | 'learning' | 'hard' | 'mastered' }
    favorites: [],    // [itemId, ...]
    wrongNotes: [],   // [{ id, jp, romaji, meaning, category, mode, wrongCount, lastWrongAt }]
    quizStats: {
      totalAnswered: 0,
      correctCount: 0,
      bestTimeAttackScore: 0
    }
  };

  let memoryFallback = structuredClone(DEFAULT_STATE);

  function load() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        statuses: { ...(parsed.statuses || {}) },
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
        wrongNotes: Array.isArray(parsed.wrongNotes) ? parsed.wrongNotes : [],
        quizStats: {
          ...structuredClone(DEFAULT_STATE.quizStats),
          ...(parsed.quizStats || {})
        }
      };
    } catch (_) {
      return memoryFallback;
    }
  }

  function save(nextState) {
    memoryFallback = nextState;
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (_) {
      // 스토리지 접근 제한 환경 폴백
    }
    return nextState;
  }

  function getStatus(itemId) {
    const state = load();
    return state.statuses[itemId] || STATUS.UNLEARNED;
  }

  function setStatus(itemId, status) {
    if (!itemId || !STATUS_LABEL[status]) return load();
    const state = load();
    state.statuses[itemId] = status;
    return save(state);
  }

  // '미학습' 상태 문자를 확인했을 때만 '학습중'으로 자동 전환 ('어려움'/'암기완료'는 유지)
  function touchItemAsSeen(itemId) {
    if (!itemId) return load();
    const state = load();
    const cur = state.statuses[itemId] || STATUS.UNLEARNED;
    if (cur === STATUS.UNLEARNED) {
      state.statuses[itemId] = STATUS.LEARNING;
      return save(state);
    }
    return state;
  }

  function isFavorite(itemId) {
    return load().favorites.includes(itemId);
  }

  function toggleFavorite(itemId) {
    if (!itemId) return false;
    const state = load();
    const idx = state.favorites.indexOf(itemId);
    let active = false;
    if (idx === -1) {
      state.favorites.push(itemId);
      active = true;
    } else {
      state.favorites.splice(idx, 1);
      active = false;
    }
    save(state);
    return active;
  }

  function recordQuiz(isCorrect, item, modeLabel = '퀴즈') {
    const state = load();
    state.quizStats.totalAnswered += 1;

    if (isCorrect) {
      state.quizStats.correctCount += 1;
      if (item && item.id) {
        const cur = state.statuses[item.id] || STATUS.UNLEARNED;
        if (cur === STATUS.UNLEARNED) {
          state.statuses[item.id] = STATUS.LEARNING;
        }
      }
      return save(state);
    }

    // 오답 발생 시 '어려움' 상태(암기완료였던 경우도 복습 대상으로 전환) 및 오답노트 기록
    if (item && item.id) {
      const cur = state.statuses[item.id] || STATUS.UNLEARNED;
      if (cur !== STATUS.HARD) {
        state.statuses[item.id] = STATUS.HARD;
      }

      const existingIdx = state.wrongNotes.findIndex(w => w.id === item.id);
      if (existingIdx !== -1) {
        state.wrongNotes[existingIdx].wrongCount += 1;
        state.wrongNotes[existingIdx].mode = modeLabel;
        state.wrongNotes[existingIdx].lastWrongAt = new Date().toISOString();
      } else {
        state.wrongNotes.unshift({
          id: item.id,
          jp: item.jp,
          romaji: item.romaji || '',
          meaning: item.meaning || '',
          category: item.category || 'hiragana',
          mode: modeLabel,
          wrongCount: 1,
          lastWrongAt: new Date().toISOString()
        });
      }
    }

    return save(state);
  }

  function updateBestTimeAttackScore(score) {
    const state = load();
    if (score > (state.quizStats.bestTimeAttackScore || 0)) {
      state.quizStats.bestTimeAttackScore = score;
      save(state);
    }
  }

  function removeWrongNote(itemId) {
    const state = load();
    state.wrongNotes = state.wrongNotes.filter(w => w.id !== itemId);
    return save(state);
  }

  // '어려움' 상태 또는 오답노트에 등록된 항목 반환
  function getReviewNeededItems(allItems = []) {
    const state = load();
    const wrongIds = new Set(state.wrongNotes.map(w => w.id));
    return allItems.filter(item => {
      const st = state.statuses[item.id] || STATUS.UNLEARNED;
      return st === STATUS.HARD || wrongIds.has(item.id);
    });
  }

  // 카테고리별 진도율 계산 (암기완료 가중치 1.0, 학습중 가중치 0.4, 어려움 가중치 0.2)
  function getCategoryProgress(items = []) {
    if (!items.length) {
      return { total: 0, unlearned: 0, learning: 0, hard: 0, mastered: 0, percent: 0 };
    }
    const state = load();
    let unlearned = 0;
    let learning = 0;
    let hard = 0;
    let mastered = 0;
    let scoreSum = 0;

    items.forEach(item => {
      const st = state.statuses[item.id] || STATUS.UNLEARNED;
      if (st === STATUS.MASTERED) {
        mastered += 1;
        scoreSum += 1;
      } else if (st === STATUS.HARD) {
        hard += 1;
        scoreSum += 0.2;
      } else if (st === STATUS.LEARNING) {
        learning += 1;
        scoreSum += 0.4;
      } else {
        unlearned += 1;
      }
    });

    const percent = Math.round((scoreSum / items.length) * 100);
    return {
      total: items.length,
      unlearned,
      learning,
      hard,
      mastered,
      percent
    };
  }

  function resetAll() {
    const fresh = structuredClone(DEFAULT_STATE);
    fresh.theme = load().theme;
    return save(fresh);
  }

  global.DB = {
    STATUS,
    STATUS_LABEL,
    load,
    save,
    getStatus,
    setStatus,
    touchItemAsSeen,
    isFavorite,
    toggleFavorite,
    recordQuiz,
    updateBestTimeAttackScore,
    removeWrongNote,
    getReviewNeededItems,
    getCategoryProgress,
    resetAll
  };
})(window);