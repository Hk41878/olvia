/* =========================================================
   fallbackForm.js — OFFLINE FORM (Premium UI)
   Clean version — now loads /css/fallbackForm.css
   ========================================================= */

window.addEventListener("resize", () => {
  const sheet = document.getElementById("apllCountrySheet");
  if (sheet && sheet.classList.contains("is-visible")) {
    const panel = sheet.querySelector(".apll-country-sheet-panel");
    panel.style.transform = "translateY(0)";
    panel.style.opacity = "1";
  }
});

console.log("[fallbackForm] Loaded (OFFLINE PREMIUM VERSION)");

(function () {

  // Avoid duplicates
  if (document.querySelector("#fallbackFormOverlay")) return;

  // -----------------------------------------------------
  // LOAD CSS (fallbackForm.css)
  // -----------------------------------------------------
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/css/fallbackForm.css";
  document.head.appendChild(link);

  // -----------------------------------------------------
  // MAIN FORM OVERLAY HTML
  // -----------------------------------------------------
  const overlay = document.createElement("div");
  overlay.id = "fallbackFormOverlay";
  overlay.innerHTML = `
    <div id="apllFormBox" role="dialog" aria-modal="true" aria-label="Book an appointment">
      <button id="apllCloseIcon" type="button" aria-label="Close form">×</button>

      <div id="apllFormChip">
        <span id="apllFormChipDot"></span>
        <span>Easy WhatsApp Booking</span>
      </div>

      <h2>Book an Appointment</h2>
      <p id="apllFormSubtitle">
        Choose your service, date and time — we will contact you on WhatsApp.
      </p>

      <form id="apllForm">

        <label for="apllService">Service</label>
        <input id="apllService" type="text" readonly autocomplete="off" />

        <label for="apllName">Name</label>
        <input id="apllName" type="text" placeholder="Your name" autocomplete="name" required />

        <label for="apllEmail">Email</label>
        <input id="apllEmail" type="email" placeholder="Your email" autocomplete="email" required />

        <label>Phone</label>
        <div class="apll-phone-row">
          <button type="button" id="apllCountryTrigger" class="apll-country-trigger">
            <span id="apllCountryFlag">🇮🇹</span>
            <span id="apllCountryCode">+39</span>
          </button>
          <input id="apllPhone" type="tel" placeholder="Your number" inputmode="tel" autocomplete="tel" required />
        </div>

        <label for="apllDate">Date</label>
        <input id="apllDate" type="date" required autocomplete="off" />

        <label for="apllTime">Time</label>
        <select id="apllTime" required>
          <option value="">Select a time</option>
        </select>

        <button id="apllSubmit" type="submit">
          <span>Send via WhatsApp</span>
        </button>

        <button id="apllClose" type="button">
          <span>Close</span>
        </button>

      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  // -----------------------------------------------------
  // COUNTRY SHEET HTML
  // -----------------------------------------------------
  const countrySheet = document.createElement("div");
  countrySheet.id = "apllCountrySheet";
  countrySheet.innerHTML = `
    <div class="apll-country-sheet-backdrop"></div>
    <div class="apll-country-sheet-panel">
      <div class="apll-country-sheet-handle"></div>
      <div class="apll-country-sheet-header">
        <input id="apllCountrySearch" type="text" placeholder="Search country or code" autocomplete="off" />
      </div>
      <div id="apllCountryList" class="apll-country-sheet-list"></div>
    </div>
  `;
  document.body.appendChild(countrySheet);

  // -----------------------------------------------------
  // ELEMENT REFS
  // -----------------------------------------------------
  const WHATSAPP = "393318358086";

  const TIME_SLOTS = [
    "09:00","09:30","10:00","10:30",
    "11:00","11:30","15:00","15:30",
    "16:00","16:30","17:00","17:30"
  ];

  const serviceField     = overlay.querySelector("#apllService");
  const nameField        = overlay.querySelector("#apllName");
  const emailField       = overlay.querySelector("#apllEmail");
  const phoneField       = overlay.querySelector("#apllPhone");
  const dateField        = overlay.querySelector("#apllDate");
  const timeField        = overlay.querySelector("#apllTime");

  const countryTrigger   = overlay.querySelector("#apllCountryTrigger");
  const countryFlagSpan  = overlay.querySelector("#apllCountryFlag");
  const countryCodeSpan  = overlay.querySelector("#apllCountryCode");

  const submitBtn        = overlay.querySelector("#apllSubmit");
  const closeBtn         = overlay.querySelector("#apllClose");
  const closeIconBtn     = overlay.querySelector("#apllCloseIcon");

  // Sheet refs
  const sheetBackdrop    = countrySheet.querySelector(".apll-country-sheet-backdrop");
  const searchInput      = countrySheet.querySelector("#apllCountrySearch");
  const countryListEl    = countrySheet.querySelector("#apllCountryList");

  // -----------------------------------------------------
  // KEYBOARD STATE
  // -----------------------------------------------------
  let keyboardOpen = false;

  function setKeyboardState(isOpen) {
    keyboardOpen = !!isOpen;
    if (keyboardOpen) document.body.classList.add("apll-keyboard-open");
    else document.body.classList.remove("apll-keyboard-open");
  }

  // -----------------------------------------------------
  // COUNTRY DATA
  // -----------------------------------------------------
  const rawCountries = Array.isArray(window.APLL_COUNTRIES) ? window.APLL_COUNTRIES : [];

  const COUNTRY_LIST = rawCountries.slice().sort((a, b) => {
    if (a.name === "Italy") return -1;
    if (b.name === "Italy") return 1;
    return a.name.localeCompare(b.name);
  });

  const CODE_MAP = new Map();
  COUNTRY_LIST.forEach(c => {
    if (!CODE_MAP.has(c.code)) CODE_MAP.set(c.code, c);
  });

  const SORTED_CODES = Array.from(CODE_MAP.keys()).sort((a, b) => b.length - a.length);

  let currentCountry = null;

  function setCurrentCountry(c) {
    currentCountry = c;
    countryFlagSpan.textContent = c.flag;
    countryCodeSpan.textContent = c.code;
  }

  // Default country
  const defaultCountry =
    COUNTRY_LIST.find(c => c.code === "+39") || COUNTRY_LIST[0];
  setCurrentCountry(defaultCountry);

  // -----------------------------------------------------
  // RENDER COUNTRY LIST
  // -----------------------------------------------------
  function renderCountryList(filterText) {
    const q = (filterText || "").trim().toLowerCase();
    countryListEl.innerHTML = "";

    COUNTRY_LIST.forEach(c => {
      const hay = (c.name + " " + c.iso + " " + c.code).toLowerCase();
      if (q && !hay.includes(q)) return;

      const row = document.createElement("button");
      row.type = "button";
      row.className = "apll-country-row";
      row.innerHTML = `
        <span class="apll-country-row-flag">${c.flag}</span>
        <span class="apll-country-row-name">${c.name}</span>
        <span class="apll-country-row-code">${c.code}</span>
      `;
      row.onclick = () => {
        setCurrentCountry(c);
        closeCountrySheet();
      };
      countryListEl.appendChild(row);
    });

    countryListEl.scrollTop = 0;
  }

  // -----------------------------------------------------
  // COUNTRY SHEET OPEN/CLOSE
  // -----------------------------------------------------
  function openCountrySheet() {
    document.getElementById("apllCountrySheet").classList.add("is-visible");
    searchInput.value = "";
    renderCountryList("");
    setKeyboardState(false);
    setTimeout(() => searchInput.focus(), 80);
  }

  function closeCountrySheet() {
    document.getElementById("apllCountrySheet").classList.remove("is-visible");
    setKeyboardState(false);
  }

  countryTrigger.onclick = openCountrySheet;
  sheetBackdrop.onclick = closeCountrySheet;

  // Search input
  searchInput.addEventListener("input", e => renderCountryList(e.target.value));

  // -----------------------------------------------------
  // PHONE INPUT AUTO-DETECT
  // -----------------------------------------------------
  function detectCountry(raw) {
    if (!raw) return null;
    let s = raw.replace(/\s+/g, "");
    if (s.startsWith("00")) s = "+" + s.slice(2);
    if (!s.startsWith("+")) return null;
    for (const code of SORTED_CODES) {
      if (s.startsWith(code)) {
        const country = CODE_MAP.get(code);
        const local = s.slice(code.length);
        return { country, local };
      }
    }
    return null;
  }

  phoneField.addEventListener("input", () => {
    let raw = phoneField.value.replace(/[^\d+]/g, "");

    const detect = detectCountry(raw);
    if (detect) {
      setCurrentCountry(detect.country);
      phoneField.value = detect.local.replace(/[^\d]/g, "");
      return;
    }
    if (!raw.startsWith("+") && !raw.startsWith("00")) {
      phoneField.value = raw.replace(/[^\d]/g, "");
    }
  });

  // -----------------------------------------------------
  // DATE / TIME LOGIC
  // -----------------------------------------------------
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14);

  const toInput = d => d.toISOString().split("T")[0];
  const todayStr = toInput(today);

  dateField.min = todayStr;
  dateField.max = toInput(maxDate);
  dateField.value = todayStr;

  function isClosed(d) {
    const day = d.getDay();
    return day === 0 || day === 6;
  }

  function fillTimes() {
    const d = new Date(dateField.value + "T00:00");
    timeField.innerHTML = "";

    if (isClosed(d)) {
      timeField.disabled = true;
      timeField.innerHTML = `<option value="">Closed (weekend)</option>`;
      return;
    }

    timeField.disabled = false;
    timeField.innerHTML = `<option value="">Select a time</option>`;
    TIME_SLOTS.forEach(t => {
      const o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      timeField.appendChild(o);
    });
  }

  dateField.onchange = fillTimes;
  fillTimes();

  // -----------------------------------------------------
  // SCROLL LOCK
  // -----------------------------------------------------
  function lockScroll()   { document.body.classList.add("overlay-lock"); }
  function unlockScroll() { document.body.classList.remove("overlay-lock"); }

  function hideOverlay() {
    unlockScroll();
    overlay.classList.remove("is-visible");
    closeCountrySheet();
  }

  closeBtn.onclick = hideOverlay;
  closeIconBtn.onclick = hideOverlay;
  overlay.onclick = e => { if (e.target === overlay) hideOverlay(); };

  // -----------------------------------------------------
  // SUBMIT → WhatsApp
  // -----------------------------------------------------
  submitBtn.onclick = e => {
    e.preventDefault();

    const s = serviceField.value.trim();
    const n = nameField.value.trim();
    const eM = emailField.value.trim();
    const p  = phoneField.value.trim();
    const d  = dateField.value;
    const t  = timeField.value;

    if (!s || !n || !eM || !p || !d || !t || timeField.disabled) {
      alert("Please fill all required fields.");
      return;
    }

    const phone = currentCountry.code.replace("+","") + p.replace(/[^\d]/g,"");
    const dateFormatted = new Date(d).toLocaleDateString("en-GB");

    const msg =
`Hello, I would like to book:
• Service: ${s}
• Name: ${n}
• Email: ${eM}
• Phone: ${phone}
• Date: ${dateFormatted}
• Time: ${t}

(Offline version)
Thank you`;

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // -----------------------------------------------------
  // GLOBAL OPEN FUNCTION
  // -----------------------------------------------------
  window.apllOpenForm = function (serviceName) {
    serviceField.value = serviceName || "Service";
    nameField.value = "";
    emailField.value = "";
    phoneField.value = "";
    dateField.value = todayStr;

    fillTimes();

    lockScroll();
    overlay.classList.add("is-visible");

    // Keyboard handling (iOS)
    try {
      window.addEventListener("keyboardDidShow", () => {
        document.documentElement.classList.add("keyboard-open");
        document.body.classList.add("keyboard-open");
      });
      window.addEventListener("keyboardDidHide", () => {
        document.documentElement.classList.remove("keyboard-open");
        document.body.classList.remove("keyboard-open");
      });
    } catch (_) {
      let lastH = window.innerHeight;
      window.addEventListener("resize", () => {
        const now = window.innerHeight;
        if (now < lastH - 120) {
          document.documentElement.classList.add("keyboard-open");
          document.body.classList.add("keyboard-open");
        } else {
          document.documentElement.classList.remove("keyboard-open");
          document.body.classList.remove("keyboard-open");
        }
        lastH = now;
      });
    }
  };

})();