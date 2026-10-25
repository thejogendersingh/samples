// ==========================================================================
// SAMPLES App Logic: Modal Preview, Couple Search, Style Filter, Navigation Sync
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const previewModal = document.getElementById('previewModal');
  const modalBackBtn = document.getElementById('modalBackBtn');
  const previewIframe = document.getElementById('previewIframe');
  const previewLoader = document.getElementById('previewLoader');
  const modalTitle = document.getElementById('modalTitle');
  const modalExternalLink = document.getElementById('modalExternalLink');
  const fallbackLink = document.getElementById('fallbackLink');

  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const emptySearchState = document.getElementById('emptySearchState');
  const emptyDesc = document.getElementById('emptyDesc');
  const emptyResetBtn = document.getElementById('emptyResetBtn');
  const samplesGrid = document.getElementById('samplesGrid');

  const sampleCards = document.querySelectorAll('.sample-card');
  const categoryChips = document.querySelectorAll('.cat-chip');
  const bottomTabs = document.querySelectorAll('.bottom-mobile-nav .nav-tab');
  const activeStyleLabel = document.getElementById('activeStyleLabel');
  const activeCount = document.getElementById('activeCount');

  let currentStyle = 'all';

  // --------------------------------------------------------------------------
  // Apply Unified Filters (Style Category + Couple Name Search)
  // --------------------------------------------------------------------------
  function applyFilters() {
    let visibleCount = 0;
    const query = searchInput.value.trim().toLowerCase();

    // Toggle clear button icon
    if (query.length > 0) {
      searchClearBtn.classList.add('active');
    } else {
      searchClearBtn.classList.remove('active');
    }

    sampleCards.forEach(card => {
      const cardStyle = card.getAttribute('data-style');
      const cardName = (card.getAttribute('data-name') || '').toLowerCase();
      const cardTheme = (card.getAttribute('data-theme') || '').toLowerCase();

      const matchesStyle = (currentStyle === 'all' || cardStyle === currentStyle);
      const matchesSearch = (!query || cardName.includes(query) || cardTheme.includes(query));

      if (matchesStyle && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle Empty State
    if (visibleCount === 0) {
      emptySearchState.style.display = 'block';
      emptyDesc.textContent = query
        ? `No invitations found for "${searchInput.value.trim()}".`
        : 'No invitations available in this style.';
      samplesGrid.style.display = 'none';
    } else {
      emptySearchState.style.display = 'none';
      samplesGrid.style.display = 'grid';
    }

    // Update Counter & Active Label
    if (query) {
      activeStyleLabel.textContent = `Search: "${searchInput.value.trim()}"`;
      activeCount.textContent = `${visibleCount} Found`;
    } else if (currentStyle === 'all') {
      activeStyleLabel.textContent = 'All Invitations';
      activeCount.textContent = `${visibleCount} Designs`;
    } else {
      activeStyleLabel.textContent = `${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Collection`;
      activeCount.textContent = `${visibleCount} Designs`;
    }
  }

  // Live Search Input Event
  searchInput.addEventListener('input', () => {
    applyFilters();
  });

  // Clear Search Button Event
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    applyFilters();
  });

  // Reset Empty State Event
  emptyResetBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentStyle = 'all';
    syncCategoryUI('all');
    applyFilters();
  });

  // --------------------------------------------------------------------------
  // Style Category Selection
  // --------------------------------------------------------------------------
  function setStyleFilter(style) {
    currentStyle = style;
    syncCategoryUI(style);
    applyFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function syncCategoryUI(style) {
    // Sync Top Chips
    categoryChips.forEach(chip => {
      if (chip.getAttribute('data-style') === style) {
        chip.classList.add('active');
        chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        chip.classList.remove('active');
      }
    });

    // Sync Bottom Navigation Tabs
    bottomTabs.forEach(tab => {
      if (tab.getAttribute('data-style') === style) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  // Top Chips Click
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const style = chip.getAttribute('data-style');
      setStyleFilter(style);
    });
  });

  // Bottom Tabs Click
  bottomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const style = tab.getAttribute('data-style');
      setStyleFilter(style);
    });
  });

  // --------------------------------------------------------------------------
  // In-App Fullscreen Modal Preview
  // --------------------------------------------------------------------------
  function openPreview(card) {
    const url = card.getAttribute('data-url');
    const name = card.getAttribute('data-name');

    if (!url) return;

    modalTitle.textContent = name || 'Wedding Invite';
    modalExternalLink.href = url;
    fallbackLink.href = url;

    // Show loading spinner
    previewLoader.classList.remove('hidden');

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    // Show modal
    previewModal.classList.add('active');
    previewModal.setAttribute('aria-hidden', 'false');

    // Load URL in iframe
    previewIframe.src = url;

    const hideLoader = () => {
      previewLoader.classList.add('hidden');
      previewIframe.removeEventListener('load', hideLoader);
    };

    previewIframe.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 3500);

    // History state for mobile hardware back button
    window.history.pushState({ modalOpen: true }, '');
  }

  function closePreview(popState = false) {
    if (!previewModal.classList.contains('active')) return;

    previewModal.classList.remove('active');
    previewModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(() => {
      previewIframe.src = 'about:blank';
      previewLoader.classList.remove('hidden');
    }, 200);

    if (!popState && window.history.state && window.history.state.modalOpen) {
      window.history.back();
    }
  }

  // Card click triggers
  sampleCards.forEach(card => {
    card.addEventListener('click', () => {
      openPreview(card);
    });

    const playBtn = card.querySelector('.play-pill-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPreview(card);
      });
    }
  });

  // Back arrow click
  modalBackBtn.addEventListener('click', () => {
    closePreview();
  });

  // Hardware Back Button
  window.addEventListener('popstate', () => {
    if (previewModal.classList.contains('active')) {
      closePreview(true);
    }
  });

  // Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.classList.contains('active')) {
      closePreview();
    }
  });
});
