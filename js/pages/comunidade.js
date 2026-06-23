let $com = id => document.getElementById(id);
let communityProfiles = [];
let communitySearchTimer = null;

function renderComunidade() {
    const loading = $com("auth-loading");
    const content = $com("comunidade-content");
    const list = $com("community-list");
    if (loading) loading.style.display = "none";
    if (content) content.style.display = "block";
    if (list) list.style.display = "flex";

    $com("profile-detail").style.display = "none";

    const backBtn = $com("pd-back-btn");
    if (backBtn) {
        backBtn.textContent = "🏠 Hub";
        backBtn.onclick = () => navigateTo("index.html");
    }

    const user = window.currentUser;
    const profile = window.state?.profile || {};

    if (user) {
        const name = profile.displayName || user.displayName || user.email?.split("@")[0] || "Herói";
        const avatar = user.photoURL || profile.avatarUrl
            || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user.email || "hero")}`;
        const photo = $com("user-photo");
        const nameEl = $com("user-name");
        if (photo) photo.src = avatar;
        if (nameEl) nameEl.textContent = name;
    }

    renderHeroCount();
    fetchAndRenderProfiles();
}

function renderHeroCount() {
    const heroCountEl = $com("hero-count");
    const xpTotalEl = $com("xp-total");
    if (!heroCountEl && !xpTotalEl) return;
    const users = communityProfiles;
    if (heroCountEl) heroCountEl.textContent = users.length || "—";
    const totalXP = users.reduce((sum, u) => sum + (u.xp || 0), 0);
    if (xpTotalEl) xpTotalEl.textContent = totalXP ? `${totalXP.toLocaleString()} XP` : "—";
}

async function fetchAndRenderProfiles(searchTerm) {
    const grid = $com("community-grid");
    const controls = $com("community-controls-bar");
    if (!grid) return;
    if (controls) controls.style.display = "none";

    grid.innerHTML = `
        <div class="community-loading">
            ${Array(6).fill(`
                <div class="skeleton-card">
                    <div class="skeleton-banner"></div>
                    <div class="skeleton-body">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line tiny"></div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;

    if (!window.currentUser) {
        grid.innerHTML = `
            <div class="community-guest-notice">
                <div style="font-size:3rem;margin-bottom:0.75rem;">🔒</div>
                <strong>Faça login para explorar a comunidade</strong><br>
                <span style="font-size:0.8rem;">Crie uma conta ou entre para descobrir outros heróis.</span><br>
                <button class="btn-theme" onclick="loginGoogle()" style="display:inline-flex;width:auto;">🔑 Entrar com Google</button>
                <button class="btn-theme" onclick="openAuthModal()" style="display:inline-flex;width:auto;">✉️ E-mail</button>
            </div>
        `;
        if (controls) controls.style.display = "none";
        return;
    }

    try {
        communityProfiles = window.fetchPublicProfiles
            ? await window.fetchPublicProfiles(100)
            : [];
    } catch (err) {
        console.error("fetch profiles error:", err);
        communityProfiles = [];
    }

    console.log(`Comunidade: ${communityProfiles.length} perfis públicos encontrados`);
    renderHeroCount();
    if (controls) controls.style.display = "flex";

    if (!communityProfiles.length) {
        grid.innerHTML = `
            <div class="community-empty">
                <span class="empty-icon">🌐</span>
                <strong>Nenhum perfil público encontrado ainda</strong><br>
                <span style="font-size:0.8rem;">Seja o primeiro! Vá em Configurações > Perfil e marque "Perfil Público".</span>
            </div>
        `;
        return;
    }

    applyFiltersAndRender(searchTerm);
}

function applyFiltersAndRender(searchTerm) {
    const grid = $com("community-grid");
    if (!grid) return;

    let filtered = [...communityProfiles];
    const term = (searchTerm || getSearchTerm()).toLowerCase().trim();
    if (term) {
        filtered = filtered.filter(p => {
            const name = (p.profile?.displayName || "").toLowerCase();
            const goal = (p.profile?.epicGoal || "").toLowerCase();
            return name.includes(term) || goal.includes(term);
        });
    }

    const sortBy = getSortBy();
    if (sortBy === "name") {
        filtered.sort((a, b) => (a.profile?.displayName || "").localeCompare(b.profile?.displayName || ""));
    } else {
        filtered.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    }

    if (!filtered.length) {
        grid.innerHTML = `
            <div class="community-empty">
                <span class="empty-icon">🔍</span>
                <strong>Nenhum herói encontrado para "${escapeHtmlCom(term)}"</strong><br>
                <span style="font-size:0.8rem;">Tente um termo de busca diferente.</span>
            </div>
        `;
        return;
    }

    function getTierInfo(xp) {
        const tiers = window.TIERS || [];
        return tiers.find(t => xp >= t.min && xp <= t.max) || tiers[0] || { i: "🥉", name: "Bronze" };
    }

    grid.innerHTML = filtered.map((p, idx) => {
        const profile = p.profile || {};
        const displayName = profile.displayName || "Herói";
        const epicGoal = profile.epicGoal || "";
        const avatarUrl = profile.avatarUrl
            || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(p.uid)}`;
        const bannerUrl = profile.bannerUrl || "";
        const tier = getTierInfo(p.xp || 0);

        return `
            <div class="player-card" data-idx="${idx}">
                <div class="player-banner" style="background-image:${bannerUrl ? `url(${escapeHtmlCom(bannerUrl)})` : "linear-gradient(135deg, var(--panel) 0%, var(--bg) 100%)"};">
                    <div class="player-banner-overlay"></div>
                </div>
                <div class="player-card-body">
                    <img class="player-card-avatar" src="${escapeHtmlCom(avatarUrl)}" alt="" loading="lazy">
                    <div class="player-card-name">${escapeHtmlCom(displayName)}</div>
                    ${epicGoal ? `<div class="player-card-goal">"${escapeHtmlCom(epicGoal)}"</div>` : '<div class="player-card-goal">&nbsp;</div>'}
                    <div class="player-card-stats">
                        <span>${tier.i} ${escapeHtmlCom(tier.name)}</span>
                        <span>${p.xp || 0} XP</span>
                        <span>${p.pts || p.pontos || 0} Pts</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    grid.querySelectorAll(".player-card").forEach(el => {
        el.addEventListener("click", () => {
            const idx = parseInt(el.dataset.idx);
            if (!isNaN(idx) && filtered[idx]) openProfileDetail(filtered[idx]);
        });
    });
}

function getSearchTerm() {
    const input = $com("community-search");
    return input ? input.value : "";
}

function getSortBy() {
    const select = $com("community-sort");
    return select ? select.value : "xp";
}

function onCommunitySearch() {
    clearTimeout(communitySearchTimer);
    communitySearchTimer = setTimeout(() => applyFiltersAndRender(), 200);
}

function onCommunitySort() { applyFiltersAndRender(); }

function escapeHtmlCom(str) {
    return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* =====================================================================
   Profile Detail — página cheia idêntica ao Hub (só leitura)
   ===================================================================== */
function openProfileDetail(data) {
    const profile = data.profile || {};
    const tiers = window.TIERS || [];
    const xp = data.xp || 0;
    const tier = tiers.find(t => xp >= t.min && xp <= t.max) || tiers[0] || { i: "🥉", name: "Bronze", min: 0, max: 499 };
    const tierIdx = tiers.indexOf(tier);
    const nextTier = (tierIdx >= 0 && tierIdx < tiers.length - 1) ? tiers[tierIdx + 1] : null;
    const progress = nextTier ? Math.min(1, (xp - tier.min) / (nextTier.min - tier.min)) : 1;

    const bannerUrl = profile.bannerUrl || "";
    const avatarUrl = profile.avatarUrl
        || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(data.uid)}`;

    if ($com("pd-banner")) {
        $com("pd-banner").style.backgroundImage = bannerUrl
            ? `url(${bannerUrl})`
            : "linear-gradient(135deg, var(--panel) 0%, var(--bg) 100%)";
    }

    if ($com("pd-avatar")) $com("pd-avatar").src = avatarUrl;
    if ($com("pd-name")) $com("pd-name").textContent = profile.displayName || "Herói";
    if ($com("pd-goal")) $com("pd-goal").textContent = profile.epicGoal || "Sem meta épica";

    if ($com("pd-rank")) $com("pd-rank").textContent = `${tier.i} ${tier.name}`;
    if ($com("pd-xp")) $com("pd-xp").textContent = `${xp} XP`;
    if ($com("pd-pts")) $com("pd-pts").textContent = `${data.pts || data.pontos || 0} Pts`;

    if ($com("pd-desc")) {
        $com("pd-desc").textContent = profile.description || "Sem descrição.";
    }

    // Progress card
    if ($com("pd-tier-label")) $com("pd-tier-label").textContent = `${tier.i} ${tier.name}`;
    if ($com("pd-next-tier-label")) {
        $com("pd-next-tier-label").textContent = nextTier ? `${nextTier.i} ${nextTier.name}` : "MAX";
    }
    if ($com("pd-tier-fill")) {
        $com("pd-tier-fill").style.width = `${Math.round(progress * 100)}%`;
    }

    // Ranking card
    if ($com("pd-rank-desc")) {
        const sorted = [...communityProfiles].sort((a, b) => (b.xp || 0) - (a.xp || 0));
        const pos = sorted.findIndex(p => p.uid === data.uid) + 1;
        $com("pd-rank-desc").textContent = pos > 0 ? `#${pos} de ${sorted.length} heróis` : "—";
    }

    const backBtn = $com("pd-back-btn");
    if (backBtn) {
        backBtn.textContent = "🌐 Comunidade";
        backBtn.onclick = closeProfileDetail;
    }

    $com("community-list").style.display = "none";
    $com("profile-detail").style.display = "flex";
    requestAnimationFrame(() => window.scrollTo(0, 0));
}

function closeProfileDetail() {
    const backBtn = $com("pd-back-btn");
    if (backBtn) {
        backBtn.textContent = "🏠 Hub";
        backBtn.onclick = () => navigateTo("index.html");
    }

    $com("profile-detail").style.display = "none";
    $com("community-list").style.display = "flex";
    requestAnimationFrame(() => window.scrollTo(0, 0));
}

window.renderComunidade     = renderComunidade;
window.onCommunitySearch    = onCommunitySearch;
window.onCommunitySort      = onCommunitySort;
window.openProfileDetail    = openProfileDetail;
window.closeProfileDetail   = closeProfileDetail;
