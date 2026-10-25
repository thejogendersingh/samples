// ==========================================================================
// SAMPLES App Logic: Modal Preview, Search, Mixed Categories & Sorting
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

  const sampleCards = Array.from(document.querySelectorAll('.sample-card'));
  const categoryChips = document.querySelectorAll('.cat-chip');
  const bottomTabs = document.querySelectorAll('.bottom-mobile-nav .nav-tab');
  const activeStyleLabel = document.getElementById('activeStyleLabel');
  const activeCount = document.getElementById('activeCount');

  // Sort Elements
  const sortFilterBtn = document.getElementById('sortFilterBtn');
  const sortDropdownMenu = document.getElementById('sortDropdownMenu');
  const sortLabel = document.getElementById('sortLabel');
  const sortOptions = document.querySelectorAll('.sort-option');

  let currentFilter = 'all';
  let currentSort = 'recommended';

  // --------------------------------------------------------------------------
  // Apply Unified Filters & Sorting (Mixed Categories + Search + Sort)
  // --------------------------------------------------------------------------
  function applyFiltersAndSort() {
    let visibleCount = 0;
    const rawQuery = searchInput.value.trim().toLowerCase();
    const query = rawQuery.replace(/^#/, '');

    // Toggle clear button icon
    if (rawQuery.length > 0) {
      searchClearBtn.classList.add('active');
    } else {
      searchClearBtn.classList.remove('active');
    }

    // 1. Filter cards
    sampleCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardStyle = card.getAttribute('data-style') || '';
      const cardCode = card.getAttribute('data-code') || '';
      const cardName = (card.getAttribute('data-name') || '').toLowerCase();
      const cardTheme = (card.getAttribute('data-theme') || '').toLowerCase();

      // Mixed Filter matches either Community or Style!
      const matchesFilter = (currentFilter === 'all' || 
                             cardCategory === currentFilter || 
                             cardStyle === currentFilter);

      const matchesSearch = (!query || 
                             cardName.includes(query) || 
                             cardTheme.includes(query) || 
                             cardCategory.includes(query) ||
                             cardStyle.includes(query) ||
                             cardCode.includes(query) ||
                             (`code ${cardCode}`).includes(query));

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // 2. Sort cards
    const visibleCards = sampleCards.filter(card => card.style.display !== 'none');
    
    visibleCards.sort((a, b) => {
      const codeA = parseInt(a.getAttribute('data-code') || '999', 10);
      const codeB = parseInt(b.getAttribute('data-code') || '999', 10);
      const orderA = parseInt(a.getAttribute('data-order') || '999', 10);
      const orderB = parseInt(b.getAttribute('data-order') || '999', 10);
      const isNewA = a.getAttribute('data-new') === 'true' ? 1 : 0;
      const isNewB = b.getAttribute('data-new') === 'true' ? 1 : 0;
      const isPopA = a.getAttribute('data-popular') === 'true' ? 1 : 0;
      const isPopB = b.getAttribute('data-popular') === 'true' ? 1 : 0;
      const nameA = a.getAttribute('data-name') || '';
      const nameB = b.getAttribute('data-name') || '';

      if (currentSort === 'code-asc') {
        return codeA - codeB;
      } else if (currentSort === 'name-asc') {
        return nameA.localeCompare(nameB);
      } else if (currentSort === 'popular') {
        return isPopB - isPopA || orderA - orderB;
      } else if (currentSort === 'newest') {
        return isNewB - isNewA || orderA - orderB;
      } else {
        return orderA - orderB;
      }
    });

    // Re-append in sorted order
    visibleCards.forEach(card => samplesGrid.appendChild(card));

    // Handle Empty State
    if (visibleCount === 0) {
      emptySearchState.style.display = 'block';
      emptyDesc.textContent = rawQuery
        ? `No invitations found for "${searchInput.value.trim()}".`
        : 'No invitations match the selected category.';
      samplesGrid.style.display = 'none';
    } else {
      emptySearchState.style.display = 'none';
      samplesGrid.style.display = 'grid';
    }

    // Update Counter & Active Label
    if (rawQuery) {
      activeStyleLabel.textContent = `Search: "${searchInput.value.trim()}"`;
      activeCount.textContent = `${visibleCount} Found`;
    } else {
      const labelMap = {
        'all': 'All Invitations',
        'hindu': 'Hindu Collection',
        'sikh': 'Sikh & Punjabi',
        'south-indian': 'South Indian',
        'islamic': 'Islamic Collection',
        'christian': 'Christian Collection',
        'royal': 'Royal Designs',
        'modern': 'Modern Designs',
        'cinematic': 'Cinematic Designs',
        'traditional': 'Traditional Designs'
      };

      activeStyleLabel.textContent = labelMap[currentFilter] || `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Collection`;
      activeCount.textContent = `${visibleCount} Designs`;
    }
  }

  // Live Search Input Event
  searchInput.addEventListener('input', () => {
    applyFiltersAndSort();
  });

  // Clear Search Button Event
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    applyFiltersAndSort();
  });

  // Reset Empty State Event
  emptyResetBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentFilter = 'all';
    currentSort = 'recommended';
    syncCategoryUI('all');
    syncSortUI('recommended');
    applyFiltersAndSort();
  });

  // --------------------------------------------------------------------------
  // Category Selection (Mixed Row)
  // --------------------------------------------------------------------------
  function setFilter(filterVal) {
    currentFilter = filterVal;
    syncCategoryUI(filterVal);
    applyFiltersAndSort();
  }

  function syncCategoryUI(filterVal) {
    categoryChips.forEach(chip => {
      if (chip.getAttribute('data-filter') === filterVal) {
        chip.classList.add('active');
        chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        chip.classList.remove('active');
      }
    });

    bottomTabs.forEach(tab => {
      if (tab.getAttribute('data-filter') === filterVal) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-filter');
      setFilter(val);
    });
  });

  bottomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const val = tab.getAttribute('data-filter');
      setFilter(val);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // --------------------------------------------------------------------------
  // Right-Side Sort Dropdown Logic
  // --------------------------------------------------------------------------
  function toggleSortDropdown(forceState) {
    const isExpanded = forceState !== undefined ? forceState : sortFilterBtn.getAttribute('aria-expanded') !== 'true';
    sortFilterBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    if (isExpanded) {
      sortDropdownMenu.classList.add('active');
    } else {
      sortDropdownMenu.classList.remove('active');
    }
  }

  sortFilterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSortDropdown();
  });

  document.addEventListener('click', (e) => {
    if (!sortFilterBtn.contains(e.target) && !sortDropdownMenu.contains(e.target)) {
      toggleSortDropdown(false);
    }
  });

  function syncSortUI(sortValue) {
    const sortTitles = {
      'recommended': 'Recommended',
      'popular': 'Most Popular',
      'newest': 'Newest Added',
      'code-asc': 'Code: 001-020',
      'name-asc': 'Name: A to Z'
    };

    sortLabel.textContent = sortTitles[sortValue] || 'Sort';

    sortOptions.forEach(opt => {
      if (opt.getAttribute('data-sort') === sortValue) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  sortOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const sortVal = opt.getAttribute('data-sort');
      currentSort = sortVal;
      syncSortUI(sortVal);
      toggleSortDropdown(false);
      applyFiltersAndSort();
    });
  });

  // --------------------------------------------------------------------------
  // In-App Fullscreen Modal Preview
  // --------------------------------------------------------------------------
  function openPreview(card) {
    const url = card.getAttribute('data-url');
    const name = card.getAttribute('data-name');
    const code = card.getAttribute('data-code');

    if (!url) return;

    modalTitle.textContent = code ? `${name} (#${code})` : (name || 'Wedding Invite');
    modalExternalLink.href = url;
    fallbackLink.href = url;

    previewLoader.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    previewModal.classList.add('active');
    previewModal.setAttribute('aria-hidden', 'false');

    previewIframe.src = url;

    const hideLoader = () => {
      previewLoader.classList.add('hidden');
      previewIframe.removeEventListener('load', hideLoader);
    };

    previewIframe.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 3500);

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
