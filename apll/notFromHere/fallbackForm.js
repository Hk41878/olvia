/* =========================================================
   fallbackForm.js — OFFLINE FORM (PREMIUM with Email & Country)
   ========================================================= */

console.log("[fallbackForm] Loaded (OFFLINE FINAL)");

(function () {

    if (document.querySelector("#fallbackFormOverlay")) return;

    /* Load CSS */
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/allform.css";
    document.head.appendChild(link);

    /* Load countries list (only once) */
    const cs = document.createElement("script");
    cs.src = "/js/countriesCode.js?v=" + Date.now();
    document.head.appendChild(cs);

    /* HTML */
    const overlay = document.createElement("div");
    overlay.id = "fallbackFormOverlay";

    overlay.innerHTML = `
      <div id="apllFormBox" role="dialog" aria-modal="true">
        <button id="apllCloseIcon" type="button">×</button>

        <div id="apllFormChip">
          <span id="apllFormChipDot"></span>
          <span>Easy WhatsApp booking</span>
        </div>

        <h2>Book an Appointment</h2>
        <p id="apllFormSubtitle">
          Choose your service, date and time — we will contact you on WhatsApp.
        </p>

        <form id="apllForm">

          <label for="apllService">Service</label>
          <input id="apllService" type="text" readonly />

          <label for="apllName">Name</label>
          <input id="apllName" type="text" placeholder="Your name" autocomplete="name" required />

          <!-- PHONE ROW -->
          <label>Phone</label>
          <div class="apll-phone-row">
            <select id="apllCountry" class="apll-country-select"></select>
            <input id="apllPhone" type="tel" placeholder="Your phone number" inputmode="tel" required />
          </div>

          <label for="apllEmail">Your Email</label>
          <input id="apllEmail" type="email" placeholder="Your email address" autocomplete="email" required />

          <label for="apllDate">Date</label>
          <input id="apllDate" type="date" required />

          <label for="apllTime">Time</label>
          <select id="apllTime" required>
            <option value="">Select a time</option>
          </select>

          <button id="apllSubmit" type="submit">
            <span>Send via WhatsApp</span>
          </button>
          <button id="apllClose" type="button"><span>Close</span></button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    /* ELEMENTS */
    const countryField = overlay.querySelector("#apllCountry");
    const phoneField   = overlay.querySelector("#apllPhone");
    const emailField   = overlay.querySelector("#apllEmail");
    const serviceField = overlay.querySelector("#apllService");
    const nameField    = overlay.querySelector("#apllName");
    const dateField    = overlay.querySelector("#apllDate");
    const timeField    = overlay.querySelector("#apllTime");

    const closeBtn     = overlay.querySelector("#apllClose");
    const closeIcon    = overlay.querySelector("#apllCloseIcon");
    const submitBtn    = overlay.querySelector("#apllSubmit");

    /* TIME SLOTS */
    const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","15:00","15:30","16:00","16:30","17:00","17:30"];

    /* DATE SETUP */
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);
    const toInput = d => d.toISOString().split("T")[0];
    dateField.min = toInput(today);
    dateField.max = toInput(maxDate);
    dateField.value = toInput(today);

    function isClosedDate(d) {
      const day = d.getDay();
      return day === 0 || day === 6;
    }

    function updateTime() {
      const d = new Date(dateField.value + "T00:00");
      timeField.innerHTML = "";

      if (isClosedDate(d)) {
        timeField.disabled = true;
        timeField.innerHTML = `<option>Closed (weekend)</option>`;
        return;
      }

      timeField.disabled = false;
      timeField.innerHTML = `<option value="">Select a time</option>`;
      TIME_SLOTS.forEach(t => {
        timeField.innerHTML += `<option value="${t}">${t}</option>`;
      });
    }

    dateField.addEventListener("change", updateTime);
    updateTime();

    /* SCROLL LOCK */
    const lockScroll = () => document.body.classList.add("overlay-lock");
    const unlockScroll = () => document.body.classList.remove("overlay-lock");

    overlay.addEventListener("click", e => {
      if (e.target === overlay) hide();
    });

    const hide = () => {
      unlockScroll();
      overlay.classList.remove("is-visible");
    };

    closeBtn.onclick = hide;
    closeIcon.onclick = hide;

    /* LOAD COUNTRIES INTO DROPDOWN */
    cs.onload = () => {
      countryField.innerHTML = "";

      APLL_COUNTRIES.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.code;
        opt.textContent = `${c.flag} ${c.code}`;
        countryField.appendChild(opt);
      });

      /* Default = Italy */
      countryField.value = "+39";
    };

    /* CLEAN PHONE INPUT */
    phoneField.addEventListener("input", () => {
      phoneField.value = phoneField.value.replace(/[^0-9]/g, "");
    });

    /* FORM SUBMIT */
    submitBtn.addEventListener("click", e => {
      e.preventDefault();

      const service = serviceField.value.trim();
      const name    = nameField.value.trim();
      const email   = emailField.value.trim();
      const phone   = phoneField.value.trim();
      const country = countryField.value;
      const date    = dateField.value;
      const time    = timeField.value;

      if (!email.includes("@")) {
        alert("Enter a valid email address.");
        return;
      }

      if (phone.length < 5) {
        alert("Enter a valid phone number.");
        return;
      }

      const fullPhone = country.replace("+","") + phone;

      const msg = 
`Hello, I would like to book:
• Service: ${service}
• Name: ${name}
• Phone: ${fullPhone}
• Email: ${email}
• Date: ${new Date(date).toLocaleDateString("en-GB")}
• Time: ${time}

(Offline form)
Thank you`;

      window.open(`https://wa.me/393318358086?text=${encodeURIComponent(msg)}`, "_blank");
    });

    /* PUBLIC API */
    window.apllOpenForm = (serviceName) => {
      serviceField.value = serviceName || "Service";
      nameField.value = "";
      emailField.value = "";
      phoneField.value = "";
      countryField.value = "+39";
      dateField.value = toInput(today);

      updateTime();
      lockScroll();
      overlay.classList.add("is-visible");
    };

})();