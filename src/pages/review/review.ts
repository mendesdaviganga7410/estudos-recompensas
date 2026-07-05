// @ts-nocheck

let _reviewSortReversed = false;

function renderReviewPage() {
    const loading = document.getElementById('auth-loading');
    if (loading) loading.style.display = 'none';
    const wrapper = document.getElementById('review-content');
    if (wrapper) wrapper.style.display = '';
    const contentDiv = document.getElementById('review-page-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="bento-layout">
                <div class="bento-card col-span-3">
                    <div class="status-header-block">
                        <div>
                            <span class="bento-label">📊 Revisão</span>
                        </div>
                        <div id="reviewSettingsHeader"></div>
                    </div>
                    <div class="status-metrics">
                        <div class="status-metrics-row" id="reviewStatsRow">
                            <div class="metric-block">
                                <span class="bento-label">🔴 Atrasados</span>
                                <span class="bento-title stat-overdue" id="rs-overdue">0</span>
                            </div>
                            <div class="metric-block">
                                <span class="bento-label">🟠 Revisar</span>
                                <span class="bento-title stat-due" id="rs-due">0</span>
                            </div>
                            <div class="metric-block">
                                <span class="bento-label">⏳ Pendentes</span>
                                <span class="bento-title" id="rs-pending">0</span>
                            </div>
                            <div class="metric-block">
                                <span class="bento-label">✅ Completos</span>
                                <span class="bento-title stat-done" id="rs-completed">0</span>
                            </div>
                            <div class="metric-block">
                                <span class="bento-label">📦 Total</span>
                                <span class="bento-title" id="rs-total">0</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bento-card col-span-3">
                    <div class="toolbar-row">
                        <div class="toolbar-search">
                            <input type="text" id="reviewSearchInput" placeholder="🔍 Buscar blocos..." oninput="window.applyReviewFilters()" autocomplete="off">
                        </div>
                        <div class="toolbar-filters">
                            <select id="reviewFilterStatus" onchange="window.applyReviewFilters()">
                                <option value="all">📋 Todos</option>
                                <option value="due">🔶 A Revisar</option>
                                <option value="overdue">🔴 Atrasado</option>
                                <option value="pending">⏳ Pendente</option>
                                <option value="completed">✅ Completado</option>
                            </select>
                            <select id="reviewFilterMateria" onchange="window.applyReviewFilters()">
                                <option value="all">📖 Todas</option>
                            </select>
                            <select id="reviewSortOrder" onchange="window.applyReviewFilters()">
                                <option value="nextReview">📅 Data</option>
                                <option value="materia">📖 Matéria</option>
                                <option value="created">🆕 Criação</option>
                            </select>
                            <button class="btn-theme" id="reviewSortToggle" onclick="window.reverseReviewSort()" title="Alternar ordem" style="width:auto;padding:0.65rem 0.85rem;font-size:0.85rem;">↕ <span id="reviewSortDir">↑</span></button>
                        </div>
                    </div>
                </div>
                <div class="bento-card col-span-3">
                    <div style="display:flex;align-items:center;justify-content:space-between;">
                        <h2 style="margin:0;">Seus Blocos de Estudo</h2>
                        <button class="btn-theme" onclick="window.openAddBlockDialog()" style="width:auto;">➕ Adicionar</button>
                    </div>
                    <div id="studyBlocksList" class="study-blocks-list"></div>
                </div>
            </div>
        `;
        window.renderReviewSettingsRow();
    }
    window.populateMateriaFilter();
    window.updateReviewStats();
    window.renderStudyBlocksList();
}

function reverseReviewSort() {
    _reviewSortReversed = !_reviewSortReversed;
    const dir = document.getElementById('reviewSortDir');
    if (dir) dir.textContent = _reviewSortReversed ? '↓' : '↑';
    window.applyReviewFilters();
}

function renderReviewSettingsRow() {
    const header = document.getElementById('reviewSettingsHeader');
    if (!header) return;

    const active = window.getActiveReviewSettings();

    header.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.15rem;">
            <span class="bento-label" style="margin:0;">⚙️ Revisão Ativa</span>
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <span class="theme-pill" style="font-size:0.75rem;font-weight:800;padding:0.2rem 0.6rem;">${active.intervals.join(', ')}d</span>
                <button class="btn-theme" onclick="window.openReviewSettingsDialog()" style="width:auto;padding:0.2rem 0.55rem;font-size:0.7rem;background:var(--panel);color:var(--muted);border-width:2px;box-shadow:2px 2px 0px var(--shadow-color);">Trocar</button>
            </div>
        </div>
    `;
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
    const blocks = window.state.studyBlocks || [];
    const overdue = blocks.filter(b => b.status === 'overdue').length;
    const due = blocks.filter(b => b.status === 'due').length;
    const pending = blocks.filter(b => b.status === 'pending').length;
    const completed = blocks.filter(b => b.status === 'completed').length;
    const e = (id) => document.getElementById(id);
    if (e('rs-overdue')) e('rs-overdue').textContent = overdue;
    if (e('rs-due')) e('rs-due').textContent = due;
    if (e('rs-pending')) e('rs-pending').textContent = pending;
    if (e('rs-completed')) e('rs-completed').textContent = completed;
    if (e('rs-total')) e('rs-total').textContent = blocks.length;
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
        const sortField = sortOrder;
        const dir = _reviewSortReversed ? -1 : 1;
        if (sortField === 'materia') return dir * (a.materia || '').localeCompare(b.materia || '');
        if (sortField === 'created') return dir * ((a.createdAt || 0) - (b.createdAt || 0));
        return dir * ((a.nextReviewDate || 0) - (b.nextReviewDate || 0));
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
window.reverseReviewSort = reverseReviewSort;

window.openReviewBlockDialog = openReviewBlockDialog;
window.closeReviewFeedbackDialog = closeReviewFeedbackDialog;
window.submitReviewFeedback = submitReviewFeedback;
window.deleteStudyBlockById = deleteStudyBlockById;

document.addEventListener('DOMContentLoaded', () => {
    if (window.isReviewPage?.()) {
        // Loading permanece visível até auth resolver
        // A renderização acontece via handleAuthRouting() após auth resolver,
        // consistente com as demais páginas (panel, hub, etc.)
    }
});
