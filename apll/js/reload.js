// ==============================
// reload.js — FIXED (NO OVERLAY ON FIRST LOAD)
// ==============================

let overlayActive = false;

window.showReloadOverlay = function () {
    if (overlayActive) return;
    overlayActive = true;

    console.log("[reload.js] Reload overlay activated.");

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        zIndex: "999999",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontFamily: "Arial",
        padding: "20px",
        textAlign: "center"
    });

    const msg1 = document.createElement("div");
    msg1.textContent = "A better version of this form is available.";
    msg1.style.fontSize = "22px";
    msg1.style.marginBottom = "12px";

    const msg2 = document.createElement("div");
    msg2.textContent = "Please reload for the best experience.";
    msg2.style.fontSize = "16px";
    msg2.style.marginBottom = "25px";

    const btn = document.createElement("button");
    btn.textContent = "Reload Now";
    Object.assign(btn.style, {
        padding: "12px 28px",
        background: "#28a745",
        borderRadius: "8px",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        fontSize: "18px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    });

    btn.onclick = () => location.reload();

    overlay.appendChild(msg1);
    overlay.appendChild(msg2);
    overlay.appendChild(btn);
    document.body.appendChild(overlay);
};