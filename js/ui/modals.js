let authMode = "login";

function openAuthModal() {
    $("auth-email").value = "";
    $("auth-password").value = "";
    setAuthMode("login");
    $("auth-modal").style.display = "flex";
    requestAnimationFrame(() => window.scrollTo(0, 0));
}

function closeAuthModal() {
    $("auth-modal").style.display = "none";
}

function setAuthMode(mode) {
    authMode = mode;
    const pwGroup = $("auth-password-group");
    const forgot  = $("btn-forgot-password");
    const isLogin = mode === "login";
    const isReset = mode === "reset";

    $("modal-title").textContent        = isReset ? "Redefinir Senha" : isLogin ? "Entrar na Conta" : "Criar Nova Conta";
    $("btn-auth-submit").textContent     = isReset ? "Enviar Link"    : isLogin ? "Entrar"          : "Cadastrar";

    if (pwGroup) pwGroup.style.display  = isReset ? "none" : "block";
    if (forgot)  forgot.style.display   = isReset ? "none" : isLogin ? "inline-block" : "none";

    const toggleEl = document.querySelector("#auth-form + div");
    if (toggleEl) {
        if (isReset) {
            toggleEl.innerHTML = `<a href="#" onclick="openAuthModal()"
                style="color: var(--accent); font-weight: 700; text-decoration: none;">← Voltar ao Login</a>`;
        } else {
            toggleEl.innerHTML = `
                <span id="toggle-text" style="color: var(--muted);">${isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}</span>
                <a href="#" id="btn-toggle-auth-mode" onclick="toggleAuthMode(event)"
                    style="color: var(--accent); font-weight: 700; text-decoration: none; margin-left: 0.25rem;">${isLogin ? "Criar Conta" : "Entrar"}</a>`;
        }
    }
}

function openForgotPassword(event) {
    if (event) event.preventDefault();
    setAuthMode("reset");
}

function toggleAuthMode(event) {
    if (event) event.preventDefault();
    setAuthMode(authMode === "login" ? "register" : "login");
}

function handleAuthSubmit() {
    const email    = $("auth-email").value.trim();
    const password = $("auth-password").value;

    if (authMode === "reset") {
        if (!email) { toast("Digite seu e-mail.", true); return; }
        window.sendPasswordReset
            ? window.sendPasswordReset(email)
            : toast("Módulo de autenticação indisponível.", true);
        return;
    }

    if (!email || !password) { toast("Preencha todos os campos.", true); return; }

    if (authMode === "login") {
        window.loginEmailAndPassword
            ? window.loginEmailAndPassword(email, password)
            : toast("Módulo de autenticação indisponível.", true);
    } else {
        window.registerEmailAndPassword
            ? window.registerEmailAndPassword(email, password)
            : toast("Módulo de autenticação indisponível.", true);
    }
}

function openSettingsModal() {
    const savedRadius = getComputedStyle(document.documentElement).getPropertyValue('--base-radius').trim() || "16px";
    const savedShadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-depth').trim() || "6px";
    if ($("radiusSlider")) $("radiusSlider").value = parseInt(savedRadius);
    if ($("shadowSlider")) $("shadowSlider").value = parseInt(savedShadow);
    if ($("radiusValue")) $("radiusValue").textContent = savedRadius;
    if ($("shadowValue")) $("shadowValue").textContent = savedShadow;

    const lockNotices   = document.querySelectorAll('.tab-lock-notice');
    const authContents  = document.querySelectorAll('.tab-auth-content');

    const profile = window.state?.profile || {};
    if (window.currentUser) {
        lockNotices.forEach(n  => n.style.display = "none");
        authContents.forEach(c => c.style.display = "flex");
        if ($("settings-name"))  $("settings-name").value  = profile.displayName || window.currentUser.displayName || "";
        if ($("settings-email")) $("settings-email").value = window.currentUser.email || "";
    } else {
        lockNotices.forEach(n  => n.style.display = "block");
        authContents.forEach(c => c.style.display = "none");
    }
    if ($("settings-epic-goal")) $("settings-epic-goal").value = profile.epicGoal || "";
    if ($("settings-description")) $("settings-description").value = profile.description || "";
    if ($("settings-password")) $("settings-password").value = "";
    if ($("settings-public-profile")) {
        $("settings-public-profile").checked = profile.public === true;
    }

    switchTab('tab-appearance');
    $("settings-modal").style.display = "flex";
    requestAnimationFrame(() =>
        document.querySelector(".settings-content")?.scrollTo(0, 0)
    );
}

function closeSettingsModal() {
    $("settings-modal").style.display = "none";
    cancelCrop();
    cancelBannerCrop();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    const btn = Array.from(document.querySelectorAll('.tab-btn'))
        .find(b => b.getAttribute('onclick')?.includes(tabId));
    if (btn) btn.classList.add('active');

    const panel = $(tabId);
    if (panel) panel.classList.add('active');

    if (tabId === 'tab-sounds') renderSoundTab();
    cancelCrop();
}

function handleUpdateName() {
    const val = $("settings-name").value.trim();
    if (!val) { toast("Digite um nome válido.", true); return; }
    if (window.state?.profile) window.state.profile.displayName = val;
    window.saveState?.();
    if (window.updateUserProfileName) window.updateUserProfileName(val);
    else window.renderHeroHub?.();
    toast("Nome atualizado!");
}

function handleUpdateEpicGoal() {
    const val = $("settings-epic-goal").value.trim();
    if (window.state?.profile) window.state.profile.epicGoal = val;
    window.saveState?.();
    window.renderHeroHub?.();
    toast(val ? "Meta épica atualizada!" : "Meta épica removida.");
}

function handleUpdateDescription() {
    const val = $("settings-description").value.trim();
    if (window.state?.profile) window.state.profile.description = val;
    window.saveState?.();
    window.renderHeroHub?.();
    toast(val ? "Descrição salva!" : "Descrição removida.");
}

function handleUpdateEmail() {
    const val = $("settings-email").value.trim();
    if (val && window.updateUserEmail) window.updateUserEmail(val);
    else if (!val) toast("Digite um e-mail válido.", true);
}

function handleUpdatePassword() {
    const val = $("settings-password").value;
    if (val.length >= 6 && window.updateUserPassword) {
        window.updateUserPassword(val);
    } else {
        toast("A senha deve conter ao menos 6 caracteres.", true);
    }
}

function handleVerifyEmail() {
    if (window.sendVerification) window.sendVerification();
}

async function toggleProfilePrivacy() {
    const cb = $("settings-public-profile");
    if (!cb) return;
    const isPublic = cb.checked;
    if (window.state?.profile) {
        window.state.profile.public = isPublic;
    }
    try {
        await window.saveState?.();
        toast(isPublic ? "Perfil agora é público 🌐" : "Perfil agora é privado 🔒");
    } catch (err) {
        console.error("Privacy toggle save error:", err);
        toast("Erro ao salvar privacidade.", true);
        cb.checked = !isPublic;
    }
}

function openCommunityModal() {
    const modal = $("community-modal");
    if (!modal) return;
    modal.style.display = "flex";
    renderPublicProfiles();
}

function closeCommunityModal() {
    $("community-modal").style.display = "none";
}

async function renderPublicProfiles() {
    const grid = $("community-grid");
    if (!grid) return;
    grid.innerHTML = `<div class="community-empty" style="text-align:center;padding:3rem 1rem;color:var(--muted);font-size:0.85rem;font-weight:700;">Carregando...</div>`;

    let profiles = [];
    try {
        profiles = window.fetchPublicProfiles
            ? await window.fetchPublicProfiles()
            : [];
    } catch (err) {
        console.error("renderPublicProfiles fetch error:", err);
    }

    console.log(`Comunidade: ${profiles.length} perfis públicos encontrados`);
    if (profiles.length) {
        profiles.forEach((p, i) => console.log(`  ${i+1}: ${p.profile?.displayName || 'sem nome'} (${p.uid}) public=${p.profile?.public}`));
    }

    if (!profiles.length) {
        grid.innerHTML = `<div class="community-empty" style="text-align:center;padding:3rem 1rem;color:var(--muted);font-size:0.85rem;font-weight:700;line-height:1.5;">Nenhum perfil público encontrado ainda.<br>🌐 Seja o primeiro a aparecer aqui!</div>`;
        return;
    }

    const tiers = window.TIERS || [];
    function getTierInfo(xp) {
        return tiers.find(t => xp >= t.min && xp <= t.max) || tiers[0] || { i: '🥉', name: 'Bronze' };
    }

    grid.innerHTML = profiles.map(p => {
        const profile = p.profile || {};
        const displayName = profile.displayName || 'Herói';
        const epicGoal = profile.epicGoal || '';
        const avatarUrl = profile.avatarUrl
            || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(p.uid)}`;
        const bannerUrl = profile.bannerUrl || '';
        const tier = getTierInfo(p.xp || 0);

        return `
            <div class="player-card">
                <div class="player-banner" style="background-image:${bannerUrl ? `url(${bannerUrl})` : 'var(--panel)'};"></div>
                <div class="player-card-body">
                    <img class="player-card-avatar" src="${avatarUrl}" alt="" loading="lazy">
                    <div class="player-card-name">${displayName}</div>
                    ${epicGoal ? `<div class="player-card-goal">"${escapeHtml(epicGoal)}"</div>` : ''}
                    <div class="player-card-stats">
                        <span>${tier.i} ${tier.name}</span>
                        <span>${p.xp || 0} XP</span>
                        <span>${p.pts || p.pontos || 0} Pts</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderSoundTab() {
    const container = $("tab-sounds-body");
    if (!container || typeof SOUND_PRESETS === 'undefined') return;
    const cfg = typeof soundConfig !== 'undefined' ? soundConfig : {};
    const groups = [
        { key: 'start',    label: '▶ Iniciar' },
        { key: 'pause',    label: '⏸ Pausar' },
        { key: 'complete', label: '🎉 Concluir' },
        { key: 'alarm',    label: '🔊 Alarme' }
    ];
    container.innerHTML = '<div style="padding:1rem 0;">' + groups.map(g => `
        <div class="sound-group">
            <span class="sound-group-title">${g.label}</span>
            <div class="sound-grid">
                ${Object.entries(SOUND_PRESETS[g.key] || {}).map(([id, p]) => `
                    <div class="sound-option ${id === cfg[g.key] ? 'active' : ''}"
                         onclick="selectSound('${g.key}','${id}')">
                        <span>${p.name}</span>
                        <button class="preview-btn" onclick="event.stopPropagation(); playSound('${g.key}','${id}')">▶</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('') + '</div>';
}

function selectSound(group, id) {
    if (typeof soundConfig === 'undefined' || typeof SOUND_PRESETS === 'undefined') return;
    soundConfig[group] = id;
    if (typeof saveSoundConfig !== 'undefined') saveSoundConfig();
    renderSoundTab();
    if (typeof playSound !== 'undefined') playSound(group, id);
}

/* =====================================================================
   QUICK-EDIT DIALOGS (Hub)
   ===================================================================== */
function openQuickDialog(id) {
    const el = $(id);
    if (!el) return;
    const profile = window.state?.profile || {};
    if (id === 'quick-name-dialog') {
        $("quick-name-input").value = profile.displayName || '';
        $("quick-name-input").focus();
    } else if (id === 'quick-goal-dialog') {
        $("quick-goal-input").value = profile.epicGoal || '';
        $("quick-goal-input").focus();
    } else if (id === 'quick-desc-dialog') {
        $("quick-desc-input").value = profile.description || '';
        $("quick-desc-input").focus();
    }
    el.style.display = 'flex';
    requestAnimationFrame(() => window.scrollTo(0, 0));
}

function closeQuickDialog(id) {
    const el = $(id);
    if (el) el.style.display = 'none';
}

function saveQuickName() {
    const val = $("quick-name-input").value.trim();
    if (!val) { toast("Digite um nome válido.", true); return; }
    if (window.state?.profile) window.state.profile.displayName = val;
    window.saveState?.();
    if (window.updateUserProfileName) window.updateUserProfileName(val);
    else window.renderHeroHub?.();
    closeQuickDialog('quick-name-dialog');
    toast("Nome atualizado!");
}

function saveQuickGoal() {
    const val = $("quick-goal-input").value.trim();
    if (window.state?.profile) window.state.profile.epicGoal = val;
    window.saveState?.();
    window.renderHeroHub?.();
    closeQuickDialog('quick-goal-dialog');
    toast(val ? "Meta épica atualizada!" : "Meta épica removida.");
}

function saveQuickDescription() {
    const val = $("quick-desc-input").value.trim();
    if (window.state?.profile) window.state.profile.description = val;
    window.saveState?.();
    window.renderHeroHub?.();
    closeQuickDialog('quick-desc-dialog');
    toast(val ? "Descrição salva!" : "Descrição removida.");
}

/* Avatar quick-edit */
let _quickCropper = null;

function openQuickAvatarDialog() {
    const dropZone = $("quick-avatar-drop-zone");
    const fileInput = $("quick-avatar-input");
    const cropCont = $("quick-avatar-crop");
    const img = $("quick-avatar-image");
    if (dropZone) dropZone.style.display = 'block';
    if (cropCont) cropCont.style.display = 'none';
    if (img) img.src = '';
    if (fileInput) fileInput.value = '';
    cancelQuickAvatarCrop();
    $("quick-avatar-dialog").style.display = 'flex';
    requestAnimationFrame(() => window.scrollTo(0, 0));
    // Auto-trigger file picker
    setTimeout(() => fileInput?.click(), 100);
}

function closeQuickAvatarDialog() {
    cancelQuickAvatarCrop();
    $("quick-avatar-dialog").style.display = 'none';
}

function initQuickAvatarPicker() {
    const dropZone = $("quick-avatar-drop-zone");
    const fileInput = $("quick-avatar-input");
    if (!dropZone || !fileInput) return;
    dropZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", e => {
        if (e.target.files.length > 0) processQuickAvatarFile(e.target.files[0]);
    });
}

function processQuickAvatarFile(file) {
    if (!file?.type.startsWith("image/")) {
        toast("Selecione um arquivo de imagem válido.", true);
        return;
    }
    const reader = new FileReader();
    reader.onload = event => {
        const img = $("quick-avatar-image");
        img.src = event.target.result;
        $("quick-avatar-drop-zone").style.display = "none";
        $("quick-avatar-crop").style.display = "flex";
        if (_quickCropper) _quickCropper.destroy();
        _quickCropper = new Cropper(img, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: "move",
            background: false,
            autoCropArea: 0.8,
            responsive: true,
            restore: false
        });
    };
    reader.readAsDataURL(file);
}

function cancelQuickAvatarCrop() {
    if (_quickCropper) { _quickCropper.destroy(); _quickCropper = null; }
    const dropZone = $("quick-avatar-drop-zone");
    const cropCont = $("quick-avatar-crop");
    const fileInput = $("quick-avatar-input");
    if (dropZone) dropZone.style.display = "block";
    if (cropCont) cropCont.style.display = "none";
    if (fileInput) fileInput.value = "";
}

function saveQuickAvatar() {
    if (!_quickCropper) return;
    const canvas = _quickCropper.getCroppedCanvas({
        width: 256, height: 256,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high"
    });
    canvas.toBlob(blob => {
        if (!blob) { toast("Erro ao processar imagem.", true); return; }
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        if (window.updateUserProfilePhoto) {
            window.updateUserProfilePhoto(file);
            closeQuickAvatarDialog();
        } else {
            toast("Serviço de sincronização indisponível.", true);
        }
    }, "image/jpeg", 0.85);
}

/* Banner quick-edit */
let _quickBannerCropper = null;

function openQuickBannerDialog() {
    const dropZone = $("quick-banner-drop-zone");
    const fileInput = $("quick-banner-input");
    const cropCont = $("quick-banner-crop");
    const img = $("quick-banner-image");
    if (dropZone) dropZone.style.display = 'flex';
    if (cropCont) cropCont.style.display = 'none';
    if (img) img.src = '';
    if (fileInput) fileInput.value = '';
    cancelQuickBannerCrop();
    $("quick-banner-dialog").style.display = 'flex';
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setTimeout(() => fileInput?.click(), 100);
}

function closeQuickBannerDialog() {
    cancelQuickBannerCrop();
    $("quick-banner-dialog").style.display = 'none';
}

function initQuickBannerPicker() {
    const dropZone = $("quick-banner-drop-zone");
    const fileInput = $("quick-banner-input");
    if (!dropZone || !fileInput) return;
    dropZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", e => {
        if (e.target.files.length > 0) processQuickBannerFile(e.target.files[0]);
    });
}

function processQuickBannerFile(file) {
    if (!file?.type.startsWith("image/")) {
        toast("Selecione um arquivo de imagem válido.", true);
        return;
    }
    const reader = new FileReader();
    reader.onload = event => {
        const img = $("quick-banner-image");
        img.src = event.target.result;
        $("quick-banner-drop-zone").style.display = "none";
        $("quick-banner-crop").style.display = "flex";
        if (_quickBannerCropper) _quickBannerCropper.destroy();
        _quickBannerCropper = new Cropper(img, {
            aspectRatio: 16 / 5,
            viewMode: 1,
            dragMode: "move",
            background: false,
            autoCropArea: 0.9,
            responsive: true,
            restore: false
        });
    };
    reader.readAsDataURL(file);
}

function cancelQuickBannerCrop() {
    if (_quickBannerCropper) { _quickBannerCropper.destroy(); _quickBannerCropper = null; }
    const dropZone = $("quick-banner-drop-zone");
    const cropCont = $("quick-banner-crop");
    const fileInput = $("quick-banner-input");
    if (dropZone) dropZone.style.display = "flex";
    if (cropCont) cropCont.style.display = "none";
    if (fileInput) fileInput.value = "";
}

function saveQuickBanner() {
    if (!_quickBannerCropper) return;
    const canvas = _quickBannerCropper.getCroppedCanvas({
        width: 1200, height: 375,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high"
    });
    canvas.toBlob(blob => {
        if (!blob) { toast("Erro ao processar imagem.", true); return; }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            if (window.updateUserProfileBanner) {
                window.updateUserProfileBanner(dataUrl);
                closeQuickBannerDialog();
            } else {
                toast("Serviço de sincronização indisponível.", true);
            }
        };
        reader.readAsDataURL(blob);
    }, "image/jpeg", 0.85);
}

/* =====================================================================
   ADMIN PANEL
   ===================================================================== */

function openAdminPanel() {
    const existing = document.getElementById('admin-panel-modal');
    if (existing) { existing.style.display = 'flex'; return; }

    const d = document.createElement('div');
    d.id = 'admin-panel-modal';
    d.className = 'admin-modal-wrap';
    d.onclick = (e) => { if (e.target === d) closeAdminPanel(); };

    d.innerHTML = `
    <div class="admin-modal" onclick="event.stopPropagation()">
        <div class="admin-header">
            <h3>🛠️ Painel de Administração</h3>
            <button class="dialog-close-btn" onclick="closeAdminPanel()">×</button>
        </div>
        <div class="admin-body">
            ${renderAdminSections()}
        </div>
        <div class="admin-footer">
            <button class="btn-theme" style="background:var(--failure);border-color:var(--failure);color:#fff;" onclick="desativarAdmin();closeAdminPanel()">🔌 Desativar Modo Admin</button>
        </div>
    </div>`;

    document.body.appendChild(d);
    requestAnimationFrame(() => d.style.opacity = '1');
}

function closeAdminPanel() {
    const el = document.getElementById('admin-panel-modal');
    if (el) el.remove();
}

function renderAdminSections() {
    const sections = [
        { title: '💰 Pontos & XP', btns: [
            { label: '+100 pts', action: 'adminAddPts(100)' },
            { label: '+1000 pts', action: 'adminAddPts(1000)' },
            { label: '+100 XP', action: 'adminAddXp(100)' },
            { label: '+1000 XP', action: 'adminAddXp(1000)' },
            { label: 'Zerar pts', action: 'adminSetPts(0)' },
            { label: 'Zerar XP', action: 'adminSetXp(0)' },
        ]},
        { title: '⏳ Cooldowns', btns: [
            { label: 'Resetar todos', action: 'adminResetAllCd()' },
            { label: 'Resetar diários', action: 'adminResetCdType("day")' },
            { label: 'Resetar semanais', action: 'adminResetCdType("wk")' },
            { label: 'Resetar mensais', action: 'adminResetCdType("mo")' },
        ]},
        { title: '📋 Tarefas', btns: [
            { label: 'Completar todas dailies', action: 'adminCompleteAllDailies()' },
            { label: 'Falhar todas dailies', action: 'adminFailAllDailies()' },
            { label: 'Completar todos epics', action: 'adminCompleteAllEpics()' },
        ]},
        { title: '🏪 Shop', btns: [
            { label: 'Comprar item grátis (loja)', action: 'adminFreeItem()' },
            { label: 'Liberar todos cooldowns', action: 'adminUnlockAllItems()' },
        ]},
        { title: '📖 Estudo', btns: [
            { label: 'Limpar histórico', action: 'adminClearStudyHistory()' },
            { label: 'Adicionar sessão fake', action: 'adminAddFakeSession()' },
        ]},
        { title: '📋 Diagnóstico', btns: [
            { label: 'Resetar diagnóstico', action: 'adminResetDiag()' },
            { label: 'Abrir diagnóstico', action: 'adminOpenDiag()' },
            { label: 'Marcar como lido', action: 'adminMarkDiagSeen()' },
        ]},
        { title: '🔔 Notificações', btns: [
            { label: 'Gerar notificação', action: 'adminGenNotif()' },
            { label: 'Limpar notificações', action: 'adminClearNotifs()' },
            { label: 'Refresh cache', action: 'adminRefreshNotifs()' },
        ]},
        { title: '👤 Usuário', btns: [
            { label: 'Ver dados (console)', action: 'adminLogState()' },
            { label: 'Forçar salvamento', action: 'adminForceSave()' },
            { label: 'Recarregar estado', action: 'adminForceReload()' },
            { label: 'Resetar estado completo', action: 'adminResetState()' },
            { label: 'Sair da conta', action: 'adminLogout()' },
        ]},
        { title: '🎨 Tema & Onboarding', btns: [
            { label: 'Resetar tema padrão', action: 'adminResetTheme()' },
            { label: 'Tema aleatório', action: 'adminRandomTheme()' },
            { label: 'Reabrir onboarding', action: 'adminReopenOnboarding()' },
        ]},
        { title: '🌐 Comunidade', btns: [
            { label: 'Alternar perfil público', action: 'adminTogglePublic()' },
            { label: 'Buscar perfis (console)', action: 'adminFetchProfiles()' },
        ]},
    ];

    return sections.map(s => `
        <div class="admin-section">
            <div class="admin-section-title">${s.title}</div>
            <div class="admin-grid">${s.btns.map(b => `
                <button class="admin-btn" onclick="${b.action}">${b.label}</button>
            `).join('')}</div>
        </div>
    `).join('');
}

/* ---- ADMIN ACTIONS ---- */

function adminAddPts(n) { if (!window.state) return; window.state.pts += n; window.saveState?.(); window.render?.(); window.updateStatsUI?.(); window.toast?.('💰 ' + n + ' pts adicionados!'); }
function adminAddXp(n) { if (!window.state) return; window.state.xp += n; window.saveState?.(); window.render?.(); window.updateStatsUI?.(); window.toast?.('⚡ ' + n + ' XP adicionados!'); }
function adminSetPts(n) { if (!window.state) return; window.state.pts = n; window.saveState?.(); window.render?.(); window.updateStatsUI?.(); window.toast?.('💰 pts definidos para ' + n); }
function adminSetXp(n) { if (!window.state) return; window.state.xp = n; window.saveState?.(); window.render?.(); window.updateStatsUI?.(); window.toast?.('⚡ XP definido para ' + n); }

function adminResetAllCd() { if (!window.state) return; window.state.cd = {}; window.saveState?.(); window.renderShop?.(); window.toast?.('⏳ Todos os cooldowns resetados!'); }
function adminResetCdType(type) {
    if (!window.state || !window.SLOT_ECONOMICS) return;
    const items = window.SLOT_ECONOMICS.shop.filter(i => i.type === type);
    items.forEach(i => delete window.state.cd[i.id]);
    window.saveState?.(); window.renderShop?.();
    const names = { day: 'diários', wk: 'semanais', mo: 'mensais' };
    window.toast?.('⏳ Cooldowns ' + (names[type] || type) + ' resetados!');
}

function adminCompleteAllDailies() {
    const dailies = window.DAILIES || [];
    dailies.forEach(t => { if (window.task) window.task(t.id, 'd', true); });
    window.toast?.('✅ Todas as dailies concluídas!');
}
function adminFailAllDailies() {
    const dailies = window.DAILIES || [];
    dailies.forEach(t => { if (window.task) window.task(t.id, 'd', false); });
    window.toast?.('❌ Todas as dailies falharam.');
}
function adminCompleteAllEpics() {
    const epics = window.EPICS || [];
    epics.forEach(t => { if (window.task) window.task(t.id, 'e', true); });
    window.toast?.('✅ Todos os epics concluídos!');
}

function adminFreeItem() {
    if (!window.state) return;
    const merged = window.getMergedLists ? window.getMergedLists() : window.SLOT_ECONOMICS;
    const shop = merged?.shop || [];
    if (!shop.length) { window.toast?.('Nenhum item na loja.', true); return; }
    const item = shop[0];
    window.state.cd[item.id] = Date.now();
    window.saveState?.(); window.renderShop?.();
    window.toast?.('🏪 Item "' + item.name + '" adquirido (sem custo)!');
}
function adminUnlockAllItems() {
    if (!window.state) return;
    const shop = window.SHOP || [];
    shop.forEach(i => delete window.state.cd[i.id]);
    window.saveState?.(); window.renderShop?.();
    window.toast?.('🔓 Todos os itens liberados!');
}

function adminClearStudyHistory() { if (window.clearStudyHistory) window.clearStudyHistory(); else window.toast?.('Função não disponível nesta página.', true); }
function adminAddFakeSession() {
    try {
        const history = JSON.parse(localStorage.getItem('neuroflow_study_history') || '[]');
        const now = Date.now();
        const duration = Math.floor(Math.random() * 3600) + 600;
        history.push({
            id: 'admin_' + now,
            mode: Math.random() > 0.5 ? 'simple' : 'pomodoro',
            duration: duration,
            formatted: Math.floor(duration / 60) + ':' + (duration % 60).toString().padStart(2, '0'),
            timestamp: now,
            note: 'Sessão administrativa'
        });
        localStorage.setItem('neuroflow_study_history', JSON.stringify(history));
        if (window.studyTimer && typeof window.studyTimer._renderHistory === 'function') window.studyTimer._renderHistory();
        window.toast?.('📖 Sessão falsa adicionada ao histórico!');
    } catch(e) { window.toast?.('Erro: ' + e.message, true); }
}

function adminResetDiag() { if (window.resetAllDiagnostics) window.resetAllDiagnostics(); else window.toast?.('Função não disponível.', true); }
function adminOpenDiag() { closeAdminPanel(); setTimeout(() => { if (window.openDiagnosticDialog) window.openDiagnosticDialog(); }, 200); }
function adminMarkDiagSeen() { if (window.markPersistentDiagSeen) window.markPersistentDiagSeen(); window.toast?.('📋 Diagnóstico marcado como lido.'); }

function adminGenNotif() { if (window.generateOneNotification) window.generateOneNotification(); else window.toast?.('Função não disponível.', true); }
function adminClearNotifs() { if (window.clearAllNotifications) window.clearAllNotifications(); else window.toast?.('Função não disponível.', true); }
function adminRefreshNotifs() {
    (async () => {
        if (window.refreshNotifications) await window.refreshNotifications();
        window.toast?.('🔄 Cache de notificações atualizado!');
    })();
}

function adminLogState() { console.log('📊 STATE:', JSON.parse(JSON.stringify(window.state))); console.log('👤 User:', window.currentUser); window.toast?.('📊 Estado logado no console.'); }
function adminForceSave() { if (window.saveState) window.saveState().then(() => window.toast?.('💾 Estado salvo!')).catch(() => window.toast?.('Erro ao salvar.', true)); }
function adminForceReload() { if (window.currentUser && window.syncUserData) window.syncUserData(window.currentUser.uid).then(() => window.toast?.('🔄 Estado recarregado!')); else window.toast?.('Faça login para recarregar.', true); }
function adminResetState() {
    if (!confirm('Tem certeza? Isso vai zerar pts, XP e cooldowns.')) return;
    if (!window.state) return;
    window.state.pts = 0;
    window.state.xp = 0;
    window.state.cd = {};
    window.saveState?.(); window.render?.(); window.updateStatsUI?.();
    window.toast?.('🔄 Estado resetado!');
}
function adminLogout() { if (window.logoutGoogle) window.logoutGoogle(); else window.toast?.('Função não disponível.', true); }

function adminResetTheme() { if (window.resetDefaults) window.resetDefaults(); else window.toast?.('Função não disponível.', true); }
function adminRandomTheme() {
    if (window.changeTheme) {
        const total = 18;
        const r = Math.floor(Math.random() * total);
        window.changeTheme(r);
        window.toast?.('🎨 Tema aleatório aplicado!');
    }
}
function adminReopenOnboarding() { if (window.reopenCustomization) { closeAdminPanel(); setTimeout(() => window.reopenCustomization(), 200); } else window.toast?.('Função não disponível.', true); }

function adminTogglePublic() { if (window.toggleProfilePrivacy) window.toggleProfilePrivacy(); else window.toast?.('Função não disponível.', true); }
function adminFetchProfiles() {
    (async () => {
        if (window.fetchPublicProfiles) {
            const p = await window.fetchPublicProfiles(200);
            console.log('🌐 Perfis públicos:', p);
            window.toast?.('🌐 ' + p.length + ' perfis encontrados. Ver console.');
        }
    })();
}

window.openAdminPanel          = openAdminPanel;
window.closeAdminPanel         = closeAdminPanel;
window.openAuthModal            = openAuthModal;
window.closeAuthModal           = closeAuthModal;
window.toggleAuthMode           = toggleAuthMode;
window.handleAuthSubmit         = handleAuthSubmit;
window.openSettingsModal        = openSettingsModal;
window.closeSettingsModal       = closeSettingsModal;
window.switchTab                = switchTab;
window.openForgotPassword       = openForgotPassword;
window.handleUpdateName         = handleUpdateName;
window.handleUpdateEpicGoal     = handleUpdateEpicGoal;
window.handleUpdateDescription  = handleUpdateDescription;
window.handleUpdateEmail        = handleUpdateEmail;
window.handleUpdatePassword     = handleUpdatePassword;
window.handleVerifyEmail        = handleVerifyEmail;
window.toggleProfilePrivacy     = toggleProfilePrivacy;
window.openCommunityModal       = openCommunityModal;
window.closeCommunityModal      = closeCommunityModal;
window.renderSoundTab           = renderSoundTab;
window.selectSound              = selectSound;
window.openQuickDialog          = openQuickDialog;
window.closeQuickDialog         = closeQuickDialog;
window.saveQuickName            = saveQuickName;
window.saveQuickGoal            = saveQuickGoal;
window.saveQuickDescription     = saveQuickDescription;
window.openQuickAvatarDialog    = openQuickAvatarDialog;
window.closeQuickAvatarDialog   = closeQuickAvatarDialog;
window.saveQuickAvatar          = saveQuickAvatar;
window.cancelQuickAvatarCrop    = cancelQuickAvatarCrop;
window.openQuickBannerDialog    = openQuickBannerDialog;
window.closeQuickBannerDialog   = closeQuickBannerDialog;
window.saveQuickBanner          = saveQuickBanner;
window.cancelQuickBannerCrop    = cancelQuickBannerCrop;
