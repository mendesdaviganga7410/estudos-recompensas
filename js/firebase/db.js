/* ==========================================================================
   firebase/db.js — Leitura e gravação no Firestore
   ========================================================================== */
import { db } from "./config.js";
import {
    doc, getDoc, setDoc,
    collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
        slots: s.slots || {},
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

    await saveStateToFirestore(userId, s);

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

window.syncUserData          = syncUserData;
window.saveStateToFirestore  = saveStateToFirestore;
window.completeOnboarding    = completeOnboarding;
window.fetchPublicProfiles   = fetchPublicProfiles;
