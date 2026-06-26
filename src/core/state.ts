// @ts-nocheck
const TIERS = [
    { name: "Bronze",        min: 0,     max: 499,     i: "🥉" },
    { name: "Prata",         min: 500,   max: 1499,    i: "🥈" },
    { name: "Ouro",          min: 1500,  max: 2999,    i: "🥇" },
    { name: "Platina",       min: 3000,  max: 4999,    i: "💎" },
    { name: "Diamante",      min: 5000,  max: 7499,    i: "❄️" },
    { name: "Esmeralda",     min: 7500,  max: 10499,   i: "💚" },
    { name: "Safira",        min: 10500, max: 14499,   i: "🔹" },
    { name: "Rubi",          min: 14500, max: 19499,   i: "❤️" },
    { name: "Ametista",      min: 19500, max: 25499,   i: "💜" },
    { name: "Opala",         min: 25500, max: 32499,   i: "🌈" },
    { name: "Obsidiana",     min: 32500, max: 44999,   i: "🖤" },
    { name: "Diamante Negro",min: 45000, max: Infinity, i: "🌌" }
];

const GUEST_STORAGE_KEY = 'neuroflow_guest_v2';

function createDefaultState() {
    return {
        pts: 0,
        xp: 0,
        cd: {},
        prefs: {},
        slots: window.cloneDefaultSlotText ? window.cloneDefaultSlotText() : {},
        profile: {
            epicGoal: '',
            bannerUrl: '',
            displayName: '',
            description: '',
            public: false
        },
        dailyLog: {},
        weeklyLog: {},
        lastDailyDate: '',
        stats: {
            dailiesDone: 0,
            epicsDone: 0,
            purchases: 0,
            currentStreak: 0,
            maxStreak: 0
        },
        onboardingComplete: false
    };
}

window.currentUser = null;
window.isGuestMode = true;
window.state = createDefaultState();

const state = window.state;

function getMergedLists() {
    if (!window.buildMergedSlots) return { dailies: [], epics: [], shop: [] };
    return window.buildMergedSlots(state.slots);
}

function loadGuestState() {
    try {
        const raw = localStorage.getItem(GUEST_STORAGE_KEY);
        let saved = null;
        if (raw) {
            saved = JSON.parse(raw);
            Object.assign(state, createDefaultState(), saved);
            if (!state.slots || !state.slots.dailies) {
                state.slots = window.cloneDefaultSlotText();
            }
            if (!state.profile) state.profile = { epicGoal: '', bannerUrl: '', displayName: '', description: '', public: false };
            if (state.profile.description === undefined) state.profile.description = '';
            if (!state.dailyLog) state.dailyLog = {};
            if (!state.weeklyLog) state.weeklyLog = {};
            if (!state.lastDailyDate) state.lastDailyDate = '';
            if (!state.stats) state.stats = {};
            if (!state.stats.currentStreak) state.stats.currentStreak = 0;
            if (state.stats.maxStreak === undefined) state.stats.maxStreak = 0;
        }
        state.prefs = (saved && saved.prefs) || {};
        window.isAdmin = state.prefs.isAdmin === true;
    } catch (err) {
        console.warn('Guest state load failed:', err);
        state.prefs = {};
    }
}

function saveGuestState() {
    if (!window.isGuestMode) return;
    try {
        const payload = {
            pts: state.pts,
            xp: state.xp,
            cd: state.cd,
            slots: state.slots,
            profile: state.profile,
            stats: state.stats,
            prefs: state.prefs,
            onboardingComplete: state.onboardingComplete,
            dailyLog: state.dailyLog,
            weeklyLog: state.weeklyLog,
            lastDailyDate: state.lastDailyDate
        };
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
        console.warn('Guest state save failed:', err);
    }
}

async function saveState() {
    if (window.isGuestMode) {
        saveGuestState();
        return;
    }
    if (window.currentUser && window.saveStateToFirestore) {
        try {
            await window.saveStateToFirestore(window.currentUser.uid, state);
        } catch (err) {
            console.error('Erro na sincronização de dados:', err);
        }
    }
}

function applyRemoteState(data) {
    if (typeof data.pontos === 'number') state.pts = data.pontos;
    else if (typeof data.pts === 'number') state.pts = data.pts;
    if (typeof data.xp === 'number') state.xp = data.xp;
    state.cd = data.cd || {};
    state.prefs = data.prefs || {};
    state.profile = data.profile || { epicGoal: '', bannerUrl: '', displayName: '', description: '', public: false };
    if (state.profile.description === undefined) state.profile.description = '';
    state.stats = data.stats || { dailiesDone: 0, epicsDone: 0, purchases: 0, currentStreak: 0, maxStreak: 0 };
    if (state.stats.currentStreak === undefined) state.stats.currentStreak = 0;
    if (state.stats.maxStreak === undefined) state.stats.maxStreak = 0;
    state.dailyLog = data.dailyLog || {};
    state.weeklyLog = data.weeklyLog || {};
    state.lastDailyDate = data.lastDailyDate || '';
    state.diagnostic = data.diagnostic ? { ...data.diagnostic } : undefined;
    state.onboardingComplete = data.onboardingComplete === true
        || (data.onboardingComplete === undefined && (
            (typeof data.xp === 'number' && data.xp > 0)
            || (typeof data.pontos === 'number' && data.pontos > 0)
            || (typeof data.pts === 'number' && data.pts > 0)
        ));
    if (data.slots) {
        state.slots = window.mergeSlotText
            ? window.mergeSlotText(window.cloneDefaultSlotText(), data.slots)
            : data.slots;
    } else {
        state.slots = window.cloneDefaultSlotText();
    }
    /* Admin mode */
    window.isAdmin = state.prefs.isAdmin === true;
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) adminBtn.style.display = window.isAdmin ? '' : 'none';
}

Object.defineProperty(window, 'DAILIES', {
    get: () => getMergedLists().dailies
});
Object.defineProperty(window, 'EPICS', {
    get: () => getMergedLists().epics
});
Object.defineProperty(window, 'SHOP', {
    get: () => getMergedLists().shop
});

loadGuestState();

/* Admin mode - activate/deactivate via console */
function ativarAdmin() {
    if (!window.state) return;
    window.state.prefs.isAdmin = true;
    window.isAdmin = true;
    window.saveState();
    const btn = document.getElementById('admin-btn');
    if (btn) btn.style.display = '';
    window.toast?.('🛠️ Modo ADMIN ativado!', false, 4000);
}

function desativarAdmin() {
    if (!window.state) return;
    window.state.prefs.isAdmin = false;
    window.isAdmin = false;
    window.saveState();
    window.toast?.('🔌 Modo ADMIN desativado.', false, 4000);
    const btn = document.getElementById('admin-btn');
    if (btn) btn.style.display = 'none';
    const panel = document.getElementById('admin-panel-modal');
    if (panel) panel.style.display = 'none';
}

function getLocalDateStr(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTodayStr() {
    return getLocalDateStr(new Date());
}

function getYesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getLocalDateStr(d);
}

function getWeekStr(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function calcStreak() {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
        const dateStr = getLocalDateStr(d);
        const log = state.dailyLog[dateStr];
        if (log && log.length > 0) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else if (i === 0) {
            d.setDate(d.getDate() - 1);
            continue;
        } else {
            break;
        }
    }
    return streak;
}

window.TIERS              = TIERS;
window.GUEST_STORAGE_KEY  = GUEST_STORAGE_KEY;
window.createDefaultState = createDefaultState;
window.getMergedLists     = getMergedLists;
window.loadGuestState     = loadGuestState;
window.saveGuestState     = saveGuestState;
window.saveState          = saveState;
window.applyRemoteState   = applyRemoteState;
window.ativarAdmin        = ativarAdmin;
window.desativarAdmin     = desativarAdmin;
window.getLocalDateStr    = getLocalDateStr;
window.getTodayStr        = getTodayStr;
window.getYesterdayStr    = getYesterdayStr;
window.getWeekStr         = getWeekStr;
window.calcStreak         = calcStreak;
