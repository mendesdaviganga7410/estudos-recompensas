const _id = (id: string) => document.getElementById(id);

let _flashcardStudyQueue: Flashcard[] = [];
let _flashcardStudyIndex = 0;
let _flashcardFlipped = false;
let _editingFlashcardId: string | null = null;

function _generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function renderFlashcardsPage() {
    const loading = _id('auth-loading');
    if (loading) loading.style.display = 'none';
    const wrapper = _id('flashcards-content');
    if (wrapper) wrapper.style.display = '';
    const contentDiv = _id('flashcards-page-content');
    if (!contentDiv) return;

    const list = window.state.flashcards || [];
    const materias = [...new Set(list.map(f => f.materia).filter(Boolean))] as string[];

    contentDiv.innerHTML = `
        <div class="bento-layout">
            <div class="bento-card col-span-3">
                <div class="status-header-block">
                    <div>
                        <span class="bento-label">🃏 Flashcards</span>
                    </div>
                    <div style="display:flex;gap:0.5rem;">
                        <button class="btn-theme" onclick="window.exportFlashcardTemplate()" style="padding:0.3rem 0.7rem;font-size:0.75rem;width:auto;">📤 Exportar Template</button>
                        <button class="btn-theme" onclick="document.getElementById('flashcardImportInput').click()" style="padding:0.3rem 0.7rem;font-size:0.75rem;width:auto;">📥 Importar</button>
                        <input type="file" id="flashcardImportInput" accept=".json,.csv" style="display:none;" onchange="window.importFlashcards(event)">
                    </div>
                </div>
                <div class="status-metrics">
                    <div class="status-metrics-row">
                        <div class="metric-block">
                            <span class="bento-label">📦 Total</span>
                            <span class="bento-title" id="fc-total">${list.length}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bento-card col-span-3">
                <div class="toolbar-row">
                    <div class="toolbar-search">
                        <input type="text" id="fcSearchInput" placeholder="🔍 Buscar flashcards..." oninput="window.filterFlashcards()" autocomplete="off">
                    </div>
                    <div class="toolbar-filters">
                        <select id="fcFilterMateria" onchange="window.filterFlashcards()">
                            <option value="all">📖 Todas</option>
                            ${materias.map(m => `<option value="${m}">${m}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn-theme" onclick="window.openAddFlashcardDialog()" style="padding:0.3rem 0.7rem;font-size:0.75rem;white-space:nowrap;">➕ Adicionar</button>
                </div>
            </div>
            <div class="bento-card col-span-3">
                <div class="status-header-block">
                    <span class="bento-label">📇 Seus Flashcards</span>
                </div>
                <div id="fcGridContainer"></div>
            </div>
        </div>
    `;

    renderFlashcardGrid();
}

function renderFlashcardGrid() {
    const container = _id('fcGridContainer');
    if (!container) return;
    const list = window.state.flashcards || [];
    if (list.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:2rem 1rem;color:var(--muted);">
                <p style="font-size:1.2rem;margin-bottom:0.5rem;">📭 Nenhum flashcard ainda</p>
                <p style="font-size:0.85rem;">Clique em <strong>Adicionar</strong> para criar seu primeiro flashcard, ou use <strong>Importar</strong> para carregar um arquivo JSON ou CSV.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="flashcard-grid">
            ${list.map(fc => {
                const color = fc.color || 'var(--accent)';
                return `
                    <div class="flashcard-item" onclick="window.openFlashcardStudy('${fc.id}')">
                        <div class="flashcard-color-bar" style="background:${color};"></div>
                        <div class="flashcard-front">${window.escapeHtml ? window.escapeHtml(fc.front) : fc.front}</div>
                        ${fc.materia ? `<span class="flashcard-materia-tag">${fc.materia}</span>` : ''}
                        <div class="flashcard-actions">
                            <button onclick="event.stopPropagation();window.openAddFlashcardDialog('${fc.id}')" title="Editar">✏️</button>
                            <button onclick="event.stopPropagation();window.deleteFlashcard('${fc.id}')" title="Excluir">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function openAddFlashcardDialog(editId?: string) {
    _editingFlashcardId = editId || null;
    const dialog = _id('add-flashcard-dialog') as HTMLDialogElement | null;
    if (!dialog) return;

    const title = _id('add-flashcard-dialog')?.querySelector('h3');
    if (title) title.textContent = editId ? '✏️ Editar Flashcard' : '➕ Novo Flashcard';

    const frontInput = _id('flashcardFrontInput') as HTMLTextAreaElement | null;
    const backInput = _id('flashcardBackInput') as HTMLTextAreaElement | null;
    const materiaInput = _id('flashcardMateriaInput') as HTMLInputElement | null;
    const colorInput = _id('flashcardColorInput') as HTMLInputElement | null;

    if (editId) {
        const fc = (window.state.flashcards || []).find(f => f.id === editId);
        if (fc) {
            if (frontInput) frontInput.value = fc.front;
            if (backInput) backInput.value = fc.back;
            if (materiaInput) materiaInput.value = fc.materia || '';
            if (colorInput) colorInput.value = fc.color || '#6a6a6a';
        }
    } else {
        if (frontInput) frontInput.value = '';
        if (backInput) backInput.value = '';
        if (materiaInput) materiaInput.value = '';
        if (colorInput) colorInput.value = '#6a6a6a';
    }

    dialog.showModal();
}

function closeAddFlashcardDialog() {
    const dialog = _id('add-flashcard-dialog') as HTMLDialogElement | null;
    if (dialog) dialog.close();
    _editingFlashcardId = null;
}

function addFlashcard() {
    const frontInput = _id('flashcardFrontInput') as HTMLTextAreaElement | null;
    const backInput = _id('flashcardBackInput') as HTMLTextAreaElement | null;
    const materiaInput = _id('flashcardMateriaInput') as HTMLInputElement | null;
    const colorInput = _id('flashcardColorInput') as HTMLInputElement | null;

    const front = frontInput?.value.trim() || '';
    const back = backInput?.value.trim() || '';

    if (!front || !back) {
        window.toast?.('Preencha a frente e o verso do flashcard.', true);
        return;
    }

    const list = window.state.flashcards || [];

    if (_editingFlashcardId) {
        const idx = list.findIndex(f => f.id === _editingFlashcardId);
        if (idx !== -1) {
            list[idx].front = front;
            list[idx].back = back;
            list[idx].materia = materiaInput?.value.trim() || '';
            list[idx].color = colorInput?.value || '#6a6a6a';
        }
        window.toast?.('✅ Flashcard atualizado!');
    } else {
        list.push({
            id: _generateId(),
            front,
            back,
            materia: materiaInput?.value.trim() || '',
            color: colorInput?.value || '#6a6a6a',
            createdAt: Date.now()
        });
        window.toast?.('✅ Flashcard adicionado!');
    }

    window.saveState?.();
    closeAddFlashcardDialog();
    renderFlashcardGrid();
    renderFlashcardsPage();
}

function deleteFlashcard(id: string) {
    if (!confirm('Excluir este flashcard?')) return;
    const list = window.state.flashcards || [];
    const idx = list.findIndex(f => f.id === id);
    if (idx !== -1) {
        list.splice(idx, 1);
        window.saveState?.();
        renderFlashcardGrid();
        renderFlashcardsPage();
        window.toast?.('🗑️ Flashcard excluído.');
    }
}

function openFlashcardStudy(flashcardId?: string) {
    const list = window.state.flashcards || [];
    if (flashcardId) {
        const idx = list.findIndex(f => f.id === flashcardId);
        if (idx === -1) return;
        _flashcardStudyQueue = list.slice(idx).concat(list.slice(0, idx));
    } else {
        _flashcardStudyQueue = [...list];
    }
    if (_flashcardStudyQueue.length === 0) {
        window.toast?.('Nenhum flashcard para estudar.', true);
        return;
    }
    _flashcardStudyIndex = 0;
    _flashcardFlipped = false;
    _renderStudyCard();
    const dialog = _id('flashcard-study-dialog') as HTMLDialogElement | null;
    if (dialog) dialog.showModal();
}

function closeFlashcardStudy() {
    const dialog = _id('flashcard-study-dialog') as HTMLDialogElement | null;
    if (dialog) dialog.close();
    _flashcardStudyQueue = [];
}

function flipFlashcard() {
    _flashcardFlipped = !_flashcardFlipped;
    _renderStudyCard();
}

function nextFlashcardStudy() {
    _flashcardStudyIndex++;
    if (_flashcardStudyIndex >= _flashcardStudyQueue.length) {
        const content = _id('flashcardStudyContent');
        if (content) content.innerHTML = '<p style="font-size:1.5rem;font-weight:900;">🎉 Todos os flashcards revisados!</p>';
        const flipBtn = _id('flashcardFlipBtn') as HTMLElement | null;
        const nextBtn = _id('flashcardNextBtn') as HTMLElement | null;
        if (flipBtn) flipBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    _flashcardFlipped = false;
    _renderStudyCard();
}

function _renderStudyCard() {
    const content = _id('flashcardStudyContent');
    const flipBtn = _id('flashcardFlipBtn') as HTMLElement | null;
    const nextBtn = _id('flashcardNextBtn') as HTMLElement | null;
    if (!content) return;

    const fc = _flashcardStudyQueue[_flashcardStudyIndex];
    if (!fc) return;

    const total = _flashcardStudyQueue.length;
    const current = _flashcardStudyIndex + 1;

    if (flipBtn) flipBtn.style.display = '';
    if (nextBtn) nextBtn.style.display = 'none';

    if (!_flashcardFlipped) {
        content.innerHTML = `
            <span style="font-size:0.7rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;">${current} / ${total}</span>
            <div class="flashcard-study-front">${window.escapeHtml ? window.escapeHtml(fc.front) : fc.front}</div>
            ${fc.materia ? `<span class="flashcard-materia-tag" style="margin-top:0.5rem;">${fc.materia}</span>` : ''}
        `;
    } else {
        content.innerHTML = `
            <span style="font-size:0.7rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;">${current} / ${total}</span>
            <div class="flashcard-study-front">${window.escapeHtml ? window.escapeHtml(fc.front) : fc.front}</div>
            <div class="flashcard-study-back">${window.escapeHtml ? window.escapeHtml(fc.back) : fc.back}</div>
            ${fc.materia ? `<span class="flashcard-materia-tag" style="margin-top:0.5rem;">${fc.materia}</span>` : ''}
        `;
        if (nextBtn) nextBtn.style.display = '';
    }
}

function importFlashcards(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = () => {
        const text = reader.result as string;
        let imported: { front: string; back: string; materia?: string }[] = [];

        try {
            if (ext === 'json') {
                const parsed = JSON.parse(text);
                if (!Array.isArray(parsed)) throw new Error('JSON deve ser um array');
                imported = parsed.map((item: any) => ({
                    front: String(item.front || item.frente || item.Frente || item.pergunta || ''),
                    back: String(item.back || item.verso || item.Verso || item.resposta || ''),
                    materia: item.materia || item.Materia || item.tag || ''
                }));
            } else if (ext === 'csv') {
                const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
                const start = lines[0]?.toLowerCase().includes('frente') || lines[0]?.toLowerCase().includes('front') ? 1 : 0;
                for (let i = start; i < lines.length; i++) {
                    const parts = lines[i].split(',').map(p => p.trim().replace(/^"(.*)"$/, '$1'));
                    if (parts.length >= 2) {
                        imported.push({
                            front: parts[0],
                            back: parts[1],
                            materia: parts[2] || ''
                        });
                    }
                }
            } else {
                window.toast?.('Formato não suportado. Use .json ou .csv.', true);
                return;
            }
        } catch (err) {
            window.toast?.('Erro ao ler arquivo. Verifique o formato.', true);
            console.error('Import error:', err);
            return;
        }

        if (imported.length === 0) {
            window.toast?.('Nenhum flashcard encontrado no arquivo.', true);
            return;
        }

        const list = window.state.flashcards || [];
        imported.forEach(item => {
            if (item.front && item.back) {
                list.push({
                    id: _generateId(),
                    front: item.front,
                    back: item.back,
                    materia: item.materia || '',
                    color: '#6a6a6a',
                    createdAt: Date.now()
                });
            }
        });

        window.saveState?.();
        renderFlashcardGrid();
        renderFlashcardsPage();
        window.toast?.(`✅ ${imported.length} flashcards importados!`);
    };

    reader.readAsText(file);
    input.value = '';
}

function exportFlashcardTemplate() {
    const sample = [
        { front: 'Qual a capital do Brasil?', back: 'Brasília', materia: 'Geografia' },
        { front: 'O que é HTML?', back: 'HyperText Markup Language', materia: 'Programação' }
    ];
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards-template.json';
    a.click();
    URL.revokeObjectURL(url);
    window.toast?.(`📤 Template exportado: ${sample.length} flashcards de exemplo.`);
}

function filterFlashcards() {
    const search = (_id('fcSearchInput') as HTMLInputElement | null)?.value.toLowerCase() || '';
    const materia = (_id('fcFilterMateria') as HTMLSelectElement | null)?.value || 'all';

    const list = window.state.flashcards || [];
    const filtered = list.filter(fc => {
        if (search && !fc.front.toLowerCase().includes(search) && !(fc.back || '').toLowerCase().includes(search)) return false;
        if (materia !== 'all' && fc.materia !== materia) return false;
        return true;
    });

    const container = _id('fcGridContainer');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:2rem 1rem;color:var(--muted);"><p>🔍 Nenhum flashcard encontrado.</p></div>`;
        return;
    }

    container.innerHTML = `
        <div class="flashcard-grid">
            ${filtered.map(fc => {
                const color = fc.color || 'var(--accent)';
                return `
                    <div class="flashcard-item" onclick="window.openFlashcardStudy('${fc.id}')">
                        <div class="flashcard-color-bar" style="background:${color};"></div>
                        <div class="flashcard-front">${window.escapeHtml ? window.escapeHtml(fc.front) : fc.front}</div>
                        ${fc.materia ? `<span class="flashcard-materia-tag">${fc.materia}</span>` : ''}
                        <div class="flashcard-actions">
                            <button onclick="event.stopPropagation();window.openAddFlashcardDialog('${fc.id}')" title="Editar">✏️</button>
                            <button onclick="event.stopPropagation();window.deleteFlashcard('${fc.id}')" title="Excluir">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    const totalEl = _id('fc-total');
    if (totalEl) totalEl.textContent = String(filtered.length);
}

window.renderFlashcardsPage = renderFlashcardsPage;
window.renderFlashcardGrid = renderFlashcardGrid;
window.openAddFlashcardDialog = openAddFlashcardDialog;
window.closeAddFlashcardDialog = closeAddFlashcardDialog;
window.addFlashcard = addFlashcard;
window.deleteFlashcard = deleteFlashcard;
window.openFlashcardStudy = openFlashcardStudy;
window.closeFlashcardStudy = closeFlashcardStudy;
window.flipFlashcard = flipFlashcard;
window.nextFlashcardStudy = nextFlashcardStudy;
window.importFlashcards = importFlashcards;
window.exportFlashcardTemplate = exportFlashcardTemplate;
window.filterFlashcards = filterFlashcards;
