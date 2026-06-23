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
        if (raw) {
            const saved = JSON.parse(raw);
            Object.assign(state, createDefaultState(), saved);
            if (!state.slots || !state.slots.dailies) {
                state.slots = window.cloneDefaultSlotText();
            }
            if (!state.profile) state.profile = { epicGoal: '', bannerUrl: '', displayName: '', description: '', public: false };
            if (state.profile.description === undefined) state.profile.description = '';
        }
        state.prefs = {};
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
            onboardingComplete: state.onboardingComplete
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

window.TIERS              = TIERS;
window.GUEST_STORAGE_KEY  = GUEST_STORAGE_KEY;
window.createDefaultState = createDefaultState;
window.getMergedLists     = getMergedLists;
window.loadGuestState     = loadGuestState;
window.saveGuestState     = saveGuestState;
window.saveState          = saveState;
window.applyRemoteState   = applyRemoteState;
