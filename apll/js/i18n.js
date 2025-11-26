// js/i18n.js
(function () {
  "use strict";

  // ---------------------------
  // Config & constants
  // ---------------------------
  const STORAGE_KEY = (window.APP_CONFIG?.STORAGE_KEYS?.LANG) || "apll.lang";
  const EXPIRY_MS   = (window.APP_CONFIG?.EXPIRY_MS) ?? (60 * 60 * 1000);

  // Public languages (also reused by welcome.js if needed)
  const LANGS = Object.freeze({
    it: "Italiano",
    en: "English",
    pa: "ਪੰਜਾਬੀ",
    hi: "हिन्दी",
    "hi-Latn": "Hinglish"
  });

  // ---------------------------
  // Expiring storage helpers
  // ---------------------------
  function getLangFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    if (raw[0] !== "{") { localStorage.removeItem(STORAGE_KEY); return null; }
    try {
      const obj = JSON.parse(raw);
      if (!obj || typeof obj.v !== "string" || typeof obj.exp !== "number") {
        localStorage.removeItem(STORAGE_KEY); return null;
      }
      if (Date.now() > obj.exp) { localStorage.removeItem(STORAGE_KEY); return null; }
      return obj.v;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function setLangWithExpiry(lang, ttlMs = EXPIRY_MS) {
    if (!LANGS[lang]) return;
    const payload = JSON.stringify({ v: lang, exp: Date.now() + ttlMs });
    localStorage.setItem(STORAGE_KEY, payload);
    syncSelectors(lang);
  }

  // ---------------------------
  // Translation dictionary
  // ---------------------------
  const T = {
    // Navbar
    "nav.brand": {
      it: "AliPerLaLiberta",
      en: "AliPerLaLiberta",
      pa: "AliPerLaLiberta",
      hi: "AliPerLaLiberta",
      "hi-Latn": "AliPerLaLiberta"
    },
    "nav.home": {
      it: "Home",
      en: "Home",
      pa: "ਮੁੱਖ ਸਫ਼ਾ",
      hi: "होम",
      "hi-Latn": "Home"
    },
    "nav.call": {
  it: "Chiama",
  en: "Call",
  pa: "ਕਾਲ ਕਰੋ",
  hi: "कॉल करें",
  "hi-Latn": "Call karein"
},
"call.hoursLabel": {
  it: "Orari: Lun–Ven 08:30–13:30 · 16:30–19:30",
  en: "Hours: Mon–Fri 08:30–13:30 · 16:30–19:30",
  pa: "ਸਮਾਂ: ਸੋਮ–ਸ਼ੁਕਰ 08:30–13:30 · 16:30–19:30",
  hi: "समय: सोमवार–शुक्रवार 08:30–13:30 · 16:30–19:30",
  "hi-Latn": "Samay: Som–Shukr 08:30–13:30 · 16:30–19:30"
},


    "nav.email": {
      it: "Email",
      en: "Email",
      pa: "ਈਮੇਲ",
      hi: "ईमेल",
      "hi-Latn": "Email"
    },
    "nav.pec": {
      it: "PEC",
      en: "PEC",
      pa: "PEC",
      hi: "PEC",
      "hi-Latn": "PEC"
    },
    "nav.youtube": {
      it: "YouTube",
      en: "YouTube",
      pa: "YouTube",
      hi: "YouTube",
      "hi-Latn": "YouTube"
    },

    "drawer.close": {
      it: "Chiudi menu",
      en: "Close menu",
      pa: "ਮੇਨੂ ਬੰਦ ਕਰੋ",
      hi: "मेन्यू बंद करें",
      "hi-Latn": "Menu band karein"
    },

    // Services (6)
    "services.caf.title": {
      it: "CAF (Centro di Assistenza Fiscale)",
      en: "CAF (Tax Assistance Center)",
      hi: "CAF (कर सहायता केंद्र)",
      pa: "CAF (ਟੈਕਸ ਸਹਾਇਤਾ ਕੇਂਦਰ)",
      "hi-Latn": "CAF (Tax Sahayata Kendra)"
    },
    "services.caf.desc": {
      it: "Ti aiutiamo con tutte le pratiche fiscali come dichiarazione dei redditi, ISEE, modelli 730, e altre procedure tributarie, in modo semplice e veloce.",
      en: "We help with income tax returns, ISEE, 730 forms, and other tax procedures—simply and quickly.",
      hi: "आयकर रिटर्न, ISEE, 730 फॉर्म और अन्य कर संबंधी प्रक्रियाओं में हम सरल और तेज़ मदद करते हैं।",
      pa: "ਆਮਦਨੀ ਕਰ ਰਿਟਰਨ, ISEE, 730 ਫਾਰਮ ਅਤੇ ਹੋਰ ਕਰੀ ਪ੍ਰਕਿਰਿਆਵਾਂ ਵਿੱਚ ਅਸੀਂ ਸਧਾਰੇ ਤੇ ਤੇਜ਼ ਤਰੀਕੇ ਨਾਲ ਮਦਦ ਕਰਦੇ ਹਾਂ।",
      "hi-Latn": "Income tax return, ISEE, 730 form aur anya tax processes me hum simple aur fast madad karte hain."
    },

    "services.patronato.title": {
      it: "Patronato",
      en: "Patronato",
      hi: "Patronato",
      pa: "Patronato",
      "hi-Latn": "Patronato"
    },
    "services.patronato.desc": {
      it: "Offriamo supporto per pensioni, indennità, disoccupazione e altre pratiche previdenziali o assistenziali con consulenza personalizzata.",
      en: "We offer support for pensions, allowances, unemployment, and other welfare procedures with personalized guidance.",
      hi: "पेंशन, भत्ते, बेरोज़गारी और अन्य सामाजिक/प्रावधान संबंधी कार्यों में व्यक्तिगत मार्गदर्शन के साथ सहायता।",
      pa: "ਪੈਂਸ਼ਨ, ਭੱਤੇ, ਬੇਰੁਜ਼ਗਾਰੀ ਅਤੇ ਹੋਰ ਭਲਾਈ ਪ੍ਰਕਿਰਿਆਵਾਂ ਲਈ ਨਿੱਜੀ ਸਲਾਹ ਨਾਲ ਸਹਾਇਤਾ।",
      "hi-Latn": "Pension, bhatte, berozgaari aur anya samajik/pravidhan prakriyaon me personal guidance ke saath sahayata."
    },

    "services.legal.title": {
      it: "Assistenza Legale / Supporto",
      en: "Legal Assistance / Support",
      hi: "कानूनी सहायता / सपोर्ट",
      pa: "ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ / ਸਮਰਥਨ",
      "hi-Latn": "Kanooni Sahayata / Support"
    },
    "services.legal.desc": {
      it: "Un aiuto legale chiaro e accessibile per contratti, documenti, vertenze o problemi legati ai diritti del lavoro e civili.",
      en: "Clear, accessible legal help for contracts, documents, disputes, or issues related to labor and civil rights.",
      hi: "कॉन्ट्रैक्ट, दस्तावेज़, विवाद या श्रम व नागरिक अधिकारों से जुड़े मुद्दों पर स्पष्ट और सुलभ कानूनी मदद।",
      pa: "ਕਾਂਟ੍ਰੈਕਟ, ਦਸਤਾਵੇਜ਼, ਵਿਵਾਦ ਜਾਂ ਮਜ਼ਦੂਰੀ ਅਤੇ ਨਾਗਰਿਕ ਹੱਕਾਂ ਨਾਲ ਜੁੜੇ ਮਸਲਿਆਂ ਲਈ ਸਪਸ਼ਟ ਤੇ ਸੌਖੀ ਕਾਨੂੰਨੀ ਮਦਦ।",
      "hi-Latn": "Contract, documents, vivad ya labour/civil rights se jude muddon par saaf aur accessible legal help."
    },

    "services.corsi.title": {
      it: "Corsi di Formazione",
      en: "Training Courses",
      hi: "प्रशिक्षण कोर्स",
      pa: "ਟ੍ਰੇਨਿੰਗ ਕੋਰਸ",
      "hi-Latn": "Training Courses"
    },
    "services.corsi.desc": {
      it: "Corsi professionali e aggiornamenti formativi per migliorare le competenze e trovare nuove opportunità di lavoro.",
      en: "Professional courses and upskilling to improve skills and find new job opportunities.",
      hi: "कौशल बढ़ाने और नई नौकरी के अवसर पाने के लिए व्यावसायिक कोर्स और अपस्किलिंग।",
      pa: "ਕੁਸ਼ਲਤਾਵਾਂ ਵਧਾਉਣ ਅਤੇ ਨਵੀਆਂ ਨੌਕਰੀ ਦੇ ਮੌਕਿਆਂ ਲਈ ਪੇਸ਼ਾਵਰ ਕੋਰਸ ਅਤੇ ਅੱਪਸਕਿਲਿੰਗ।",
      "hi-Latn": "Professional courses aur upskilling se skills improve karo aur naye job opportunities pao."
    },

    "services.web.title": {
      it: "Creazione Siti Web",
      en: "Website Creation",
      hi: "वेबसाइट निर्माण",
      pa: "ਵੈੱਬਸਾਈਟ ਤਿਆਰੀ",
      "hi-Latn": "Website Creation"
    },
    "services.web.desc": {
      it: "Realizziamo siti web professionali e moderni per aziende, freelance o piccoli business, curando design e funzionalità.",
      en: "We build professional, modern websites for companies, freelancers, or small businesses, with care for design and functionality.",
      hi: "कंपनियों, फ्रीलांसरों और छोटे व्यवसायों के लिए आधुनिक, पेशेवर वेबसाइट—डिज़ाइन और फ़ंक्शन पर विशेष ध्यान।",
      pa: "ਕੰਪਨੀਆਂ, ਫ੍ਰੀਲਾਂਸਰਾਂ ਅਤੇ ਛੋਟੇ ਕਾਰੋਬਾਰ ਲਈ ਆਧੁਨਿਕ, ਪੇਸ਼ਾਵਰ ਵੈੱਬਸਾਈਟ—ਡਿਜ਼ਾਈਨ ਅਤੇ ਫਂਕਸ਼ਨ 'ਤੇ ਖਾਸ ਧਿਆਨ।",
      "hi-Latn": "Companies, freelancers aur small business ke liye modern, professional websites—design aur function par khas dhyan."
    },

    "services.biglietti.title": {
      it: "Biglietti & E-Visa Supporto",
      en: "Tickets & E-Visa Support",
      hi: "टिकट और ई-वीज़ा सहायता",
      pa: "ਟਿਕਟਾਂ ਅਤੇ E-Visa ਸਹਾਇਤਾ",
      "hi-Latn": "Tickets & E-Visa Support"
    },
    "services.biglietti.desc": {
      it: "Prenotazioni per treni, autobus e aerei. Aiuto anche per ottenere eVisa per chi viaggia all’estero in modo rapido e sicuro.",
      en: "Bookings for trains, buses, and flights. We also help obtain eVisas for international travel quickly and safely.",
      hi: "ट्रेन, बस और उड़ान की बुकिंग। विदेश यात्रा के लिए eVisa प्राप्त करने में भी तेज़ और सुरक्षित मदद।",
      pa: "ਰੇਲ, ਬੱਸ ਅਤੇ ਉਡਾਣਾਂ ਦੀ ਬੁਕਿੰਗ। ਵਿਦੇਸ਼ ਯਾਤਰਾ ਲਈ eVisa ਲੈਣ ਵਿੱਚ ਵੀ ਤੇਜ਼ ਅਤੇ ਸੁਰੱਖਿਅਤ ਮਦਦ।",
      "hi-Latn": "Train, bus aur flight ki booking. Abroad travel ke liye eVisa hasil karne me bhi tez aur surakshit madad."
    },

    // Buttons (Home hero)
    "hero.cta.discover": {
      it: "Scopri il servizio",
      en: "View service",
      hi: "सेवा देखें",
      pa: "ਸੇਵਾ ਵੇਖੋ",
      "hi-Latn": "Service dekho"
    },
    "hero.cta.share": {
      it: "Condividi",
      en: "Share",
      hi: "शेयर करें",
      pa: "ਸਾਂਝਾ ਕਰੋ",
      "hi-Latn": "Share karein"
    },

    // Buttons (Service detail)
    "detail.cta.request": {
      it: "Richiedi assistenza",
      en: "Request assistance",
      hi: "सहायता माँगें",
      pa: "ਸਹਾਇਤਾ ਮੰਗੋ",
      "hi-Latn": "Sahayata maangein"
    },
    "detail.cta.share": {
      it: "Condividi",
      en: "Share",
      hi: "शेयर करें",
      pa: "ਸਾਂਝਾ ਕਰੋ",
      "hi-Latn": "Share karein"
    },

    // ---------------------------
    // Footer
    // ---------------------------
    "footer.title.contacts": {
      it: "Contatti & Orari",
      en: "Contacts & Hours",
      hi: "संपर्क और समय",
      pa: "ਸੰਪਰਕ ਅਤੇ ਸਮਾਂ",
      "hi-Latn": "Sampark aur Samay"
    },
    "footer.phone": {
      it: "Telefono / WhatsApp",
      en: "Phone / WhatsApp",
      hi: "फ़ोन / व्हाट्सऐप",
      pa: "ਫੋਨ / ਵਟਸਐਪ",
      "hi-Latn": "Phone / WhatsApp"
    },
    "footer.email": {
      it: "Email",
      en: "Email",
      hi: "ईमेल",
      pa: "ਈਮੇਲ",
      "hi-Latn": "Email"
    },
    "footer.address.label": {
      it: "Indirizzo",
      en: "Address",
      hi: "पता",
      pa: "ਪਤਾ",
      "hi-Latn": "Pata"
    },
    "footer.hours": {
      it: "Orari: Lun–Ven 08:30–13:30 · 16:30–19:30",
      en: "Hours: Mon–Fri 08:30–13:30 · 16:30–19:30",
      hi: "समय: सोमवार–शुक्रवार 08:30–13:30 · 16:30–19:30",
      pa: "ਸਮਾਂ: ਸੋਮ–ਸ਼ੁਕਰ 08:30–13:30 · 16:30–19:30",
      "hi-Latn": "Samay: Som–Shukr 08:30–13:30 · 16:30–19:30"
    },
    "footer.openwith": {
      it: "Apri con",
      en: "Open with",
      hi: "इसके साथ खोलें",
      pa: "ਇਸ ਨਾਲ ਖੋਲ੍ਹੋ",
      "hi-Latn": "Iske sath kholo"
    },
    "footer.title.legal": {
      it: "Legale",
      en: "Legal",
      hi: "कानूनी जानकारी",
      pa: "ਕਾਨੂੰਨੀ",
      "hi-Latn": "Kanooni Jaankari"
    },
    "footer.privacy": {
      it: "Privacy Policy",
      en: "Privacy Policy",
      hi: "गोपनीयता नीति",
      pa: "ਪਰਾਈਵੇਸੀ ਨੀਤੀ",
      "hi-Latn": "Privacy Policy"
    },
    "footer.terms": {
      it: "Termini di Servizio",
      en: "Terms of Service",
      hi: "सेवा की शर्तें",
      pa: "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",
      "hi-Latn": "Service ki Shartein"
    },
    "footer.cookies": {
      it: "Cookie Policy",
      en: "Cookie Policy",
      hi: "कुकी नीति",
      pa: "ਕੂਕੀ ਨੀਤੀ",
      "hi-Latn": "Cookie Policy"
    },
    "footer.legalnotes": {
      it: "Note Legali",
      en: "Legal Notice",
      hi: "कानूनी सूचना",
      pa: "ਕਾਨੂੰਨੀ ਸੂਚਨਾ",
      "hi-Latn": "Kanooni Suchna"
    },
    "footer.rights": {
      it: "© 2025 AliPerLaLiberta — Tutti i diritti riservati.",
      en: "© 2025 AliPerLaLiberta — All rights reserved.",
      hi: "© 2025 AliPerLaLiberta — सर्वाधिकार सुरक्षित.",
      pa: "© 2025 AliPerLaLiberta — ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
      "hi-Latn": "© 2025 AliPerLaLiberta — Sabhi Adhikaar Surakshit."
    },
    // ================================
// CAF Page — i18n dictionary block
// ================================
"caf.title": {
  it: "CAF (Centro di Assistenza Fiscale)",
  en: "CAF (Tax Assistance Center)",
  hi: "CAF (कर सहायता केंद्र)",
  pa: "CAF (ਟੈਕਸ ਸਹਾਇਤਾ ਕੇਂਦਰ)",
  "hi-Latn": "CAF (Kar Sahayata Kendra)"
},
"caf.desc": {
  it: "Assistenza semplice e veloce per le tue pratiche fiscali.",
  en: "Simple and fast assistance for your tax procedures.",
  hi: "आपकी टैक्स प्रक्रियाओं के लिए सरल और तेज़ सहायता।",
  pa: "ਤੁਹਾਡੇ ਟੈਕਸ ਮਾਮਲਿਆਂ ਲਈ ਸੌਖੀ ਤੇ ਤੇਜ਼ ਸਹਾਇਤਾ।",
  "hi-Latn": "Aapki tax prakriya ke liye saral aur tez sahayata."
},
"caf.services.isee": {
  it: "Compilazione e invio della Dichiarazione Sostitutiva Unica.",
  en: "Compilation and submission of the ISEE Declaration.",
  hi: "आईएसईई घोषणा का संकलन और प्रस्तुतिकरण।",
  pa: "ISEE ਘੋਸ਼ਣਾ ਦੀ ਤਿਆਰੀ ਅਤੇ ਜਮ੍ਹਾਂ ਕਰਨਾ।",
  "hi-Latn": "ISEE ghoshna ka sangrahan aur prastutikaran."
},
"caf.services.730": {
  it: "Dichiarazione dei redditi con assistenza professionale.",
  en: "Income declaration with professional assistance.",
  hi: "पेशेवर सहायता के साथ आय घोषणा।",
  pa: "ਪੇਸ਼ੇਵਰ ਸਹਾਇਤਾ ਨਾਲ ਆਮਦਨ ਘੋਸ਼ਣਾ।",
  "hi-Latn": "Peshevar sahayata ke sath aay ghoshna."
},
"caf.services.redditi": {
  it: "Gestione completa per persone fisiche e autonomi.",
  en: "Complete management for individuals and freelancers.",
  hi: "व्यक्तियों और फ्रीलांसरों के लिए पूर्ण प्रबंधन।",
  pa: "ਵਿਅਕਤੀਆਂ ਅਤੇ ਖੁਦਮੁਖਤਿਆਰਾਂ ਲਈ ਪੂਰਾ ਪ੍ਰਬੰਧ।",
  "hi-Latn": "Vyaktiyon aur freelancers ke liye poora prabandh."
},
"caf.services.red": {
  it: "Comunicazioni obbligatorie per pensionati e INPS.",
  en: "Mandatory communications for pensioners and INPS.",
  hi: "पेंशनभोगियों और INPS के लिए अनिवार्य सूचनाएँ।",
  pa: "ਪੈਨਸ਼ਨਰਾਂ ਅਤੇ INPS ਲਈ ਲਾਜ਼ਮੀ ਸੂਚਨਾਵਾਂ।",
  "hi-Latn": "Pensioners aur INPS ke liye anivarya soochnaen."
},
"caf.services.f24": {
  it: "Calcolo e pagamento di imposte comunali e statali.",
  en: "Calculation and payment of municipal and state taxes.",
  hi: "नगर और राज्य करों की गणना और भुगतान।",
  pa: "ਨਗਰ ਅਤੇ ਰਾਜ ਦੇ ਕਰਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਭੁਗਤਾਨ।",
  "hi-Latn": "Nagar aur rajya karon ki ganana aur bhugtan."
},
"caf.services.bonus": {
  it: "Supporto per richiedere bonus e agevolazioni fiscali.",
  en: "Support for requesting tax bonuses and benefits.",
  hi: "कर बोनस और लाभों के लिए समर्थन।",
  pa: "ਟੈਕਸ ਬੋਨਸ ਅਤੇ ਲਾਭਾਂ ਲਈ ਸਹਾਇਤਾ।",
  "hi-Latn": "Tax bonus aur labhon ke liye sahayata."
},
"caf.button.book": {
  it: "Prenota ora",
  en: "Book now",
  hi: "अभी बुक करें",
  pa: "ਹੁਣੇ ਬੁੱਕ ਕਰੋ",
  "hi-Latn": "Abhi book karo"
},

// Patronato Section
"patronato.title": {
  it: "Patronato",
  en: "Patronato",
  hi: "Patronato",
  pa: "Patronato",
  "hi-Latn": "Patronato"
},
"patronato.subtitle": {
  it: "Supporto completo per pensioni, indennità e assistenza sociale.",
  en: "Complete support for pensions, benefits, and social assistance.",
  hi: "पेंशन, भत्ते और सामाजिक सहायता के लिए पूर्ण समर्थन।",
  pa: "ਪੈਨਸ਼ਨ, ਭੱਤੇ ਅਤੇ ਸਮਾਜਿਕ ਸਹਾਇਤਾ ਲਈ ਪੂਰਾ ਸਮਰਥਨ।",
  "hi-Latn": "Pension, bhatte aur samajik sahayata ke liye poora support."
},

"patronato.service.pensione": {
  it: "Assistenza nella richiesta e gestione delle pratiche pensionistiche.",
  en: "Assistance in requesting and managing pension procedures.",
  hi: "पेंशन प्रक्रियाओं के अनुरोध और प्रबंधन में सहायता।",
  pa: "ਪੈਨਸ਼ਨ ਪ੍ਰਕਿਰਿਆਵਾਂ ਦੀ ਬੇਨਤੀ ਅਤੇ ਪ੍ਰਬੰਧ ਵਿੱਚ ਸਹਾਇਤਾ।",
  "hi-Latn": "Pension prakriya ke liye sahayata."
},
"patronato.service.invalidita": {
  it: "Supporto per riconoscimento e benefici legati all’invalidità civile.",
  en: "Support for recognition and benefits related to civil disability.",
  hi: "नागरिक विकलांगता से जुड़ी मान्यता और लाभों के लिए समर्थन।",
  pa: "ਸਿਵਲ ਅਯੋਗਤਾ ਨਾਲ ਸੰਬੰਧਿਤ ਮਾਨਤਾ ਅਤੇ ਲਾਭਾਂ ਲਈ ਸਹਾਇਤਾ।",
  "hi-Latn": "Viklangta ke labh ke liye sahayata."
},
"patronato.service.assegni": {
  it: "Domande e aggiornamenti per gli assegni destinati alle famiglie.",
  en: "Applications and updates for family allowance benefits.",
  hi: "परिवार भत्ते के लिए आवेदन और अद्यतन।",
  pa: "ਪਰਿਵਾਰ ਭੱਤੇ ਲਈ ਅਰਜ਼ੀਆਂ ਅਤੇ ਅਪਡੇਟ।",
  "hi-Latn": "Parivar bhatta ke liye aavedan aur update."
},
"patronato.service.naspi": {
  it: "Richiesta dell’indennità di disoccupazione e assistenza nelle procedure.",
  en: "Unemployment benefit request and procedure assistance.",
  hi: "बेरोजगारी भत्ते के लिए अनुरोध और प्रक्रिया में सहायता।",
  pa: "ਬੇਰੁਜ਼ਗਾਰੀ ਭੱਤੇ ਲਈ ਬੇਨਤੀ ਅਤੇ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਸਹਾਇਤਾ।",
  "hi-Latn": "Berojgari bhatta ke liye sahayata."
},
"patronato.service.malattia": {
  it: "Gestione delle pratiche legate a periodi di malattia e assenze dal lavoro.",
  en: "Handling of sickness-related and work absence cases.",
  hi: "बीमारी और कार्य से अनुपस्थिति से जुड़ी प्रक्रियाओं का प्रबंधन।",
  pa: "ਬੀਮਾਰੀ ਅਤੇ ਕੰਮ ਤੋਂ ਗੈਰਹਾਜ਼ਰੀ ਨਾਲ ਸੰਬੰਧਿਤ ਮਾਮਲਿਆਂ ਦਾ ਪ੍ਰਬੰਧ।",
  "hi-Latn": "Bimari aur kaam se gayrahazri ke mamle."
},
"patronato.service.maternita": {
  it: "Supporto per congedo, indennità e diritti legati alla maternità.",
  en: "Support for leave, benefits, and maternity rights.",
  hi: "छुट्टी, लाभ और मातृत्व अधिकारों के लिए समर्थन।",
  pa: "ਛੁੱਟੀ, ਭੱਤੇ ਅਤੇ ਮਾਤਰਤਵ ਅਧਿਕਾਰਾਂ ਲਈ ਸਹਾਇਤਾ।",
  "hi-Latn": "Maternity aur leave ke liye support."
},
"patronato.service.infortuni": {
  it: "Assistenza per le pratiche INAIL e tutela in caso di infortunio.",
  en: "INAIL support and protection in case of workplace injury.",
  hi: "कार्यस्थल पर चोट की स्थिति में INAIL सहायता और सुरक्षा।",
  pa: "ਕੰਮ ਦੀ ਥਾਂ 'ਤੇ ਚੋਟ ਦੇ ਮਾਮਲੇ ਵਿੱਚ INAIL ਸਹਾਇਤਾ ਅਤੇ ਸੁਰੱਖਿਆ।",
  "hi-Latn": "Injury ke case me INAIL support."
},
"patronato.service.welfare": {
  it: "Accesso agevolato ai servizi di welfare e sostegno sociale.",
  en: "Easy access to welfare and social support services.",
  hi: "कल्याण और सामाजिक सहायता सेवाओं तक आसान पहुंच।",
  pa: "ਭਲਾਈ ਅਤੇ ਸਮਾਜਿਕ ਸਹਾਇਤਾ ਸੇਵਾਵਾਂ ਤੱਕ ਆਸਾਨ ਪਹੁੰਚ।",
  "hi-Latn": "Welfare aur samajik support ke liye asaan pahunch."
},
"patronato.btn.book": {
  it: "Prenota ora",
  en: "Book now",
  hi: "अभी बुक करें",
  pa: "ਹੁਣ ਬੁੱਕ ਕਰੋ",
  "hi-Latn": "Abhi book karo"
},
// ================================
// Legal Assistance Page — i18n dictionary block
// ================================
"legal.title": {
  it: "Assistenza Legale",
  en: "Legal Assistance",
  hi: "कानूनी सहायता",
  pa: "ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ",
  "hi-Latn": "Kanooni Sahayata"
},
"legal.desc": {
  it: "Supporto completo per pratiche legali e documentazione per stranieri.",
  en: "Comprehensive support for legal procedures and foreign documentation.",
  hi: "कानूनी प्रक्रियाओं और विदेशी दस्तावेज़ों के लिए पूर्ण सहायता।",
  pa: "ਕਾਨੂੰਨੀ ਪ੍ਰਕਿਰਿਆਵਾਂ ਅਤੇ ਵਿਦੇਸ਼ੀ ਦਸਤਾਵੇਜ਼ਾਂ ਲਈ ਪੂਰੀ ਸਹਾਇਤਾ।",
  "hi-Latn": "Kanooni prakriyaon aur videshi dastavezon ke liye poori sahayata."
},

"legal.services.ricongiungimento": {
  it: "Assistenza per la richiesta di ricongiungimento dei familiari.",
  en: "Assistance for family reunification applications.",
  hi: "पारिवारिक पुनर्मिलन के लिए सहायता।",
  pa: "ਪਰਿਵਾਰਕ ਮਿਲਾਪ ਲਈ ਸਹਾਇਤਾ।",
  "hi-Latn": "Parivarik punarmilan ke liye sahayata."
},
"legal.services.cittadinanza": {
  it: "Supporto completo per l’ottenimento della cittadinanza italiana.",
  en: "Complete support for obtaining Italian citizenship.",
  hi: "इतालवी नागरिकता प्राप्त करने के लिए पूर्ण सहायता।",
  pa: "ਇਟਾਲਵੀ ਨਾਗਰਿਕਤਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਪੂਰੀ ਸਹਾਇਤਾ।",
  "hi-Latn": "Italvi nagrikta prapt karne ke liye poori sahayata."
},
"legal.services.kit": {
  it: "Aiuto nella compilazione dei moduli e documenti ufficiali.",
  en: "Help in filling out official forms and documents.",
  hi: "आधिकारिक फॉर्म और दस्तावेज़ भरने में सहायता।",
  pa: "ਸਰਕਾਰੀ ਫਾਰਮਾਂ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਭਰਨ ਵਿੱਚ ਸਹਾਇਤਾ।",
  "hi-Latn": "Aadhikarik form aur dastavej bharne mein sahayata."
},
"legal.services.rinnovo": {
  it: "Guida e assistenza nel rinnovo del permesso di soggiorno.",
  en: "Guidance and assistance in renewing residence permits.",
  hi: "निवास परमिट के नवीनीकरण में मार्गदर्शन और सहायता।",
  pa: "ਰਿਹਾਇਸ਼ ਪਰਮਿਟ ਦੇ ਨਵੀਨੀਕਰਨ ਵਿੱਚ ਸਹਾਇਤਾ।",
  "hi-Latn": "Nivaas permit ke navinikaran mein margdarshan aur sahayata."
},
"legal.services.testLingua": {
  it: "Iscrizione e preparazione al test di lingua per stranieri.",
  en: "Enrollment and preparation for the Italian language test for foreigners.",
  hi: "विदेशियों के लिए इतालवी भाषा परीक्षा के लिए पंजीकरण और तैयारी।",
  pa: "ਵਿਦੇਸ਼ੀਆਂ ਲਈ ਇਤਾਲਵੀ ਭਾਸ਼ਾ ਟੈਸਟ ਲਈ ਦਰਜਾ ਤੇ ਤਿਆਰੀ।",
  "hi-Latn": "Videshiyon ke liye Italian bhasha test ke liye panjikaran aur taiyaari."
},
"legal.services.rilascioCarta": {
  it: "Supporto per la richiesta della carta di soggiorno.",
  en: "Support for applying for a residence card.",
  hi: "निवास कार्ड के लिए आवेदन करने में सहायता।",
  pa: "ਰਿਹਾਇਸ਼ ਕਾਰਡ ਲਈ ਅਰਜ਼ੀ ਦੇਣ ਵਿੱਚ ਸਹਾਇਤਾ।",
  "hi-Latn": "Nivaas card ke liye aavedan karne mein sahayata."
},
"legal.services.aggiornamentoCarta": {
  it: "Assistenza per aggiornare i dati nella carta di soggiorno.",
  en: "Assistance for updating data in the residence card.",
  hi: "निवास कार्ड में जानकारी अपडेट करने के लिए सहायता।",
  pa: "ਰਿਹਾਇਸ਼ ਕਾਰਡ ਵਿੱਚ ਜਾਣਕਾਰੀ ਅਪਡੇਟ ਕਰਨ ਲਈ ਸਹਾਇਤਾ।",
  "hi-Latn": "Nivaas card mein jankari update karne ke liye sahayata."
},
"legal.services.pec": {
  it: "Invio pratiche ufficiali tramite PEC per appuntamenti e comunicazioni.",
  en: "Sending official requests via PEC for appointments and communications.",
  hi: "अपॉइंटमेंट और संचार के लिए PEC के माध्यम से आधिकारिक अनुरोध भेजना।",
  pa: "ਮੁਲਾਕਾਤਾਂ ਅਤੇ ਸੰਚਾਰ ਲਈ PEC ਰਾਹੀਂ ਅਧਿਕਾਰਿਕ ਬੇਨਤੀਆਂ ਭੇਜਣਾ।",
  "hi-Latn": "Appointment aur sanchar ke liye PEC ke madhyam se adhikarik anurodh bhejna."
},

"legal.button.book": {
  it: "Prenota ora",
  en: "Book now",
  hi: "अभी बुक करें",
  pa: "ਹੁਣੇ ਬੁੱਕ ਕਰੋ",
  "hi-Latn": "Abhi book karo"
}

  };

  // ---------------------------
  // Apply translations (+ Safari repaint nudge)
  // ---------------------------
  function applyTranslations(root = document) {
    const lang = getLangFromStorage();
    if (!lang) return;

    // Text nodes
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const txt = T[key]?.[lang];
      if (typeof txt === "string") el.textContent = txt;
    });

    // Attribute translations: data-i18n-attr="aria-label:drawer.close, title:nav.home"
    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      spec.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        const val = T[key]?.[lang];
        if (attr && typeof val === "string") el.setAttribute(attr, val);
      });
    });

    // Repaint nudge to avoid Safari/WebKit stale glass layers
    repaintCards();

    // Optional event for any listeners
    try {
      document.dispatchEvent(new CustomEvent("language:change", { detail: { lang } }));
    } catch {}
  }

  // Gently force reflow/repaint for glass cards (fixes Safari glitches)
  function repaintCards() {
    const cards = document.querySelectorAll(".hero-card");
    cards.forEach((c) => {
      c.style.transform = "translateZ(0)";
      void c.offsetHeight; // reflow
      c.style.transform = "";
    });
  }

  // ---------------------------
  // Language selectors
  // ---------------------------
  function wireSelectors() {
    const selects = Array.from(document.querySelectorAll("select.lang-select"));
    if (!selects.length) return;

    // Populate once
    selects.forEach((sel) => {
      if (sel.dataset.populated === "true") return;
      const frag = document.createDocumentFragment();
      Object.entries(LANGS).forEach(([value, label]) => {
        const opt = document.createElement("option");
        opt.value = value; opt.textContent = label;
        frag.appendChild(opt);
      });
      sel.appendChild(frag);
      sel.dataset.populated = "true";
    });

    // Sync current saved language (if any)
    const current = getLangFromStorage();
    if (current) syncSelectors(current);

    // On change: save + apply
    const onChange = (e) => {
      const lang = e.currentTarget.value || "it";
      setLangWithExpiry(lang, EXPIRY_MS);
      applyTranslations(document);
    };
    selects.forEach((sel) => {
      sel.removeEventListener("change", onChange); // prevent double-binding
      sel.addEventListener("change", onChange);
    });
  }

  function syncSelectors(lang) {
    document.querySelectorAll("select.lang-select").forEach((sel) => {
      sel.value = lang;
    });
  }

  // ---------------------------
  // Init
  // ---------------------------
  function init() {
    wireSelectors();
    applyTranslations(document);
  }

  // Public API (for welcome.js, etc.)
  window.LanguageSelector = {
    init,
    set: (lang, ttl = EXPIRY_MS) => {
      setLangWithExpiry(lang, ttl);
      applyTranslations(document);
    },
    get: () => getLangFromStorage(),
    LANGS
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
