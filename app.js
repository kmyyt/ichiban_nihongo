// 메인 컨트롤러: 탭 전환, 라이트/다크 테마, 대시보드 및 v2 로드맵 렌더링
document.addEventListener('DOMContentLoaded', () => {
  let activeTab = 'dashboard';
  let activeCategory = 'all';

  // 1. 테마 초기화 및 토글
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    DB.setTheme(theme);
    const desktopBtn = document.getElementById('themeToggleDesktop');
    const mobileBtn = document.getElementById('themeToggleMobile');
    if (desktopBtn) desktopBtn.textContent = theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
    if (mobileBtn) mobileBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  applyTheme(DB.load().theme);

  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  document.getElementById('themeToggleDesktop')?.addEventListener('click', toggleTheme);
  document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);

  // 2. 대시보드 렌더링
  function renderDashboard() {
    const state = DB.load();
    const stats = DB.getCategoryStats(JP_DATA.items);
    const overall = stats[0];
    const accuracy = state.quizTotal === 0 ? 0 : Math.round((state.quizSolved / state.quizTotal) * 100);

    document.getElementById('dashboardStats').innerHTML = `
      <div class="stat-box">
        <div class="stat-label">전체 진도율</div>
        <div class="stat-value">${overall.percent}%</div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">${overall.done} / ${overall.total} 항목 완료</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">퀴즈 정답률</div>
        <div class="stat-value">${accuracy}%</div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">${state.quizSolved} / ${state.quizTotal} 문제 정답</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">미니게임 클리어</div>
        <div class="stat-value">${state.gameClears}회</div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">짝맞추기 완주 횟수</div>
      </div>
    `;

    document.getElementById('categoryProgressList').innerHTML = stats.map(s => `
      <div class="progress-item">
        <div class="progress-top">
          <strong>${s.label}</strong>
          <span>${s.done} / ${s.total} (${s.percent}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${s.percent}%"></div>
        </div>
      </div>
    `).join('');
  }

  // 3. 추후 확장 로드맵(v2) 렌더링
  function renderRoadmap() {
    document.getElementById('roadmapContainer').innerHTML = JP_DATA.roadmapV2.map(item => `
      <div class="card">
        <span class="badge-v2">${item.stage}</span>
        <h3 style="margin-bottom:8px;">${item.title}</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:12px;">${item.desc}</p>
        <div class="jp-font" style="padding:10px; border-radius:10px; background:var(--accent-soft); font-size:0.88rem;">
          예시: ${item.sample}
        </div>
      </div>
    `).join('');
  }

  // 4. 화면 갱신 통합 함수
  function refreshAll() {
    renderDashboard();
    if (activeTab === 'study') {
      StudyModule.render(activeCategory, renderDashboard);
    } else if (activeTab === 'quiz') {
      QuizModule.render(activeCategory, renderDashboard);
    }
  }

  // 5. 메인 내비게이션 탭 전환 (PC 사이드바 & 모바일 하단바 동기화)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === activeTab));
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${activeTab}`);
      });
      refreshAll();
    });
  });

  // 6. 카테고리 칩 전환 (전체 / 히라가나 / 가타카나 / 명사 / い형용사 / な형용사 / 동사)
  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.cat;
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      refreshAll();
    });
  });

  // 7. 학습 서브탭 전환
  document.querySelectorAll('.sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      StudyModule.setMode(btn.dataset.mode);
      StudyModule.render(activeCategory, renderDashboard);
    });
  });

  // 8. 퀴즈 서브탭 전환
  document.querySelectorAll('.quiz-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      QuizModule.setMode(btn.dataset.qmode);
      QuizModule.render(activeCategory, renderDashboard);
    });
  });

  // 9. 학습 기록 초기화
  document.getElementById('resetProgressBtn')?.addEventListener('click', () => {
    if (confirm('모든 학습 완료 체크와 퀴즈 점수를 초기화할까요?')) {
      DB.resetAll();
      refreshAll();
    }
  });

  // 초기 렌더링
  renderDashboard();
  renderRoadmap();
});