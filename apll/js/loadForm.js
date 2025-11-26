// ==============================
// loadForm.js — decides which form to load
// ==============================

const ADVANCED_FORM_URL = "https://app.apll.it/js/advancedForm.js";
const FALLBACK_FORM_URL = "https://itsnowonline.github.io/js/fallbackForm.js";

let advancedFormLoaded = false;
let fallbackFormLoaded = false;

// Helper: page-based default service
function getPageService() {
  const el = document.querySelector("[data-page]");
  if (!el) return "Servizio";
  const page = (el.getAttribute("data-page") || "").toLowerCase();
  if (page === "caf") return "Servizio CAF";
  if (page === "patronato") return "Patronato";
  if (page === "legal") return "Assistenza Legale";
  return "Servizio";
}

// Helper: compute service name for this button
function resolveServiceName(button) {
  const fromBtn = (button.getAttribute("data-service") || "").trim();
  if (fromBtn) return fromBtn;
  return getPageService();
}

// Load script once
function loadExternalScriptOnce(url, type) {
  return new Promise((resolve, reject) => {

    if (type === "advanced" && advancedFormLoaded) {
      return resolve();
    }
    if (type === "fallback" && fallbackFormLoaded) {
      return resolve();
    }

    const s = document.createElement("script");
    s.src = url + "?v=" + Date.now();

    s.onload = () => {
      console.log(`[loadForm] Loaded: ${url}`);
      if (type === "advanced") advancedFormLoaded = true;
      if (type === "fallback") fallbackFormLoaded = true;
      resolve();
    };

    s.onerror = () => {
      console.error(`[loadForm] FAILED to load: ${url}`);
      reject(new Error("Script load failed"));
    };

    document.body.appendChild(s);
  });
}

// Main click handler (event delegation)
document.addEventListener("click", evt => {
  const btn = evt.target.closest(".js-reservation-btn");
  if (!btn) return;

  const serviceName = resolveServiceName(btn);
  const stateGetter = window.getApllServerState;
  const currentState = typeof stateGetter === "function" ? stateGetter() : "unknown";

  const useAdvanced = currentState === "online";
  const url = useAdvanced ? ADVANCED_FORM_URL : FALLBACK_FORM_URL;
  const type = useAdvanced ? "advanced" : "fallback";

  console.log(`[loadForm] Button clicked. State=${currentState}, type=${type}`);

  loadExternalScriptOnce(url, type)
    .then(() => {
      if (typeof window.apllOpenForm === "function") {
        window.apllOpenForm(serviceName);
      } else {
        console.error("[loadForm] apllOpenForm() not defined by form script.");
        alert("Form could not be opened. Please try again later.");
      }
    })
    .catch(() => {
      alert("Form could not be loaded. Please try again later.");
    });
});