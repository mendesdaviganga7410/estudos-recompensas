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
        <div class="bento-card dialog-theme-card" style="max-width:520px;">
            <div class="dialog-header-block">
                <h3>⚙️ Configuração de Revisão</h3>
                <button class="dialog-close-btn" onclick="window.closeReviewSettingsDialog()">×</button>
            </div>
            <div class="dialog-body">
                <div class="dialog-scroll">
                    <div id="reviewSettingsDialogBody"></div>
                </div>
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

    dialogBody.innerHTML = `
        <h4 class="grid-section-title">🎯 Presets Rápidos</h4>
        <div class="study-config-grid">
            ${DEFAULT_REVIEW_PRESETS.map(p => {
                const isActive = p.id === active.id;
                return `
                    <div class="study-config-item"${isActive ? ' style="border-color:var(--accent);box-shadow:4px 4px 0 color-mix(in srgb, var(--accent), var(--shadow-color) 50%);"' : ''}>
                        <div>
                            <label>${p.name}</label>
                            <div class="hint">${p.desc} — ${p.intervals.join(', ')} dias</div>
                        </div>
                        <button class="btn-theme" onclick="window.selectPresetFromDialog('${p.id}')" style="padding:0.3rem 0.7rem;font-size:0.75rem;${isActive ? 'border-color:var(--accent);' : ''}">${isActive ? '✓ Ativo' : 'Usar'}</button>
                    </div>
                `;
            }).join('')}
            <div class="study-config-item" id="customPresetItem"${active.id === 'custom' ? ' style="border-color:var(--accent);box-shadow:4px 4px 0 color-mix(in srgb, var(--accent), var(--shadow-color) 50%);"' : ''}>
                <div>
                    <label>✏️ Personalizar</label>
                    <div class="hint">Defina seus próprios intervalos</div>
                </div>
                <button class="btn-theme" onclick="window.selectPresetFromDialog('custom')" style="padding:0.3rem 0.7rem;font-size:0.75rem;${active.id === 'custom' ? 'border-color:var(--accent);' : ''}">${active.id === 'custom' ? '✓ Ativo' : 'Configurar'}</button>
            </div>
        </div>
    `;
}

function selectPresetFromDialog(presetId: string) {
    if (presetId === 'custom') {
        const dialogBody = document.getElementById('reviewSettingsDialogBody');
        if (!dialogBody) return;
        dialogBody.innerHTML = `
            <h4 class="grid-section-title">✏️ Personalizar Intervalos</h4>
            <p style="font-size:0.85rem;color:var(--muted);margin-bottom:1rem;line-height:1.5;">Digite os intervalos em dias, separados por vírgula.</p>
            <div class="study-config-grid">
                <div class="study-config-item">
                    <div>
                        <label>Intervalos (dias)</label>
                        <div class="hint">Ex: 7, 15, 30, 60</div>
                    </div>
                    <input type="text" id="dialogCustomIntervals" placeholder="7, 15, 30" value="7, 15, 30" autocomplete="off" style="width:160px;padding:0.45rem 0.75rem;background:var(--panel);border:3px solid var(--stroke);border-radius:var(--element-radius);font-weight:800;color:var(--text);font-family:inherit;font-size:0.9rem;outline:none;box-shadow:3px 3px 0 var(--shadow-color);box-sizing:border-box;">
                </div>
            </div>
            <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:1rem;">
                <button class="btn-theme" onclick="window.renderReviewSettingsDialog()" style="width:auto;background:var(--panel);">Voltar</button>
                <button class="btn-theme" onclick="window.saveCustomIntervals()" style="width:auto;">Salvar</button>
            </div>
        `;
        return;
    }

    const preset = DEFAULT_REVIEW_PRESETS.find(p => p.id === presetId);
    if (!preset) { closeReviewSettingsDialog(); return; }
    window.state.activeReviewSetting = { ...preset };

    window.saveState();
    if (typeof window.renderReviewSettingsRow === 'function') window.renderReviewSettingsRow();
    closeReviewSettingsDialog();
    if (typeof window.renderStudyBlocksList === 'function') window.renderStudyBlocksList();
    if (typeof window.generateReviewNotif === 'function') window.generateReviewNotif?.();
    window.toast?.(`✅ Revisão: ${window.state.activeReviewSetting.name}`);
}

function saveCustomIntervals() {
    const input = document.getElementById('dialogCustomIntervals') as HTMLInputElement | null;
    if (!input) return;
    const intervalsStr = input.value.trim();
    const intervals = intervalsStr.split(/[,\s]+/).map(Number).filter(n => !isNaN(n) && n > 0);
    if (intervals.length === 0) {
        window.toast?.('Digite pelo menos um intervalo válido (ex: 7, 15, 30).', true);
        return;
    }
    intervals.sort((a, b) => a - b);
    window.state.activeReviewSetting = {
        id: 'custom',
        name: '✏️ Personalizar',
        intervals: intervals
    };
    window.saveState();
    if (typeof window.renderReviewSettingsRow === 'function') window.renderReviewSettingsRow();
    window.renderReviewSettingsDialog();
    if (typeof window.renderStudyBlocksList === 'function') window.renderStudyBlocksList();
    if (typeof window.generateReviewNotif === 'function') window.generateReviewNotif?.();
    window.toast?.(`✅ Revisão: Personalizado (${intervals.join(', ')}d)`);
}

window.getActiveReviewSettings = getActiveReviewSettings;
window.openReviewSettingsDialog = openReviewSettingsDialog;
window.closeReviewSettingsDialog = closeReviewSettingsDialog;
window.renderReviewSettingsDialog = renderReviewSettingsDialog;
window.selectPresetFromDialog = selectPresetFromDialog;
window.saveCustomIntervals = saveCustomIntervals;
