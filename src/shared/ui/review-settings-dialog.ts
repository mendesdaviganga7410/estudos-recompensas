/* =====================================================================
   REVIEW-SETTINGS-DIALOG — Compartilhado entre todas as páginas
   ===================================================================== */

const DEFAULT_REVIEW_PRESETS = [
    { id: 'curta',      name: '📅 Curta',     desc: '3 intervalos rápidos',  intervals: [1, 3, 7],                           easeFactorMultiplier: 1.0 },
    { id: 'mensal',     name: '📚 Mensal',    desc: 'Revisões mensais',      intervals: [7, 15, 30],                         easeFactorMultiplier: 1.0 },
    { id: 'semestral',  name: '📖 Semestral', desc: 'Revisões semestrais',   intervals: [7, 15, 30, 60, 120, 180],           easeFactorMultiplier: 1.2 },
    { id: 'intensiva',  name: '⚡ Intensiva', desc: 'Alta frequência',       intervals: [1, 2, 4, 7, 14, 30],                easeFactorMultiplier: 0.9 },
    { id: 'longoprazo', name: '🌟 Longo Prazo',desc: 'Espaçamento máximo',   intervals: [30, 60, 120, 240, 365],             easeFactorMultiplier: 1.4 },
];

function getActiveReviewSettings() {
    if (window.state && window.state.activeReviewSetting) {
        return window.state.activeReviewSetting;
    }
    return DEFAULT_REVIEW_PRESETS[1];
}

function openReviewSettingsDialog() {
    renderReviewSettingsDialog();
    const dialog = document.getElementById('review-settings-dialog');
    if (dialog) {
        (dialog as HTMLDialogElement).showModal();
        return;
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <dialog id="review-settings-dialog" class="theme-bento-dialog">
        <div class="bento-card dialog-theme-card" style="max-width:620px;">
            <div class="dialog-header-block">
                <h3>⚙️ Configuração de Revisão</h3>
                <button class="dialog-close-btn" onclick="window.closeReviewSettingsDialog()">×</button>
            </div>
            <div class="dialog-body" style="padding:0;">
                <div id="reviewSettingsDialogBody" style="flex:1;min-height:0;"></div>
            </div>
        </div>
    </dialog>
    `;
    document.body.appendChild(wrapper.children[0]);
    renderReviewSettingsDialog();
    const newDialog = document.getElementById('review-settings-dialog') as HTMLDialogElement | null;
    if (newDialog) newDialog.showModal();
}

function closeReviewSettingsDialog() {
    const dialog = document.getElementById('review-settings-dialog') as HTMLDialogElement | null;
    if (dialog) dialog.close();
}

function renderReviewSettingsDialog() {
    const dialogBody = document.getElementById('reviewSettingsDialogBody');
    if (!dialogBody) return;

    const active = getActiveReviewSettings();

    dialogBody.className = 'review-settings-layout';
    dialogBody.innerHTML = `
        <div class="review-settings-sidebar">
            <button type="button" class="rs-tab-btn active">📋 Predefinições</button>
        </div>
        <div class="review-settings-content">
            <div class="rs-section-title">🎯 Escolha um preset</div>
            <div class="preset-options">
                ${DEFAULT_REVIEW_PRESETS.map(p => {
                    const isActive = p.id === active.id;
                    return `
                        <button type="button" class="btn-theme preset-option w-full ${isActive ? 'preset-option--active' : ''}" onclick="window.selectPresetFromDialog('${p.id}')">
                            <span class="preset-option-name">${p.name}</span>
                            <span class="preset-option-desc">${p.desc}</span>
                            <span class="preset-option-intervals">${p.intervals.join(', ')} dias</span>
                        </button>
                    `;
                }).join('')}
                <button type="button" class="btn-theme preset-option w-full ${active.id === 'custom' ? 'preset-option--active' : ''}" onclick="window.selectPresetFromDialog('custom')">
                    <span class="preset-option-name">✏️ Personalizar</span>
                    <span class="preset-option-desc">Defina seus próprios intervalos</span>
                    <span class="preset-option-intervals">${active.id === 'custom' ? active.intervals.join(', ') + ' dias' : 'Digite na barra de ferramentas'}</span>
                </button>
            </div>
        </div>
    `;
}

function selectPresetFromDialog(presetId: string) {
    if (presetId === 'custom') {
        window.state.activeReviewSetting = {
            id: 'custom',
            name: '✏️ Personalizar',
            intervals: [7, 15, 30]
        };
    } else {
        const preset = DEFAULT_REVIEW_PRESETS.find(p => p.id === presetId);
        if (!preset) { closeReviewSettingsDialog(); return; }
        window.state.activeReviewSetting = { ...preset };
    }

    window.saveState();
    if (typeof window.renderReviewSettingsRow === 'function') window.renderReviewSettingsRow();
    closeReviewSettingsDialog();
    if (typeof window.renderStudyBlocksList === 'function') window.renderStudyBlocksList();
    if (typeof window.generateReviewNotif === 'function') window.generateReviewNotif?.();
    window.toast?.(`✅ Revisão: ${window.state.activeReviewSetting.name}`);
}

window.getActiveReviewSettings = getActiveReviewSettings;
window.openReviewSettingsDialog = openReviewSettingsDialog;
window.closeReviewSettingsDialog = closeReviewSettingsDialog;
window.renderReviewSettingsDialog = renderReviewSettingsDialog;
window.selectPresetFromDialog = selectPresetFromDialog;
