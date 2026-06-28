// @ts-nocheck

function renderReviewPage() {
    const loading = document.getElementById('auth-loading');
    if (loading) loading.style.display = 'none';
    const wrapper = document.getElementById('review-content');
    if (wrapper) wrapper.style.display = '';
    const contentDiv = document.getElementById('review-page-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="review-stats-bar" id="reviewStatsBar"></div>
            <div class="review-toolbar">
                <div class="toolbar-row">
                    <div class="toolbar-search">
                        <input type="text" id="reviewSearchInput" placeholder="🔍 Buscar blocos..." oninput="window.applyReviewFilters()" autocomplete="off">
                    </div>
                    <div class="toolbar-filters">
                        <select id="reviewFilterStatus" onchange="window.applyReviewFilters()">
                            <option value="all">Todos</option>
                            <option value="due">🔶 A Revisar</option>
                            <option value="overdue">🔴 Atrasado</option>
                            <option value="pending">⏳ Pendente</option>
                            <option value="completed">✅ Completado</option>
                        </select>
                        <select id="reviewFilterMateria" onchange="window.applyReviewFilters()">
                            <option value="all">Todas matérias</option>
                        </select>
                        <select id="reviewSortOrder" onchange="window.applyReviewFilters()">
                            <option value="nextReview-asc">📅 Próxima revisão ↑</option>
                            <option value="nextReview-desc">📅 Próxima revisão ↓</option>
                            <option value="materia-asc">📖 Matéria A-Z</option>
                            <option value="materia-desc">📖 Matéria Z-A</option>
                            <option value="created-desc">🆕 Criado (recente)</option>
                            <option value="created-asc">🕐 Criado (antigo)</option>
                        </select>
                    </div>
                </div>
                <div class="review-settings-row" id="reviewSettingsRow"></div>
            </div>
            <div class="study-blocks-list-section bento-card">
                <h2>Seus Blocos de Estudo</h2>
                <div id="studyBlocksList" class="study-blocks-list"></div>
            </div>
        `;
        window.renderReviewSettingsRow();
    }
    window.populateMateriaFilter();
    window.updateReviewStats();
    window.renderStudyBlocksList();
}

function renderReviewSettingsRow() {
    const row = document.getElementById('reviewSettingsRow');
    if (!row) return;

    const active = window.getActiveReviewSettings();
    const isCustom = active.id === 'custom';

    row.innerHTML = `
        <div class="settings-row-controls">
            <button type="button" class="preset-select-wrapper" onclick="window.openReviewSettingsDialog()">
                <span class="settings-label">⚙️ Revisão</span>
                <span class="preset-current">${window.escapeHtml(active.name)} (${active.intervals.join(', ')}d)</span>
                <span class="preset-arrow">▾</span>
            </button>
            <div id="customSettingsInline" class="custom-settings-inline" ${!isCustom ? 'style="display:none"' : ''}>
                <input type="text" id="customIntervalsInput" placeholder="Intervalos (ex: 7, 15, 30)" value="${isCustom ? active.intervals.join(', ') : ''}" autocomplete="off">
            </div>
            <button class="btn-theme settings-ok-btn" onclick="window.applyReviewSettings()">OK</button>
        </div>
    `;
}

function applyReviewSettings() {
    const intervalsInput = document.getElementById('customIntervalsInput');
    const intervalsStr = (intervalsInput?.value || '').trim();
    const intervals = intervalsStr.split(/[,\s]+/).map(Number).filter(n => !isNaN(n) && n > 0);
    if (intervals.length === 0) {
        window.toast?.('Digite pelo menos um intervalo válido (ex: 7, 15, 30).', true);
        return;
    }
    intervals.sort((a, b) => a - b);
    const setting = {
        id: 'custom',
        name: '✏️ Personalizar',
        intervals: intervals
    };
    window.state.activeReviewSetting = setting;
    window.saveState();
    window.toast?.(`✅ Revisão: ${setting.name}`);
    window.renderReviewSettingsRow();
}

function applyReviewFilters() {
    window.updateReviewStats();
    window.renderStudyBlocksList();
}

function populateMateriaFilter() {
    const select = document.getElementById('reviewFilterMateria');
    if (!select) return;
    const materias = [...new Set((window.state.studyBlocks || []).map(b => b.materia))].sort();
    const currentVal = select.value;
    select.innerHTML = '<option value="all">Todas matérias</option>' +
        materias.map(m => `<option value="${window.escapeHtml(m)}">${window.escapeHtml(m)}</option>`).join('');
    if (currentVal !== 'all') select.value = currentVal;
}

function updateReviewStats() {
    const bar = document.getElementById('reviewStatsBar');
    if (!bar) return;
    const blocks = window.state.studyBlocks || [];
    const overdue = blocks.filter(b => b.status === 'overdue').length;
    const due = blocks.filter(b => b.status === 'due').length;
    const pending = blocks.filter(b => b.status === 'pending').length;
    const completed = blocks.filter(b => b.status === 'completed').length;
    bar.innerHTML = `
        <span class="stat-item stat-overdue">🔴 ${overdue} atrasado${overdue !== 1 ? 's' : ''}</span>
        <span class="stat-item stat-due">🟠 ${due} para revisar</span>
        <span class="stat-item stat-pending">⏳ ${pending} pendente${pending !== 1 ? 's' : ''}</span>
        <span class="stat-item stat-done">✅ ${completed} completo${completed !== 1 ? 's' : ''}</span>
        <span class="stat-item stat-total">📦 ${blocks.length} total</span>
    `;
}

function openAddBlockDialog() {
    const dialog = document.getElementById('add-block-dialog');
    if (!dialog) return;
    dialog.showModal();
    document.getElementById('materiaInput').focus();
    const materiaInput = document.getElementById('materiaInput');
    materiaInput.addEventListener('input', updateColorBasedOnMateria);
    updateColorBasedOnMateria();
}

function closeAddBlockDialog() {
    const dialog = document.getElementById('add-block-dialog');
    if (!dialog) return;
    dialog.close();
    const materiaInput = document.getElementById('materiaInput');
    materiaInput.removeEventListener('input', updateColorBasedOnMateria);
    materiaInput.value = '';
    document.getElementById('topicoInput').value = '';
    document.getElementById('conteudoInput').value = '';
    document.getElementById('blockColorInput').value = '#6a6a6a';
}

function updateColorBasedOnMateria() {
    const materiaInput = document.getElementById('materiaInput');
    const blockColorInput = document.getElementById('blockColorInput');
    const materia = materiaInput.value.trim();

    if (materia) {
        const existingBlock = window.state.studyBlocks.find(b => b.materia.toLowerCase() === materia.toLowerCase());
        if (existingBlock && existingBlock.color) {
            blockColorInput.value = existingBlock.color;
        } else {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            blockColorInput.value = randomColor;
        }
    } else {
        blockColorInput.value = '#6a6a6a';
    }
}

function addStudyBlock() {
    const materiaInput = document.getElementById('materiaInput');
    const topicoInput = document.getElementById('topicoInput');
    const conteudoInput = document.getElementById('conteudoInput');
    const blockColorInput = document.getElementById('blockColorInput');

    const materia = materiaInput.value.trim();
    const topico = topicoInput.value.trim();
    const conteudo = conteudoInput.value.trim();
    const color = blockColorInput.value;

    if (!materia || !topico || !conteudo) {
        window.toast?.('Por favor, preencha todos os campos obrigatórios.', true);
        return;
    }

    const settings = window.getActiveReviewSettings();
    const intervals = settings.intervals;
    const firstInterval = intervals[0] || 1;
    const now = Date.now();
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + firstInterval);

    const newBlock = {
        id: crypto.randomUUID(),
        userId: window.currentUser?.uid || 'guest',
        materia: materia,
        topico: topico,
        conteudo: conteudo,
        createdAt: now,
        lastReviewDate: now,
        nextReviewDate: nextDate.getTime(),
        status: 'pending',
        currentIntervalIndex: 0,
        repetition: 0,
        color: color
    };

    window.state.studyBlocks.push(newBlock);
    if (!window.isGuestMode && window.currentUser && window.saveStudyBlock) {
        window.saveStudyBlock(window.currentUser.uid, newBlock);
    }
    window.saveState();
    window.generateReviewNotif?.();

    window.toast?.('Bloco de estudo adicionado!');
    window.closeAddBlockDialog();
    window.renderStudyBlocksList();
    window.populateMateriaFilter();
}

function renderStudyBlocksList() {
    const listDiv = document.getElementById('studyBlocksList');
    if (!listDiv) return;

    const allBlocks = window.state.studyBlocks || [];

    // Filtros
    const searchTerm = (document.getElementById('reviewSearchInput')?.value || '').toLowerCase().trim();
    const filterStatus = document.getElementById('reviewFilterStatus')?.value || 'all';
    const filterMateria = document.getElementById('reviewFilterMateria')?.value || 'all';
    const sortOrder = document.getElementById('reviewSortOrder')?.value || 'nextReview-asc';

    let blocks = [...allBlocks];

    // Aplicar busca
    if (searchTerm) {
        blocks = blocks.filter(b =>
            b.materia.toLowerCase().includes(searchTerm) ||
            b.topico.toLowerCase().includes(searchTerm) ||
            b.conteudo.toLowerCase().includes(searchTerm)
        );
    }

    // Aplicar filtro de status
    if (filterStatus !== 'all') {
        blocks = blocks.filter(b => b.status === filterStatus);
    }

    // Aplicar filtro de matéria
    if (filterMateria !== 'all') {
        blocks = blocks.filter(b => b.materia === filterMateria);
    }

    // Aplicar ordenação
    blocks.sort((a, b) => {
        switch (sortOrder) {
            case 'nextReview-asc': return (a.nextReviewDate || 0) - (b.nextReviewDate || 0);
            case 'nextReview-desc': return (b.nextReviewDate || 0) - (a.nextReviewDate || 0);
            case 'materia-asc': return (a.materia || '').localeCompare(b.materia || '');
            case 'materia-desc': return (b.materia || '').localeCompare(a.materia || '');
            case 'created-desc': return (b.createdAt || 0) - (a.createdAt || 0);
            case 'created-asc': return (a.createdAt || 0) - (b.createdAt || 0);
            default: return 0;
        }
    });

    // Renderizar
    const settings = window.getActiveReviewSettings();
    const settingsName = settings ? settings.name : 'Mensal';

    const addBlockButton = `
        <button class="study-block-item add-block-button" onclick="window.openAddBlockDialog()">
            <i class="fas fa-plus"></i>
            <span>Adicionar Novo Bloco</span>
        </button>
    `;

    if (blocks.length === 0) {
        const msg = allBlocks.length === 0
            ? '<div class="review-empty-state">Nenhum bloco de estudo adicionado ainda. Clique no + para começar!</div>'
            : '<div class="review-empty-state">Nenhum bloco encontrado com os filtros atuais.</div>';
        listDiv.innerHTML = msg + addBlockButton;
        return;
    }

    const blockItemsHtml = blocks.map(block => {
        const reviewBtnDisabled = block.status === 'completed' ? 'disabled' : '';
        const borderStyle = block.status === 'pending'
            ? ` style="border-left: 5px solid ${window.escapeHtml(block.color || 'var(--accent)')};"`
            : '';
        return `
            <div class="study-block-item status-${block.status}"${borderStyle}>
                <div class="block-header">
                    <h3>${window.escapeHtml(block.materia)}: ${window.escapeHtml(block.topico)}</h3>
                </div>
                <p>${window.escapeHtml(block.conteudo)}</p>
                <div class="block-meta">
                    <span class="block-settings-badge">${settingsName}</span>
                    <small>Próx: ${new Date(block.nextReviewDate).toLocaleDateString('pt-BR')}</small>
                </div>
                <div class="block-actions">
                    <button class="btn-theme review-btn ${reviewBtnDisabled ? 'completed-btn' : ''}" onclick="window.openReviewBlockDialog('${block.id}')" ${reviewBtnDisabled}>
                        ${block.status === 'completed' ? '✅ Revisado' : '🔁 Revisar'}
                    </button>
                    <button class="btn-theme delete-block-btn" onclick="window.deleteStudyBlockById('${block.id}')">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    listDiv.innerHTML = blockItemsHtml + addBlockButton;
}

// ================================================================
//  AÇÕES DE REVISÃO DOS BLOCOS
// ================================================================

function openReviewBlockDialog(blockId) {
    window._reviewBlockId = blockId;
    const block = (window.state.studyBlocks || []).find(b => b.id === blockId);
    if (!block) return;

    document.getElementById('reviewBlockTitle').textContent =
        `${block.materia}: ${block.topico}`;
    document.getElementById('reviewBlockConteudo').textContent = block.conteudo;
    document.querySelectorAll('#review-feedback-dialog .difficulty-btn').forEach(btn => {
        btn.disabled = false;
    });

    const dialog = document.getElementById('review-feedback-dialog');
    if (dialog) dialog.showModal();
}

function submitReviewFeedback(difficulty) {
    const blockId = window._reviewBlockId;
    if (!blockId) return;

    const blocks = window.state.studyBlocks;
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const block = blocks[blockIndex];
    const settings = window.getActiveReviewSettings();
    const intervals = settings.intervals;
    const oldIntervalIndex = block.currentIntervalIndex;

    // Para blocos atrasados, usa a data originalmente agendada como referência
    const referenceDate = block.status === 'overdue' ? block.nextReviewDate : undefined;
    const result = window.calculateNextReview(block, settings, difficulty, referenceDate);

    block.lastReviewDate = result.lastReviewDate;
    block.nextReviewDate = result.nextReviewDate;
    block.currentIntervalIndex = result.currentIntervalIndex;
    block.repetition = result.repetition;

    // Se o bloco já estava no último intervalo antes desta revisão, conclui permanentemente
    if (oldIntervalIndex >= intervals.length - 1) {
        block.status = 'completed';
    } else {
        block.status = result.status;
    }

    window.saveState();

    const dialog = document.getElementById('review-feedback-dialog');
    if (dialog) dialog.close();

    window._reviewBlockId = null;
    window.generateReviewNotif?.();
    window.renderStudyBlocksList();

    const feedbackLabel = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
    window.toast?.(`✅ Revisão registrada! (${feedbackLabel[difficulty]})`, false, 3000);
}

function closeReviewFeedbackDialog() {
    const dialog = document.getElementById('review-feedback-dialog');
    if (dialog) dialog.close();
    window._reviewBlockId = null;
}

function deleteStudyBlockById(blockId) {
    if (!confirm('Tem certeza que deseja excluir este bloco de estudo?')) return;

    window.state.studyBlocks = (window.state.studyBlocks || []).filter(b => b.id !== blockId);

    if (!window.isGuestMode && window.currentUser && window.deleteStudyBlock) {
        window.deleteStudyBlock(window.currentUser.uid, blockId);
    }
    window.saveState();
    window.generateReviewNotif?.();
    window.renderStudyBlocksList();
    window.toast?.('Bloco excluído.');
}

// ================================================================
//  EXPOSIÇÃO GLOBAL
// ================================================================

window.renderReviewPage = renderReviewPage;
window.openAddBlockDialog = openAddBlockDialog;
window.closeAddBlockDialog = closeAddBlockDialog;
window.addStudyBlock = addStudyBlock;
window.renderStudyBlocksList = renderStudyBlocksList;
window.applyReviewFilters = applyReviewFilters;
window.populateMateriaFilter = populateMateriaFilter;
window.updateReviewStats = updateReviewStats;
window.renderReviewSettingsRow = renderReviewSettingsRow;
window.applyReviewSettings = applyReviewSettings;

window.openReviewBlockDialog = openReviewBlockDialog;
window.closeReviewFeedbackDialog = closeReviewFeedbackDialog;
window.submitReviewFeedback = submitReviewFeedback;
window.deleteStudyBlockById = deleteStudyBlockById;

document.addEventListener('DOMContentLoaded', () => {
    if (window.isReviewPage?.()) {
        if (!window.currentUser && (!window.state.studyBlocks || window.state.studyBlocks.length === 0)) {
            window.loadGuestState();
        }
        if (window.updateBlocksStatus) window.updateBlocksStatus();
        window.generateReviewNotif?.();
        window.renderReviewPage();
    }
});
