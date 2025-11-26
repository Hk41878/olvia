// ==============================
// statusBall.js — COMPATIBLE WITH serverMan.js + loadForm.js
// Mobile + PC Drag + Save Position
// ==============================

// ---------- CONFIG ----------
const ENABLE_STATUS_BALL = true;
const ENABLE_DRAG = true;

// Storage key (same position across all pages)
const STORAGE_KEY = "statusBallPos";

// ---------- INTERNAL VARIABLES ----------
let ballEl = null;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let ballStartX = 0;
let ballStartY = 0;

// ---------- INITIALIZE ----------
(function () {
    if (!ENABLE_STATUS_BALL) return;

    createBall();
    restoreSavedPosition();
    initStatusSync();
})();

// ---------- CREATE FLOATING BALL ----------
function createBall() {
    ballEl = document.createElement("div");

    Object.assign(ballEl.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "42px",
        height: "42px",
        background: "#222",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        cursor: ENABLE_DRAG ? "grab" : "pointer",
        zIndex: "999998",
        color: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        userSelect: "none"
    });

    ballEl.textContent = "🔴";
    document.body.appendChild(ballEl);

    if (ENABLE_DRAG) enableHybridDrag(ballEl);
}

// ---------- UPDATE EMOJI ----------
window.updateStatusBall = function (isOnline) {
    if (!ballEl) return;
    ballEl.textContent = isOnline ? "🟢" : "🔴";
};

// ---------- SYNC WITH serverMan.js ----------
function initStatusSync() {
    // Wait 100ms for serverMan.js to initialize
    setTimeout(() => {
        if (typeof window.getApllServerState === "function") {
            applyCurrentState();
        }
    }, 100);

    // Update ball every time serverMan updates
    window.addEventListener("apllStatusUpdated", applyCurrentState);
}

function applyCurrentState() {
    if (!ballEl) return;
    const state = window.getApllServerState ? window.getApllServerState() : "unknown";

    if (state === "online") {
        ballEl.textContent = "🟢";
    } else {
        ballEl.textContent = "🔴";
    }
}

// =====================================================
//            DRAG SYSTEM (PC + MOBILE)
// =====================================================
function enableHybridDrag(el) {

    function disableSelection() {
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";
    }

    function enableSelection() {
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
    }

    function startDrag(clientX, clientY) {
        isDragging = true;

        dragStartX = clientX;
        dragStartY = clientY;

        const rect = el.getBoundingClientRect();
        ballStartX = rect.left;
        ballStartY = rect.top;

        el.style.transition = "none";
        el.style.cursor = "grabbing";

        disableSelection();
    }

    function moveDrag(clientX, clientY) {
        if (!isDragging) return;

        const dx = clientX - dragStartX;
        const dy = clientY - dragStartY;

        el.style.left = ballStartX + dx + "px";
        el.style.top = ballStartY + dy + "px";
        el.style.right = "auto";
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;

        el.style.cursor = "grab";
        el.style.transition = "0.15s";

        savePosition();
        enableSelection();
    }

    // Mouse
    el.addEventListener("mousedown", e => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });

    document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
    document.addEventListener("mouseup", endDrag);

    // Touch
    el.addEventListener("touchstart", e => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
    }, { passive: false });

    document.addEventListener("touchmove", e => {
        if (!isDragging) return;
        const t = e.touches[0];
        moveDrag(t.clientX, t.clientY);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener("touchend", endDrag);
}

// =====================================================
//               SAVE + RESTORE POSITION
// =====================================================

function savePosition() {
    if (!ballEl) return;

    const rect = ballEl.getBoundingClientRect();
    const pos = {
        left: rect.left,
        top: rect.top
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
}

function restoreSavedPosition() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const pos = JSON.parse(saved);

        ballEl.style.left = pos.left + "px";
        ballEl.style.top = pos.top + "px";
        ballEl.style.right = "auto";

    } catch (err) {
        console.error("Failed to load saved position:", err);
    }
}