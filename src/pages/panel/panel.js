function getTier(xp) {
    return TIERS.find(t => xp >= t.min && xp <= t.max) || TIERS[0];
}

function updateStatsUI() {
    const ptsEl  = $("rPts");
    const xpEl   = $("rXp");
    const rankEl = $("rRank");
    const nextEl = $("rNext");
    const barEl  = $("rBar");
    if (!ptsEl) return;

    ptsEl.textContent = state.pts;
    xpEl.textContent  = `${state.xp} XP`;

    const tier = getTier(state.xp);
    const next = TIERS[TIERS.indexOf(tier) + 1];

    rankEl.textContent = `${tier.i} ${tier.name}`;

    if (next) {
        nextEl.textContent = `Próximo: ${next.min} XP`;
        const perc = ((state.xp - tier.min) / (next.min - tier.min)) * 100;
        barEl.style.width = `${Math.min(100, Math.max(0, perc))}%`;
    } else {
        nextEl.textContent = "Nível Máximo ✨";
        barEl.style.width  = "100%";
    }
}

function renderShop() {
    const shopEl = $("rShop");
    if (!shopEl) return;

    const { shop } = getMergedLists();
    const now = Date.now();

    shopEl.innerHTML = shop.map(p => {
        const last     = state.cd[p.id];
        const activeCd = last && (now - last < p.cd);
        const canBuy   = state.pts >= p.cost && !activeCd;

        let bTxt = "Resgatar";
        if (activeCd) {
            const hrs = Math.ceil((p.cd - (now - last)) / 3600000);
            bTxt = hrs > 24 ? `${Math.ceil(hrs / 24)}d` : `${hrs}h`;
        } else if (state.pts < p.cost) {
            bTxt = "Faltam Pts";
        }

        return `
            <div class="shop-node ${activeCd ? 'cooldown' : ''}">
                <div>
                    <div class="node-tag t-${p.type}">${p.label}</div>
                    <div class="node-name">${p.name}</div>
                </div>
                <div>
                    <div class="node-cost">${p.cost} Pts</div>
                    <button class="btn-buy" ${canBuy ? '' : 'disabled'} onclick="buy('${p.id}')">${bTxt}</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderStaticLists() {
    const dailiesEl = $("rDailies");
    const epicsEl   = $("rEpics");
    if (!dailiesEl && !epicsEl) return;

    const lists = window.getMergedLists ? window.getMergedLists() : { dailies: [], epics: [] };

    if (dailiesEl) {
        dailiesEl.innerHTML = lists.dailies.map(t => `
            <div class="task-item">
                <div class="task-info">
                    <span class="task-t">${t.name}</span>
                    <span class="task-d">${t.desc}</span>
                    <div class="badges">
                        <span class="badge badge-highlight">+${t.pts} Pts</span>
                        <span class="badge">+${t.xp} XP</span>
                        <span class="badge">-${t.fXp} XP penalidade</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn-ctrl btn-del" onclick="task('${t.id}','d',false)" title="Falhou">−</button>
                    <button class="btn-ctrl btn-ok"  onclick="task('${t.id}','d',true)"  title="Concluído">+</button>
                </div>
            </div>
        `).join('');
    }

    if (epicsEl) {
        epicsEl.innerHTML = lists.epics.map(t => `
            <div class="task-item">
                <div class="task-info">
                    <span class="task-t">${t.name}</span>
                    <span class="task-d">${t.desc}</span>
                    <div class="badges">
                        <span class="badge badge-highlight">+${t.pts} Pts</span>
                        <span class="badge">+${t.xp} XP</span>
                    </div>
                </div>
                <button class="btn-ctrl btn-epic" onclick="task('${t.id}','e',true)">Concluir</button>
            </div>
        `).join('');
    }
}

function render() {
    const loading = document.getElementById('auth-loading');
    const content = document.getElementById('panel-content');
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';

    updateStatsUI();
    renderShop();
    renderStaticLists();

    if (!window._shopInterval) {
        window._shopInterval = setInterval(renderShop, 30000);
    }
}

window.render = render;

function persistState() {
    if (window.isGuestMode) {
        window.saveGuestState?.();
        return;
    }
    if (!window.currentUser || !window.saveStateToFirestore) return;
    window.saveStateToFirestore(window.currentUser.uid, state)
        .catch(err => console.warn('Firestore: escrita pendente.', err));
}

function task(id, type, success) {
    const { dailies, epics } = getMergedLists();
    const list = type === 'd' ? dailies : epics;
    const t    = list.find(x => x.id === id);
    if (!t) return;

    const oldTier = getTier(state.xp);

    if (success) {
        state.pts += t.pts;
        state.xp  += t.xp;
        if (type === 'd') state.stats.dailiesDone = (state.stats.dailiesDone || 0) + 1;
        if (type === 'e') state.stats.epicsDone = (state.stats.epicsDone || 0) + 1;
        toast(`+${t.xp} XP / +${t.pts} Pts adicionados.`);
    } else {
        const penalty = t.fXp || 0;
        state.xp = Math.max(0, state.xp - penalty);
        toast(`Penalidade aplicada: −${penalty} XP.`, true);
    }

    render();
    persistState();

    const newTier = getTier(state.xp);
    if (oldTier.name !== newTier.name && state.xp > oldTier.min) {
        toast(`👑 Novo ranking alcançado: ${newTier.name}!`);
    }
}

function buy(id) {
    const { shop } = getMergedLists();
    const p   = shop.find(x => x.id === id);
    if (!p) return;
    const now = Date.now();
    if (state.pts < p.cost) return;
    if (state.cd[p.id] && now - state.cd[p.id] < p.cd) return;

    state.pts     -= p.cost;
    state.cd[p.id] = now;
    state.stats.purchases = (state.stats.purchases || 0) + 1;

    toast(`Item adquirido: ${p.name} 🎉`);
    render();
    persistState();
}

window.task = task;
window.buy  = buy;

if (window.isPainelPage?.() || document.getElementById('rDailies')) {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.updateGuestUI) window.updateGuestUI();
    });
}
