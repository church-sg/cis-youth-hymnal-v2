/**
 * Dynamic Script Loader
 * Loads the appropriate script version based on user preference
 */

(function() {
  'use strict';

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function getVersion() {
    return localStorage.getItem('cis-hymnal-version') || 'v1';
  }

  // Load appropriate script version
  async function init() {
    const version = getVersion();
    const basePath = window.location.origin;

    try {
      if (version === 'v2') {
        console.log('Loading V2 script...');
        await loadScript(basePath + '/js/script-v2.js');
      } else {
        console.log('Loading V1 script...');
        await loadScript(basePath + '/js/script.js');
      }
    } catch (error) {
      console.error('Error loading script:', error);
      // Fallback to v1
      if (version === 'v2') {
        await loadScript(basePath + '/js/script.js');
      }
    }
  }

  init();
})();
