/* ==========================================================================
   firebase/auth.js — Autenticação Firebase (Google + E-mail)
   Correção: import duplicado de versões diferentes removido.
   ========================================================================== */
import {
    auth,
    signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    updateProfile, updateEmail, updatePassword,
    sendEmailVerification, sendPasswordResetEmail
} from "./init.js";

/* --------------------------------------------------------------------------
   LOGIN / REGISTER / LOGOUT
   -------------------------------------------------------------------------- */
export function loginGoogle() {
    if (!auth) { window.toast("Serviço de autenticação indisponível.", true); return; }
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(result => window.toast(`Bem-vindo, ${result.user.displayName}!`))
        .catch(err   => { console.error(err); window.toast("Falha na autenticação.", true); });
}

export function loginEmailAndPassword(email, password) {
    if (!auth) { window.toast("Serviço de autenticação indisponível.", true); return; }
    signInWithEmailAndPassword(auth, email, password)
        .then(result => {
            const name = result.user.displayName || result.user.email.split('@')[0];
            window.toast(`Bem-vindo, ${name}!`);
            if (window.closeAuthModal) window.closeAuthModal();
        })
        .catch(err => { console.error(err); window.toast("E-mail ou senha incorretos.", true); });
}

export function registerEmailAndPassword(email, password) {
    if (!auth) { window.toast("Serviço de autenticação indisponível.", true); return; }
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.toast("Conta criada com sucesso!");
            if (window.closeAuthModal) window.closeAuthModal();
        })
        .catch(err => { console.error(err); window.toast("Falha ao criar conta.", true); });
}

export function logoutGoogle() {
    if (!auth) return;
    signOut(auth)
        .then(() => window.toast("Sessão encerrada."))
        .catch(err => console.error(err));
}

/* --------------------------------------------------------------------------
   ATUALIZAÇÃO DE PERFIL
   -------------------------------------------------------------------------- */
export async function updateUserProfileName(newName) {
    if (!auth?.currentUser) return;
    try {
        await updateProfile(auth.currentUser, { displayName: newName });
        if (window.state?.profile) window.state.profile.displayName = newName;
        window.saveState?.();
        window.renderHeroHub?.();
        window.toast("Nome atualizado com sucesso!");
        const el = document.getElementById("user-name");
        if (el) el.textContent = newName;
    } catch { window.toast("Erro ao atualizar nome.", true); }
}

export async function updateUserProfilePhoto(file) {
    if (!auth?.currentUser) { window.toast("Nenhum usuário conectado.", true); return; }
    try {
        const base64 = await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload  = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(file);
        });
        await updateProfilePhotoUrl(base64);
        window.toast("Foto de perfil atualizada!");
    } catch (err) {
        console.error("Photo update error:", err);
        window.toast("Erro ao processar nova imagem.", true);
    }
}

export async function updateProfilePhotoUrl(photoUrl) {
    if (!auth?.currentUser) return;
    const img = document.getElementById("user-photo");
    if (img) img.src = photoUrl;
    const heroAvatar = document.getElementById("hero-avatar");
    if (heroAvatar) heroAvatar.src = photoUrl;
    if (window.state?.profile) window.state.profile.avatarUrl = photoUrl;
    if (window.saveStateToFirestore) {
        window.saveStateToFirestore(auth.currentUser.uid, window.state)
            .catch(err => console.warn("Firestore sync error:", err));
    }
    try {
        await updateProfile(auth.currentUser, { photoURL: photoUrl });
    } catch (err) {
        console.warn("Could not persist photoURL to Firebase Auth:", err);
    }
}

export async function updateUserEmail(newEmail) {
    if (!auth?.currentUser) return;
    try {
        await updateEmail(auth.currentUser, newEmail);
        window.toast("E-mail alterado com sucesso!");
    } catch (err) {
        const msg = err.code === "auth/requires-recent-login"
            ? "Ação sensível. Faça logout e login novamente."
            : "Erro ao atualizar e-mail.";
        window.toast(msg, true);
    }
}

export async function updateUserPassword(newPassword) {
    if (!auth?.currentUser) return;
    try {
        await updatePassword(auth.currentUser, newPassword);
        window.toast("Senha alterada com sucesso!");
    } catch (err) {
        const msg = err.code === "auth/requires-recent-login"
            ? "Ação sensível. Faça logout e login novamente."
            : "Senha fraca ou inválida.";
        window.toast(msg, true);
    }
}

export function updateUserProfileBanner(bannerUrl) {
    if (!window.state?.profile) return;
    window.state.profile.bannerUrl = bannerUrl;
    const bannerEl = document.getElementById('hero-banner');
    if (bannerEl) {
        bannerEl.style.backgroundImage = `url(${bannerUrl})`;
        bannerEl.classList.add('has-image');
    }
    if (window.currentUser && window.saveStateToFirestore) {
        window.saveStateToFirestore(window.currentUser.uid, window.state)
            .catch(err => console.warn("Banner sync error:", err));
    }
    window.toast("Banner atualizado!");
}

export async function sendPasswordReset(email) {
    if (!auth) { window.toast("Serviço de autenticação indisponível.", true); return; }
    try {
        await sendPasswordResetEmail(auth, email);
        window.toast("Link de redefinição enviado para seu e-mail!");
        if (window.closeAuthModal) window.closeAuthModal();
    } catch (err) {
        console.error(err);
        const msg = err.code === "auth/user-not-found"
            ? "Nenhuma conta encontrada com este e-mail."
            : "Erro ao enviar link de redefinição.";
        window.toast(msg, true);
    }
}

export async function sendVerification() {
    if (!auth?.currentUser) return;
    try {
        await sendEmailVerification(auth.currentUser);
        window.toast("E-mail de verificação enviado!");
    } catch { window.toast("Erro ao enviar verificação.", true); }
}

/* --------------------------------------------------------------------------
   LISTENER DE ESTADO DE AUTH
   -------------------------------------------------------------------------- */

const authFallbackTimer = setTimeout(() => {
    console.warn("Auth fallback: Firebase não resolveu o estado de autenticação em 5s. Exibindo modo visitante.");
    const loading = document.getElementById("auth-loading");
    if (loading) loading.style.display = "none";
    if (window.handleAuthRouting) window.handleAuthRouting();
    if (window.render) window.render();
}, 5000);

if (auth) {
    onAuthStateChanged(auth, async user => {
        clearTimeout(authFallbackTimer);
        const loginBtns  = document.getElementById("auth-buttons");
        const profileDiv = document.getElementById("user-profile");
        const userPhoto  = document.getElementById("user-photo");
        const userName   = document.getElementById("user-name");

        if (user) {
            window.currentUser = user;
            if (window.setGuestMode) window.setGuestMode(false);

            if (loginBtns)  loginBtns.style.display  = "none";
            if (profileDiv) profileDiv.style.display = "flex";

            const displayName = user.displayName || user.email.split('@')[0];
            if (userName) userName.textContent = displayName;

            const photoSrc = user.photoURL
                || window.state?.profile?.avatarUrl
                || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user.email)}`;
            if (userPhoto) userPhoto.src = photoSrc;

            if (window.syncUserData) await window.syncUserData(user.uid);

            const updatedPhotoSrc = user.photoURL
                || window.state?.profile?.avatarUrl
                || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user.email)}`;
            if (userPhoto && userPhoto.src !== updatedPhotoSrc) {
                userPhoto.src = updatedPhotoSrc;
            }
        } else {
            window.currentUser = null;
            if (window.setGuestMode) window.setGuestMode(true);

            if (loginBtns)  loginBtns.style.display  = "flex";
            if (profileDiv) profileDiv.style.display = "none";

            if (window.loadGuestState) window.loadGuestState();
            if (window.applyPrefs) window.applyPrefs(window.state?.prefs || {});
            if (window.handleAuthRouting) window.handleAuthRouting();
            if (window.render) window.render();
        }
    });
}

/* Expõe globalmente */
window.loginGoogle             = loginGoogle;
window.loginEmailAndPassword   = loginEmailAndPassword;
window.registerEmailAndPassword = registerEmailAndPassword;
window.logoutGoogle            = logoutGoogle;
window.updateUserProfileName   = updateUserProfileName;
window.updateUserProfilePhoto  = updateUserProfilePhoto;
window.updateProfilePhotoUrl   = updateProfilePhotoUrl;
window.updateUserEmail         = updateUserEmail;
window.updateUserPassword      = updateUserPassword;
window.updateUserProfileBanner = updateUserProfileBanner;
window.sendPasswordReset      = sendPasswordReset;
window.sendVerification        = sendVerification;
