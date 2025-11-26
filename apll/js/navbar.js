// js/navbar.js
(function () {
  "use strict";

  const cfg = window.APP_CONFIG || { LARGE_BP: 992 };

  // DOM
  const menuToggle  = document.getElementById("menuToggle");
  const drawer      = document.getElementById("mobileDrawer");
  const overlay     = document.getElementById("overlay");
  const drawerClose = document.getElementById("drawerClose");
  const pageRoot    = document.querySelector(".page") || document.body;

  let lastFocused = null;
  let keyHandlerBound = false;

  function lockScroll(lock) {
    document.body.classList.toggle("overlay-lock", !!lock);
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;

    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    menuToggle?.setAttribute("aria-expanded", "true");
    if (overlay) overlay.hidden = false;

    lockScroll(true);
    trapFocus(true);
    drawerClose?.focus({ preventScroll: true });
  }

  function closeDrawer() {
    if (!drawer) return;

    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (overlay) overlay.hidden = true;

    trapFocus(false);
    lockScroll(false);
    // return focus to the toggle for accessibility
    lastFocused?.focus?.();
  }

  // Focus trap within drawer
  function trapFocus(enable) {
    if (!enable) {
      if (keyHandlerBound) {
        document.removeEventListener("keydown", onKey);
        keyHandlerBound = false;
      }
      return;
    }
    if (!keyHandlerBound) {
      document.addEventListener("keydown", onKey);
      keyHandlerBound = true;
    }
  }

  function focusablesIn(scope) {
    return Array.from(
      scope.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute("disabled") && el.offsetParent !== null);
  }

  function onKey(e) {
    // ESC closes
    if (e.key === "Escape" && drawer?.classList.contains("open")) {
      e.preventDefault();
      closeDrawer();
      return;
    }
    // Trap TAB inside drawer
    if (e.key !== "Tab" || !drawer?.classList.contains("open")) return;
    const f = focusablesIn(drawer);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // Clicks
  menuToggle?.addEventListener("click", openDrawer);
  drawerClose?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);

  // Close on drawer link click
  drawer?.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.tagName === "A") closeDrawer();
  });

  // Resize: close if we cross to desktop
  let resizeRaf = null;
  window.addEventListener("resize", () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      if (window.innerWidth >= cfg.LARGE_BP && drawer?.classList.contains("open")) {
        closeDrawer();
      }
    });
  });

  // Export (optional)
  window.Navbar = { openDrawer, closeDrawer };
})();


// js/call-hours.js (ya main.js ke last me)
(function () {
  "use strict";

  // Opening slots (Italy time based on user device)
  const OPEN_SLOTS = [
    { startH: 8, startM: 30, endH: 13, endM: 30 },
    { startH: 16, startM: 30, endH: 19, endM: 30 }
  ];

  // Message in different languages
  const OUTSIDE_MSG = {
    it: "Puoi chiamare tra Lun–Ven 08:30–13:30 · 16:30–19:30",
    en: "Please call between Mon–Fri 08:30–13:30 · 16:30–19:30",
    pa: "ਕਿਰਪਾ ਕਰਕੇ ਸੋਮ–ਸ਼ੁਕਰ 08:30–13:30 · 16:30–19:30 ਵਿੱਚ ਕਾਲ ਕਰੋ।",
    hi: "कृपया सोमवार–शुक्रवार 08:30–13:30 · 16:30–19:30 के बीच कॉल करें।",
    "hi-Latn": "Kripya Som–Shukr 08:30–13:30 · 16:30–19:30 ke beech call karein."
  };

  function isWithinOpeningHours(date) {
    // getDay(): 0=Sun, 1=Mon, ... 6=Sat
    const day = date.getDay();
    // Only Mon–Fri
    if (day === 0 || day === 6) return false;

    const minutes = date.getHours() * 60 + date.getMinutes();

    return OPEN_SLOTS.some(slot => {
      const start = slot.startH * 60 + slot.startM;
      const end   = slot.endH   * 60 + slot.endM;
      return minutes >= start && minutes <= end;
    });
  }

  function getOutsideMessage() {
    const lang = (window.LanguageSelector?.get && window.LanguageSelector.get()) || "it";
    return OUTSIDE_MSG[lang] || OUTSIDE_MSG.it;
  }

  function wireCallButtons() {
    const links = document.querySelectorAll("[data-call-link]");
    if (!links.length) return;

    links.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const now = new Date();
        if (isWithinOpeningHours(now)) {
          const phone = link.getAttribute("data-phone") || "+393318358086";
          // Trigger real call
          window.location.href = "tel:" + phone;
        } else {
          // Show info message
          alert(getOutsideMessage());
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireCallButtons);
  } else {
    wireCallButtons();
  }
})();
