/* ==========================================================================
   firebase/db.js — Leitura e gravação no Firestore
   ========================================================================== */
import {
    db,
    doc, getDoc, setDoc,
    collection, query, where, getDocs,
    orderBy, limit, deleteDoc
} from "./init.js";

export async function syncUserData(userId) {
    if (!db) return;
    try {
        const ref  = doc(db, "users", userId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            const data = snap.data();
            if (window.applyRemoteState) window.applyRemoteState(data);
        } else {
            window.state.onboardingComplete = false;
            window.state.prefs = {};
            if (window.saveStateToFirestore) {
                await window.saveStateToFirestore(userId, window.state);
            }
        }

        if (window.applyPrefs) window.applyPrefs(window.state.prefs || {});
        if (window.handleAuthRouting) window.handleAuthRouting();
        if (window.render) window.render();
    } catch (err) {
        console.error("Firestore sync error:", err);
        if (window.applyPrefs) window.applyPrefs(window.state.prefs || {});
        if (window.handleAuthRouting) window.handleAuthRouting();
        if (window.render) window.render();
    }
}

export async function saveStateToFirestore(userId, fullState, partial) {
    if (!db) throw new Error("Banco de dados não inicializado.");

    const s = fullState || window.state;
    const payload = {
        pontos: s.pts,
        xp: s.xp,
        cd: s.cd || {},
        prefs: s.prefs || {},
        profile: s.profile || {},
        stats: s.stats || {},
        slots: s.slots || {},
        dailyLog: s.dailyLog || {},
        weeklyLog: s.weeklyLog || {},
        lastDailyDate: s.lastDailyDate || '',
        onboardingComplete: !!s.onboardingComplete,
        updatedAt: Date.now(),
        ...partial
    };

    try {
        const ref = doc(db, "users", userId);
        await setDoc(ref, payload, { merge: true });
    } catch (err) {
        console.error("Firestore save error:", err);
        throw err;
    }
}

export async function completeOnboarding(userId, onboardingData) {
    const s = window.state;
    s.profile = { ...s.profile, ...onboardingData.profile };
    s.slots = onboardingData.slots || s.slots;
    s.onboardingComplete = true;

    try { await saveStateToFirestore(userId, s); } catch (_) {}

    if (window.renderHeroHub) window.renderHeroHub();
    if (window.closeOnboarding) window.closeOnboarding();
    if (window.handleAuthRouting) window.handleAuthRouting();
}

export async function fetchPublicProfiles(max = 50) {
    if (!db) return [];
    try {
        const q = query(
            collection(db, "users"),
            where("profile.public", "==", true)
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({
            uid: d.id,
            ...d.data()
        }));
        docs.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        return docs.slice(0, max);
    } catch (err) {
        console.error("fetchPublicProfiles error:", err);
        return [];
    }
}

// ================================================================
//  HISTÓRICO DE ESTUDOS — subcoleção users/{uid}/studySessions
// ================================================================

export async function saveStudySession(userId, session) {
    if (!db) return;
    try {
        const ref = doc(db, "users", userId, "studySessions", String(session.id));
        await setDoc(ref, {
            ...session,
            uid: userId,
            savedAt: Date.now()
        });
    } catch (err) {
        console.error("Erro ao salvar sessão de estudo:", err);
    }
}

export async function loadStudySessions(userId, max = 200) {
    if (!db) return [];
    try {
        const ref = collection(db, "users", userId, "studySessions");
        const q = query(ref, orderBy("timestamp", "desc"), limit(max));
        const snap = await getDocs(q);
        return snap.docs.map(d => d.data());
    } catch (err) {
        console.error("Erro ao carregar sessões de estudo:", err);
        return [];
    }
}

export async function deleteAllStudySessions(userId) {
    if (!db) return;
    try {
        const ref = collection(db, "users", userId, "studySessions");
        const snap = await getDocs(ref);
        const deletions = snap.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletions);
    } catch (err) {
        console.error("Erro ao limpar histórico de estudos:", err);
    }
}

export async function migrateStudySessions(userId) {
    if (!db) return 0;
    try {
        const existing = await loadStudySessions(userId, 1);
        if (existing.length > 0) return 0; // já migrado

        const raw = localStorage.getItem("historico_estudos");
        if (!raw) return 0;
        const list = JSON.parse(raw);
        if (!Array.isArray(list) || list.length === 0) return 0;

        const saves = list.map(s => saveStudySession(userId, s));
        await Promise.all(saves);
        return list.length;
    } catch (err) {
        console.error("Erro na migração do histórico:", err);
        return 0;
    }
}

window.saveStudySession           = saveStudySession;
window.loadStudySessions          = loadStudySessions;
window.deleteAllStudySessions     = deleteAllStudySessions;
window.migrateStudySessions       = migrateStudySessions;
window.syncUserData               = syncUserData;
window.saveStateToFirestore       = saveStateToFirestore;
window.completeOnboarding         = completeOnboarding;
window.fetchPublicProfiles        = fetchPublicProfiles;
