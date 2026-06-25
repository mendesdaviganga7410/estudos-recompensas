const $hero = id => document.getElementById(id);

function renderHeroHub() {
    const landing = $hero('guest-landing');
    const content = $hero('hero-content');
    const loading = $hero('auth-loading');
    if (loading) loading.style.display = 'none';
    if (landing) landing.style.display = 'none';
    if (content) content.style.display = 'flex';

    const user = window.currentUser;
    const profile = window.state.profile || {};
    const tier = window.TIERS
        ? (window.TIERS.find(t => window.state.xp >= t.min && window.state.xp <= t.max) || window.TIERS[0])
        : { i: '🥉', name: 'Bronze' };

    const name = profile.displayName || user?.displayName || user?.email?.split('@')[0] || 'Herói';
    const epicGoal = profile.epicGoal || 'Defina sua Meta Épica';
    const desc = profile.description || '';
    const avatar = user?.photoURL || profile.avatarUrl
        || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user?.email || 'hero')}`;
    const banner = profile.bannerUrl || '';

    const bannerEl = $hero('hero-banner');
    if (bannerEl) {
        if (banner) {
            bannerEl.style.backgroundImage = `url(${banner})`;
            bannerEl.classList.add('has-image');
        } else {
            bannerEl.style.backgroundImage = '';
            bannerEl.classList.remove('has-image');
        }
    }

    const avatarEl = $hero('hero-avatar');
    if (avatarEl) avatarEl.src = avatar;

    const nameEl = $hero('hero-name');
    if (nameEl) {
        nameEl.innerHTML = `${name} <button class="btn-edit-inline" onclick="openQuickDialog('quick-name-dialog')" title="Editar nome"><svg width="14" height="14" viewBox="0 0 24 24" fill="#999"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>`;
    }

    const epicEl = $hero('hero-epic-goal');
    if (epicEl) {
        epicEl.innerHTML = `${epicGoal} <button class="btn-edit-inline" onclick="openQuickDialog('quick-goal-dialog')" title="Editar meta"><svg width="14" height="14" viewBox="0 0 24 24" fill="#999"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>`;
    }

    const descContainer = $hero('hero-description');
    if (descContainer) {
        if (desc) {
            descContainer.innerHTML = `<span class="hero-desc-text" onclick="openQuickDialog('quick-desc-dialog')" style="cursor:pointer;">${window.escapeHtml ? window.escapeHtml(desc) : desc}</span>`;
            descContainer.style.display = 'block';
        } else {
            descContainer.innerHTML = `
                <span class="hero-desc-prompt">📝 Sua descrição está incompleta — <a href="#" onclick="openQuickDialog('quick-desc-dialog');return false;">clique para preencher</a></span>
            `;
            descContainer.style.display = 'block';
        }
    }

    const avatarWrap = $hero('hero-avatar-wrap');
    if (avatarWrap) {
        let editBtn = avatarWrap.querySelector('.btn-edit-overlay-avatar');
        if (!editBtn) {
            editBtn = document.createElement('button');
            editBtn.className = 'btn-edit-overlay btn-edit-overlay-avatar';
            editBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#999"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
            editBtn.title = 'Trocar foto';
            editBtn.onclick = () => openQuickAvatarDialog();
            avatarWrap.appendChild(editBtn);
        }
    }

    if (bannerEl) {
        let editBtn = bannerEl.querySelector('.btn-edit-overlay-banner');
        if (!editBtn) {
            editBtn = document.createElement('button');
            editBtn.className = 'btn-edit-overlay btn-edit-overlay-banner';
            editBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#999"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
            editBtn.title = 'Trocar banner';
            editBtn.onclick = () => openQuickBannerDialog();
            bannerEl.appendChild(editBtn);
        }
    }

    const rankEl = $hero('hero-rank');
    if (rankEl) rankEl.textContent = `${tier.i} ${tier.name}`;

    const xpEl = $hero('hero-xp');
    if (xpEl) xpEl.textContent = `${window.state.xp} XP`;

    const ptsEl = $hero('hero-pts');
    if (ptsEl) ptsEl.textContent = `${window.state.pts} Pts`;

    const stats = window.state.stats || {};
    const statDailies = document.getElementById('stat-dailies');
    const statEpics = document.getElementById('stat-epics');
    const statPurchases = document.getElementById('stat-purchases');
    const statStreak = document.getElementById('stat-streak');
    if (statDailies) statDailies.textContent = stats.dailiesDone || 0;
    if (statEpics) statEpics.textContent = stats.epicsDone || 0;
    if (statPurchases) statPurchases.textContent = stats.purchases || 0;
    if (statStreak) statStreak.textContent = stats.currentStreak || 0;

    const calEl = document.getElementById('streak-calendar');
    if (calEl) {
        const dailyLog = window.state.dailyLog || {};
        const today = new Date();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = window.getLocalDateStr(d);
            const log = dailyLog[dateStr];
            const done = log && log.length > 0;
            days.push({ dateStr, done, isToday: i === 0, dow: d.getDay() });
        }
        const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        calEl.innerHTML = days.map((d) => {
            const cls = d.done ? 'day done' : 'day missed';
            return `<div class="${cls}${d.isToday ? ' today' : ''}" title="${dayLabels[d.dow]} ${d.dateStr.slice(5)}${d.done ? ' ✅' : ''}"><span>${dayLabels[d.dow][0]}</span></div>`;
        }).join('');
        if (stats.maxStreak > 0) {
            calEl.innerHTML += `<span class="streak-max">🔥 Melhor: ${stats.maxStreak} dias</span>`;
        }
    }
}

window.renderHeroHub = renderHeroHub;

document.addEventListener("DOMContentLoaded", () => {
    if (typeof initQuickAvatarPicker === 'function') initQuickAvatarPicker();
    if (typeof initQuickBannerPicker === 'function') initQuickBannerPicker();
});
