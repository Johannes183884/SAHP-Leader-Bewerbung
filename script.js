(() => {
  const progress = document.getElementById('progress');
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBar = document.getElementById('loadingBar');
  const loadingText = document.getElementById('loadingText');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  // Kleiner Ladebildschirm, danach bleibt die Seite ganz normal bedienbar.
  let loadValue = 0;
  const loadTimer = window.setInterval(() => {
    loadValue = Math.min(loadValue + 17, 100);
    if (loadingBar) loadingBar.style.width = `${loadValue}%`;
    if (loadValue >= 100) {
      window.clearInterval(loadTimer);
      if (loadingText) loadingText.textContent = 'Bereit';
      window.setTimeout(() => loadingScreen?.classList.add('done'), 220);
    }
  }, 65);

  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progress) progress.style.width = `${percent}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '✕' : '☰';
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.textContent = '☰';
    });
  });

  const tabs = Array.from(document.querySelectorAll('.rank-tab'));
  const rows = Array.from(document.querySelectorAll('#rankRows tr'));
  const search = document.getElementById('rankSearch');
  const noResults = document.getElementById('noResults');
  let activeGroup = 'all';

  function filterRanks() {
    const query = (search?.value || '').trim().toLocaleLowerCase('de-DE');
    let visibleCount = 0;
    rows.forEach((row) => {
      const groupMatch = activeGroup === 'all' || row.dataset.group === activeGroup;
      const textMatch = row.textContent.toLocaleLowerCase('de-DE').includes(query);
      const visible = groupMatch && textMatch;
      row.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (noResults) noResults.hidden = visibleCount > 0;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeGroup = tab.dataset.rank || 'all';
      tabs.forEach((item) => item.classList.toggle('active', item === tab));
      filterRanks();
    });
  });
  search?.addEventListener('input', filterRanks);
})();
