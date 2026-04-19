(function () {
  const tabs = [
    { id: 'tab-name', hash: '#panel-name', legacyHashes: ['#nombres'], btn: document.getElementById('tab-name'), panel: document.getElementById('panel-name') },
    { id: 'tab-sensi', hash: '#panel-sensi', legacyHashes: ['#sensi'], btn: document.getElementById('tab-sensi'), panel: document.getElementById('panel-sensi') },
    { id: 'tab-players', hash: '#panel-players', legacyHashes: ['#jugadores'], btn: document.getElementById('tab-players'), panel: document.getElementById('panel-players') }
  ].filter(tab => tab.btn && tab.panel);

  const navLinks = Array.from(document.querySelectorAll('[data-nav-target]'));

  function isTabAvailable(tab) {
    return tab && !tab.btn.classList.contains('hidden');
  }

  function getTabById(id) {
    return tabs.find(tab => tab.id === id);
  }

  function getTabByHash(hash) {
    return tabs.find(tab => tab.hash === hash || tab.legacyHashes.includes(hash));
  }

  function getFallbackTab() {
    return tabs.find(isTabAvailable) || tabs[0];
  }

  function updateNavState(selectedId) {
    navLinks.forEach(link => {
      const targetTab = getTabById(link.dataset.navTarget);
      const isAvailable = isTabAvailable(targetTab);
      const isActive = targetTab?.id === selectedId;

      link.classList.toggle('opacity-50', !isAvailable);
      link.classList.toggle('cursor-not-allowed', !isAvailable);
      link.classList.toggle('pointer-events-none', !isAvailable);
      link.classList.toggle('border-cyan-200', isActive && isAvailable);
      link.classList.toggle('bg-cyan-50', isActive && isAvailable);
      link.classList.toggle('text-cyan-700', isActive && isAvailable);
      link.classList.toggle('shadow-md', isActive && isAvailable);
      link.setAttribute('aria-disabled', isAvailable ? 'false' : 'true');
      link.setAttribute('aria-current', isActive && isAvailable ? 'page' : 'false');
    });
  }

  function selectTab(selectedId, options = {}) {
    const requestedTab = getTabById(selectedId);
    const selectedTab = isTabAvailable(requestedTab) ? requestedTab : getFallbackTab();

    if (!selectedTab) {
      return;
    }

    tabs.forEach(tab => {
      const isSelected = tab.id === selectedTab.id;
      tab.btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.panel.classList.toggle('active', isSelected);
    });

    updateNavState(selectedTab.id);

    if (options.updateHash !== false && window.history?.replaceState) {
      window.history.replaceState(null, '', selectedTab.hash);
    }
  }

  tabs.forEach(tab => {
    tab.btn.addEventListener('click', () => selectTab(tab.id));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const targetTab = getTabById(link.dataset.navTarget);

      event.preventDefault();

      if (!isTabAvailable(targetTab)) {
        return;
      }

      selectTab(targetTab.id);
    });
  });

  window.selectKingNationTab = selectTab;
  window.syncTopNavState = selectedId => {
    const activeTab = selectedId || tabs.find(tab => tab.btn.getAttribute('aria-selected') === 'true')?.id;
    updateNavState(activeTab);
  };

  const initialTab = getTabByHash(window.location.hash) || tabs.find(tab => tab.panel.classList.contains('active')) || getFallbackTab();
  selectTab(initialTab?.id, { updateHash: false });
})();
