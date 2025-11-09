/**
 * Version Switcher
 * Manages toggling between v1 (classic) and v2 (enhanced) versions
 */

(function() {
  'use strict';

  const VERSION_KEY = 'cis-hymnal-version';
  const DEFAULT_VERSION = 'v1';

  // Get current version from localStorage
  function getCurrentVersion() {
    return localStorage.getItem(VERSION_KEY) || DEFAULT_VERSION;
  }

  // Set version in localStorage
  function setVersion(version) {
    localStorage.setItem(VERSION_KEY, version);
  }

  // Toggle between versions
  function toggleVersion() {
    const currentVersion = getCurrentVersion();
    const newVersion = currentVersion === 'v1' ? 'v2' : 'v1';
    setVersion(newVersion);

    // Reload page to apply new version
    window.location.reload();
  }

  // Load appropriate stylesheet based on version
  function loadVersionStyles() {
    const version = getCurrentVersion();
    const styleSheet = version === 'v2' ? 'styles-v2.css' : 'styles.css';

    // Find existing stylesheet link
    const existingLink = document.querySelector('link[href*="styles"]');
    if (existingLink) {
      const baseURL = existingLink.href.substring(0, existingLink.href.lastIndexOf('/') + 1);
      existingLink.href = baseURL + styleSheet;
    }
  }

  // Load appropriate script based on version
  function loadVersionScript() {
    const version = getCurrentVersion();
    window.HYMNAL_VERSION = version;

    // Dynamically load the appropriate script version
    if (version === 'v2') {
      // Check if we need to load v2 script
      if (!document.querySelector('script[src*="script-v2.js"]')) {
        // We'll handle this in the template instead
        console.log('V2 mode active');
      }
    }
  }

  // Initialize on page load
  function init() {
    loadVersionStyles();
    loadVersionScript();

    // Make toggle function globally available
    window.toggleHymnalVersion = toggleVersion;
    window.getCurrentHymnalVersion = getCurrentVersion;

    // Update button label based on current version
    updateVersionButtonLabel();
  }

  // Update version button label
  function updateVersionButtonLabel() {
    const version = getCurrentVersion();
    const labels = document.querySelectorAll('.version-label');
    labels.forEach(label => {
      label.textContent = version === 'v2' ? 'Back to V1' : 'Try V2';
    });
  }

  // Run initialization immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
