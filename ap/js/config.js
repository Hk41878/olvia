// js/config.js
// =========================================================
// AliPerLaLiberta — Global App Configuration
// =========================================================

window.APP_CONFIG = Object.freeze({

  // ---------------------------
  // Layout Breakpoints
  // ---------------------------
  LARGE_BP: 992,  // Desktop breakpoint (px)

  // ---------------------------
  // Local-storage expiry time for language preference
  // Default: 60 × 1000 = 1 minute
  // You can change to 3600 × 1000 = 1 hour when stable
  // ---------------------------
  EXPIRY_MS: 24 * 60 * 60 * 1000,

  // ---------------------------
  // Storage Keys
  // ---------------------------
  STORAGE_KEYS: Object.freeze({
    LANG: "apll.lang"
  })
});
