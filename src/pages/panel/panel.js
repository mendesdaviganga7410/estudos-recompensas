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

    const streakEl = $("rStreak");
    if (streakEl) streakEl.textContent = `${state.stats.currentStreak || 0} dias`;

    const calEl = $("rStreakCalendar");
    if (calEl) {
        const dailyLog = state.dailyLog || {};
        const today = new Date();
        const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        calEl.innerHTML = '';
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = window.getLocalDateStr(d);
            const log = dailyLog[dateStr];
            const done = log && log.length > 0;
            const isToday = i === 0;
            const dow = d.getDay();
            const day = document.createElement('div');
            day.className = `day${done ? ' done' : ' missed'}${isToday ? ' today' : ''}`;
            day.title = `${dayLabels[dow]} ${dateStr.slice(5)}${done ? ' ✅' : ''}`;
            day.textContent = dayLabels[dow][0];
            calEl.appendChild(day);
        }
        if (state.stats.maxStreak > 0) {
            const max = document.createElement('span');
            max.className = 'streak-max';
            max.textContent = `🔥 Melhor: ${state.stats.maxStreak} dias`;
            calEl.appendChild(max);
        }
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

function dailyDoneToday(id) {
    const today = window.getTodayStr();
    const log = state.dailyLog[today];
    return log && log.includes(id);
}

function weeklyDoneThisWeek(id) {
    const week = window.getWeekStr(new Date());
    const log = state.weeklyLog[week];
    return log && log.includes(id);
}

function spawnConfetti(btnEl) {
    if (!btnEl) return;
    const rect = btnEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ['var(--accent)', 'var(--success)', '#ffd700', '#ff6b6b', '#48dbfb', '#ff9ff3'];
    for (let i = 0; i < 16; i++) {
        const p = document.createElement('div');
        p.className = 'sparkle-particle';
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 40 + Math.random() * 60;
        p.style.cssText = `
            left:${cx}px; top:${cy}px;
            width:${4 + Math.random() * 6}px; height:${4 + Math.random() * 6}px;
            background:${colors[i % colors.length]};
            --x:${Math.cos(angle) * dist}px; --y:${Math.sin(angle) * dist}px;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

function renderStaticLists() {
    const dailiesEl = $("rDailies");
    const epicsEl   = $("rEpics");
    if (!dailiesEl && !epicsEl) return;

    const lists = window.getMergedLists ? window.getMergedLists() : { dailies: [], epics: [] };

    if (dailiesEl) {
        dailiesEl.innerHTML = lists.dailies.map(t => {
            const done = dailyDoneToday(t.id);
            return `
            <div class="task-item ${done ? 'completed' : ''}">
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
                    <button class="btn-ctrl btn-del" onclick="task('${t.id}','d',false)" title="Falhou" ${done ? 'disabled' : ''}>−</button>
                    <button class="btn-ctrl btn-ok"  onclick="task('${t.id}','d',true)"  title="Concluído" ${done ? 'disabled' : ''}>${done ? '✓' : '+'}</button>
                </div>
            </div>
        `}).join('');
    }

    if (epicsEl) {
        const week = window.getWeekStr(new Date());
        epicsEl.innerHTML = lists.epics.map(t => {
            const done = weeklyDoneThisWeek(t.id);
            return `
            <div class="task-item ${done ? 'completed' : ''}">
                <div class="task-info">
                    <span class="task-t">${t.name}</span>
                    <span class="task-d">${t.desc}</span>
                    <div class="badges">
                        <span class="badge badge-highlight">+${t.pts} Pts</span>
                        <span class="badge">+${t.xp} XP</span>
                    </div>
                </div>
                <button class="btn-ctrl btn-epic" onclick="task('${t.id}','e',true)" ${done ? 'disabled' : ''}>${done ? '✓ Concluída' : 'Concluir'}</button>
            </div>
        `}).join('');
    }
}

function applyAutoPenalties() {
    const today = window.getTodayStr();
    const yesterday = window.getYesterdayStr();
    if (state.lastDailyDate === today) return;
    if (!state.lastDailyDate) {
        state.lastDailyDate = today;
        persistState();
        return;
    }

    const dailies = window.getMergedLists ? window.getMergedLists().dailies : [];
    let penalized = false;

    const startDate = new Date(state.lastDailyDate);
    const endDate = new Date(yesterday);
    startDate.setDate(startDate.getDate() + 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = window.getLocalDateStr(d);
        const log = state.dailyLog[dateStr] || [];
        for (const daily of dailies) {
            if (!log.includes(daily.id)) {
                state.xp = Math.max(0, state.xp - (daily.fXp || 0));
                penalized = true;
            }
        }
    }

    if (penalized) {
        toast('⏰ Penalidade por missões não concluídas em dias anteriores.', true, 4000);
        updateStatsUI();
    }

    state.lastDailyDate = today;
    persistState();
}

function render() {
    const loading = document.getElementById('auth-loading');
    const content = document.getElementById('panel-content');
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';

    applyAutoPenalties();
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

    if (type === 'd') {
        if (dailyDoneToday(id)) {
            toast('Missão já concluída hoje! ✅', false, 2000);
            return;
        }
        const today = window.getTodayStr();
        if (!state.dailyLog[today]) state.dailyLog[today] = [];
        state.dailyLog[today].push(id);
    }
    if (type === 'e') {
        if (success) {
            const week = window.getWeekStr(new Date());
            if (weeklyDoneThisWeek(id)) {
                toast('Missão já concluída esta semana! ✅', false, 2000);
                return;
            }
            if (!state.weeklyLog[week]) state.weeklyLog[week] = [];
            state.weeklyLog[week].push(id);
        }
    }

    const oldTier = getTier(state.xp);

    if (success) {
        state.pts += t.pts;
        state.xp  += t.xp;
        if (type === 'd') state.stats.dailiesDone = (state.stats.dailiesDone || 0) + 1;
        if (type === 'e') state.stats.epicsDone = (state.stats.epicsDone || 0) + 1;
        state.stats.currentStreak = window.calcStreak();
        if (state.stats.currentStreak > state.stats.maxStreak) {
            state.stats.maxStreak = state.stats.currentStreak;
        }
        toast(`+${t.xp} XP / +${t.pts} Pts adicionados.`);
        const btn = document.querySelector(`.btn-ok[onclick*="'${id}'"]`) || document.querySelector(`.btn-epic[onclick*="'${id}'"]`);
        spawnConfetti(btn);
    } else {
        const penalty = t.fXp || 0;
        state.xp = Math.max(0, state.xp - penalty);
        toast(`Penalidade aplicada: −${penalty} XP.`, true);
    }

    state.lastDailyDate = window.getTodayStr();
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
