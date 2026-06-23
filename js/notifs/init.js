let __initTimer = null;

async function initNotifications() {
    if (__initTimer) clearTimeout(__initTimer);

    if (!window.currentUser) {
        __diagnosticAnswered = false;
        renderNotificationBadge();
        return;
    }

    const oldDiag = window.state && window.state.diagnostic;
    if (oldDiag && oldDiag.diagnosticVersion !== DIAGNOSTIC_VERSION) {
        window.state.diagnostic = undefined;
        __diagnosticAnswered = false;
        __notifications = [];
        __unreadCount = 0;
        __diagAnswers = {};
        renderNotificationBadge();
        setTimeout(showDiagnosticPrompt, 1500);
        scheduleDiagnosticPrompt();
        return;
    }

    __diagnosticAnswered = hasDiagnostic();

    if (hasDiagnostic()) {
        renderNotificationBadge();
        await refreshNotifications();
    } else {
        renderNotificationBadge();
        setTimeout(showDiagnosticPrompt, 3000);
    }

    scheduleDiagnosticPrompt();

    if (__refreshTimer) clearInterval(__refreshTimer);
    __refreshTimer = setInterval(() => {
        if (window.currentUser && hasDiagnostic()) {
            refreshNotifications();
        }
    }, 300000);
}

async function resetAllDiagnostics() {
    if (!window.currentUser || !window.saveStateToFirestore) {
        console.warn("Usuário não logado ou Firestore indisponível.");
        return;
    }

    const myDiag = window.state && window.state.diagnostic;
    if (!myDiag) {
        window.toast("Você já está sem diagnóstico ativo.", false);
        return;
    }

    window.state.diagnostic = undefined;
    __diagnosticAnswered = false;
    __notifications = [];
    __unreadCount = 0;
    __diagAnswers = {};

    try {
        await window.saveStateToFirestore(window.currentUser.uid, window.state, {
            diagnostic: null,
            diagnosticVersion: null,
            diagnosticUpdatedAt: null
        });
    } catch (e) {
        console.warn("Erro ao limpar diagnóstico no Firestore:", e);
    }

    renderNotificationBadge();
    setTimeout(showDiagnosticPrompt, 1500);
    window.toast("🔄 Diagnóstico resetado. Responda novamente!", false, 5000);
}

/* ---- EXPORT WINDOW ---- */

window.openDiagnosticDialog     = openDiagnosticDialog;
window.closeDiagnosticDialog    = closeDiagnosticDialog;
window.submitDiagnostic         = submitDiagnostic;
window.diagNext                 = diagNext;
window.diagPrev                 = diagPrev;
window.goToStep                 = goToStep;
window.selectDiagOption         = selectDiagOption;
window.toggleDiagOption         = toggleDiagOption;
window.openNotificationPanel    = openNotificationPanel;
window.closeNotificationPanel   = closeNotificationPanel;
window.openProfileModal         = openProfileModal;
window.closeProfileModal        = closeProfileModal;
window.refreshNotifications     = refreshNotifications;
window.initNotifications        = initNotifications;
window.renderNotifItem          = renderNotifItem;
window.resetAllDiagnostics      = resetAllDiagnostics;

/* Monitora mudanças de currentUser para (re)inicializar */
(function watchUser() {
    let lastUid = window.currentUser && window.currentUser.uid;
    setInterval(() => {
        const uid = window.currentUser && window.currentUser.uid;
        if (uid !== lastUid) {
            lastUid = uid;
            if (uid) initNotifications();
            else {
                __diagnosticAnswered = false;
                __notifications = [];
                __unreadCount = 0;
                renderNotificationBadge();
            }
        }
    }, 1000);
})();

/* Init on DOM ready if user already logged in */
document.addEventListener("DOMContentLoaded", () => {
    if (window.currentUser) {
        setTimeout(initNotifications, 500);
    }
});
