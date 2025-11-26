
console.log("[advancedForm] Loaded (SERVER PREMIUM VERSION)");

(function () {

    if (document.querySelector("#apllFormOverlay")) return;

    /* -----------------------------------------------------
       HTML — Premium layout
    ----------------------------------------------------- */
    const overlay = document.createElement("div");
    overlay.id = "apllFormOverlay";
    overlay.innerHTML = `
      <div id="apllFormBox" role="dialog" aria-modal="true">
        <button id="apllCloseIcon" type="button">×</button>

        <div id="apllFormChip">
          <span id="apllFormChipDot"></span>
          <span>Online booking</span>
        </div>

        <h2>Book an Appointment</h2>
        <p id="apllFormSubtitle">
          Choose your service, date and time — we will confirm via WhatsApp.
        </p>

        <form id="apllForm">
          <label for="apllService">Service</label>
          <input id="apllService" type="text" readonly autocomplete="off" />

          <label for="apllName">Name</label>
          <input id="apllName" type="text" placeholder="Your name"
                 autocomplete="name" required />

          <label for="apllPhone">Phone</label>
          <input id="apllPhone" type="tel" placeholder="Your phone number"
                 inputmode="tel" autocomplete="tel" required />

          <label for="apllDate">Date</label>
          <input id="apllDate" type="date" required autocomplete="off" />

          <label for="apllTime">Time</label>
          <select id="apllTime" required>
            <option value="">Select a time</option>
          </select>

          <button id="apllSubmit" type="submit">Send via WhatsApp</button>
          <button id="apllClose" type="button">Close</button>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    /* -----------------------------------------------------
       JS LOGIC
    ----------------------------------------------------- */

    const WHATSAPP = "393318358086";
    const TIME_SLOTS = [
      "09:00","09:30","10:00","10:30",
      "11:00","11:30","15:00","15:30",
      "16:00","16:30","17:00","17:30"
    ];

    const serviceField = overlay.querySelector("#apllService");
    const nameField    = overlay.querySelector("#apllName");
    const phoneField   = overlay.querySelector("#apllPhone");
    const dateField    = overlay.querySelector("#apllDate");
    const timeField    = overlay.querySelector("#apllTime");

    const submitBtn    = overlay.querySelector("#apllSubmit");
    const closeBtn     = overlay.querySelector("#apllClose");
    const closeIconBtn = overlay.querySelector("#apllCloseIcon");

    /* Date Setup */
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);

    const toInput = d => d.toISOString().split("T")[0];

    const todayStr = toInput(today);
    dateField.min = todayStr;
    dateField.max = toInput(maxDate);
    dateField.value = todayStr;

    function isClosedDate(d) {
      const day = d.getDay();
      return day === 0 || day === 6;
    }

    function fillTimeSlotsForCurrentDate() {
      const d = new Date(dateField.value + "T00:00");
      timeField.innerHTML = "";

      if (isClosedDate(d)) {
        timeField.classList.add("apll-closed");
        timeField.disabled = true;
        timeField.innerHTML = `<option value="">Closed (weekend)</option>`;
        return;
      }

      timeField.classList.remove("apll-closed");
      timeField.disabled = false;
      timeField.innerHTML = `<option value="">Select a time</option>`;
      TIME_SLOTS.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        timeField.appendChild(opt);
      });
    }

    dateField.addEventListener("change", fillTimeSlotsForCurrentDate);

    /* -----------------------------------------------------
       FIX 2 — Prevent background scroll
    ----------------------------------------------------- */
    function lockScroll() { document.body.classList.add("overlay-lock"); }
    function unlockScroll() { document.body.classList.remove("overlay-lock"); }

    function hideOverlay() {
      unlockScroll();
      overlay.classList.remove("is-visible");
    }

    closeBtn.onclick = hideOverlay;
    closeIconBtn.onclick = hideOverlay;

    overlay.addEventListener("click", e => {
      if (e.target === overlay) hideOverlay();
    });

    /* -----------------------------------------------------
       Submit → WhatsApp
    ----------------------------------------------------- */
    submitBtn.addEventListener("click", e => {
      e.preventDefault();

      const service = serviceField.value.trim();
      const name    = nameField.value.trim();
      const phone   = phoneField.value.trim();
      const date    = dateField.value;
      const time    = timeField.value;

      if (!service || !name || !phone || !date || !time || timeField.disabled) {
        alert("Please fill all fields and select a valid working day.");
        return;
      }

      const formatted = new Date(date).toLocaleDateString("en-GB");

      const msg =
`Hello, I would like to book:
• Service: ${service}
• Name: ${name}
• Phone: ${phone}
• Date: ${formatted}
• Time: ${time}

Thank you`;

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    });

    fillTimeSlotsForCurrentDate();

    /* -----------------------------------------------------
       Global open function for loadForm.js
    ----------------------------------------------------- */
    window.apllOpenForm = function (serviceName) {
      console.log("[advancedForm] Open request —", serviceName);

      serviceField.value = serviceName || "Service";
      nameField.value = "";
      phoneField.value = "";
      dateField.value = todayStr;

      fillTimeSlotsForCurrentDate();

      lockScroll();
      overlay.classList.add("is-visible");
    };

})();