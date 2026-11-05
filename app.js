// ==========================================================================
// INVCRAFTMEDIA - Streamlined Client Experience Logic
// 1. Direct-to-WhatsApp Flow (Custom pre-filled order messages)
// 2. Interactive Mobile Fullscreen Preview Modal (#previewModal)
// 3. Category Filter Tabs & Realtime Search
// 4. Floating WhatsApp CTA & Drawer Menu
// 5. Interactive FAQ Accordion
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Configuration: WhatsApp Phone Number (Direct Orders & Customization)
  // --------------------------------------------------------------------------
  const WHATSAPP_PHONE = '918209415303';

  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const navDrawerBackdrop = document.getElementById('navDrawerBackdrop');
  const menuIconBars = mobileMenuBtn ? mobileMenuBtn.querySelector('.menu-icon-bars') : null;
  const menuIconClose = mobileMenuBtn ? mobileMenuBtn.querySelector('.menu-icon-close') : null;

  // Preview Modal
  const previewModal = document.getElementById('previewModal');
  const modalBackBtn = document.getElementById('modalBackBtn');
  const previewIframe = document.getElementById('previewIframe');
  const previewLoader = document.getElementById('previewLoader');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitleText = document.getElementById('modalSubtitleText');
  const modalExternalLink = document.getElementById('modalExternalLink');
  const previewSellBar = document.getElementById('previewSellBar');
  const sellBarCode = document.getElementById('sellBarCode');
  const previewWhatsappBtn = document.getElementById('startCustomizeFromPreviewBtn') || document.getElementById('previewWhatsappBtn');

  // Search & Filtering
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const emptySearchState = document.getElementById('emptySearchState');
  const emptyDesc = document.getElementById('emptyDesc');
  const emptyResetBtn = document.getElementById('emptyResetBtn');
  const samplesGrid = document.getElementById('samplesGrid');
  const sampleCards = document.querySelectorAll('.sample-card');
  const catChips = document.querySelectorAll('.cat-chip, .filter-pill');
  const bottomNavTabs = document.querySelectorAll('.bottom-mobile-nav .nav-tab');
  const sortSelect = document.getElementById('sortSelect');
  const activeStyleLabel = document.getElementById('activeStyleLabel');
  const activeCount = document.getElementById('activeCount');

  // --------------------------------------------------------------------------
  // Configure WhatsApp Links
  // --------------------------------------------------------------------------
  const drawerWaBtn = document.querySelector('.drawer-wa-btn');
  if (drawerWaBtn) {
    const defaultMsg = 'Hello InvCraftMedia! I want to explore wedding invitation designs.';
    drawerWaBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(defaultMsg)}`;
  }

  // --------------------------------------------------------------------------
  // Mobile Nav Drawer Toggle
  // --------------------------------------------------------------------------
  let isMenuOpen = false;

  function setHamburgerMenuState(open) {
    isMenuOpen = open;
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.toggle('active', open);
      mobileNavDrawer.setAttribute('aria-hidden', (!open).toString());
    }
    if (navDrawerBackdrop) {
      navDrawerBackdrop.classList.toggle('active', open);
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', open.toString());
      if (menuIconBars && menuIconClose) {
        menuIconBars.style.display = open ? 'none' : 'block';
        menuIconClose.style.display = open ? 'block' : 'none';
      }
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setHamburgerMenuState(!isMenuOpen);
    });
  }

  if (navDrawerBackdrop) {
    navDrawerBackdrop.addEventListener('click', () => setHamburgerMenuState(false));
  }

  document.querySelectorAll('[data-close-drawer]').forEach(item => {
    item.addEventListener('click', () => setHamburgerMenuState(false));
  });

  // --------------------------------------------------------------------------
  // Card Data Extraction Helper
  // --------------------------------------------------------------------------
  function extractCardData(card) {
    return {
      code: card.getAttribute('data-code') || '001',
      name: card.getAttribute('data-name') || card.querySelector('.card-title')?.textContent.trim() || 'Wedding Sample',
      theme: card.getAttribute('data-theme') || card.querySelector('.card-sub')?.textContent.trim() || 'Digital Wedding Invite',
      category: card.getAttribute('data-category') || 'hindu',
      url: card.getAttribute('data-url') || '',
      cover: card.querySelector('.card-img')?.getAttribute('src') || ''
    };
  }

  // --------------------------------------------------------------------------
  // Live Mobile Preview Modal
  // --------------------------------------------------------------------------
  function openPreview(data) {
    if (!data || !data.url) return;

    if (modalTitle) modalTitle.textContent = data.name;
    if (modalSubtitleText) modalSubtitleText.textContent = data.theme;
    if (modalExternalLink) modalExternalLink.href = data.url;
    if (sellBarCode) sellBarCode.textContent = `DESIGN #${data.code}`;

    // WhatsApp Message
    if (previewWhatsappBtn) {
      const msg = `Hello InvCraftMedia! I want to customize this wedding invitation:
📌 Design #${data.code} - ${data.name}
🎨 Theme: ${data.theme}
💰 Offer Price: ₹999 (Regular ₹3,499)
🔗 Live Demo: ${data.url}

Please share how to add my wedding details!`;
      previewWhatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }

    if (previewLoader) previewLoader.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (previewModal) {
      previewModal.classList.add('active');
      previewModal.setAttribute('aria-hidden', 'false');
    }

    if (previewIframe) {
      previewIframe.src = data.url;
      const hideLoader = () => {
        if (previewLoader) previewLoader.classList.add('hidden');
        previewIframe.removeEventListener('load', hideLoader);
      };
      previewIframe.addEventListener('load', hideLoader);
      setTimeout(hideLoader, 3000);
    }
  }

  function closePreview() {
    if (!previewModal || !previewModal.classList.contains('active')) return;
    previewModal.classList.remove('active');
    previewModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (previewIframe) previewIframe.src = 'about:blank';
      if (previewLoader) previewLoader.classList.remove('hidden');
    }, 200);
  }

  if (modalBackBtn) {
    modalBackBtn.addEventListener('click', closePreview);
  }

  // Attach preview triggers to cards
  sampleCards.forEach(card => {
    const data = extractCardData(card);

    card.addEventListener('click', () => {
      openPreview(data);
    });

    const playBtn = card.querySelector('.play-pill-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPreview(data);
      });
    }
  });

  // --------------------------------------------------------------------------
  // Search & Filtering Engine
  // --------------------------------------------------------------------------
  let currentCategory = 'all';
  let currentSearchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    const query = currentSearchQuery.trim().toLowerCase();
    const activeFilter = currentCategory.toLowerCase();

    sampleCards.forEach(card => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const cardStyle = (card.getAttribute('data-style') || '').toLowerCase();
      const cardName = (card.getAttribute('data-name') || '').toLowerCase();
      const cardTheme = (card.getAttribute('data-theme') || '').toLowerCase();
      const cardCode = (card.getAttribute('data-code') || '').toLowerCase();

      // Check category/style match
      const matchesCategory = (
        activeFilter === 'all' || 
        cardCategory === activeFilter || 
        cardStyle === activeFilter
      );

      // Check search match
      const matchesSearch = !query || 
        cardName.includes(query) || 
        cardTheme.includes(query) || 
        cardCode.includes(query) ||
        `#${cardCode}`.includes(query);

      const isVisible = matchesCategory && matchesSearch;

      if (isVisible) {
        card.classList.remove('is-hidden');
        card.style.display = '';
        visibleCount++;
      } else {
        card.classList.add('is-hidden');
        card.style.display = 'none';
      }
    });

    if (activeCount) {
      activeCount.textContent = `Showing ${visibleCount} invitation${visibleCount === 1 ? '' : 's'}`;
    }

    if (emptySearchState) {
      if (visibleCount === 0) {
        emptySearchState.style.display = 'block';
        if (emptyDesc) {
          emptyDesc.textContent = query
            ? `No templates matching "${query}" in this category.`
            : 'No invitations found for the selected category.';
        }
      } else {
        emptySearchState.style.display = 'none';
      }
    }
  }

  function setCategory(catValue) {
    currentCategory = catValue;

    // Sync top category chips
    catChips.forEach(chip => {
      const chipFilter = chip.getAttribute('data-filter') || 'all';
      chip.classList.toggle('active', chipFilter === currentCategory);
    });

    // Sync bottom navigation tabs
    bottomNavTabs.forEach(tab => {
      const tabFilter = tab.getAttribute('data-filter') || 'all';
      tab.classList.toggle('active', tabFilter === currentCategory);
    });

    if (activeStyleLabel) {
      const activeBtn = document.querySelector(`.cat-chip[data-filter="${currentCategory}"]`) || 
                        document.querySelector(`.bottom-mobile-nav .nav-tab[data-filter="${currentCategory}"]`);
      activeStyleLabel.textContent = currentCategory === 'all' 
        ? 'All Collections' 
        : (activeBtn ? activeBtn.textContent.trim() : currentCategory);
    }

    applyFilters();
  }

  // Top Category Chips (Horizontal Scroll)
  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.getAttribute('data-filter') || 'all';
      setCategory(filter);
    });
  });

  // Bottom Mobile Nav Tabs
  bottomNavTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = tab.getAttribute('data-filter') || 'all';
      setCategory(filter);

      // Scroll matching chip into view in the top category bar
      const matchingChip = document.querySelector(`.cat-chip[data-filter="${filter}"]`);
      if (matchingChip && matchingChip.scrollIntoView) {
        matchingChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }

      // Smooth scroll up to catalog
      const catalog = document.getElementById('catalogSection');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Search Input Handlers
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('visible', currentSearchQuery.length > 0);
      }
      applyFilters();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      searchClearBtn.classList.remove('visible');
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      if (searchClearBtn) searchClearBtn.classList.remove('visible');

      currentCategory = 'all';
      filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));
      bottomNavTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-filter') === 'all'));
      if (activeStyleLabel) activeStyleLabel.textContent = 'All Collections';

      applyFilters();
    });
  }

  // Sort Dropdown
  if (sortSelect && samplesGrid) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      const cardsArr = Array.from(sampleCards);

      cardsArr.sort((a, b) => {
        const orderA = parseInt(a.getAttribute('data-order') || '0', 10);
        const orderB = parseInt(b.getAttribute('data-order') || '0', 10);
        const isPopA = a.hasAttribute('data-popular') ? 1 : 0;
        const isPopB = b.hasAttribute('data-popular') ? 1 : 0;
        const isNewA = a.hasAttribute('data-new') ? 1 : 0;
        const isNewB = b.hasAttribute('data-new') ? 1 : 0;

        if (val === 'popular') return isPopB - isPopA || orderA - orderB;
        if (val === 'newest') return isNewB - isNewA || orderB - orderA;
        return orderA - orderB;
      });

      cardsArr.forEach(card => samplesGrid.appendChild(card));
    });
  }

  // --------------------------------------------------------------------------
  // Interactive FAQ Accordion
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const btn = other.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        });
        // Toggle current
        item.classList.toggle('active', !isOpen);
        questionBtn.setAttribute('aria-expanded', (!isOpen).toString());
      });
    }
  });

  // --------------------------------------------------------------------------
  // Keyboard Escape
  // --------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setHamburgerMenuState(false);
      closePreview();
    }
  });
});
