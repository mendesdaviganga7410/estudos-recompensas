const tierName = (xp) => {
    const t = (window.TIERS || []).find(r => xp >= r.min && xp <= r.max);
    return t ? `${t.i} ${t.name}` : "🥉 Bronze";
};
const avatarUrl = (uid, profile) =>
    (profile && profile.avatarUrl) ||
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(uid || "anon")}`;
const displayName = (profile, fallback) =>
    (profile && profile.displayName) || fallback || "Jogador";

function renderNotificationBadge() {
    const badge = $n("notif-badge");
    const prompt = $n("notif-prompt-dot");

    if (!badge) return;

    const hasDiag = hasDiagnostic();
    __diagnosticAnswered = hasDiag;

    if (!hasDiag) {
        badge.style.display = "none";
        if (prompt) prompt.style.display = "block";
        return;
    }

    if (prompt) prompt.style.display = "none";

    let totalUnread = __unreadCount || 0;

    if (totalUnread > 0) {
        badge.textContent = totalUnread > 99 ? "99+" : totalUnread;
        badge.style.display = "flex";
    } else {
        badge.style.display = "none";
    }
}

function formatNotifTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return "agora";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
}

function renderNotifItem(n) {
    const clickHandler = n.type === 'diagnosis' ? "onNotifDiagClick()" : `onNotifClick('${n.uid || ''}','${n.id || ''}')`;
    return `<div class="notif-item ${n.seen ? "" : "notif-item-unread"}" onclick="${clickHandler}">
        <img class="notif-avatar" src="${n.avatar || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ccc%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2230%22>🔔</text></svg>'}" alt="" loading="lazy">
        <div class="notif-body">
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${formatNotifTime(n.time)}</div>
        </div>
    </div>`;
}

function onNotifDiagClick() {
    markPersistentDiagSeen();
    closeNotificationPanel();
    setTimeout(openDiagnosticDialog, 150);
}

function onNotifClick(uid, nid) {
    closeNotificationPanel();
    if (uid) openProfileModal(uid);

    const n = __notifications.find(x => x.id === nid);
    if (n && !n.seen) {
        n.seen = true;
        __unreadCount = __notifications.filter(x => !x.seen).length;
        __saveNotifs();
        renderNotificationBadge();
    }
}

function openNotificationPanel() {
    const existing = $n("notif-panel-wrap");
    if (existing) { closeNotificationPanel(); return; }

    const bellBtn = $n("notif-bell-btn");
    const rect = bellBtn.getBoundingClientRect();

    const wrap = document.createElement("div");
    wrap.id = "notif-panel-wrap";
    wrap.className = "notif-panel-wrap";
    wrap.onclick = (e) => { if (e.target === wrap) closeNotificationPanel(); };

    const panel = document.createElement("div");
    panel.id = "notif-panel";
    panel.className = "notif-panel-dropdown";
    panel.onclick = (e) => e.stopPropagation();

    panel.style.top = Math.min(rect.bottom + 8, window.innerHeight - 40) + "px";
    panel.style.right = Math.max(8, window.innerWidth - rect.right - 4) + "px";

    let content = `<div class="notif-panel-header">
        <h3>🔔 Notificações</h3>
        <div class="notif-header-actions">
            ${hasDiagnostic() && __notifications.length > 0 ? '<button class="notif-delete-all-btn" onclick="event.stopPropagation();deleteAllNotifications()" title="Limpar notificações">🗑️</button>' : ''}
            <button class="dialog-close-btn" onclick="closeNotificationPanel()">×</button>
        </div>
    </div>
    <div class="notif-panel-body" id="notif-list">`;

    if (!window.currentUser) {
        content += `<div class="notif-empty">Faça login para receber notificações.</div>`;
    } else if (!hasDiagnostic()) {
        content += `<div class="notif-prompt" onclick="closeNotificationPanel();setTimeout(openDiagnosticDialog,100)">
            <div class="notif-prompt-icon">📋</div>
            <div class="notif-prompt-text">
                <strong>Responda ao Diagnóstico de Perfil</strong>
                <span>8 perguntas para conectar você a estudantes compatíveis</span>
            </div>
        </div>`;
    } else {
        if (__notifications.length > 0) {
            __notifications.forEach(n => {
                content += renderNotifItem(n);
            });
        }

        if (__notifications.length === 0) {
            content += `<div class="notif-empty">Nenhuma notificação no momento. Volte mais tarde!</div>`;
        }
    }

    // Item de diagnóstico — sempre a última mensagem na barra
    if (window.currentUser) {
        const diagText = hasDiagnostic()
            ? '📋 Meu Diagnóstico de Perfil — clique para ver ou editar'
            : '📋 Diagnóstico de Perfil — responda para conectar-se';
        content += `<div class="notif-item notif-item-persistent" onclick="onNotifDiagClick()">
            <span class="notif-persistent-icon">📋</span>
            <div class="notif-body">
                <div class="notif-text">${diagText}</div>
                <div class="notif-time">sempre</div>
            </div>
        </div>`;
    }

    content += `</div>`;
    panel.innerHTML = content;
    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    requestAnimationFrame(() => { wrap.classList.add("open"); panel.classList.add("open"); });
    __panelOpen = true;

    renderNotificationBadge();
}

function deleteAllNotifications() {
    clearAllNotifications();
    window.toast("🗑️ Notificações limpas!", false, 3000);
}

function closeNotificationPanel() {
    const wrap = $n("notif-panel-wrap");
    if (wrap) {
        wrap.classList.remove("open");
        const p = $n("notif-panel");
        if (p) p.classList.remove("open");
        setTimeout(() => wrap.remove(), 200);
        __panelOpen = false;
    }
}

async function openProfileModal(uid) {
    const existing = $n("notif-profile-modal");
    if (existing) existing.remove();

    const d = document.createElement("dialog");
    d.id = "notif-profile-modal";
    d.className = "theme-bento-dialog";

    d.innerHTML = `<div class="bento-card dialog-theme-card" style="max-width:380px;">
        <div class="dialog-header-block">
            <h3>Perfil do Jogador</h3>
            <button class="dialog-close-btn" onclick="closeProfileModal()">×</button>
        </div>
        <div class="dialog-body" id="notif-profile-body">
            <div class="notif-profile-loading">Carregando...</div>
        </div>
    </div>`;

    document.body.appendChild(d);
    d.showModal();

    try {
        const profiles = await window.fetchPublicProfiles(200);
        const data = profiles.find(p => p.uid === uid);

        if (!data) {
            $n("notif-profile-body").innerHTML = `<div class="notif-empty">Perfil não encontrado.</div>`;
            return;
        }

        const profile = data.profile || {};
        const xp = data.xp || 0;
        const pts = data.pts || data.pontos || 0;
        const name = displayName(profile, "Jogador");
        const avatar = avatarUrl(uid, profile);
        const goal = profile.epicGoal || "Sem meta definida";
        const tier = tierName(xp);
        const desc = profile.description || "";

        $n("notif-profile-body").innerHTML = `
            <div class="notif-profile-card">
                <img class="notif-profile-avatar" src="${avatar}" alt="" loading="lazy"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ccc%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2230%22>🧑</text></svg>'">
                <div class="notif-profile-name">${name}</div>
                <div class="notif-profile-rank">${tier}</div>
                <div class="notif-profile-stats">
                    <span>⚡ ${xp} XP</span>
                    <span>🏆 ${pts} Pts</span>
                </div>
                <div class="notif-profile-goal">🎯 ${goal}</div>
                ${desc ? `<div class="notif-profile-desc">${desc}</div>` : ""}
                <button class="btn-theme w-full" style="margin-top:0.75rem;" onclick="closeProfileModal();navigateTo('comunidade.html')">
                    🌐 Ver na Comunidade
                </button>
            </div>`;
    } catch (err) {
        console.warn("Profile modal error:", err);
        if ($n("notif-profile-body")) {
            $n("notif-profile-body").innerHTML = `<div class="notif-empty">Erro ao carregar perfil.</div>`;
        }
    }
}

function closeProfileModal() {
    const d = $n("notif-profile-modal");
    if (d) d.close();
}

function showDiagnosticPrompt() {
    if (hasDiagnostic() || !window.currentUser) return;
    window.toast("📋 Responda ao Diagnóstico de Perfil (8 perguntas) para se conectar a outros estudantes!", false, 8000);
}

let __promptTimer = null;
function scheduleDiagnosticPrompt() {
    if (__promptTimer) clearInterval(__promptTimer);
    __promptTimer = setInterval(() => {
        if (hasDiagnostic() || !window.currentUser) return;
        showDiagnosticPrompt();
    }, 120000);
}
