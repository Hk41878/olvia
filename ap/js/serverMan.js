// ==============================
// serverMan.js — FIXED FULL VERSION
// ==============================

// ---------- CONFIG ----------
const STATUS_URL = "https://app.apll.it/status";
const TIMEOUT_MS = 2000;
const CHECK_INTERVAL_MS = 15000;

// ---------- GLOBAL STATUS ----------
window.apllServerStatus = {
  state: "unknown",
  lastChecked: 0,
  raw: null
};

// First-load flag
let firstLoadDone = false;

// Exposed helper
window.getApllServerState = function () {
  return window.apllServerStatus.state;
};

// ---------- CHECK ----------
function checkStatusOnce() {
  return new Promise(resolve => {
    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        resolve({ ok: false, raw: null });
      }
    }, TIMEOUT_MS);

    fetch(STATUS_URL)
      .then(res => res.text())
      .then(text => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        resolve({ ok: true, raw: (text || "").trim().toLowerCase() });
      })
      .catch(() => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        resolve({ ok: false, raw: null });
      });
  });
}

// ---------- MAIN ----------
async function updateServerStatus() {

  const prevState = window.apllServerStatus.state;
  const result = await checkStatusOnce();
  const raw = result.raw;

  let newState = "offline";

  if (result.ok && raw === "online") {
    newState = "online";
  } else if (!result.ok && prevState === "unknown") {
    newState = "unknown";
  }

  // Save to global
  window.apllServerStatus = {
    state: newState,
    lastChecked: Date.now(),
    raw
  };

  console.log(`[serverMan] Status updated → ${newState}`);

  // Update floating ball
  if (typeof window.updateStatusBall === "function") {
    window.updateStatusBall(newState === "online");
  }

  // Dispatch event to loadForm.js
  window.dispatchEvent(new Event("apllStatusUpdated"));

  // ---------- FIXED: Prevent overlay on first-load ----------
  if (!firstLoadDone) {
    firstLoadDone = true;
    return;  // do NOT show overlay on first check
  }

  // ---------- REAL TRANSITIONS ONLY ----------
  const becameOnline = prevState !== "online" && newState === "online";
  const becameOffline = prevState === "online" && newState !== "online";

  if (typeof window.showReloadOverlay === "function") {
    if (becameOnline || becameOffline) {
      console.log("[serverMan] Real state transition → showing overlay");
      window.showReloadOverlay();
    }
  }
}

// ---------- INIT ----------
(function () {
  updateServerStatus();
  setInterval(updateServerStatus, CHECK_INTERVAL_MS);
})();