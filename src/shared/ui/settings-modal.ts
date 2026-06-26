/* =====================================================================
   SETTINGS-MODAL — Modal único de configurações injetado dinamicamente
   ===================================================================== */

const STUDY_CFG_KEY = 'estudo_config';

// ============================================================
//  CONFIGURACOES DE ESTUDO (Pomodoro auto/prompt)
// ============================================================
let studyConfig = {
    askBreak: true,
    askFocus: true,
    autoBreak: false,
    autoFocus: false,
    longBreakEvery: 0,
    longBreakMin: 15,
    timerSize: 'md'
};

function loadStudyConfig() {
    try {
        const raw = localStorage.getItem(STUDY_CFG_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            Object.keys(studyConfig).forEach(k => {
                if (k in saved && typeof saved[k] === typeof studyConfig[k]) {
                    studyConfig[k] = saved[k];
                }
            });
        }
    } catch { /* silencioso */ }
}
function saveStudyConfig() {
    try { localStorage.setItem(STUDY_CFG_KEY, JSON.stringify(studyConfig)); }
    catch { /* silencioso */ }
}

function applyPomoPreset(focus: number, brk: number, cycles: number): void {
    const focusEl = document.getElementById('pomoFocusMin') as HTMLInputElement | null;
    const breakEl = document.getElementById('pomoBreakMin') as HTMLInputElement | null;
    const cyclesEl = document.getElementById('pomoCycles') as HTMLInputElement | null;
    if (focusEl) focusEl.value = String(focus);
    if (breakEl) breakEl.value = String(brk);
    if (cyclesEl) cyclesEl.value = String(cycles);
    window.toast?.(`Preset aplicado: ${focus}min foco / ${brk}min descanso`);
    closeStudyConfigDialog();
}

function applyTimerSize() {
    const display = document.getElementById('timerDisplay');
    if (!display) return;
    const sizes = { sm: '2.4rem', md: '3.5rem', lg: '5rem' };
    display.style.fontSize = sizes[studyConfig.timerSize] || sizes.md;
}

function openStudyConfigDialog(): void {
    renderStudyConfigDialog();
    const el = document.getElementById('study-config-dialog') as HTMLDialogElement | null;
    if (el) el.showModal();
}
function closeStudyConfigDialog(): void {
    const el = document.getElementById('study-config-dialog') as HTMLDialogElement | null;
    if (el) el.close();
}
function renderStudyConfigDialog() {
    const body = document.getElementById('studyConfigBody');
    if (!body) return;

    const presets = [
        { label: 'Cl\u00e1ssico 25/5', focus: 25, brk: 5, cycles: 4 },
        { label: 'Profundo 52/17', focus: 52, brk: 17, cycles: 4 },
        { label: '90/20', focus: 90, brk: 20, cycles: 3 }
    ];

    body.innerHTML = `
        <h4 class="grid-section-title">Presets R\u00e1pidos</h4>
        <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1.25rem;">
            ${presets.map(p => `
                <button class="btn-theme" onclick="applyPomoPreset(${p.focus},${p.brk},${p.cycles})" style="justify-content:center;padding:0.5rem;">${p.label}</button>
            `).join('')}
        </div>

        <h4 class="grid-section-title">Ciclos</h4>
        <div class="study-config-grid" style="margin-bottom:1rem;">
            <div class="study-config-item">
                <div>
                    <label for="cfg_longBreakEvery">Pausa longa a cada X ciclos</label>
                    <div class="hint">0 = desligado. Ex: 4 = pausa longa a cada 4 ciclos</div>
                </div>
                <input type="number" id="cfg_longBreakEvery" min="0" max="10" value="${studyConfig.longBreakEvery}" style="width:60px;padding:0.3rem 0.5rem;background:var(--panel);border:3px solid var(--stroke);border-radius:var(--element-radius);font-weight:800;color:var(--text);font-family:inherit;text-align:center;">
            </div>
            <div class="study-config-item">
                <div>
                    <label for="cfg_longBreakMin">Dura\u00e7\u00e3o da pausa longa (min)</label>
                    <div class="hint">Usado quando a pausa longa est\u00e1 ativa</div>
                </div>
                <input type="number" id="cfg_longBreakMin" min="1" max="60" value="${studyConfig.longBreakMin}" style="width:60px;padding:0.3rem 0.5rem;background:var(--panel);border:3px solid var(--stroke);border-radius:var(--element-radius);font-weight:800;color:var(--text);font-family:inherit;text-align:center;">
            </div>
        </div>

        <h4 class="grid-section-title">Comportamento</h4>
        <div class="study-config-grid" style="margin-bottom:1rem;">
            <div class="study-config-item">
                <div>
                    <label for="cfg_askBreak">Perguntar antes do descanso</label>
                    <div class="hint">Exibe op\u00e7\u00f5es ao fim de cada foco</div>
                </div>
                <input type="checkbox" id="cfg_askBreak" ${studyConfig.askBreak ? 'checked' : ''}>
            </div>
            <div class="study-config-item">
                <div>
                    <label for="cfg_askFocus">Perguntar antes do foco</label>
                    <div class="hint">Exibe op\u00e7\u00f5es ao fim de cada descanso</div>
                </div>
                <input type="checkbox" id="cfg_askFocus" ${studyConfig.askFocus ? 'checked' : ''}>
            </div>
            <div class="study-config-item">
                <div>
                    <label for="cfg_autoBreak">Iniciar descanso automaticamente</label>
                    <div class="hint">Ignora a pergunta e inicia o descanso sozinho</div>
                </div>
                <input type="checkbox" id="cfg_autoBreak" ${studyConfig.autoBreak ? 'checked' : ''}>
            </div>
            <div class="study-config-item">
                <div>
                    <label for="cfg_autoFocus">Iniciar foco automaticamente</label>
                    <div class="hint">Ignora a pergunta e inicia o foco sozinho</div>
                </div>
                <input type="checkbox" id="cfg_autoFocus" ${studyConfig.autoFocus ? 'checked' : ''}>
            </div>
        </div>

        <h4 class="grid-section-title">Apar\u00eancia</h4>
        <div class="study-config-grid" style="margin-bottom:1rem;">
            <div class="study-config-item">
                <div>
                    <label>Tamanho do timer</label>
                    <div class="hint">Define o tamanho da fonte do cron\u00f4metro</div>
                </div>
                <div style="display:flex;gap:0.35rem;">
                    <button class="btn-theme timer-size-btn" data-size="sm" style="padding:0.3rem 0.6rem;font-size:0.7rem;${studyConfig.timerSize === 'sm' ? 'border-color:var(--accent);' : ''}">P</button>
                    <button class="btn-theme timer-size-btn" data-size="md" style="padding:0.3rem 0.7rem;font-size:0.75rem;${studyConfig.timerSize === 'md' ? 'border-color:var(--accent);' : ''}">M</button>
                    <button class="btn-theme timer-size-btn" data-size="lg" style="padding:0.3rem 0.8rem;font-size:0.8rem;${studyConfig.timerSize === 'lg' ? 'border-color:var(--accent);' : ''}">G</button>
                </div>
            </div>
        </div>

        <h4 class="grid-section-title">Sess\u00f5es</h4>
        <div class="study-config-grid">
            <div class="study-config-item">
                <div>
                    <label>Limpar hist\u00f3rico de sess\u00f5es</label>
                    <div class="hint">Apaga permanentemente todo o hist\u00f3rico</div>
                </div>
                <button class="btn-theme" onclick="clearStudyHistory()" style="padding:0.3rem 0.7rem;font-size:0.7rem;background:var(--failure);color:white;">Limpar</button>
            </div>
        </div>
    `;

    body.querySelectorAll('input[type="checkbox"]').forEach(el => {
        el.addEventListener('change', function() {
            const key = this.id.replace('cfg_', '');
            const checked = this.checked;
            studyConfig[key] = checked;
            if (key === 'askBreak' && checked) {
                studyConfig.autoBreak = false;
                const other = document.getElementById('cfg_autoBreak') as HTMLInputElement | null;
                if (other) other.checked = false;
            }
            if (key === 'autoBreak' && checked) {
                studyConfig.askBreak = false;
                const other = document.getElementById('cfg_askBreak') as HTMLInputElement | null;
                if (other) other.checked = false;
            }
            if (key === 'askFocus' && checked) {
                studyConfig.autoFocus = false;
                const other = document.getElementById('cfg_autoFocus') as HTMLInputElement | null;
                if (other) other.checked = false;
            }
            if (key === 'autoFocus' && checked) {
                studyConfig.askFocus = false;
                const other = document.getElementById('cfg_askFocus') as HTMLInputElement | null;
                if (other) other.checked = false;
            }
            saveStudyConfig();
        });
    });
    body.querySelectorAll('input[type="number"]').forEach(el => {
        el.addEventListener('input', function() {
            const key = this.id.replace('cfg_', '');
            studyConfig[key] = parseInt(this.value) || 0;
            saveStudyConfig();
        });
    });
    body.querySelectorAll('.timer-size-btn').forEach((el: Element) => {
        el.addEventListener('click', function(this: HTMLElement) {
            studyConfig.timerSize = this.dataset.size;
            (body.querySelectorAll('.timer-size-btn') as NodeListOf<HTMLElement>).forEach(b => b.style.borderColor = '');
            this.style.borderColor = 'var(--accent)';
            applyTimerSize();
            saveStudyConfig();
        });
    });
}

function clearStudyHistory() {
    if (window.studyTimer && typeof window.studyTimer.clearHistory === 'function') {
        window.studyTimer.clearHistory();
    } else {
        window.toast?.('V\u00e1 para a p\u00e1gina de estudos para gerenciar o hist\u00f3rico.', true);
    }
    closeStudyConfigDialog();
}

// ============================================================
//  HTML DO MODAL DE CONFIGURACOES
// ============================================================
function getSettingsModalHTML() {
    return `
    <div id="settings-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content settings-large">
            <div class="modal-header">
                <h3>Configura\u00e7\u00f5es</h3>
                <button class="modal-close" onclick="closeSettingsModal()">\u00d7</button>
            </div>
            <div class="settings-layout">
                <div class="settings-sidebar">
                    <button class="tab-btn active" onclick="switchTab('tab-appearance')">\ud83c\udfa8 Estilo</button>
                    <button class="tab-btn" onclick="switchTab('tab-profile')">\ud83d\udc64 Perfil</button>
                    <button class="tab-btn" onclick="switchTab('tab-sounds')">\ud83d\udd14 Sons</button>
                    <button class="tab-btn" onclick="switchTab('tab-security')">\ud83d\udd12 Seguran\u00e7a</button>
                    <button class="tab-btn" onclick="switchTab('tab-advanced')">\u2699\ufe0f Avan\u00e7ado</button>
                </div>
                <div class="settings-content">
                    <div id="tab-appearance" class="tab-panel active">
                        <div class="form-group">
                            <label>Paleta de Cores Tem\u00e1tica</label>
                            <button type="button" class="btn-theme w-full" onclick="openThemeDialog()"
                                style="display: flex; justify-content: space-between; align-items: center; text-align: left;">
                                <span>\ud83c\udfa8 Customizar Visual de Tela</span>
                                <span id="current-theme-label" class="theme-pill">Padr\u00e3o Claro</span>
                            </button>
                        </div>
                        <div class="form-group">
                            <label>Arredondamento Geral</label>
                            <div class="range-widget">
                                <input type="range" id="radiusSlider" min="0" max="50" value="16" oninput="changeRadius(this.value+'px')">
                                <span id="radiusValue" class="range-value">16px</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Intensidade do Relevo (Sombras)</label>
                            <div class="range-widget">
                                <input type="range" id="shadowSlider" min="2" max="14" value="6" oninput="changeShadow(this.value+'px')">
                                <span id="shadowValue" class="range-value">6px</span>
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 0.5rem; border-top: 2px dashed var(--stroke); padding-top: 1.25rem;">
                            <button class="btn-theme w-full" onclick="resetDefaults()" style="justify-content: center;">\ud83d\udd04 Restaurar Padr\u00f5es</button>
                        </div>
                    </div>
                    <div id="tab-profile" class="tab-panel">
                        <div class="tab-lock-notice">\ud83d\udd12 Sincroniza\u00e7\u00e3o Desativada. Fa\u00e7a login para editar seu perfil.</div>
                        <div class="tab-auth-content" style="display: none; flex-direction: column; gap: 1rem;">
                            <div class="form-group">
                                <label>Nome de Exibi\u00e7\u00e3o</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="text" id="settings-name" placeholder="Nome do usu\u00e1rio" autocomplete="nickname">
                                    <button class="btn-theme" onclick="handleUpdateName()" style="padding: 0.65rem 1rem; width: auto;">Salvar</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Meta \u00c9pica</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="text" id="settings-epic-goal" placeholder='Ex: "Passar na USP"' autocomplete="off">
                                    <button class="btn-theme" onclick="handleUpdateEpicGoal()" style="padding: 0.65rem 1rem; width: auto;">Salvar</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Descri\u00e7\u00e3o</label>
                                <textarea id="settings-description" placeholder="Conte um pouco sobre voc\u00ea..." rows="3" style="width:100%;background:var(--panel);border:3px solid var(--stroke);border-radius:var(--element-radius);padding:0.65rem 1rem;font-size:0.85rem;color:var(--text);font-weight:800;outline:none;font-family:inherit;resize:vertical;"></textarea>
                                <button class="btn-theme" onclick="handleUpdateDescription()" style="align-self:flex-start;margin-top:0.35rem;">Salvar Descri\u00e7\u00e3o</button>
                            </div>
                            <div class="form-group">
                                <label>Foto de Perfil</label>
                                <div id="photo-drop-zone" class="photo-drop-zone">
                                    <span class="drop-zone-prompt">\ud83d\udcbc Clique para enviar uma imagem</span>
                                    <input type="file" id="photo-file-input" accept="image/*" style="display: none;">
                                </div>
                                <div id="crop-container" class="crop-container" style="display: none;">
                                    <div class="img-crop-wrapper">
                                        <img id="image-to-crop" src="" alt="Editor de Imagem">
                                    </div>
                                    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                                        <button class="btn-theme" onclick="cancelCrop()" style="background: var(--failure); color: white; width: auto;">Cancelar</button>
                                        <button class="btn-theme" onclick="saveCroppedPhoto()" style="background: var(--success); color: white; width: auto;">Cortar e Salvar</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Banner de Capa</label>
                                <div id="banner-drop-zone" class="banner-drop-zone">
                                    <span class="drop-zone-prompt">\ud83d\udcbc Clique para enviar uma imagem</span>
                                    <input type="file" id="banner-file-input" accept="image/*" style="display: none;">
                                </div>
                                <div id="banner-crop-container" class="crop-container" style="display: none;">
                                    <div class="img-crop-wrapper">
                                        <img id="banner-image-to-crop" src="" alt="Editor de Banner">
                                    </div>
                                    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                                        <button class="btn-theme" onclick="cancelBannerCrop()" style="background: var(--failure); color: white; width: auto;">Cancelar</button>
                                        <button class="btn-theme" onclick="saveCroppedBanner()" style="background: var(--success); color: white; width: auto;">Cortar e Salvar</button>
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface);border:3px solid var(--stroke);border-radius:var(--element-radius);padding:0.85rem 1rem;box-shadow:3px 3px 0 var(--shadow-color);">
                                <label for="settings-public-profile" style="margin:0;font-size:0.82rem;font-weight:800;color:var(--text);cursor:pointer;">\ud83c\udf10 Perfil P\u00fablico (aparecer na comunidade)</label>
                                <input type="checkbox" id="settings-public-profile" onchange="toggleProfilePrivacy()" style="width:20px;height:20px;accent-color:var(--accent);cursor:pointer;flex-shrink:0;">
                            </div>
                            <div class="form-group" style="border-top: 2px dashed var(--stroke); padding-top: 1rem;">
                                <label>Customiza\u00e7\u00e3o do Painel</label>
                                <button class="btn-theme w-full" onclick="reopenCustomization()" style="justify-content:center;">\ud83d\udee0\ufe0f Recustomizar Experi\u00eancia</button>
                            </div>
                        </div>
                    </div>
                    <div id="tab-sounds" class="tab-panel">
                        <div id="tab-sounds-body">
                        </div>
                    </div>
                    <div id="tab-security" class="tab-panel">
                        <div class="tab-lock-notice">\ud83d\udd12 Sincroniza\u00e7\u00e3o Desativada. Fa\u00e7a login para gerenciar credenciais.</div>
                        <div class="tab-auth-content" style="display: none; flex-direction: column; gap: 1rem;">
                            <div class="form-group">
                                <label>Alterar E-mail</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="email" id="settings-email" placeholder="novo@email.com" autocomplete="email">
                                    <button class="btn-theme" onclick="handleUpdateEmail()" style="padding: 0.65rem 1rem; width: auto;">Mudar</button>
                                </div>
                                <button class="btn-theme" onclick="handleVerifyEmail()" style="margin-top: 0.35rem; font-size: 0.7rem; padding: 0.35rem 0.75rem; width: max-content;">\ud83d\udce7 Solicitar Verifica\u00e7\u00e3o</button>
                            </div>
                            <div class="form-group">
                                <label>Redefinir Senha</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="password" id="settings-password" placeholder="M\u00ednimo 6 caracteres" minlength="6" autocomplete="new-password">
                                    <button class="btn-theme" onclick="handleUpdatePassword()" style="padding: 0.65rem 1rem; width: auto;">Atualizar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="tab-advanced" class="tab-panel">
                        <div style="display:flex;flex-direction:column;gap:1rem;">
                            <button class="btn-theme w-full" onclick="openStudyConfigDialog()" style="justify-content:center;">\ud83d\udcda Configura\u00e7\u00f5es de Estudo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <dialog id="study-config-dialog" class="theme-bento-dialog">
        <div class="bento-card dialog-theme-card">
            <div class="dialog-header-block">
                <h3>\ud83d\udcda Configura\u00e7\u00f5es de Estudo</h3>
                <button class="dialog-close-btn" onclick="closeStudyConfigDialog()">\u00d7</button>
            </div>
            <div class="dialog-body">
                <div class="dialog-scroll">
                    <div class="study-config-grid" id="studyConfigBody">
                    </div>
                </div>
            </div>
        </div>
    </dialog>`;
}

// ============================================================
//  INJECAO DO MODAL NO DOM
// ============================================================
function injectSettingsModalIfNeeded() {
    if (document.getElementById('settings-modal')) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = getSettingsModalHTML();
    while (wrapper.children.length > 0) {
        document.body.appendChild(wrapper.children[0]);
    }
}

// ============================================================
//  OVERRIDE: openSettingsModal — injeta antes de abrir
// ============================================================
const _origOpenSettingsModal = window.openSettingsModal;
window.openSettingsModal = function() {
    injectSettingsModalIfNeeded();
    _origOpenSettingsModal();
};

// ============================================================
//  Carrega config de estudo ao iniciar
// ============================================================
loadStudyConfig();

// ============================================================
//  EXPORTACOES GLOBAIS
// ============================================================
window.studyConfig            = studyConfig;
window.loadStudyConfig        = loadStudyConfig;
window.saveStudyConfig        = saveStudyConfig;
window.openStudyConfigDialog  = openStudyConfigDialog;
window.closeStudyConfigDialog = closeStudyConfigDialog;
window.renderStudyConfigDialog = renderStudyConfigDialog;
window.applyPomoPreset        = applyPomoPreset;
window.applyTimerSize         = applyTimerSize;
window.clearStudyHistory      = clearStudyHistory;
