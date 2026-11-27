// 메인 컨트롤러: 영역별 독립 워크스페이스, PC 단축키, 뜻/힌트 가림, TTS, 대시보드·문법·작문 관리
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

  function getItemsForCategory(cat = activeCategory) {
    if (window.ContentDB && typeof window.ContentDB.getByCategory === 'function') {
      return window.ContentDB.getByCategory(cat);
    }
    return getAllItems().filter(i => i.category === cat);
  }

  function getCategoryLabel(cat = activeCategory) {
    if (window.ContentDB && typeof window.ContentDB.getCategoryLabel === 'function') {
      return window.ContentDB.getCategoryLabel(cat);
    }
    return cat;
  }

  function getGrammarLessonsForCategory(cat = activeCategory) {
    if (window.ContentDB && typeof window.ContentDB.getGrammarByCategory === 'function') {
      return window.ContentDB.getGrammarByCategory(cat);
    }
    return [];
  }

  function getWritingExercisesForCategory(cat = activeCategory) {
    if (window.ContentDB && typeof window.ContentDB.getWritingByCategory === 'function') {
      return window.ContentDB.getWritingByCategory(cat);
    }
    return [];
  }

  // ==================== 1. 테마 · 뜻가림 · 힌트가림 · 사이드바 초기화 ====================
  function applyTheme(theme) {
    const resolved = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);
    DB.savePreferences({ theme: resolved });

    const desktopBtn = document.getElementById('themeToggleDesktop');
    const mobileBtn = document.getElementById('themeToggleMobile');
    if (desktopBtn) desktopBtn.textContent = resolved === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
    if (mobileBtn) mobileBtn.textContent = resolved === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function applyHideMeaning(hidden) {
    const isHidden = !!hidden;
    document.body.classList.toggle('hide-meanings', isHidden);
    DB.savePreferences({ hideMeanings: isHidden });

    const toggle = document.getElementById('hideMeaningToggle');
    if (toggle) toggle.checked = isHidden;
  }

  function applyHideHint(hidden) {
    const isHidden = !!hidden;
    document.body.classList.toggle('hide-hints', isHidden);
    DB.savePreferences({ hideHints: isHidden });

    const toggle = document.getElementById('hideHintToggle');
    if (toggle) toggle.checked = isHidden;
  }

  function applySidebarCollapsed(collapsed) {
    const isCollapsed = !!collapsed;
    const sidebar = document.getElementById('pcSidebar');
    const btn = document.getElementById('sidebarToggleBtn');
    sidebar?.classList.toggle('collapsed', isCollapsed);
    if (btn) btn.textContent = isCollapsed ? '▶' : '◀';
    DB.savePreferences({ sidebarCollapsed: isCollapsed });
  }

  const savedPrefs = DB.loadPreferences();
  applyTheme(savedPrefs.theme);
  applyHideMeaning(savedPrefs.hideMeanings);
  applyHideHint(savedPrefs.hideHints);
  applySidebarCollapsed(savedPrefs.sidebarCollapsed);

  document.getElementById('themeToggleDesktop')?.addEventListener('click', toggleTheme);
  document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);

  document.getElementById('hideMeaningToggle')?.addEventListener('change', e => {
    applyHideMeaning(e.target.checked);
  });

  document.getElementById('hideHintToggle')?.addEventListener('change', e => {
    applyHideHint(e.target.checked);
  });

  document.getElementById('sidebarToggleBtn')?.addEventListener('click', () => {
    const isCollapsed = document.getElementById('pcSidebar')?.classList.contains('collapsed');
    applySidebarCollapsed(!isCollapsed);
  });

  document.getElementById('quickTtsBtn')?.addEventListener('click', () => {
    const text = activeTab === 'quiz'
      ? QuizModule.getActiveSpeakingText()
      : StudyModule.getActiveSpeakingText();
    StudyModule.speakText(text);
  });

  // ==================== 2. 탭 및 학습 영역(독립 워크스페이스) 전환 ====================
  function updateAreaHeaders() {
    const label = getCategoryLabel(activeCategory);
    const badge = document.getElementById('activeAreaBadge');
    if (badge) badge.textContent = `현재 영역: ${label}`;

    const dashTitle = document.getElementById('dashboardTitle');
    if (dashTitle) dashTitle.textContent = `📊 ${label} 대시보드`;

    const quizTitle = document.getElementById('quizPanelTitle');
    if (quizTitle) quizTitle.textContent = `🎮 ${label} 퀴즈 및 미니게임`;

    const grammarTitle = document.getElementById('grammarPanelTitle');
    if (grammarTitle) {
      grammarTitle.textContent = activeCategory === 'hiragana'
        ? '📐 히라가나 발음 · 표기 규칙'
        : `📐 ${label} 문법 학습`;
    }

    const writingTitle = document.getElementById('writingPanelTitle');
    if (writingTitle) writingTitle.textContent = `✍️ ${label} 읽기 및 작문 연습`;
  }

  function switchTopTab(tabName) {
    if (activeTab === 'quiz' && tabName !== 'quiz' && window.QuizModule?.stopTimer) {
      QuizModule.stopTimer();
    }
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
    DB.setActiveCategory(activeCategory);

    document.querySelectorAll('.cat-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === activeCategory);
    });

    StudyModule.setCategory(activeCategory);
    QuizModule.resetStateForCategory(activeCategory);
    updateAreaHeaders();

    if (moveToStudy && activeTab !== 'study') {
      switchTopTab('study');
      return;
    }
    refreshCurrentView();
  }

  document.querySelectorAll('.home-trigger').forEach(el => {
    el.addEventListener('click', () => switchTopTab('dashboard'));
  });

  document.querySelectorAll('.top-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTopTab(btn.dataset.tab));
  });

  document.querySelectorAll('.cat-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // 현재 보고 있던 하위 탭(대시보드/학습/퀴즈/문법/작문)을 유지한 채 영역만 독립 전환
      switchCategory(btn.dataset.cat, false);
    });
  });

  document.querySelectorAll('#hiraganaSubTabs .sub-btn, #generalSubTabs .sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      StudyModule.setMode(btn.dataset.mode);
      StudyModule.render(activeCategory, renderDashboard);
    });
  });

  document.querySelectorAll('.quiz-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      QuizModule.setMode(btn.dataset.qmode);
      QuizModule.render(activeCategory, renderDashboard);
    });
  });

  // ==================== 3. 영역별 독립 대시보드 & 유틸리티 탭 ====================
  function renderDashboard() {
    updateAreaHeaders();
    const label = getCategoryLabel(activeCategory);
    const catItems = getItemsForCategory(activeCategory);
    const prog = DB.getCategoryProgress(catItems, activeCategory);
    const reviewCount = DB.getReviewNeededItems(catItems, activeCategory).length;
    const writingTotal = getWritingExercisesForCategory(activeCategory).length;
    const writingDone = DB.getWritingSolvedCount(activeCategory);

    const statsEl = document.getElementById('dashboardStats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-card">
          <div class="stat-label">${label} 학습 완료율</div>
          <div class="stat-value">${prog.percent}%</div>
          <div class="stat-sub">암기완료 ${prog.mastered} / ${prog.total} (학습중 ${prog.learning} · 어려움 ${prog.hard})</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${label} 퀴즈 정답률</div>
          <div class="stat-value">${prog.accuracy}%</div>
          <div class="stat-sub">${prog.correctCount} / ${prog.totalAttempts} 문제 정답 · 최고 ${prog.bestScore}점</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${label} 작문 달성도</div>
          <div class="stat-value">${writingTotal > 0 ? Math.round((writingDone / writingTotal) * 100) : 0}%</div>
          <div class="stat-sub">완료 ${writingDone} / ${writingTotal} 문항</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${label} 즐겨찾기 / 복습</div>
          <div class="stat-value">⭐ ${prog.favoritesCount} · 🔁 ${reviewCount}</div>
          <div class="stat-sub">오답노트 ${prog.wrongCount}개 기록됨</div>
        </div>
      `;
    }

    const categories = [
      { key: 'hiragana', label: '히라가나 (기본+심화)' },
      { key: 'katakana', label: '가타카나' },
      { key: 'noun', label: '명사' },
      { key: 'i_adj', label: 'い형용사' },
      { key: 'na_adj', label: 'な형용사' },
      { key: 'verb', label: '동사' }
    ];

    const progEl = document.getElementById('categoryProgressList');
    if (progEl) {
      progEl.innerHTML = categories.map(cat => {
        const items = getItemsForCategory(cat.key);
        const p = DB.getCategoryProgress(items, cat.key);
        const isCurrent = cat.key === activeCategory;
        return `
          <div class="progress-row" data-jump-cat="${cat.key}" style="${isCurrent ? 'border-color:var(--accent); background:var(--accent-soft);' : ''}">
            <div class="progress-row-top">
              <strong>${isCurrent ? '▶ ' : ''}${cat.label}</strong>
              <span>진도 ${p.percent}% (완료 ${p.mastered}/${p.total} · 학습중 ${p.learning} · 어려움 ${p.hard})</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width:${p.percent}%"></div>
            </div>
          </div>
        `;
      }).join('');

      progEl.querySelectorAll('.progress-row').forEach(row => {
        row.addEventListener('click', () => {
          switchCategory(row.dataset.jumpCat, false);
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

    const catItems = getItemsForCategory(activeCategory);
    const byId = new Map(catItems.map(i => [i.id, i]));
    const catState = DB.loadCategory(activeCategory);
    const label = getCategoryLabel(activeCategory);

    if (activeDashUtil === 'favorites') {
      const favItems = catState.favorites.map(id => byId.get(id)).filter(Boolean);
      if (!favItems.length) {
        utilContainer.innerHTML = `<p class="hint-text">[${label}] 영역에 즐겨찾기한 항목이 없습니다. 학습하기 탭에서 ☆를 눌러 추가해 보세요.</p>`;
        return;
      }
      utilContainer.innerHTML = `
        <div class="roadmap-grid">
          ${favItems.map(item => `
            <div class="card" style="padding:14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
              <div>
                <strong class="jp-font" style="font-size:1.25rem;">${item.emoji ? item.emoji + ' ' : ''}${item.jp}</strong>
                <span class="hint-text hint-mask" style="margin-left:6px;">[${item.romaji}]</span>
                <div class="meaning-mask" style="font-size:0.86rem;">${item.meaning}</div>
              </div>
              <div class="btn-row">
                <button type="button" class="btn fav-tts-btn" data-tts="${item.jp}" style="padding:5px 10px;">🔊</button>
                <button type="button" class="btn primary fav-go-btn" data-id="${item.id}" style="padding:5px 10px;">학습</button>
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
          StudyModule.setMode('stroke', b.dataset.id);
          switchTopTab('study');
        });
      });
    } else if (activeDashUtil === 'wrong') {
      const wrongList = Array.isArray(catState.wrongNotes) ? catState.wrongNotes : [];
      if (!wrongList.length) {
        utilContainer.innerHTML = `<p class="hint-text">[${label}] 영역에 기록된 오답이 없습니다. 퀴즈 및 게임에서 틀린 문제가 자동으로 이곳에 모입니다.</p>`;
        return;
      }
      utilContainer.innerHTML = `
        <div class="roadmap-grid">
          ${wrongList.map(w => `
            <div class="card" style="padding:14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
              <div>
                <strong class="jp-font" style="font-size:1.25rem;">${w.jp}</strong>
                <span style="font-size:0.82rem; color:#dc2626; font-weight:700; margin-left:6px;">오답 ${w.wrongCount || 1}회</span>
                <div style="font-size:0.86rem;"><span class="hint-mask">${w.romaji}</span> · <span class="meaning-mask">${w.meaning}</span></div>
              </div>
              <button type="button" class="btn del-wrong-btn" data-id="${w.itemId || w.id}" style="padding:5px 10px;">해제</button>
            </div>
          `).join('')}
        </div>
      `;

      utilContainer.querySelectorAll('.del-wrong-btn').forEach(b => {
        b.addEventListener('click', () => {
          DB.removeWrongNote(b.dataset.id, activeCategory);
          renderDashboard();
        });
      });
    } else if (activeDashUtil === 'review') {
      const reviewItems = DB.getReviewNeededItems(catItems, activeCategory);
      if (!reviewItems.length) {
        utilContainer.innerHTML = `<p class="hint-text">[${label}] 영역에 복습이 필요한 항목이 없습니다.</p>`;
        return;
      }
      utilContainer.innerHTML = `
        <div class="roadmap-grid">
          ${reviewItems.map(item => {
            const st = DB.getStatus(item.id, activeCategory);
            return `
              <div class="card" style="padding:14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
                <div>
                  <strong class="jp-font" style="font-size:1.25rem;">${item.jp}</strong>
                  <span class="status-badge status-${st}" style="margin-left:6px;">${DB.STATUS_LABEL[st]}</span>
                  <div style="font-size:0.86rem;"><span class="hint-mask">${item.romaji}</span> · <span class="meaning-mask">${item.meaning}</span></div>
                </div>
                <button type="button" class="btn primary rev-study-btn" data-id="${item.id}" style="padding:5px 10px;">복습</button>
              </div>
            `;
          }).join('')}
        </div>
      `;

      utilContainer.querySelectorAll('.rev-study-btn').forEach(b => {
        b.addEventListener('click', () => {
          StudyModule.setMode('flashcard', b.dataset.id);
          switchTopTab('study');
        });
      });
    } else if (activeDashUtil === 'guide') {
      utilContainer.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px; font-size:0.9rem; line-height:1.55;">
          <div><strong>1. 학습 영역별 독립 관리:</strong> 좌측 사이드바(또는 모바일 하단 바)에서 <strong>히라가나 · 가타카나 · 명사 · い형용사 · な형용사 · 동사</strong>를 선택하면 대시보드, 학습하기, 퀴즈 및 게임, 문법, 작문 데이터가 영역별로 완전히 분리되어 동작합니다.</div>
          <div><strong>2. 심화 50음도 & 획순:</strong> 히라가나 영역의 <strong>✨ 심화 50음도</strong> 탭에서 탁음·반탁음·요음을 학습할 수 있으며, 기본 규칙은 <strong>📐 문법</strong> 탭에서 확인할 수 있습니다.</div>
          <div><strong>3. 뜻 가림(M) & 힌트 가림(T):</strong> 상단의 <strong>뜻 가림</strong>과 <strong>힌트 가림</strong> 토글을 이용해 한국어 뜻과 로마자·연상·작문 힌트를 개별적으로 가리고 테스트할 수 있습니다.</div>
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

  // ==================== 4. 영역별 문법 및 작문 탭 렌더링 ====================
  function renderGrammarTab() {
    updateAreaHeaders();
    const el = document.getElementById('grammarContainer');
    if (!el) return;
    const lessons = getGrammarLessonsForCategory(activeCategory);

    if (!lessons.length) {
      el.innerHTML = `<div class="card"><p class="hint-text">현재 영역에 등록된 문법 설명이 없습니다.</p></div>`;
      return;
    }

    el.innerHTML = lessons.map(lesson => `
      <div class="card">
        <span class="status-badge status-learning" style="margin-bottom:8px; display:inline-block;">${lesson.stage}</span>
        <h3 style="margin-bottom:8px;">${lesson.title}</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:12px;">${lesson.desc}</p>
        <div class="jp-font" style="padding:10px 12px; border-radius:10px; background:var(--accent-soft); font-size:0.92rem;">
          예시: ${lesson.sample}
        </div>
      </div>
    `).join('');
  }

  function renderWritingCompTab() {
    updateAreaHeaders();
    const el = document.getElementById('writingCompContainer');
    if (!el) return;
    const exercises = getWritingExercisesForCategory(activeCategory);
    const catState = DB.loadCategory(activeCategory);

    if (!exercises.length) {
      el.innerHTML = `<div class="card"><p class="hint-text">현재 영역에 등록된 작문 문제가 없습니다.</p></div>`;
      return;
    }

    el.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        ${exercises.map((ex, idx) => {
          const isSolved = Boolean(catState.writingSolved && catState.writingSolved[String(idx)]);
          return `
            <div class="card">
              <div class="card-title-row">
                <strong>작문 문제 ${idx + 1} ${isSolved ? '<span class="status-badge status-mastered" style="margin-left:6px;">✅ 완료</span>' : ''}</strong>
                <button type="button" class="btn comp-tts-btn" data-tts="${ex.answer}">🔊 정답 발음 듣기</button>
              </div>
              <p style="font-size:1.05rem; font-weight:700; margin-bottom:6px;">한국어: ${ex.ko}</p>
              <p class="hint-text" style="margin-bottom:10px;">힌트: <span class="hint-mask">${ex.hint}</span></p>
              <input
                type="text"
                class="jp-font comp-input"
                data-idx="${idx}"
                placeholder="일본어 문장을 입력하세요"
                style="width:100%; padding:10px 12px; border-radius:10px; border:1px solid var(--border); background:var(--bg-elevated); color:var(--text-primary); font-size:1rem; margin-bottom:10px;"
              />
              <div class="btn-row" style="justify-content:flex-start;">
                <button type="button" class="btn primary comp-check-btn" data-idx="${idx}">정답 확인</button>
                <button type="button" class="btn comp-show-btn" data-idx="${idx}">모범 답안 보기</button>
              </div>
              <div class="comp-feedback" id="compFb_${idx}" style="margin-top:10px; font-weight:700;"></div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    el.querySelectorAll('.comp-tts-btn').forEach(b => {
      b.addEventListener('click', () => StudyModule.speakText(b.dataset.tts));
    });

    el.querySelectorAll('.comp-check-btn').forEach(b => {
      b.addEventListener('click', () => {
        const idx = Number(b.dataset.idx);
        const ex = exercises[idx];
        const input = el.querySelector(`.comp-input[data-idx="${idx}"]`);
        const fb = document.getElementById(`compFb_${idx}`);
        const normalize = s => (s || '').replace(/\s+/g, '').trim();
        if (normalize(input?.value) === normalize(ex.answer)) {
          DB.markWritingSolved(idx, activeCategory);
          fb.style.color = 'var(--st-mastered-fg)';
          fb.textContent = `🎉 정확합니다! (${ex.answer} / ${ex.romaji})`;
          renderDashboard();
        } else {
          fb.style.color = '#dc2626';
          fb.textContent = `❌ 다시 시도해 보세요. 모범 답안: ${ex.answer} (${ex.romaji})`;
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
    if (key === 'h' || e.key === '1') switchTopTab('dashboard');
    else if (e.key === '2') switchTopTab('study');
    else if (e.key === '3') switchTopTab('quiz');
    else if (e.key === '4') switchTopTab('grammar');
    else if (e.key === '5') switchTopTab('writing_comp');
    else if (e.key === 'ArrowLeft') {
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
      applyHideMeaning(!document.body.classList.contains('hide-meanings'));
    } else if (key === 't') {
      applyHideHint(!document.body.classList.contains('hide-hints'));
    } else if (key === 'f') {
      if (activeTab === 'study') StudyModule.toggleCurrentFavorite();
    } else if (key === 'b') {
      const isCollapsed = document.getElementById('pcSidebar')?.classList.contains('collapsed');
      applySidebarCollapsed(!isCollapsed);
    }
  });

  document.getElementById('resetProgressBtn')?.addEventListener('click', () => {
    const label = getCategoryLabel(activeCategory);
    if (confirm(`현재 선택된 [${label}] 영역의 학습 상태, 즐겨찾기, 오답노트, 퀴즈·작문 기록만 초기화할까요?`)) {
      DB.resetCategory(activeCategory);
      refreshCurrentView();
    }
  });

  window.AppController = {
    refreshDashboard: renderDashboard,
    switchTopTab,
    switchCategory
  };

  DB.setActiveCategory(activeCategory);
  StudyModule.setCategory(activeCategory);
  renderDashboard();
});
