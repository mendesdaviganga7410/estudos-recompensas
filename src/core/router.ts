const ROUTES = {
    inicio:     'index.html',
    hub:        'index.html',
    painel:     'panel.html',
    guest:      'panel.html',
    comunidade: 'comunidade.html',
    estudo:     'study.html',
    review:     'review.html'
};

function getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path;
}

function isInicioPage()  { return getCurrentPage() === 'index.html'; }
function isHubPage()     { return getCurrentPage() === 'index.html'; }
function isPainelPage()  { return getCurrentPage() === 'panel.html'; }
function isHeroPage()    { return isHubPage(); }
function isComunidadePage() { return getCurrentPage() === 'comunidade.html'; }
function isReviewPage() { return getCurrentPage() === 'review.html'; }
function isStudyPage()     { return getCurrentPage() === 'study.html'; }

function setGuestMode(active) {
    window.isGuestMode = active;
    document.body.classList.toggle('guest-mode', active);
    document.body.classList.toggle('auth-mode', !active);
    updateGuestUI();
}

function updateGuestUI() {
    const isGuest = window.isGuestMode;
    const profileTab = document.querySelector('.tab-btn[onclick*="tab-profile"]') as HTMLElement | null;
    const securityTab = document.querySelector('.tab-btn[onclick*="tab-security"]') as HTMLElement | null;
    const heroOnly = document.querySelectorAll('.auth-only') as NodeListOf<HTMLElement>;
    const guestOnly = document.querySelectorAll('.guest-only') as NodeListOf<HTMLElement>;

    if (profileTab) profileTab.style.display = isGuest ? 'none' : '';
    if (securityTab) securityTab.style.display = isGuest ? 'none' : '';
    heroOnly.forEach(el => { el.style.display = isGuest ? 'none' : ''; });
    guestOnly.forEach(el => { el.style.display = isGuest ? '' : 'none'; });
}

function navigateTo(url) {
    window.location.href = url;
}

function handleAuthRouting() {
    const user = window.currentUser;

    if (!user) {
        setGuestMode(true);
        if (isHubPage()) {
            renderGuestLanding();
        } else if (isComunidadePage()) {
            if (window.renderComunidade) window.renderComunidade();
        } else if (isStudyPage()) {
            if (window.renderStudy) window.renderStudy();
        }
        return;
    }

    setGuestMode(false);

    if (!window.state.onboardingComplete) {
        if (isPainelPage() || isComunidadePage() || isStudyPage()) {
            navigateTo(ROUTES.hub);
            return;
        }
        if (window.startOnboarding) window.startOnboarding();
        return;
    }

    if (isPainelPage()) {
        if (window.render) window.render();
        return;
    }

    if (isComunidadePage()) {
        if (window.renderComunidade) window.renderComunidade();
        return;
    }
    if (isStudyPage()) {
        if (window.renderStudy) window.renderStudy();
        return;
    }
    if (isReviewPage()) {
        if (window.renderReviewPage) window.renderReviewPage();
        return;
    }
    if (isHubPage() || isInicioPage()) {
        if (window.renderHeroHub) window.renderHeroHub();
    }
}

// Hook para garantir que a renderização da página de revisão ocorra após o handleAuthRouting
// Isso previne que a página de revisão renderize antes que window.state.studyBlocks seja populado
const originalHandleAuthRouting = window.handleAuthRouting;
window.handleAuthRouting = async () => {
    await originalHandleAuthRouting();
    if (window.isReviewPage?.()) {
        if (window.state.studyBlocks && window.state.studyBlocks.length === 0 && window.currentUser && window.loadStudyBlocks) {
            // Se o estado estiver vazio e for um usuário logado, tentar carregar do Firestore
            const loadedBlocks = await window.loadStudyBlocks(String(window.currentUser.uid));
            window.state.studyBlocks = loadedBlocks; // Atualiza o estado
            window.renderStudyBlocksList(); // Renderiza com os dados carregados
        } else if (window.isGuestMode && (!window.state.studyBlocks || window.state.studyBlocks.length === 0)) {
            // Para modo convidado, garantir que o estado local seja carregado e renderizado
            window.loadGuestState();
            window.renderStudyBlocksList();
        } else if (window.state.studyBlocks && window.state.studyBlocks.length > 0) {
             // Se já tem dados no estado, apenas renderiza
            window.renderStudyBlocksList();
        }
    }
};

function renderGuestLanding() {
    const landing = document.getElementById('guest-landing');
    const heroContent = document.getElementById('hero-content');
    const loading = document.getElementById('auth-loading');
    if (loading) loading.style.display = 'none';
    if (landing) landing.style.display = 'flex';
    if (heroContent) heroContent.style.display = 'none';
}

function enterGuestMode() {
    if (window.currentUser) {
        window.toast?.('Você já está logado. Use o painel normalmente.', true);
        return;
    }
    setGuestMode(true);
    window.loadGuestState();
    if (window.applyPrefs) window.applyPrefs((window.state.prefs || {}) as UserPrefs);
    navigateTo(ROUTES.guest);
}

function enterHeroHub() {
    if (!window.currentUser) {
        window.toast?.('Faça login para acessar o Hub do Herói.', true);
        return;
    }
    if (!window.state.onboardingComplete) {
        window.startOnboarding?.();
        return;
    }
    navigateTo(ROUTES.hub);
}

function enterPanel() {
    navigateTo(ROUTES.painel);
}

window.ROUTES            = ROUTES;
window.getCurrentPage    = getCurrentPage;
window.isInicioPage      = isInicioPage;
window.isHubPage         = isHubPage;
window.isPainelPage      = isPainelPage;
window.isStudyPage       = isStudyPage;
window.isHeroPage        = isHeroPage;
window.setGuestMode      = setGuestMode;
window.updateGuestUI     = updateGuestUI;
window.navigateTo        = navigateTo;
window.handleAuthRouting = handleAuthRouting;
window.renderGuestLanding = renderGuestLanding;
window.enterGuestMode    = enterGuestMode;
window.enterHeroHub      = enterHeroHub;
window.enterPanel        = enterPanel;
