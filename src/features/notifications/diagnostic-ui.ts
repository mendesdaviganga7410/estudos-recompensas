// @ts-nocheck
const $n = id => document.getElementById(id);

let __diagStep = 0;
let __diagAnswers = {};
let _visibleQuestions = [];

function getDefaultVisible() {
    return DIAGNOSTIC_QUESTIONS.filter(q =>
        q.id === "focusAreas" || q.track === "global"
    );
}

function recalcVisibleQuestions() {
    const areas = Array.isArray(__diagAnswers.focusAreas) ? __diagAnswers.focusAreas : [];
    _visibleQuestions = DIAGNOSTIC_QUESTIONS.filter(q => {
        if (q.id === "focusAreas" || q.track === "global") return true;
        if (typeof q.track === "string") return areas.includes(q.track);
        if (Array.isArray(q.track)) return q.track.some(t => areas.includes(t));
        return true;
    });
}

function resolveOptions(q) {
    if (!q.dependsOn) return q.options;
    const parentAnswer = __diagAnswers[q.dependsOn.field];
    if (!parentAnswer) return [{ v: "", l: "Selecione a opção anterior primeiro", i: "⚠️" }];
    const source = q.dependsOn.source === "COURSES_BY_AREA" ? COURSES_BY_AREA :
                   q.dependsOn.source === "PROFESSIONS_BY_SECTOR" ? PROFESSIONS_BY_SECTOR : null;
    return source && source[parentAnswer] ? source[parentAnswer] : q.options;
}

function hasDiagnostic() {
    if (!window.state || !window.state.diagnostic) return false;
    return window.state.diagnostic.diagnosticVersion === DIAGNOSTIC_VERSION;
}

function saveDiagnosticLocally(answers) {
    if (!window.state) return;
    window.state.diagnostic = answers;
}

function openDiagnosticDialog() {
    const existing = $n("diagnostic-dialog");
    if (existing) { existing.showModal(); return; }

    __diagStep = 0;
    __diagAnswers = {};
    _visibleQuestions = getDefaultVisible();

    const d = document.createElement("dialog");
    d.id = "diagnostic-dialog";
    d.className = "theme-bento-dialog";

    d.innerHTML = `<div class="bento-card dialog-theme-card" style="max-width:640px;">
        <div class="dialog-header-block">
            <h3>📋 Diagnóstico de Perfil</h3>
            <button class="dialog-close-btn" onclick="closeDiagnosticDialog()">×</button>
        </div>
        <div class="dialog-body" style="padding:0.75rem;">
            <p style="margin:0 0 0.75rem;line-height:1.5;color:var(--muted);font-size:0.82rem;text-align:center;font-weight:700;">
                Responda para conectar-se a outros estudantes com perfil semelhante.
                Suas respostas são <strong>confidenciais</strong>.
            </p>
            <div id="diag-progress" style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:0.75rem;"></div>
            <div id="diag-step" style="overflow-y:auto;flex:1;min-height:0;margin-bottom:0.5rem;"></div>
            <div style="display:flex;gap:0.75rem;margin-top:0.5rem;">
                <button class="btn-theme" id="diag-prev" onclick="diagPrev()" style="flex:1;">⬅ Voltar</button>
                <button class="btn-theme" id="diag-next" onclick="diagNext()" style="flex:1;">Próximo ➡</button>
            </div>
        </div>
    </div>`;

    document.body.appendChild(d);
    renderDiagStep();
    renderDiagProgress();
    d.showModal();
}

function renderDiagProgress() {
    const container = $n("diag-progress");
    if (!container) return;
    container.innerHTML = _visibleQuestions.map((q, i) =>
        `<span class="diag-dot ${i === __diagStep ? "active" : i < __diagStep ? "done" : ""}" data-i="${i}" onclick="goToStep(${i})" title="Pergunta ${i + 1}: ${q.label}" style="cursor:pointer;">${q.icon}</span>`
    ).join("");
}

function renderDiagStep() {
    const container = $n("diag-step");
    if (!container) return;

    const q = _visibleQuestions[__diagStep];
    if (!q) return;

    let html = `<div class="diag-step-header">
        <span class="diag-step-icon">${q.icon}</span>
        <div class="diag-step-meta">
            <span class="diag-step-num">PERGUNTA ${__diagStep + 1} DE ${_visibleQuestions.length}</span>
            <span class="diag-step-question">${q.label}</span>
        </div>
    </div>`;

    if (q.type === "number") {
        const saved = __diagAnswers[q.id] || "";
        html += `<div class="diag-step-options" style="flex-direction:column;align-items:center;gap:0.5rem;">
            <input class="diag-number-input" id="diag-number-input" type="number" min="${q.min}" max="${q.max}" placeholder="${q.placeholder}" value="${saved}" autofocus>
            <div class="diag-input-hint">Digite o ano com 4 dígitos (${q.min} a ${q.max})</div>
        </div>`;
    } else if (q.type === "multiselect") {
        const saved = Array.isArray(__diagAnswers[q.id]) ? __diagAnswers[q.id] : [];
        html += `<div class="diag-step-options">`;
        html += q.options.map(o => {
            const sel = saved.includes(o.v);
            return `<label class="diagnostic-option ${sel ? "selected" : ""}" data-value="${o.v}" onclick="toggleDiagOption('${q.id}','${o.v}')">
                <span class="diag-opt-icon">${o.i}</span>
                <span class="diag-opt-label">${o.l}</span>
                <span class="diag-opt-check">${sel ? "✓" : ""}</span>
            </label>`;
        }).join("");
        html += `</div>`;
        if (q.hint) html += `<div class="diag-input-hint">${q.hint}</div>`;
    } else {
        const options = resolveOptions(q);
        const saved = __diagAnswers[q.id] || "";
        html += `<div class="diag-step-options">`;
        html += options.map(o => {
            const sel = saved === o.v;
            return `<label class="diagnostic-option ${sel ? "selected" : ""}" data-value="${o.v}" onclick="selectDiagOption('${q.id}','${o.v}')">
                <span class="diag-opt-icon">${o.i}</span>
                <span class="diag-opt-label">${o.l}</span>
                <span class="diag-opt-check">${sel ? "✓" : ""}</span>
            </label>`;
        }).join("");
        html += `</div>`;
    }

    container.innerHTML = html;

    if (q.type === "number") {
        const inp = $n("diag-number-input");
        if (inp) {
            inp.addEventListener("input", () => { __diagAnswers[q.id] = inp.value; });
        }
    }

    const prev = $n("diag-prev");
    const next = $n("diag-next");
    if (prev) prev.style.display = __diagStep === 0 ? "none" : "flex";
    if (next) {
        if (__diagStep === _visibleQuestions.length - 1) {
            next.textContent = "✅ Concluir";
            next.onclick = submitDiagnostic;
        } else {
            next.textContent = "Próximo ➡";
            next.onclick = diagNext;
        }
    }

    renderDiagProgress();
}

function selectDiagOption(qid, val) {
    __diagAnswers[qid] = val;
    const options = document.querySelectorAll("#diag-step .diagnostic-option");
    options.forEach(el => {
        const isSelected = el.dataset.value === val;
        el.classList.toggle("selected", isSelected);
        const check = el.querySelector(".diag-opt-check");
        if (check) check.textContent = isSelected ? "✓" : "";
    });
}

function toggleDiagOption(qid, val) {
    if (!Array.isArray(__diagAnswers[qid])) {
        __diagAnswers[qid] = [];
    }
    const idx = __diagAnswers[qid].indexOf(val);
    if (idx >= 0) {
        __diagAnswers[qid].splice(idx, 1);
    } else {
        __diagAnswers[qid].push(val);
    }
    const options = document.querySelectorAll("#diag-step .diagnostic-option");
    const arr = __diagAnswers[qid];
    options.forEach(el => {
        const sel = arr.includes(el.dataset.value);
        el.classList.toggle("selected", sel);
        const check = el.querySelector(".diag-opt-check");
        if (check) check.textContent = sel ? "✓" : "";
    });
}

function diagNext() {
    const q = _visibleQuestions[__diagStep];
    if (!q) return;

    if (q.type === "number") {
        const val = __diagAnswers[q.id];
        if (!val || !/^\d{4}$/.test(String(val)) || Number(val) < q.min || Number(val) > q.max) {
            window.toast(`Digite um ano válido entre ${q.min} e ${q.max}.`, true);
            return;
        }
    } else if (q.type === "multiselect") {
        const arr = __diagAnswers[q.id];
        if (!Array.isArray(arr) || arr.length === 0) {
            window.toast("Selecione pelo menos uma opção.", true);
            return;
        }
        recalcVisibleQuestions();
    } else {
        if (!__diagAnswers[q.id]) {
            window.toast("Selecione uma opção antes de continuar.", true);
            return;
        }
    }

    if (__diagStep < _visibleQuestions.length - 1) {
        __diagStep++;
        renderDiagStep();
    }
}

function diagPrev() {
    if (__diagStep > 0) {
        __diagStep--;
        renderDiagStep();
    }
}

function goToStep(i) {
    if (i < 0 || i >= _visibleQuestions.length) return;
    if (i > __diagStep) {
        for (let j = __diagStep; j < i; j++) {
            const q = _visibleQuestions[j];
            if (!q) continue;
            if (q.type === "multiselect") {
                const arr = __diagAnswers[q.id];
                if (!Array.isArray(arr) || arr.length === 0) {
                    window.toast("Responda a pergunta atual antes de avançar.", true);
                    return;
                }
            } else if (q.type === "number") {
                const val = __diagAnswers[q.id];
                if (!val || !/^\d{4}$/.test(String(val)) || Number(val) < q.min || Number(val) > q.max) {
                    window.toast("Responda a pergunta atual antes de avançar.", true);
                    return;
                }
            } else {
                if (!__diagAnswers[q.id]) {
                    window.toast("Responda a pergunta atual antes de avançar.", true);
                    return;
                }
            }
        }
    }
    __diagStep = i;
    renderDiagStep();
}

function closeDiagnosticDialog() {
    const d = $n("diagnostic-dialog");
    if (d) d.close();
}

async function submitDiagnostic() {
    const q = _visibleQuestions[__diagStep];
    if (!q) return;

    for (const question of _visibleQuestions) {
        if (question.type === "multiselect") {
            const arr = __diagAnswers[question.id];
            if (!Array.isArray(arr) || arr.length === 0) {
                window.toast("Responda todas as perguntas antes de salvar.", true);
                return;
            }
        } else if (question.type === "number") {
            const val = __diagAnswers[question.id];
            if (!val || !/^\d{4}$/.test(String(val)) || Number(val) < question.min || Number(val) > question.max) {
                window.toast("Responda todas as perguntas antes de salvar.", true);
                return;
            }
        } else {
            if (!__diagAnswers[question.id]) {
                window.toast("Responda todas as perguntas antes de salvar.", true);
                return;
            }
        }
    }

    __diagAnswers.diagnosticVersion = DIAGNOSTIC_VERSION;
    saveDiagnosticLocally(__diagAnswers);
    __diagnosticAnswered = true;
    __persistentDiagNotif = null;
    closeDiagnosticDialog();
    window.toast("✅ Dados salvos com sucesso!");

    const user = window.currentUser;
    if (user && window.saveStateToFirestore) {
        window.saveStateToFirestore(user.uid, window.state, {
            diagnostic: __diagAnswers,
            diagnosticUpdatedAt: Date.now()
        }).catch(() => {});
    }

    initPersistentDiagNotif();
    markPersistentDiagSeen();
    renderNotificationBadge();
    await refreshNotifications();
    generateOneNotification();
    scheduleDiagReminder();
}
