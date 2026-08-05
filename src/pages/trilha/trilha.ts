const tl$ = (id: string) => document.getElementById(id);

function tlFormatXp(n: number): string {
    return n.toLocaleString('pt-BR');
}

function renderTrilha() {
    const loading = tl$('auth-loading');
    if (loading) loading.style.display = 'none';
    const wrapper = tl$('trilha-content');
    if (wrapper) wrapper.style.display = '';
    const contentDiv = tl$('trilha-page-content');
    if (!contentDiv) return;

    const levels = window.LEVELS || [];
    const xp = window.state.xp || 0;
    const info = window.getLevelInfo ? window.getLevelInfo(xp) : null;
    const level = info ? info.level : (levels[0] || { name: 'Nível 1', rank: 'Semente', icon: '🌱', min: 0 });
    const next = info ? info.next : null;

    const progressPct = next
        ? Math.min(100, Math.max(0, ((xp - level.min) / (next.min - level.min)) * 100))
        : 100;

    const hero = `
        <div class="bento-card trilha-hero">
            <div class="trilha-hero-title">🗺️ Trilha da Evolução</div>
            <div class="trilha-hero-rank">${level.icon} <strong>${level.name}</strong> <span class="trilha-hero-rank-tag">${level.rank}</span></div>
            <div class="trilha-hero-xp">${tlFormatXp(xp)} XP acumulados</div>
            <div class="trilha-progress-wrap">
                <div class="trilha-progress-labels">
                    <span>${level.icon} ${level.name}</span>
                    <span>${next ? `Próximo: ${next.icon} ${next.name}` : 'Nível Máximo ✨'}</span>
                </div>
                <div class="trilha-progress-track"><div class="trilha-progress-fill" style="width:${progressPct}%"></div></div>
                ${next ? `<div class="trilha-progress-xp">${tlFormatXp(xp)} / ${tlFormatXp(next.min)} XP para ${next.name}</div>` : '<div class="trilha-progress-xp">Você atingiu o topo da trilha. 👑</div>'}
            </div>
        </div>
    `;

    const track = tlBuildTrack(levels, xp, info);
    contentDiv.innerHTML = hero + track;

    const current = contentDiv.querySelector('.trilha-node.current');
    if (current) current.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function tlBuildTrack(levels, xp, info) {
    const idx = info ? info.index : 0;
    const fillPct = levels.length > 1
        ? Math.min(100, (idx / (levels.length - 1)) * 100)
        : 0;
    const rows = levels.map((lvl, i) => {
        const n = i + 1;
        const isSectionStart = n % 8 === 1;
        const reached = xp >= lvl.min;
        const current = i === idx;
        const infoOnLeft = n % 2 === 1;

        const marker = `
            <div class="trilha-marker-wrap">
                <div class="trilha-marker${current ? ' current' : ''}${reached ? ' reached' : ''}">${lvl.icon}</div>
                ${current ? '<div class="trilha-current-tag">Você está aqui</div>' : ''}
            </div>
        `;
        const levelCell = `
            <div class="trilha-cell trilha-cell-level ${infoOnLeft ? 'left' : 'right'}">
                <div class="trilha-level-name">${lvl.icon} ${lvl.name}</div>
                <div class="trilha-rank-name">${lvl.rank}</div>
                <div class="trilha-level-min">${tlFormatXp(lvl.min)} XP</div>
            </div>
        `;
        const rewardCell = `
            <div class="trilha-cell trilha-cell-reward ${reached ? 'unlocked' : 'locked'} ${infoOnLeft ? 'right' : 'left'}">
                <div class="trilha-reward-label">🎁 ${lvl.reward}</div>
                <div class="trilha-reward-status">${reached ? '🔓 Desbloqueada' : '🔒 Bloqueada'}</div>
            </div>
        `;

        const section = isSectionStart
            ? `
                <div class="trilha-section">
                    <span class="trilha-section-line"></span>
                    <span class="trilha-section-label">${lvl.icon} ${lvl.rank} · Níveis ${n}-${n + 7}</span>
                    <span class="trilha-section-line"></span>
                </div>
            `
            : '';

        return section + `
            <div class="trilha-node${reached ? ' reached' : ''}${current ? ' current' : ''}" data-level="${n}">
                ${infoOnLeft ? levelCell : rewardCell}
                ${marker}
                ${infoOnLeft ? rewardCell : levelCell}
            </div>
        `;
    }).join('');

    return `
        <div class="trilha-track">
            <div class="trilha-line"></div>
            <div class="trilha-line-fill" style="height:${fillPct}%"></div>
            ${rows.reverse().join('')}
        </div>
    `;
}

window.renderTrilha = renderTrilha;
