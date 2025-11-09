/**
 * CIS Youth Hymnal V2 - Enhanced Edition
 * Complete feature-rich implementation
 */

(function () {
  'use strict';

  // ========================================
  // Global State Management
  // ========================================
  const STATE = {
    pagesIndex: null,
    favorites: new Set(),
    history: [],
    settings: {
      theme: 'auto', // 'light', 'dark', 'auto'
      fontSize: 1, // Scale factor
      searchHistory: [],
      maxSearchHistory: 10,
      maxHistory: 20
    },
    currentQuery: '',
    searchTimeout: null,
    swipeStart: null,
    swipeEnd: null,
    modals: {},
  };

  // ========================================
  // Local Storage Management
  // ========================================
  const Storage = {
    keys: {
      FAVORITES: 'cis-hymnal-favorites',
      HISTORY: 'cis-hymnal-history',
      SETTINGS: 'cis-hymnal-settings',
    },

    load() {
      try {
        // Load favorites
        const favorites = localStorage.getItem(this.keys.FAVORITES);
        if (favorites) {
          STATE.favorites = new Set(JSON.parse(favorites));
        }

        // Load history
        const history = localStorage.getItem(this.keys.HISTORY);
        if (history) {
          STATE.history = JSON.parse(history);
        }

        // Load settings
        const settings = localStorage.getItem(this.keys.SETTINGS);
        if (settings) {
          STATE.settings = { ...STATE.settings, ...JSON.parse(settings) };
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    },

    saveFavorites() {
      try {
        localStorage.setItem(
          this.keys.FAVORITES,
          JSON.stringify([...STATE.favorites])
        );
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    },

    saveHistory() {
      try {
        localStorage.setItem(
          this.keys.HISTORY,
          JSON.stringify(STATE.history)
        );
      } catch (error) {
        console.error('Error saving history:', error);
      }
    },

    saveSettings() {
      try {
        localStorage.setItem(
          this.keys.SETTINGS,
          JSON.stringify(STATE.settings)
        );
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    },
  };

  // ========================================
  // Theme Management
  // ========================================
  const ThemeManager = {
    init() {
      this.applyTheme(STATE.settings.theme);
    },

    applyTheme(theme) {
      const root = document.documentElement;

      if (theme === 'auto') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', theme);
      }

      STATE.settings.theme = theme;
      Storage.saveSettings();
    },

    toggle() {
      const themes = ['light', 'dark', 'auto'];
      const currentIndex = themes.indexOf(STATE.settings.theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      this.applyTheme(themes[nextIndex]);

      Toast.show(`Theme: ${themes[nextIndex]}`, 'info');
    },

    getCurrentTheme() {
      return STATE.settings.theme;
    },
  };

  // ========================================
  // Font Size Management
  // ========================================
  const FontSizeManager = {
    init() {
      this.applyFontSize(STATE.settings.fontSize);
    },

    applyFontSize(scale) {
      document.documentElement.style.setProperty('--user-font-scale', scale);
      STATE.settings.fontSize = scale;
      Storage.saveSettings();
    },

    increase() {
      const newScale = Math.min(STATE.settings.fontSize + 0.1, 2);
      this.applyFontSize(newScale);
      Toast.show(`Font size: ${Math.round(newScale * 100)}%`, 'info');
    },

    decrease() {
      const newScale = Math.max(STATE.settings.fontSize - 0.1, 0.7);
      this.applyFontSize(newScale);
      Toast.show(`Font size: ${Math.round(newScale * 100)}%`, 'info');
    },

    reset() {
      this.applyFontSize(1);
      Toast.show('Font size reset to 100%', 'info');
    },
  };

  // ========================================
  // Favorites Management
  // ========================================
  const Favorites = {
    toggle(hymnId) {
      if (STATE.favorites.has(hymnId)) {
        STATE.favorites.delete(hymnId);
        Toast.show('Removed from favorites', 'info');
      } else {
        STATE.favorites.add(hymnId);
        Toast.show('Added to favorites', 'success');
      }
      Storage.saveFavorites();
      this.updateUI();
    },

    has(hymnId) {
      return STATE.favorites.has(hymnId);
    },

    getAll() {
      return [...STATE.favorites];
    },

    updateUI() {
      // Update favorite buttons in the UI
      document.querySelectorAll('.favorite-btn').forEach((btn) => {
        const hymnId = btn.dataset.hymnId;
        if (this.has(hymnId)) {
          btn.classList.add('active');
          btn.innerHTML = '<span class="material-symbols-outlined">favorite</span>';
        } else {
          btn.classList.remove('active');
          btn.innerHTML = '<span class="material-symbols-outlined">favorite_border</span>';
        }
      });
    },
  };

  // ========================================
  // History Management
  // ========================================
  const History = {
    add(hymn) {
      // Remove if already exists
      STATE.history = STATE.history.filter((h) => h.href !== hymn.href);

      // Add to beginning
      STATE.history.unshift({
        ...hymn,
        timestamp: Date.now(),
      });

      // Limit history size
      if (STATE.history.length > STATE.settings.maxHistory) {
        STATE.history = STATE.history.slice(0, STATE.settings.maxHistory);
      }

      Storage.saveHistory();
    },

    getRecent(limit = 5) {
      return STATE.history.slice(0, limit);
    },

    clear() {
      STATE.history = [];
      Storage.saveHistory();
      Toast.show('History cleared', 'info');
    },

    isRecent(hymnId) {
      const recent = this.getRecent();
      return recent.some((h) => h.href === `/hymns/${hymnId}`);
    },
  };

  // ========================================
  // Search Functionality
  // ========================================
  const Search = {
    $results: null,

    init() {
      this.$results = $('#results');
      this.setupSearchInput();
    },

    setupSearchInput() {
      const $search = $('#search');

      $search.on('keyup', (e) => {
        clearTimeout(STATE.searchTimeout);

        STATE.searchTimeout = setTimeout(() => {
          this.performSearch($(e.target).val());
        }, 150); // Debounce
      });

      // Clear button functionality
      $search.on('input', (e) => {
        const value = $(e.target).val();
        if (value) {
          this.showClearButton();
        } else {
          this.hideClearButton();
        }
      });
    },

    showClearButton() {
      let $clearBtn = $('.search-clear-btn');
      if ($clearBtn.length === 0) {
        $clearBtn = $('<button>')
          .addClass('search-clear-btn')
          .html('<span class="material-symbols-outlined">close</span>')
          .on('click', () => this.clearSearch());
        $('#search').after($clearBtn);
      }
      $clearBtn.addClass('visible');
    },

    hideClearButton() {
      $('.search-clear-btn').removeClass('visible');
    },

    clearSearch() {
      $('#search').val('').trigger('keyup').focus();
      this.hideClearButton();
    },

    performSearch(query) {
      this.$results.empty();

      const cleanQuery = query
        .replace(/[^\w\s]|_/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      STATE.currentQuery = cleanQuery;

      let results;
      if (isNaN(parseInt(cleanQuery))) {
        results = this.searchByText(cleanQuery);
      } else {
        results = this.searchByNumber(cleanQuery);
      }

      this.renderResults(results, cleanQuery);
    },

    searchByText(query) {
      if (!query) return STATE.pagesIndex;

      return STATE.pagesIndex.filter((page) => {
        return (
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.content.toLowerCase().includes(query.toLowerCase())
        );
      });
    },

    searchByNumber(number) {
      return STATE.pagesIndex.filter((page) => {
        return page.href.replace('/hymns/', '').includes(number);
      });
    },

    highlightText(text, query) {
      if (!query) return text;

      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    },

    renderResults(results, query = '') {
      if (!results || results.length === 0) {
        this.renderEmptyState();
        return;
      }

      // Announce results for screen readers
      this.$results.attr('aria-label', `${results.length} hymns found`);

      results.forEach((result, index) => {
        const hymnNumber = result.href.replace('/hymns/', '');
        const isFavorite = Favorites.has(hymnNumber);
        const isRecent = History.isRecent(hymnNumber);

        const $li = $('<li>').css('animation-delay', `${index * 30}ms`);

        const $link = $('<a>', {
          href: '.' + result.href + '/',
          'data-hymn-id': hymnNumber,
        });

        // Hymn number
        const $number = $('<span>')
          .addClass('hymn-number')
          .text(hymnNumber);

        // Title with optional highlighting
        const titleText = query
          ? this.highlightText(result.title, query)
          : result.title;

        const $title = $('<span>').addClass('hymn-title').html(titleText);

        // Badges
        const $badges = $('<div>').addClass('hymn-badges');
        if (isFavorite) {
          $badges.append(
            $('<span>')
              .addClass('badge badge-favorite')
              .html('<span class="material-symbols-outlined">favorite</span>')
          );
        }
        if (isRecent) {
          $badges.append(
            $('<span>')
              .addClass('badge badge-recent')
              .text('Recent')
          );
        }
        if (result.medlyFrom || result.medlyTo) {
          $badges.append(
            $('<span>')
              .addClass('badge badge-medley')
              .html('<span class="material-symbols-outlined">queue_music</span>')
          );
        }

        // Add click handler to track history
        $link.on('click', () => {
          History.add(result);
        });

        $link.append($number, $title);
        if ($badges.children().length > 0) {
          $link.append($badges);
        }

        $li.append($link);
        this.$results.append($li);
      });
    },

    renderEmptyState() {
      this.$results.attr('aria-label', 'No hymns found');

      const $emptyState = $('<div>')
        .addClass('empty-state')
        .html(`
          <div class="empty-state-icon">
            <span class="material-symbols-outlined">search_off</span>
          </div>
          <h3 class="empty-state-title">No hymns found</h3>
          <p class="empty-state-description">
            Try adjusting your search terms or browse all hymns by clearing the search box.
          </p>
        `);

      const $li = $('<li>').append($emptyState);
      this.$results.append($li);
    },

    renderLoadingState() {
      this.$results.empty();

      for (let i = 0; i < 5; i++) {
        const $skeleton = $('<div>')
          .addClass('skeleton-card')
          .html(`
            <div class="skeleton-number"></div>
            <div class="skeleton-title"></div>
          `);

        const $li = $('<li>').append($skeleton);
        this.$results.append($li);
      }
    },
  };

  // ========================================
  // Keyboard Shortcuts
  // ========================================
  const KeyboardShortcuts = {
    init() {
      document.addEventListener('keydown', (e) => {
        // Focus search: /
        if (e.key === '/' && !this.isInputFocused()) {
          e.preventDefault();
          $('#search').focus();
        }

        // Escape: Clear search or close modal
        if (e.key === 'Escape') {
          if (Modal.hasOpenModal()) {
            Modal.closeAll();
          } else if ($('#search').val()) {
            Search.clearSearch();
          }
        }

        // Ctrl/Cmd + K: Settings
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          Modal.open('settings');
        }

        // Ctrl/Cmd + D: Toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
          e.preventDefault();
          ThemeManager.toggle();
        }

        // Ctrl/Cmd + +: Increase font size
        if ((e.ctrlKey || e.metaKey) && e.key === '=') {
          e.preventDefault();
          FontSizeManager.increase();
        }

        // Ctrl/Cmd + -: Decrease font size
        if ((e.ctrlKey || e.metaKey) && e.key === '-') {
          e.preventDefault();
          FontSizeManager.decrease();
        }

        // Ctrl/Cmd + 0: Reset font size
        if ((e.ctrlKey || e.metaKey) && e.key === '0') {
          e.preventDefault();
          FontSizeManager.reset();
        }

        // Arrow keys for hymn navigation (on hymn pages)
        if (this.isHymnPage()) {
          if (e.key === 'ArrowLeft') {
            const $prev = $('.btn-prev:not(.invisible)');
            if ($prev.length) {
              window.location.href = $prev.attr('href');
            }
          }
          if (e.key === 'ArrowRight') {
            const $next = $('.btn-next:not(.invisible)');
            if ($next.length) {
              window.location.href = $next.attr('href');
            }
          }
        }
      });
    },

    isInputFocused() {
      const activeElement = document.activeElement;
      return (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );
    },

    isHymnPage() {
      return window.location.pathname.includes('/hymns/');
    },
  };

  // ========================================
  // Swipe Gestures (Mobile)
  // ========================================
  const SwipeGestures = {
    init() {
      if (!this.isMobile()) return;

      const lyricsContainer = document.querySelector('.lyrics');
      if (!lyricsContainer) return;

      lyricsContainer.addEventListener('touchstart', (e) => {
        STATE.swipeStart = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        };
      });

      lyricsContainer.addEventListener('touchend', (e) => {
        if (!STATE.swipeStart) return;

        STATE.swipeEnd = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
          time: Date.now(),
        };

        this.handleSwipe();
      });
    },

    handleSwipe() {
      const diffX = STATE.swipeEnd.x - STATE.swipeStart.x;
      const diffY = STATE.swipeEnd.y - STATE.swipeStart.y;
      const diffTime = STATE.swipeEnd.time - STATE.swipeStart.time;

      // Check if horizontal swipe (not vertical scroll)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && diffTime < 300) {
        if (diffX > 0) {
          // Swipe right - go to previous
          const $prev = $('.btn-prev:not(.invisible)');
          if ($prev.length) {
            window.location.href = $prev.attr('href');
          }
        } else {
          // Swipe left - go to next
          const $next = $('.btn-next:not(.invisible)');
          if ($next.length) {
            window.location.href = $next.attr('href');
          }
        }
      }

      STATE.swipeStart = null;
      STATE.swipeEnd = null;
    },

    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  };

  // ========================================
  // Modal Management
  // ========================================
  const Modal = {
    init() {
      this.createSettingsModal();
      this.createHelpModal();
      this.setupEventListeners();
    },

    createSettingsModal() {
      const modal = $(`
        <div class="modal-backdrop" id="settings-modal">
          <div class="modal" role="dialog" aria-labelledby="settings-title" aria-modal="true">
            <div class="modal-header">
              <h2 class="modal-title" id="settings-title">Settings</h2>
              <button class="modal-close" aria-label="Close settings">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="settings-group">
                <h3 class="settings-group-title">Appearance</h3>

                <div class="settings-item">
                  <div class="settings-label">
                    <div class="settings-label-text">Theme</div>
                    <div class="settings-label-description">Choose your color scheme</div>
                  </div>
                  <select id="theme-select" class="settings-select">
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div class="settings-item">
                  <div class="settings-label">
                    <div class="settings-label-text">Font Size</div>
                    <div class="settings-label-description">Adjust text size</div>
                  </div>
                  <div class="font-size-control">
                    <button class="font-size-btn" id="font-decrease">A-</button>
                    <span class="font-size-display" id="font-size-display">100%</span>
                    <button class="font-size-btn" id="font-increase">A+</button>
                  </div>
                </div>
              </div>

              <div class="settings-group">
                <h3 class="settings-group-title">Data</h3>

                <div class="settings-item">
                  <div class="settings-label">
                    <div class="settings-label-text">Clear History</div>
                    <div class="settings-label-description">Remove recently viewed hymns</div>
                  </div>
                  <button class="btn btn-secondary" id="clear-history-btn">Clear</button>
                </div>

                <div class="settings-item">
                  <div class="settings-label">
                    <div class="settings-label-text">Clear Favorites</div>
                    <div class="settings-label-description">Remove all favorite hymns</div>
                  </div>
                  <button class="btn btn-secondary" id="clear-favorites-btn">Clear</button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary modal-close">Done</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(modal);
    },

    createHelpModal() {
      const modal = $(`
        <div class="modal-backdrop" id="help-modal">
          <div class="modal" role="dialog" aria-labelledby="help-title" aria-modal="true">
            <div class="modal-header">
              <h2 class="modal-title" id="help-title">Keyboard Shortcuts</h2>
              <button class="modal-close" aria-label="Close help">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid var(--color-divider);">
                  <td style="padding: var(--space-md); font-weight: var(--font-weight-semibold);">Action</td>
                  <td style="padding: var(--space-md); font-weight: var(--font-weight-semibold);">Shortcut</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-divider);">
                  <td style="padding: var(--space-md);">Focus search</td>
                  <td style="padding: var(--space-md);"><code>/</code></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-divider);">
                  <td style="padding: var(--space-md);">Open settings</td>
                  <td style="padding: var(--space-md);"><code>Ctrl/Cmd + K</code></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-divider);">
                  <td style="padding: var(--space-md);">Toggle theme</td>
                  <td style="padding: var(--space-md);"><code>Ctrl/Cmd + D</code></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-divider);">
                  <td style="padding: var(--space-md);">Increase font</td>
                  <td style="padding: var(--space-md);"><code>Ctrl/Cmd + =</code></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-divider);">
                  <td style="padding: var(--space-md);">Decrease font</td>
                  <td style="padding: var(--space-md);"><code>Ctrl/Cmd + -</code></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-divider);">
                  <td style="padding: var(--space-md);">Reset font size</td>
                  <td style="padding: var(--space-md);"><code>Ctrl/Cmd + 0</code></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-divider);">
                  <td style="padding: var(--space-md);">Previous hymn</td>
                  <td style="padding: var(--space-md);"><code>←</code> or swipe right</td>
                </tr>
                <tr>
                  <td style="padding: var(--space-md);">Next hymn</td>
                  <td style="padding: var(--space-md);"><code>→</code> or swipe left</td>
                </tr>
              </table>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary modal-close">Got it!</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(modal);
    },

    setupEventListeners() {
      // Close modal on backdrop click
      $('.modal-backdrop').on('click', (e) => {
        if ($(e.target).hasClass('modal-backdrop')) {
          this.close($(e.target).attr('id'));
        }
      });

      // Close button
      $('.modal-close').on('click', function() {
        const modalId = $(this).closest('.modal-backdrop').attr('id');
        Modal.close(modalId);
      });

      // Settings modal controls
      $('#theme-select').on('change', (e) => {
        ThemeManager.applyTheme(e.target.value);
      });

      $('#font-increase').on('click', () => {
        FontSizeManager.increase();
        this.updateFontSizeDisplay();
      });

      $('#font-decrease').on('click', () => {
        FontSizeManager.decrease();
        this.updateFontSizeDisplay();
      });

      $('#clear-history-btn').on('click', () => {
        if (confirm('Clear all viewing history?')) {
          History.clear();
        }
      });

      $('#clear-favorites-btn').on('click', () => {
        if (confirm('Clear all favorites?')) {
          STATE.favorites.clear();
          Storage.saveFavorites();
          Favorites.updateUI();
          Toast.show('Favorites cleared', 'info');
        }
      });
    },

    open(modalId) {
      const $modal = $(`#${modalId}-modal`);
      if ($modal.length) {
        // Update settings values
        if (modalId === 'settings') {
          $('#theme-select').val(STATE.settings.theme);
          this.updateFontSizeDisplay();
        }

        $modal.addClass('active');
        $modal.find('.modal').focus();

        // Trap focus in modal
        this.trapFocus($modal.find('.modal')[0]);
      }
    },

    close(modalId) {
      $(`#${modalId}`).removeClass('active');
    },

    closeAll() {
      $('.modal-backdrop').removeClass('active');
    },

    hasOpenModal() {
      return $('.modal-backdrop.active').length > 0;
    },

    updateFontSizeDisplay() {
      const percentage = Math.round(STATE.settings.fontSize * 100);
      $('#font-size-display').text(`${percentage}%`);
    },

    trapFocus(element) {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    },
  };

  // ========================================
  // Toast Notifications
  // ========================================
  const Toast = {
    container: null,

    init() {
      this.container = $('<div>').addClass('toast-container');
      $('body').append(this.container);
    },

    show(message, type = 'info', duration = 3000) {
      const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning',
      };

      const $toast = $(`
        <div class="toast toast-${type}">
          <span class="material-symbols-outlined toast-icon">${icons[type]}</span>
          <span class="toast-message">${message}</span>
        </div>
      `);

      this.container.append($toast);

      // Trigger animation
      setTimeout(() => $toast.addClass('show'), 10);

      // Auto remove
      setTimeout(() => {
        $toast.removeClass('show');
        setTimeout(() => $toast.remove(), 300);
      }, duration);
    },
  };

  // ========================================
  // Share Functionality
  // ========================================
  const ShareManager = {
    async share(hymn) {
      const shareData = {
        title: `Hymn ${hymn.number}: ${hymn.title}`,
        text: `Check out this hymn from CIS Youth Hymnal`,
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          Toast.show('Shared successfully', 'success');
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(shareData.url);
          Toast.show('Link copied to clipboard', 'success');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          Toast.show('Failed to share', 'error');
        }
      }
    },

    createShareButton() {
      const hymnNumber = this.getCurrentHymnNumber();
      if (!hymnNumber) return;

      const $shareBtn = $(`
        <button class="fab" id="share-fab" aria-label="Share this hymn">
          <span class="material-symbols-outlined">share</span>
        </button>
      `);

      $shareBtn.on('click', () => {
        const hymn = STATE.pagesIndex.find(
          (h) => h.href === `/hymns/${hymnNumber}`
        );
        if (hymn) {
          this.share({
            number: hymnNumber,
            title: hymn.title,
          });
        }
      });

      $('body').append($shareBtn);
    },

    getCurrentHymnNumber() {
      const match = window.location.pathname.match(/\/hymns\/(\d+)/);
      return match ? match[1] : null;
    },
  };

  // ========================================
  // PWA Features
  // ========================================
  const PWA = {
    deferredPrompt: null,

    init() {
      this.setupInstallPrompt();
      this.setupUpdateNotification();
    },

    setupInstallPrompt() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallButton();
      });

      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        Toast.show('App installed successfully!', 'success');
      });
    },

    showInstallButton() {
      // Could show an install button or banner here
      console.log('PWA install available');
    },

    async promptInstall() {
      if (!this.deferredPrompt) return;

      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        Toast.show('Installing app...', 'info');
      }

      this.deferredPrompt = null;
    },

    setupUpdateNotification() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          Toast.show('App updated! Reload for new version.', 'info', 5000);
        });
      }
    },
  };

  // ========================================
  // Service Worker Registration
  // ========================================
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('Service Worker Registered');

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              Toast.show('New version available!', 'info', 5000);
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // ========================================
  // Data Loading
  // ========================================
  async function getPagesIndex() {
    try {
      const response = await $.getJSON('./js/PagesIndex.json');
      STATE.pagesIndex = response;
      console.log('Index loaded:', STATE.pagesIndex.length, 'hymns');
      return response;
    } catch (error) {
      console.error('Error loading index:', error);
      Toast.show('Failed to load hymn index', 'error');
      throw error;
    }
  }

  // ========================================
  // Floating Action Buttons
  // ========================================
  function setupFloatingActions() {
    // Settings FAB
    const $settingsFab = $(`
      <button class="fab" id="settings-fab" aria-label="Open settings" style="bottom: calc(var(--space-xl) + 72px);">
        <span class="material-symbols-outlined">settings</span>
      </button>
    `);

    $settingsFab.on('click', () => Modal.open('settings'));
    $('body').append($settingsFab);

    // Help FAB
    const $helpFab = $(`
      <button class="fab" id="help-fab" aria-label="Open help" style="bottom: calc(var(--space-xl) + 144px);">
        <span class="material-symbols-outlined">help</span>
      </button>
    `);

    $helpFab.on('click', () => Modal.open('help'));
    $('body').append($helpFab);
  }

  // ========================================
  // Update Version Toggle Label
  // ========================================
  function updateVersionToggleLabel() {
    const version = window.getCurrentHymnalVersion ? window.getCurrentHymnalVersion() : 'v1';
    $('.version-label').text(version === 'v2' ? 'Back to V1' : 'Try V2');
  }

  // ========================================
  // Initialization
  // ========================================
  function init() {
    // Load saved data
    Storage.load();

    // Initialize managers
    ThemeManager.init();
    FontSizeManager.init();
    Toast.init();
    Modal.init();
    KeyboardShortcuts.init();
    SwipeGestures.init();
    PWA.init();

    // Initialize search (on home page)
    if ($('#search').length) {
      Search.init();
      setupFloatingActions();
    }

    // Initialize share button (on hymn pages)
    if (window.location.pathname.includes('/hymns/')) {
      ShareManager.createShareButton();
    }

    // Update version toggle label
    updateVersionToggleLabel();
  }

  // ========================================
  // DOM Ready
  // ========================================
  $(document).ready(() => {
    init();
  });

  // ========================================
  // Window Load
  // ========================================
  $(window).on('load', async () => {
    if ($('#search').length) {
      Search.renderLoadingState();

      try {
        await getPagesIndex();
        Search.performSearch('');
      } catch (error) {
        Search.$results.empty();
        Toast.show('Failed to load hymns', 'error');
      }
    }

    // Register service worker
    registerServiceWorker();
  });

  // ========================================
  // Export for global access
  // ========================================
  window.HymnalV2 = {
    ThemeManager,
    FontSizeManager,
    Favorites,
    History,
    Modal,
    Toast,
    ShareManager,
  };
})();
