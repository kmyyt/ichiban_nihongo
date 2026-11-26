// 메인 컨트롤러: 내비게이션, 단축키, 뜻 가림, TTS, 대시보드·유틸리티(즐겨찾기·오답노트·복습필요·사용법), 문법·작문 관리
document.addEventListener('DOMContentLoaded', () => {
  let activeTab = 'dashboard';
  let activeCategory = 'hiragana';
  let activeDashUtil = 'favorites';

  function getAllItems() {
    if (window.ContentDB && typeof window.ContentDB.getAllItems === 'function') {
      return window.ContentDB.getAllItems();
    }
    return (window.JP_DATA && window.JP_DATA.items) || [];
  }

  function getGrammarLessons() {
    if (window.ContentDB && Array.isArray(window.ContentDB.grammarLessons)) {
      return window.ContentDB.grammarLessons;
    }
    return (window.JP_DATA && window.JP_DATA.grammarLessons) || [];
  }

  function getWritingExercises() {
    if (window.ContentDB && Array.isArray(window.ContentDB.writingExercises)) {
      return window.ContentDB.writingExercises;
    }
    return (window.JP_DATA && window.JP_DATA.writingExercises) || [];
  }

  // ==================== 1. 테마·뜻가림·사이드바 초기화 ====================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    DB.setTheme(theme);
    const desktopBtn = document.getElementById('themeToggleDesktop');
    const mobileBtn = document.getElementById('themeToggleMobile');
    if (desktopBtn) desktopBtn.textContent = theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
    if (mobileBtn) mobileBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function applyHideMeaning(hidden) {
    document.body.classList.toggle('hide-meaning', !!hidden);
    DB.setHideMeaning(!!hidden);
    const toggle = document.getElementById('hideMeaningToggle');
    if (toggle) toggle.checked = !!hidden;
  }

  function applySidebarCollapsed(collapsed) {
    const sidebar = document.getElementById('pcSidebar');
    const btn = document.getElementById('sidebarToggleBtn');
    sidebar?.classList.toggle('collapsed', !!collapsed);
    if (btn) btn.textContent = collapsed ? '▶' : '◀';
    DB.setSidebarCollapsed(!!collapsed);
  }

  const savedState = DB.load();
  applyTheme(savedState.theme);
  applyHideMeaning(savedState.hideMeaning);
  applySidebarCollapsed(savedState.sidebarCollapsed);

  document.getElementById('themeToggleDesktop')?.addEventListener('click', toggleTheme);
  document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);

  document.getElementById('hideMeaningToggle')?.addEventListener('change', e => {
    applyHideMeaning(e.target.checked);
  });

  // 가려진 뜻(.meaning-mask)을 직접 클릭하면 일시적으로 확인 가능
  document.addEventListener('click', e => {
    const mask = e.target.closest('.meaning-mask');
    if (mask && document.body.classList.contains('hide-meaning')) {
      mask.classList.toggle('revealed');
    }
  });

  document.getElementById('sidebarToggleBtn')?.addEventListener('click', () => {
    const isCollapsed = document.getElementById('pcSidebar')?.classList.contains('collapsed');
    applySidebarCollapsed(!isCollapsed);
  });

  // 상단 TTS 버튼
  document.getElementById('quickTtsBtn')?.addEventListener('click', () => {
    const text = activeTab === 'quiz'
      ? QuizModule.getActiveSpeakingText()
      : StudyModule.getActiveSpeakingText();
    StudyModule.speakText(text);
  });

  // ==================== 2. 탭 및 카테고리 전환 ====================
  function switchTopTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll('.top-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === activeTab);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${activeTab}`);
    });
    refreshCurrentView();
  }

  function switchCategory(catName, moveToStudy = false) {
    activeCategory = catName || 'hiragana';
    document.querySelectorAll('.cat-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === activeCategory);
    });
    StudyModule.setCategory(activeCategory);

    if (moveToStudy && activeTab !== 'study' && activeTab !== 'quiz') {
      switchTopTab('study');
      return;
    }
    refreshCurrentView();
  }

  // 홈 버튼(헤더 및 사이드바 브랜드) 클릭 시 대시보드로 이동
  document.querySelectorAll('.home-trigger').forEach(el => {
    el.addEventListener('click', () => switchTopTab('dashboard'));
  });

  // 상단 주요 메뉴 탭 클릭
  document.querySelectorAll('.top-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTopTab(btn.dataset.tab));
  });

  // PC 사이드바 & 모바일 하단 카테고리 탭 클릭
  document.querySelectorAll('.cat-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const moveToStudy = activeTab === 'dashboard' || activeTab === 'grammar' || activeTab === 'writing_comp';
      switchCategory(btn.dataset.cat, moveToStudy);
    });
  });

  // 히라가나 및 일반 카테고리 서브탭 클릭
  document.querySelectorAll('#hiraganaSubTabs .sub-btn, #generalSubTabs .sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      StudyModule.setMode(btn.dataset.mode);
      StudyModule.render(activeCategory, renderDashboard);
    });
  });

  // 퀴즈 및 미니게임 모드 탭 클릭
  document.querySelectorAll('.quiz-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      QuizModule.setMode(btn.dataset.qmode);
      QuizModule.render(activeCategory, renderDashboard);
    });
  });

  // ==================== 3. 대시보드 & 유틸리티 탭 ====================
  function renderDashboard() {
    const allItems = getAllItems();
    const state = DB.load();
    const stats = DB.getCategoryStats(allItems);
    const overall = stats[0];
    const hiraStat = stats.find(s => s.key === 'hiragana') || { percent: 0, done: 0, total: 46 };
    const accuracy = state.quizTotal === 0 ? 0 : Math.round((state.quizSolved / state.quizTotal) * 100);
    const reviewCount = DB.getReviewNeededItems(allItems).length;

    const statsEl = document.getElementById('dashboardStats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-box">
          <div class="stat-label">전체 진도율</div>
          <div class="stat-value">${overall.percent}%</div>
          <div class="hint-text" style="margin-top:4px;">암기완료 ${overall.done} / ${overall.total}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">히라가나 진도율</div>
          <div class="stat-value">${hiraStat.percent}%</div>
          <div class="hint-text" style="margin-top:4px;">암기완료 ${hiraStat.done} / ${hiraStat.total}자</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">퀴즈 정답률</div>
          <div class="stat-value">${accuracy}%</div>
          <div class="hint-text" style="margin-top:4px;">${state.quizSolved} / ${state.quizTotal} 문제 정답</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">즐겨찾기 / 복습필요</div>
          <div class="stat-value">⭐ ${state.favorites.length} · 🔁 ${reviewCount}</div>
          <div class="hint-text" style="margin-top:4px;">미니게임 클리어 ${state.gameClears}회</div>
        </div>
      `;
    }

    const progEl = document.getElementById('categoryProgressList');
    if (progEl) {
      progEl.innerHTML = stats.slice(1).map(s => `
        <div class="progress-item" data-jump-cat="${s.key}">
          <div class="progress-top">
            <strong>${s.label}</strong>
            <span>진도 ${s.percent}% (암기완료 ${s.done}/${s.total} · 학습중 ${s.learning} · 어려움 ${s.hard})</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${s.percent}%"></div>
          </div>
        </div>
      `).join('');

      progEl.querySelectorAll('.progress-item').forEach(row => {
        row.addEventListener('click', () => {
          switchCategory(row.dataset.jumpCat, true);
        });
      });
    }

    renderDashboardUtil();
  }

  function renderDashboardUtil() {
    const utilContainer = document.getElementById('dashboardUtilContent');
    if (!utilContainer) return;

    document.querySelectorAll('.dash-util-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.util === activeDashUtil);
    });

    const allItems = getAllItems();
    const byId = new Map(allItems.map(i => [i.id, i]));
    const state = DB.load();

    if (activeDashUtil === 'favorites') {
      const favItems = state.favorites.map(id => byId.get(id)).filter(Boolean);
      if (!favItems.length) {
        utilContainer.innerHTML = `<p class="hint-text">아직 즐겨찾기한 문자나 단어가 없습니다. 50음도 타일이나 상세 팝업에서 ☆를 눌러 추가해보세요.</p>`;
        return;
      }
      utilContainer.innerHTML = `
        <div class="util-item-grid">
          ${favItems.map(item => `
            <div class="util-mini-card">
              <div>
                <strong class="jp-font" style="font-size:1.25rem;">${item.emoji ? item.emoji + ' ' : ''}${item.jp}</strong>
                <span style="font-size:0.84rem; color:var(--text-secondary); margin-left:6px;">[${item.romaji}]</span>
                <div class="meaning-mask" style="font-size:0.86rem;">${item.meaning}</div>
              </div>
              <div class="btn-row">
                <button type="button" class="secondary-btn fav-tts-btn" data-tts="${item.jp}" style="padding:5px 9px; font-size:0.78rem;">🔊</button>
                <button type="button" class="primary-btn fav-go-btn" data-id="${item.id}" data-cat="${item.category}" style="padding:5px 9px; font-size:0.78rem;">학습</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      utilContainer.querySelectorAll('.fav-tts-btn').forEach(b => {
        b.addEventListener('click', () => StudyModule.speakText(b.dataset.tts));
      });
      utilContainer.querySelectorAll('.fav-go-btn').forEach(b => {
        b.addEventListener('click', () => {
          switchCategory(b.dataset.cat, false);
          StudyModule.setMode('stroke', b.dataset.id);
          switchTopTab('study');
        });
      });
    } else if (activeDashUtil === 'wrong') {
      const wrongList = DB.getWrongNotes();
      if (!wrongList.length) {
        utilContainer.innerHTML = `<p class="hint-text">기록된 오답이 없습니다. 퀴즈나 미니게임에서 틀린 문제가 자동으로 이곳에 모입니다.</p>`;
        return;
      }
      utilContainer.innerHTML = `
        <div class="util-item-grid">
          ${wrongList.map(w => `
            <div class="util-mini-card">
              <div>
                <strong class="jp-font" style="font-size:1.25rem;">${w.jp}</strong>
                <span style="font-size:0.82rem; color:var(--danger); margin-left:6px;">오답 ${w.wrongCount}회</span>
                <div class="meaning-mask" style="font-size:0.86rem;">${w.romaji} · ${w.meaning}</div>
              </div>
              <button type="button" class="secondary-btn del-wrong-btn" data-id="${w.id}" style="padding:5px 9px; font-size:0.78rem;">해제</button>
            </div>
          `).join('')}
        </div>
      `;

      utilContainer.querySelectorAll('.del-wrong-btn').forEach(b => {
        b.addEventListener('click', () => {
          DB.removeWrongNote(b.dataset.id);
          renderDashboard();
        });
      });
    } else if (activeDashUtil === 'review') {
      const reviewItems = DB.getReviewNeededItems(allItems);
      if (!reviewItems.length) {
        utilContainer.innerHTML = `<p class="hint-text">현재 복습이 필요한 항목이 없습니다. '어려움' 상태이거나 퀴즈에서 틀린 항목이 이곳에 표시됩니다.</p>`;
        return;
      }
      utilContainer.innerHTML = `
        <div class="util-item-grid">
          ${reviewItems.map(item => `
            <div class="util-mini-card">
              <div>
                <strong class="jp-font" style="font-size:1.25rem;">${item.jp}</strong>
                <span style="font-size:0.82rem; color:var(--st-hard); margin-left:6px;">${DB.STATUS_LABEL[DB.getStatus(item.id)]}</span>
                <div class="meaning-mask" style="font-size:0.86rem;">${item.romaji} · ${item.meaning}</div>
              </div>
              <button type="button" class="primary-btn rev-study-btn" data-id="${item.id}" data-cat="${item.category}" style="padding:5px 9px; font-size:0.78rem;">복습</button>
            </div>
          `).join('')}
        </div>
      `;

      utilContainer.querySelectorAll('.rev-study-btn').forEach(b => {
        b.addEventListener('click', () => {
          switchCategory(b.dataset.cat, false);
          StudyModule.setMode('flashcard', b.dataset.id);
          switchTopTab('study');
        });
      });
    } else if (activeDashUtil === 'guide') {
      utilContainer.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px; font-size:0.9rem; line-height:1.55;">
          <div><strong>1. 상단 & 영역 탭:</strong> 상단 메뉴(대시보드, 학습하기, 퀴즈 및 게임, 문법, 작문)와 PC 좌측 사이드바 / 모바일 하단 영역 탭(히라가나, 가타카나, 명사, い형용사, な형용사, 동사)을 조합해 이동할 수 있습니다.</div>
          <div><strong>2. 히라가나 학습 흐름:</strong> 상단 진도표에서 암기율·즐겨찾기·복습필요를 확인하고, 50음도 타일을 눌러 상세 팝업·플래시카드·정밀 SVG 획순 및 따라쓰기·연상 암기(3지선다)·문자별 단어/예문을 학습하세요.</div>
          <div><strong>3. 뜻 가림 & TTS:</strong> 상단의 <strong>뜻 가림</strong> 슬라이드로 한국어 뜻을 숨겨 자가 테스트할 수 있으며, <strong>TTS</strong> 버튼으로 일본어 발음을 들을 수 있습니다.</div>
          <div><strong>4. 퀴즈 & 미니게임:</strong> 4지선다 60초 타임어택, 글자타일 선택, 그림 직접 입력, 카드 짝 맞추기를 즐기면 틀린 문제가 오답노트와 복습필요 목록에 자동 반영됩니다.</div>
        </div>
      `;
    }
  }

  document.querySelectorAll('.dash-util-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeDashUtil = btn.dataset.util;
      renderDashboardUtil();
    });
  });

  // ==================== 4. 문법 및 작문 탭 렌더링 ====================
  function renderGrammarTab() {
    const el = document.getElementById('grammarContainer');
    if (!el) return;
    const lessons = getGrammarLessons();
    el.innerHTML = lessons.map(lesson => `
      <div class="card">
        <span class="badge-v2">${lesson.stage}</span>
        <h3 style="margin-bottom:8px;">${lesson.title}</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:12px;">${lesson.desc}</p>
        <div class="jp-font" style="padding:10px 12px; border-radius:10px; background:var(--accent-soft); font-size:0.92rem;">
          예시: ${lesson.sample}
        </div>
      </div>
    `).join('');
  }

  function renderWritingCompTab() {
    const el = document.getElementById('writingCompContainer');
    if (!el) return;
    const exercises = getWritingExercises();

    el.innerHTML = exercises.map((ex, idx) => `
      <div class="card">
        <div class="card-title-row">
          <strong>작문 문제 ${idx + 1}</strong>
          <button type="button" class="secondary-btn comp-tts-btn" data-tts="${ex.answer}">🔊 정답 발음 듣기</button>
        </div>
        <p style="font-size:1.05rem; font-weight:700; margin-bottom:6px;">한국어: ${ex.ko}</p>
        <p class="hint-text" style="margin-bottom:10px;">힌트: ${ex.hint}</p>
        <input type="text" class="quiz-input jp-font comp-input" data-idx="${idx}" placeholder="일본어 문장을 입력하세요" style="max-width:100%; text-align:left;" />
        <div class="btn-row" style="justify-content:flex-start;">
          <button type="button" class="primary-btn comp-check-btn" data-idx="${idx}">정답 확인</button>
          <button type="button" class="secondary-btn comp-show-btn" data-idx="${idx}">모범 답안 보기</button>
        </div>
        <div class="comp-feedback" id="compFb_${idx}" style="margin-top:10px; font-weight:700;"></div>
      </div>
    `).join('');

    el.querySelectorAll('.comp-tts-btn').forEach(b => {
      b.addEventListener('click', () => StudyModule.speakText(b.dataset.tts));
    });

    el.querySelectorAll('.comp-check-btn').forEach(b => {
      b.addEventListener('click', () => {
        const idx = Number(b.dataset.idx);
        const ex = exercises[idx];
        const input = el.querySelector(`.comp-input[data-idx="${idx}"]`);
        const fb = document.getElementById(`compFb_${idx}`);
        const normalize = s => s.replace(/\s+/g, '').trim();
        if (normalize(input.value) === normalize(ex.answer)) {
          fb.style.color = 'var(--st-mastered)';
          fb.textContent = `🎉 정확합니다! (${ex.answer} / ${ex.romaji})`;
        } else {
          fb.style.color = 'var(--danger)';
          fb.textContent = `❌ 다시 시도해보세요. 모범 답안: ${ex.answer} (${ex.romaji})`;
        }
      });
    });

    el.querySelectorAll('.comp-show-btn').forEach(b => {
      b.addEventListener('click', () => {
        const idx = Number(b.dataset.idx);
        const ex = exercises[idx];
        const fb = document.getElementById(`compFb_${idx}`);
        fb.style.color = 'var(--accent)';
        fb.textContent = `정답: ${ex.answer} (${ex.romaji})`;
      });
    });
  }

  function refreshCurrentView() {
    renderDashboard();
    if (activeTab === 'study') {
      StudyModule.render(activeCategory, renderDashboard);
    } else if (activeTab === 'quiz') {
      QuizModule.render(activeCategory, renderDashboard);
    } else if (activeTab === 'grammar') {
      renderGrammarTab();
    } else if (activeTab === 'writing_comp') {
      renderWritingCompTab();
    }
  }

  // ==================== 5. 팝업(50음도 상세 / 단축키) & PC 단축키 ====================
  const charModal = document.getElementById('charDetailModal');
  const shortcutModal = document.getElementById('shortcutModal');

  document.getElementById('closeCharModalBtn')?.addEventListener('click', () => {
    charModal?.classList.add('hidden');
  });
  charModal?.addEventListener('click', e => {
    if (e.target === charModal) charModal.classList.add('hidden');
  });

  document.getElementById('shortcutHelpBtn')?.addEventListener('click', () => {
    shortcutModal?.classList.remove('hidden');
  });
  document.getElementById('closeShortcutModalBtn')?.addEventListener('click', () => {
    shortcutModal?.classList.add('hidden');
  });
  shortcutModal?.addEventListener('click', e => {
    if (e.target === shortcutModal) shortcutModal.classList.add('hidden');
  });

  // PC 키보드 단축키 지원
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';

    if (e.key === 'Escape') {
      charModal?.classList.add('hidden');
      shortcutModal?.classList.add('hidden');
      return;
    }

    if (isTyping) return;

    const key = e.key.toLowerCase();
    if (key === 'h') {
      switchTopTab('dashboard');
    } else if (e.key === '1') {
      switchTopTab('dashboard');
    } else if (e.key === '2') {
      switchTopTab('study');
    } else if (e.key === '3') {
      switchTopTab('quiz');
    } else if (e.key === '4') {
      switchTopTab('grammar');
    } else if (e.key === '5') {
      switchTopTab('writing_comp');
    } else if (e.key === 'ArrowLeft') {
      if (activeTab === 'study') StudyModule.stepItem(-1);
    } else if (e.key === 'ArrowRight') {
      if (activeTab === 'study') StudyModule.stepItem(1);
    } else if (e.code === 'Space') {
      if (activeTab === 'study') {
        e.preventDefault();
        StudyModule.toggleFlashcardOrStrokeAction();
      }
    } else if (key === 's') {
      const txt = activeTab === 'quiz'
        ? QuizModule.getActiveSpeakingText()
        : StudyModule.getActiveSpeakingText();
      StudyModule.speakText(txt);
    } else if (key === 'm') {
      applyHideMeaning(!document.body.classList.contains('hide-meaning'));
    } else if (key === 'f') {
      if (activeTab === 'study') StudyModule.toggleCurrentFavorite();
    } else if (key === 'b') {
      const isCollapsed = document.getElementById('pcSidebar')?.classList.contains('collapsed');
      applySidebarCollapsed(!isCollapsed);
    }
  });

  // 학습 기록 초기화
  document.getElementById('resetProgressBtn')?.addEventListener('click', () => {
    if (confirm('모든 학습 상태, 즐겨찾기, 오답노트, 퀴즈 기록을 초기화할까요?')) {
      DB.resetAll();
      refreshCurrentView();
    }
  });

  // 전역 컨트롤러 노출
  window.AppController = {
    refreshDashboard: renderDashboard,
    switchTopTab,
    switchCategory
  };

  // 초기 화면 렌더링
  StudyModule.setCategory(activeCategory);
  renderDashboard();
});
