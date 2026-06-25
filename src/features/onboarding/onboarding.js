/* ==========================================================================
   ONBOARDING.JS — Assistente de Iniciação (Wizard RPG Gamificado)
   ========================================================================== */

const $ob = id => document.getElementById(id);

let onboardingDraft = null;
let wizardStepIndex = 0;
let wizardSteps = [];
let onboardingCropper = null;
let onboardingCropTarget = null;
let isFinishing = false;



function createOnboardingDraft() {
    return {
        profile: {
            epicGoal: '',
            bannerUrl: '',
            avatarUrl: '',
            displayName: window.currentUser?.displayName || '',
            public: true
        },
        slots: window.cloneDefaultSlotText(),
        packageId: null
    };
}

function startOnboarding() {
    isFinishing = false;
    onboardingDraft = createOnboardingDraft();
    wizardStepIndex = 0;
    wizardSteps = window.getWizardSteps ? window.getWizardSteps() : [];

    const nameInput = $ob('ob-display-name');
    if (nameInput && window.currentUser) {
        nameInput.value = window.currentUser.displayName || '';
    }

    const overlay = $ob('onboarding-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        showOnboardingStep(1);
    }
}

function reopenCustomization() {
    isFinishing = false;
    const currentProfile = window.state.profile || {};
    onboardingDraft = {
        profile: {
            epicGoal: currentProfile.epicGoal || '',
            bannerUrl: currentProfile.bannerUrl || '',
            avatarUrl: currentProfile.avatarUrl || '',
            displayName: currentProfile.displayName || window.currentUser?.displayName || '',
            public: currentProfile.public === true
        },
        slots: window.state.slots ? JSON.parse(JSON.stringify(window.state.slots)) : window.cloneDefaultSlotText(),
        packageId: null
    };
    wizardStepIndex = 0;
    wizardSteps = window.getWizardSteps ? window.getWizardSteps() : [];

    const nameInput = $ob('ob-display-name');
    if (nameInput) nameInput.value = onboardingDraft.profile.displayName;
    const goalInput = $ob('ob-epic-goal');
    if (goalInput) goalInput.value = onboardingDraft.profile.epicGoal;

    if (window.closeSettingsModal) window.closeSettingsModal();

    const overlay = $ob('onboarding-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        showOnboardingStep(2);
        renderPackageCards();
    }
}

function closeOnboarding() {
    const overlay = $ob('onboarding-overlay');
    if (overlay) overlay.style.display = 'none';
    cancelOnboardingCrop();
}

function showOnboardingStep(step) {
    document.querySelectorAll('.ob-step').forEach(el => el.classList.remove('active'));
    const panel = $ob(`ob-step-${step}`);
    if (panel) panel.classList.add('active');

    const progress = $ob('ob-progress');
    if (progress) {
        const labels = ['Identidade', 'Pacotes', 'Personalização'];
        const idx = step <= 1 ? 0 : step <= 2 ? 1 : 2;
        progress.textContent = `Etapa ${step}/3 — ${labels[idx]}`;
    }

    if (step === 3) renderWizardCard();
}

function validateStep1() {
    const goal = $ob('ob-epic-goal')?.value.trim();
    if (!goal) {
        window.toast('Defina sua Meta Épica para continuar.', true);
        return false;
    }
    onboardingDraft.profile.epicGoal = goal;
    onboardingDraft.profile.displayName = $ob('ob-display-name')?.value.trim()
        || window.currentUser?.displayName || '';
    const privacyCheck = $ob('ob-public-profile');
    onboardingDraft.profile.public = privacyCheck ? privacyCheck.checked : true;
    return true;
}

function goToStep2() {
    if (!validateStep1()) return;
    showOnboardingStep(2);
    renderPackageCards();
}

function goToStep1() { showOnboardingStep(1); }

function renderPackageCards() {
    const grid = $ob('ob-packages');
    if (!grid || !window.STARTER_PACKAGES) return;

    grid.innerHTML = Object.values(window.STARTER_PACKAGES).map(pkg => `
        <button class="package-card" onclick="selectPackage('${pkg.id}')">
            <span class="package-icon">${pkg.icon}</span>
            <span class="package-name">${pkg.name}</span>
            <span class="package-desc">${pkg.desc}</span>
        </button>
    `).join('');
}

function selectPackage(packageId) {
    const pkg = window.STARTER_PACKAGES[packageId];
    if (!pkg) return;

    onboardingDraft.packageId = packageId;
    onboardingDraft.profile.epicGoal = onboardingDraft.profile.epicGoal || pkg.epicGoal;
    onboardingDraft.slots = window.mergeSlotText(onboardingDraft.slots, pkg.slots);
    finishOnboarding();
}

function startAdvancedWizard() {
    if (!validateStep1()) return;
    onboardingDraft.packageId = 'custom';
    wizardStepIndex = 0;
    showOnboardingStep(3);
}

function getWizardStepData() {
    return wizardSteps[wizardStepIndex] || null;
}

function getCategoryLabel(cat) {
    return { dailies: 'Rotina Diária', shop: 'Loja de Recompensas', epics: 'Marco Épico' }[cat] || cat;
}

function renderWizardCard() {
    const step = getWizardStepData();
    const card = $ob('wizard-card');
    const counter = $ob('wizard-counter');
    if (!step || !card) return;

    const defaults = window.getDefaultText(step.category, step.id);
    const presets = window.getSlotPresets(step.id);
    const current = onboardingDraft.slots[step.category][step.id] || defaults;
    const econ = step.economics;

    if (counter) counter.textContent = `${wizardStepIndex + 1} / ${wizardSteps.length}`;

    let econBadges = '';
    if (step.category === 'shop') {
        econBadges = `<span class="badge badge-highlight">${econ.cost} Pts</span>`;
    } else if (step.category === 'dailies') {
        econBadges = `
            <span class="badge badge-highlight">+${econ.pts} Pts</span>
            <span class="badge">+${econ.xp} XP</span>
            <span class="badge">−${econ.fXp} XP</span>`;
    } else {
        econBadges = `
            <span class="badge badge-highlight">+${econ.pts} Pts</span>
            <span class="badge">+${econ.xp} XP</span>`;
    }

    card.classList.remove('slide-in');
    void card.offsetWidth;
    card.classList.add('slide-in');

    card.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <span class="wizard-category">${window.escapeHtml(getCategoryLabel(step.category))}</span>
            <div class="badges" style="margin-left:auto;">${econBadges}</div>
        </div>
        <h3 class="wizard-question">Como quer nomear esta missão?</h3>
        <p class="wizard-default">Padrão: <strong>${window.escapeHtml(defaults.name)}</strong>${defaults.desc ? ` — ${window.escapeHtml(defaults.desc)}` : ''}</p>

        <div class="wizard-options">
            <button type="button" class="btn-theme w-full wizard-opt" data-wizard-action="default">✓ Manter Texto Padrão</button>
            ${presets.map((p, i) => `
                <button type="button" class="btn-theme w-full wizard-opt preset-opt" data-wizard-action="preset" data-preset-index="${i}">
                    <span class="preset-profile">${window.escapeHtml(p.profile)}</span>
                    <span class="preset-name">${window.escapeHtml(p.name)}</span>
                </button>
            `).join('')}
        </div>

        <details class="wizard-custom-section">
            <summary class="btn-theme w-full" style="justify-content:center;font-size:0.8rem;">✏️ Criar título personalizado</summary>
            <div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.5rem;">
                <input type="text" id="wizard-custom-name" placeholder="Título personalizado" value="${window.escapeHtml(current.name !== defaults.name ? current.name : '')}">
                ${step.hasDesc ? `<input type="text" id="wizard-custom-desc" placeholder="Descrição personalizada" value="${window.escapeHtml(current.desc && current.desc !== defaults.desc ? current.desc : '')}">` : ''}
                <button type="button" class="btn-theme w-full" style="justify-content:center;" data-wizard-action="custom">Salvar</button>
            </div>
        </details>

        <div class="wizard-nav">
            <button type="button" class="btn-theme" data-wizard-action="prev" ${wizardStepIndex === 0 ? 'disabled' : ''}>← Anterior</button>
            <button type="button" class="btn-theme" data-wizard-action="next" style="background:var(--accent);color:var(--accent-text);">
                ${wizardStepIndex >= wizardSteps.length - 1 ? 'Finalizar ✓' : 'Próximo →'}
            </button>
        </div>
    `;
}

function handleWizardCardClick(e) {
    if (isFinishing) return;
    const btn = e.target.closest('[data-wizard-action]');
    if (!btn || btn.disabled) return;

    const action = btn.dataset.wizardAction;
    if (action === 'default') wizardKeepDefault();
    else if (action === 'preset') wizardSelectPreset(Number(btn.dataset.presetIndex));
    else if (action === 'custom') wizardSaveCustom();
    else if (action === 'prev') wizardPrev();
    else if (action === 'next') wizardNext();
}

function saveWizardSlot(name, desc) {
    const step = getWizardStepData();
    if (!step) return;
    const entry = { name };
    if (step.hasDesc && desc) entry.desc = desc;
    onboardingDraft.slots[step.category][step.id] = entry;
}

function wizardKeepDefault() {
    const step = getWizardStepData();
    if (!step) return;
    const defaults = window.getDefaultText(step.category, step.id);
    saveWizardSlot(defaults.name, defaults.desc);
    wizardAdvance();
}

function wizardSelectPreset(index) {
    const step = getWizardStepData();
    if (!step) return;
    const presets = window.getSlotPresets(step.id);
    const p = presets[index];
    if (!p) return;
    saveWizardSlot(p.name, p.desc);
    wizardAdvance();
}

function wizardSaveCustom() {
    const name = $ob('wizard-custom-name')?.value.trim();
    if (!name) {
        window.toast('Digite um título para continuar.', true);
        return;
    }
    const desc = $ob('wizard-custom-desc')?.value.trim() || '';
    saveWizardSlot(name, desc);
    wizardAdvance();
}

function wizardAdvance() {
    if (isFinishing) return;
    if (wizardStepIndex >= wizardSteps.length - 1) {
        finishOnboarding();
    } else {
        wizardStepIndex++;
        renderWizardCard();
    }
}

function wizardNext() {
    const customName = $ob('wizard-custom-name')?.value.trim();
    if (customName) {
        wizardSaveCustom();
        return;
    }
    wizardKeepDefault();
}

function wizardPrev() {
    if (wizardStepIndex > 0) {
        wizardStepIndex--;
        renderWizardCard();
    } else {
        showOnboardingStep(2);
    }
}

async function finishOnboarding() {
    if (!window.currentUser) {
        window.toast('Sessão expirada. Faça login novamente.', true);
        return;
    }
    if (!onboardingDraft || isFinishing) return;

    isFinishing = true;
    const finishBtn = document.querySelector('[data-wizard-action="next"]');
    if (finishBtn) { finishBtn.disabled = true; finishBtn.textContent = 'Salvando...'; }

    try {
        window.state.profile = { ...window.state.profile, ...onboardingDraft.profile };
        window.state.slots = onboardingDraft.slots;

        const avatarUrl = onboardingDraft.profile.avatarUrl;
        if (avatarUrl && window.updateProfilePhotoUrl) {
            await window.updateProfilePhotoUrl(avatarUrl);
        }
        if (onboardingDraft.profile.displayName && window.updateUserProfileName) {
            await window.updateUserProfileName(onboardingDraft.profile.displayName);
        }
        if (window.completeOnboarding) {
            await window.completeOnboarding(window.currentUser.uid, onboardingDraft);
        } else if (window.saveStateToFirestore) {
            window.state.onboardingComplete = true;
            await window.saveStateToFirestore(window.currentUser.uid, window.state);
        } else {
            window.state.onboardingComplete = true;
        }

        closeOnboarding();
        window.toast('Iniciação concluída! Bem-vindo ao seu Hub. 🎉');
        if (window.renderHeroHub) window.renderHeroHub();
        if (window.handleAuthRouting) window.handleAuthRouting();
    } catch (err) {
        console.error('Onboarding save error:', err);
        window.toast('Erro ao salvar iniciação. Tente novamente.', true);
        if (finishBtn) {
            finishBtn.disabled = false;
            finishBtn.textContent = wizardStepIndex >= wizardSteps.length - 1 ? 'Finalizar ✓' : 'Próximo →';
        }
    } finally {
        isFinishing = false;
    }
}

function initOnboardingMedia() {
    const avatarZone = $ob('ob-avatar-zone');
    const bannerZone = $ob('ob-banner-zone');
    const avatarInput = $ob('ob-avatar-input');
    const bannerInput = $ob('ob-banner-input');

    avatarZone?.addEventListener('click', () => avatarInput?.click());
    bannerZone?.addEventListener('click', () => bannerInput?.click());

    avatarInput?.addEventListener('change', e => {
        if (e.target.files[0]) openOnboardingCrop(e.target.files[0], 'avatar');
    });
    bannerInput?.addEventListener('change', e => {
        if (e.target.files[0]) openOnboardingCrop(e.target.files[0], 'banner');
    });
}

function openOnboardingCrop(file, target) {
    if (!file?.type.startsWith('image/')) {
        window.toast('Selecione uma imagem válida.', true);
        return;
    }
    onboardingCropTarget = target;
    const reader = new FileReader();
    reader.onload = event => {
        const img = $ob('ob-crop-image');
        const container = $ob('ob-crop-container');
        if (!img || !container) return;
        img.src = event.target.result;
        container.style.display = 'flex';

        if (onboardingCropper) onboardingCropper.destroy();
        onboardingCropper = new Cropper(img, {
            aspectRatio: target === 'avatar' ? 1 : 16 / 5,
            viewMode: 1,
            dragMode: 'move',
            background: false,
            autoCropArea: 0.9,
            responsive: true
        });
    };
    reader.readAsDataURL(file);
}

function saveOnboardingCrop() {
    if (!onboardingCropper || !onboardingCropTarget) return;
    const isAvatar = onboardingCropTarget === 'avatar';
    const canvas = onboardingCropper.getCroppedCanvas({
        width: isAvatar ? 256 : 1200,
        height: isAvatar ? 256 : 375,
        imageSmoothingQuality: 'high'
    });
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    if (isAvatar) {
        onboardingDraft.profile.avatarUrl = dataUrl;
        const preview = $ob('ob-avatar-preview');
        if (preview) { preview.src = dataUrl; preview.style.display = 'block'; }
    } else {
        onboardingDraft.profile.bannerUrl = dataUrl;
        const preview = $ob('ob-banner-zone');
        if (preview) { preview.style.backgroundImage = `url(${dataUrl})`; preview.classList.add('has-image'); }
    }
    cancelOnboardingCrop();
    window.toast(isAvatar ? 'Avatar definido!' : 'Banner definido!');
}

function cancelOnboardingCrop() {
    if (onboardingCropper) { onboardingCropper.destroy(); onboardingCropper = null; }
    onboardingCropTarget = null;
    const container = $ob('ob-crop-container');
    if (container) container.style.display = 'none';
}

window.startOnboarding       = startOnboarding;
window.reopenCustomization   = reopenCustomization;
window.closeOnboarding       = closeOnboarding;
window.goToStep1             = goToStep1;
window.goToStep2             = goToStep2;
window.selectPackage         = selectPackage;
window.startAdvancedWizard   = startAdvancedWizard;
window.wizardKeepDefault     = wizardKeepDefault;
window.wizardSelectPreset    = wizardSelectPreset;
window.wizardSaveCustom      = wizardSaveCustom;
window.wizardNext            = wizardNext;
window.wizardPrev            = wizardPrev;
window.saveOnboardingCrop    = saveOnboardingCrop;
window.cancelOnboardingCrop  = cancelOnboardingCrop;

document.addEventListener('DOMContentLoaded', () => {
    initOnboardingMedia();
    const wizardStage = document.getElementById('wizard-stage');
    if (wizardStage) wizardStage.addEventListener('click', handleWizardCardClick);

    const goalInput = $ob('ob-epic-goal');
    if (goalInput) {
        goalInput.addEventListener('input', () => {
            if (onboardingDraft) onboardingDraft.profile.epicGoal = goalInput.value.trim();
        });
    }
});
