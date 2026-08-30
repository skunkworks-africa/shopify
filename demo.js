(() => {
  const installAdaptiveShell = () => {
    if (document.querySelector('link[data-adaptive-shell]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './adaptive-shell.css';
    link.dataset.adaptiveShell = '';
    document.head.append(link);
  };

  installAdaptiveShell();

  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const searchInput = document.querySelector('[data-card-search]');
  const cards = [...document.querySelectorAll('[data-card]')];
  const emptyState = document.querySelector('[data-empty-state]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const year = document.querySelector('[data-year]');
  const navLinks = [...document.querySelectorAll('.top-nav a[href^="#"]')];
  const desktopQuery = window.matchMedia('(min-width: 821px)');
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const closeMenu = () => {
    if (!mobileNav || !menuButton) return;
    mobileNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    if (!mobileNav || !menuButton) return;
    const isOpen = mobileNav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  };

  menuButton?.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (!desktopQuery.matches) closeMenu();
    });
  });

  desktopQuery.addEventListener?.('change', (event) => {
    if (event.matches) closeMenu();
  });

  const updateThemeLabel = () => {
    if (!themeLabel) return;
    themeLabel.textContent = darkQuery.matches
      ? 'Dark mode · black page / white inverse header and footer'
      : 'Light mode · white page / black inverse header and footer';
  };

  updateThemeLabel();
  darkQuery.addEventListener?.('change', updateThemeLabel);

  searchInput?.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const haystack = `${card.dataset.search ?? ''} ${card.textContent}`.toLowerCase();
      const match = !query || haystack.includes(query);
      card.hidden = !match;
      if (match) visible += 1;
    });

    if (emptyState) emptyState.hidden = visible !== 0;
  });

  if ('IntersectionObserver' in window && navLinks.length) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visibleEntry.target.id}`);
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0.08, 0.2, 0.5]
    });

    sections.forEach((section) => observer.observe(section));
  }

  if (year) year.textContent = new Date().getFullYear();
})();
