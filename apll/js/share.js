/* js/share.js */
/* One-file Share Component: injects its own CSS + modal + event wiring (with icons/colors) */
(function () {
  "use strict";

  // ---------- Inject CSS once ----------
  const CSS = `
  .share-overlay{position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);display:grid;place-items:center}
  .share-overlay[hidden]{display:none!important}
  .share-card{width:min(92vw,480px);background:#fff;color:var(--ink,#1a1d20);border-radius:16px;box-shadow:0 18px 48px rgba(0,0,0,.25);padding:22px 18px 18px;position:relative}
  .share-close{position:absolute;top:8px;right:10px;width:40px;height:40px;border:0;background:transparent;font-size:24px;line-height:1;border-radius:8px;cursor:pointer}
  .share-card h3{margin:6px 0 6px;font-size:20px;color:var(--primary-ink,#0A2E5C)}
  .share-desc{margin:0 0 14px;color:var(--muted,#5f6673);font-size:14px}

  .share-actions{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
  .share-actions .btn{
    flex:1 1 30%;
    display:flex;align-items:center;justify-content:center;gap:10px;
    text-align:center;padding:13px 16px;
    border-radius:12px;border:1.5px solid rgba(0,0,0,.14);
    background:#fff;cursor:pointer;
    font-weight:800;font-size:15px;letter-spacing:.2px;
    text-decoration:none;
    box-shadow:0 2px 10px rgba(0,0,0,.10);
    transition:transform .12s ease,background .12s ease,box-shadow .12s ease,filter .12s ease,border-color .12s ease;
  }
  .share-actions .btn:not(.share-copy):not(.btn-wa):hover{
    background:rgba(0,0,0,.035);
    box-shadow:0 6px 16px rgba(0,0,0,.14);
  }
  .share-actions .btn:active{transform:translateY(1px)}
  .share-actions .btn:focus-visible{
    outline:2px solid var(--ring,rgba(11,94,215,.35));
    outline-offset:2px;
  }
  .share-actions .btn svg{
    width:20px;height:20px;display:inline-block;flex:0 0 auto;
    filter:drop-shadow(0 1px 0 rgba(0,0,0,.08));
  }

 .share-actions .share-copy,
.share-actions .btn-wa {
  background-color: inherit;
  color: inherit;
}

.share-actions .share-copy {
  background:#0B5ED7 !important;
  color:#fff !important;
  border-color:transparent !important;
}

.share-actions .btn-wa {
  background:#25D366 !important;
  color:#fff !important;
  border-color:#1FAA54 !important;
}

  /* Email */
  .btn-mail{
    background:linear-gradient(0deg,#ffffff 0%, #fbfbfd 100%);
    color:var(--primary-ink,#0A2E5C);
    border-color:rgba(10,46,92,.18);
  }
  .btn-mail:hover{background:linear-gradient(0deg,#f7f9fc 0%, #ffffff 100%)}
  .btn-mail svg{fill:currentColor}

  .share-linkbox{background:#f7f9fc;border:1px solid rgba(0,0,0,.08);border-radius:10px;padding:5px}
  #shareLink{width:100%;border:0;background:transparent;outline:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:14px;color:#223}

  .share-actions .btn{ white-space: nowrap; }
  
  .share-actions .btn span{ white-space: nowrap; }

  @media (max-width: 380px){
  .share-actions{ gap: 8px; }
  .share-actions .btn{ font-size: 14px; padding: 12px; gap: 8px; }
}
  
  @media (prefers-reduced-motion:no-preference){
    .share-card{transform:translateY(6px);animation:shareIn .18s ease both}
    @keyframes shareIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  }`;
  function injectCSSOnce() {
    if (document.getElementById("sharejs-style")) return;
    const s = document.createElement("style");
    s.id = "sharejs-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ---------- Icons ----------
  const ICONS = {
    copy:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z"/></svg>`,
    wa:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.11 17.72c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.51-1.78-1.69-2.08-.18-.3-.02-.46.14-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.48-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.16 4.55 3.02 1.3 3.02.87 3.56.83.54-.03 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.43-.07-.13-.26-.2-.56-.35z"/><path d="M26.9 5.1A13.93 13.93 0 0 0 16.02 1C8.3 1.02 2.04 7.3 2.02 15.02c-.01 2.63.69 5.2 2.03 7.45L1 31l8.7-2.93a14 14 0 0 0 6.33 1.56h.01c7.72-.02 13.98-6.3 14-14.02a13.93 13.93 0 0 0-3.14-9.5zM16.02 28.6h-.01a12.6 12.6 0 0 1-6.42-1.77l-.46-.27-5.17 1.74 1.72-5.04-.3-.52a12.59 12.59 0 0 1-1.88-6.7C3.52 8.07 9.02 2.58 16.02 2.56c3.35 0 6.5 1.3 8.86 3.67a12.55 12.55 0 0 1 3.66 8.85c-.02 6.99-5.71 12.6-12.52 12.6z"/></svg>`,
    mail:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>`
  };

  // ---------- Modal ----------
  const MODAL_HTML = `
  <div id="shareModal" class="share-overlay" hidden>
    <div class="share-card" role="dialog" aria-modal="true" aria-labelledby="shareTitle">
      <button class="share-close" type="button" aria-label="Chiudi">×</button>
      <h3 id="shareTitle">Condividi</h3>
      <p class="share-desc">Scegli come condividere questo servizio:</p>

      <div class="share-actions">
        <button class="btn share-copy" type="button">
          ${ICONS.copy}<span>Copia link</span>
        </button>
        <a class="btn btn-wa" data-share-wa target="_blank" rel="noopener">
          ${ICONS.wa}<span>WhatsApp</span>
        </a>
        <a class="btn btn-mail" data-share-mail>
          ${ICONS.mail}<span>Email</span>
        </a>
      </div>

      <div class="share-linkbox">
        <input id="shareLink" type="text" readonly aria-label="Link" />
      </div>
    </div>
  </div>`;
  function ensureModal() {
    let modal = document.getElementById("shareModal");
    if (!modal) {
      const wrap = document.createElement("div");
      wrap.innerHTML = MODAL_HTML;
      document.body.appendChild(wrap.firstElementChild);
      modal = document.getElementById("shareModal");
    }
    return modal;
  }

  // ---------- Utils ----------
  const $ = (q, r = document) => r.querySelector(q);
  const $$ = (q, r = document) => Array.from(r.querySelectorAll(q));
  function absURL(url) {
    try { return new URL(url || "", location.href).href; }
    catch { return location.href; }
  }
  function pickFromCard(el) {
    const card = el.closest(".hero-card") || document;
    const title = card.querySelector("h1,h2,h3")?.textContent?.trim() || document.title || "Condividi";
    const desc = card.querySelector("p")?.textContent?.trim() || "";
    return { title, desc };
  }
  function buildShareData(trigger) {
    const { title: t0, desc: d0 } = pickFromCard(trigger);
    const urlAttr   = trigger.getAttribute("data-share-url") || trigger.getAttribute("href");
    const titleAttr = trigger.getAttribute("data-share-title");
    const textAttr  = trigger.getAttribute("data-share-text");
    return { title: titleAttr || t0, text: textAttr || d0, url: absURL(urlAttr || location.href) };
  }

  async function tryNativeShare(data) {
    if (!navigator.share) return false;
    try { await navigator.share({ title: data.title, text: data.text, url: data.url }); return true; }
    catch { return false; }
  }

  // ---------- Modal control ----------
  let lastActive = null;
  function openModal(data) {
    const modal = ensureModal();
    const input = $("#shareLink", modal);
    const aWA = $("[data-share-wa]", modal);
    const aMailEl = $("[data-share-mail]", modal);
    const btnCopy = $(".share-copy", modal);
    const btnClose = $(".share-close", modal);

    input.value = data.url;
    aWA.href = "https://wa.me/?text=" + encodeURIComponent(`${data.title}\n${data.url}`);
    aMailEl.href = "mailto:?subject=" + encodeURIComponent(data.title) +
      "&body=" + encodeURIComponent((data.text ? data.text + "\n\n" : "") + data.url);

    modal.removeAttribute("hidden");
    document.body.classList.add("overlay-lock");
    lastActive = document.activeElement;
    btnCopy?.focus();
    trapFocus(modal, true);

    modal.addEventListener("click", overlayClose);
    btnClose.addEventListener("click", closeModal);
    btnCopy.addEventListener("click", copyLink);

    function overlayClose(e){ if(e.target === modal) closeModal(); }
    function copyLink(){
      const url = input.value;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(toast, fallback);
      } else { fallback(); }
      function fallback(){ input.select(); document.execCommand?.("copy"); toast(); }
      function toast(){
        btnCopy.innerHTML = `${ICONS.copy}<span>Copiato!</span>`;
        setTimeout(()=>{ btnCopy.innerHTML = `${ICONS.copy}<span>Copia link</span>`; }, 1200);
      }
    }
    function closeModal(){
      trapFocus(modal, false);
      modal.setAttribute("hidden","");
      document.body.classList.remove("overlay-lock");
      modal.removeEventListener("click", overlayClose);
      btnClose.removeEventListener("click", closeModal);
      btnCopy.removeEventListener("click", copyLink);
      lastActive?.focus?.();
    }
  }

  function trapFocus(scope, enable){
    function onKey(e){
      if (e.key === "Escape"){
        e.preventDefault();
        scope.setAttribute("hidden","");
        document.body.classList.remove("overlay-lock");
        lastActive?.focus?.();
        document.removeEventListener("keydown", onKey);
        return;
      }
      if (e.key !== "Tab") return;
      const f = $$("button,a[href],input,[tabindex]:not([tabindex='-1'])", scope)
        .filter(el => !el.hasAttribute("disabled") && el.offsetParent !== null);
      const first = f[0], last = f[f.length-1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
    if (enable) document.addEventListener("keydown", onKey);
    else document.removeEventListener("keydown", onKey);
  }

  // ---------- Delegate clicks ----------
  function onShareClick(e) {
    const trigger = e.target.closest("[data-share]");
    if (!trigger) return;
    e.preventDefault();
    const data = buildShareData(trigger);
    tryNativeShare(data).then(done => { if (!done) openModal(data); });
  }

  function init() {
    injectCSSOnce();
    ensureModal();
    document.addEventListener("click", onShareClick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else { init(); }
})();