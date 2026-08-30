(() => {
  const SELECTORS = {
    root: '[data-skunkworks-search]',
    form: '[data-swa-search-form]',
    input: '[data-swa-search-input]',
    clear: '[data-swa-search-clear]',
    results: '[data-swa-predictive]',
    live: '[data-swa-search-live]'
  };

  const emit = (name, detail = {}) => {
    document.dispatchEvent(new CustomEvent('skunkworks:analytics', { detail: { event: name, ...detail } }));
  };

  const text = (tag, value, className) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value || '';
    return element;
  };

  const resultLink = (item, type, index) => {
    const link = document.createElement('a');
    link.className = 'swa-predictive__item';
    link.href = item.url;
    link.id = `swa-predictive-option-${index}`;
    link.setAttribute('role', 'option');
    link.dataset.resultType = type;

    if (item.image?.url || item.featured_image?.url) {
      const image = document.createElement('img');
      image.src = item.image?.url || item.featured_image.url;
      image.alt = '';
      image.loading = 'lazy';
      link.append(image);
    } else {
      link.append(text('span', type.slice(0, 1).toUpperCase(), 'swa-predictive__thumb'));
    }

    const copy = document.createElement('span');
    copy.append(text('strong', item.title || item.text || ''));
    const metadata = [type, item.price].filter(Boolean).join(' · ');
    copy.append(text('span', metadata, 'swa-predictive__meta'));
    link.append(copy);
    return link;
  };

  const init = (root) => {
    const form = root.querySelector(SELECTORS.form);
    const input = root.querySelector(SELECTORS.input);
    const clear = root.querySelector(SELECTORS.clear);
    const panel = root.querySelector(SELECTORS.results);
    const live = root.querySelector(SELECTORS.live);
    if (!form || !input || !panel || !live) return;

    let timer;
    let controller;
    let activeIndex = -1;
    let options = [];

    const close = () => {
      panel.hidden = true;
      panel.replaceChildren();
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      activeIndex = -1;
      options = [];
    };

    const syncClear = () => {
      if (clear) clear.hidden = input.value.length === 0;
    };

    const activate = (index) => {
      options.forEach((option) => option.classList.remove('is-active'));
      if (!options.length) return;
      activeIndex = (index + options.length) % options.length;
      const active = options[activeIndex];
      active.classList.add('is-active');
      input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    };

    const status = (message) => {
      panel.replaceChildren(text('p', message, 'swa-predictive__status'));
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      live.textContent = message;
    };

    const render = (payload, query) => {
      panel.replaceChildren();
      const resources = payload?.resources?.results || {};
      const groups = [
        ['Products', 'product', resources.products || []],
        ['Collections', 'collection', resources.collections || []],
        ['Pages', 'page', resources.pages || []],
        ['Articles', 'article', resources.articles || []]
      ];
      let count = 0;
      groups.forEach(([heading, type, items]) => {
        if (!items.length) return;
        panel.append(text('p', heading, 'swa-predictive__heading'));
        items.forEach((item) => panel.append(resultLink(item, type, count++)));
      });

      if (!count) {
        status(`No results found for “${query}”. Try a broader term.`);
        emit('zero_result_search', { query_length: query.length });
        return;
      }

      const all = document.createElement('a');
      all.className = 'swa-predictive__all';
      all.href = `${form.action}?q=${encodeURIComponent(query)}&type=product%2Cpage%2Carticle`;
      all.textContent = `View all results for “${query}”`;
      all.setAttribute('role', 'option');
      all.id = `swa-predictive-option-${count}`;
      panel.append(all);
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      options = [...panel.querySelectorAll('[role="option"]')];
      live.textContent = `${count} predictive results available.`;
      emit('predictive_results_displayed', { result_count: count, query_length: query.length });
    };

    const search = async (query) => {
      controller?.abort();
      controller = new AbortController();
      status('Loading search suggestions…');
      const endpoint = `${window.Shopify?.routes?.root || '/'}search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,page,article&resources[limit]=4&resources[options][unavailable_products]=last`;
      try {
        const response = await fetch(endpoint, { signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Predictive search failed: ${response.status}`);
        render(await response.json(), query);
      } catch (error) {
        if (error.name === 'AbortError') return;
        status('Suggestions are temporarily unavailable. Press Enter to search the full store.');
      }
    };

    input.addEventListener('focus', () => emit('search_opened'));
    input.addEventListener('input', () => {
      syncClear();
      window.clearTimeout(timer);
      const query = input.value.trim();
      if (query.length < 2) {
        controller?.abort();
        close();
        return;
      }
      timer = window.setTimeout(() => search(query), 220);
    });

    clear?.addEventListener('click', () => {
      input.value = '';
      syncClear();
      close();
      input.focus();
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activate(activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        activate(activeIndex - 1);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        options[activeIndex].click();
      }
    });

    panel.addEventListener('click', (event) => {
      const selected = event.target.closest('[role="option"]');
      if (selected) emit('predictive_result_selected', { result_type: selected.dataset.resultType || 'all' });
    });
    form.addEventListener('submit', () => emit('search_submitted', { query_length: input.value.trim().length }));
    document.addEventListener('pointerdown', (event) => { if (!root.contains(event.target)) close(); });
    syncClear();
  };

  const enhanceHeaderSearch = () => {
    document.querySelectorAll('input[type="search"][name="q"]').forEach((input) => {
      if (!input.placeholder || input.placeholder.toLowerCase() === 'search') input.placeholder = 'Search products, courses, software, cloud and services';
      if (!input.getAttribute('aria-label') && !document.querySelector(`label[for="${CSS.escape(input.id)}"]`)) input.setAttribute('aria-label', 'Search the complete Skunkworks storefront');
    });
  };

  document.querySelectorAll(SELECTORS.root).forEach(init);
  document.querySelectorAll('[data-swa-event]').forEach((element) => element.addEventListener('click', () => emit(element.dataset.swaEvent)));
  enhanceHeaderSearch();
})();
