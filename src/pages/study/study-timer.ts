// @ts-nocheck
    // ============================================================
    //  PAINEL DE CONTROLE DE TEMPO E REGISTRO DE SESSOES
    //  studyTimer — Objeto unico de gerenciamento
    //  Modos: 'simple' (cronometro livre) | 'pomodoro' (ciclos foco/descanso)
    // ============================================================
    const STORAGE_KEY = 'historico_estudos';
    // SOUND_KEY, SOUND_PRESETS, soundConfig e funcoes de som
    // foram movidos para settings-modal.ts (disponivel em todas as paginas)
    let _phasePending = null; // 'start' | 'wait' | 'skip'

    function showPhaseDialog(type) {
        const isFocusEnd = type === 'focus-end';
        const title = isFocusEnd ? '🎯 Foco Concluído!' : '☕ Descanso Concluído!';
        const actionLabel = isFocusEnd ? 'Descanso' : 'Foco';
        const skipLabel = isFocusEnd ? 'Pular Descanso' : 'Pular Foco';

        document.getElementById('phaseDialogTitle').textContent = title;
        document.getElementById('phaseBtnPrimary').innerHTML = `▶ Começar ${actionLabel}`;
        document.getElementById('phaseBtnPrimary').onclick = () => {
            document.getElementById('phase-dialog').close();
            _resolvePhase('start');
        };
        document.getElementById('phaseBtnWait').onclick = () => {
            document.getElementById('phase-dialog').close();
            _resolvePhase('wait');
        };
        document.getElementById('phaseBtnSkip').innerHTML = `⏭ ${skipLabel}`;
        document.getElementById('phaseBtnSkip').onclick = () => {
            document.getElementById('phase-dialog').close();
            _resolvePhase('skip');
        };
        document.getElementById('phase-dialog').showModal();
    }

    function closePhaseDialog() {
        document.getElementById('phase-dialog').close();
        _resolvePhase('wait');
    }

    function _resolvePhase(action) {
        _phasePending = action;
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (typeof applyTimerSize === 'function') applyTimerSize();
    });

    // ============================================================
    //  DIALOG DE SOM (usa globais SOUND_PRESETS, soundConfig,
    //  playSound, saveSoundConfig de settings-modal.ts)
    // ============================================================
    function openSoundDialog() {
        renderSoundDialog();
        document.getElementById('sound-dialog').showModal();
    }
    function closeSoundDialog() {
        document.getElementById('sound-dialog').close();
    }
    function renderSoundDialog() {
        const body = document.getElementById('soundDialogBody');
        const groups = [
            { key: 'start',    label: '▶ Iniciar' },
            { key: 'pause',    label: '⏸ Pausar' },
            { key: 'complete', label: '🎉 Concluir' },
            { key: 'alarm',    label: '🔊 Alarme' }
        ];
        body.innerHTML = groups.map(g => {
            const presets = SOUND_PRESETS[g.key];
            const active = soundConfig[g.key];
            return `
                <div class="sound-group">
                    <span class="sound-group-title">${g.label}</span>
                    <div class="sound-grid">
                        ${Object.entries(presets).map(([id, p]) => `
                            <div class="sound-option ${id === active ? 'active' : ''}" data-group="${g.key}" data-id="${id}">
                                <span>${p.name}</span>
                                <button class="preview-btn" onclick="event.stopPropagation(); playSound('${g.key}','${id}')">▶ Prévia</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
        // Clique para selecionar
        body.querySelectorAll('.sound-option').forEach(el => {
            el.addEventListener('click', function() {
                const group = this.dataset.group;
                const id = this.dataset.id;
                soundConfig[group] = id;
                saveSoundConfig();
                // Atualiza visual
                this.parentElement.querySelectorAll('.sound-option').forEach(o => o.classList.remove('active'));
                this.classList.add('active');
                // Toca preview
                playSound(group, id);
            });
        });
    }

    function toggleNotes() {
        const ta = document.getElementById('sessionNotes');
        ta.style.display = ta.style.display === 'none' ? 'block' : 'none';
    }

    const studyTimer = {
        // ---- Modo atual ----
        mode: 'simple',

        // ---- Simple Timer ----
        elapsed: 0,
        running: false,
        intervalId: null,
        startTime: null,

        // ---- Pomodoro Timer ----
        pomo: {
            config: { focusMin: 25, breakMin: 5, cycles: 4 },
            phase: 'idle',       // 'idle' | 'focus' | 'break' | 'done'
            currentCycle: 0,
            phaseElapsed: 0,     // segundos decorridos na fase atual
            phaseTotal: 0,       // segundos totais da fase atual
            phaseStartTime: null,
            running: false,
            intervalId: null,
            phasesCompleted: [], // { tipo, duracao }
            focusTotal: 0,
            breakTotal: 0,
            nextPhase: null      // 'focus' | 'break' | null (pendente após "Esperar")
        },

        // ===========================================================
        //  FEEDBACK SONORO (delega ao sistema de presets)
        // ===========================================================
        _playStartSound()    { playConfiguredSound('start'); },
        _playPauseSound()    { playConfiguredSound('pause'); },
        _playCompleteSound() { playConfiguredSound('complete'); },
        _alarmTimer: null,
        _autoTimeout: null,
        _playAlarmSound() {
            this._stopAlarm();
            const play = () => playConfiguredSound('alarm');
            play();
            this._alarmTimer = setInterval(play, 1500);
        },
        _stopAlarm() {
            if (this._alarmTimer) {
                clearInterval(this._alarmTimer);
                this._alarmTimer = null;
            }
        },
        _clearAutoTimeout() {
            if (this._autoTimeout) {
                clearTimeout(this._autoTimeout);
                this._autoTimeout = null;
            }
        },

        // ===========================================================
        //  UTILITARIOS
        // ===========================================================
        formatTime(sec) {
            const m = String(Math.floor(sec / 60)).padStart(2, '0');
            const s = String(sec % 60).padStart(2, '0');
            return `${m}:${s}`;
        },

        _formatDuration(sec) {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            if (h > 0) return `${h}h${m > 0 ? m : ''}`;
            return `${m}min${s > 0 ? s : ''}`;
        },

        // ===========================================================
        //  SWITCH MODE
        // ===========================================================
        switchMode(mode) {
            if (this.running || this.pomo.running) {
                window.toast?.('Finalize a sessão atual antes de trocar de modo.', true);
                return;
            }
            this.mode = mode;
            document.getElementById('modeSimple').classList.toggle('active', mode === 'simple');
            document.getElementById('modePomo').classList.toggle('active', mode === 'pomodoro');
            document.getElementById('btnStart').textContent = mode === 'pomodoro' ? '▶ Iniciar Pomodoro' : '▶ Iniciar Foco';
            document.getElementById('pomoConfig').style.display = mode === 'pomodoro' ? 'grid' : 'none';
            document.getElementById('pomoStatus').style.display = mode === 'pomodoro' ? 'flex' : 'none';
            document.getElementById('btnSkip').style.display = mode === 'pomodoro' ? '' : 'none';
            this._resetState();
        },

        _resetState() {
            this.elapsed = 0;
            this.running = false;
            if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
            this.startTime = null;
            this._resetPomo();
            this._updateDisplay();
            document.getElementById('btnStart').disabled = false;
            document.getElementById('btnPause').disabled = true;
            document.getElementById('btnStop').disabled = true;
            document.getElementById('btnSkip').disabled = true;
            document.getElementById('timerDisplay').className = 'timer-display';
        },

        _resetPomo() {
            this._stopAlarm();
            this._clearAutoTimeout();
            const p = this.pomo;
            if (p.intervalId) { clearInterval(p.intervalId); p.intervalId = null; }
            p.phase = 'idle';
            p.currentCycle = 0;
            p.phaseElapsed = 0;
            p.phaseTotal = 0;
            p.phaseStartTime = null;
            p.running = false;
            p.phasesCompleted = [];
            p.focusTotal = 0;
            p.breakTotal = 0;
            p.nextPhase = null;
            this._updatePomoUI();
        },

        _updateDisplay() {
            document.getElementById('timerDisplay').textContent = this.formatTime(this.elapsed);
        },

        // ===========================================================
        //  LOGICA PRINCIPAL
        // ===========================================================
        start() {
            if (this.mode === 'pomodoro') return this._startPomo();

            if (this.running) return;
            const subject = document.getElementById('subjectInput').value.trim();
            if (!subject) {
                window.toast?.('Digite o nome da matéria antes de iniciar.', true);
                return;
            }
            this.running = true;
            this.startTime = Date.now() - this.elapsed * 1000;
            this.intervalId = setInterval(() => {
                this.elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this._updateDisplay();
            }, 200);
            this._setButtons(true, false, false);
            this._playStartSound();
            window.toast?.('⏱ Foco iniciado!');
        },

        pause() {
            if (this.mode === 'pomodoro') return this._pausePomo();

            if (!this.running) return;
            this.running = false;
            clearInterval(this.intervalId);
            this.intervalId = null;
            this._setButtons(false, true, false);
            this._playPauseSound();
            window.toast?.('⏸ Foco pausado.');
        },

        stop() {
            if (this.mode === 'pomodoro') return this._stopPomo();

            this.running = false;
            clearInterval(this.intervalId);
            this.intervalId = null;

            const session = this._buildSimpleSession();
            this._saveSession(session);
            this._playCompleteSound();
            this._resetState();
            window.toast?.('✅ Sessão concluída e salva!');
        },

        skip() {
            if (this.mode === 'pomodoro') return this._skipPhase();
            window.toast?.('⏭ Pular não disponível no modo Simples.', true);
        },

        _skipPhase() {
            this._stopAlarm();
            this._clearAutoTimeout();
            const p = this.pomo;
            if (!p.running || (p.phase !== 'focus' && p.phase !== 'break')) return;

            clearInterval(p.intervalId);
            p.intervalId = null;
            p.running = false;

            const elapsed = p.phaseTotal;
            p.phasesCompleted.push({ tipo: p.phase, duracao: elapsed });
            if (p.phase === 'focus') p.focusTotal += elapsed;
            else p.breakTotal += elapsed;

            this._playAlarmSound();
            this._updatePomoUI();
            this._handlePhaseComplete(p.phase);
        },

        // ===========================================================
        //  POMODORO — START
        // ===========================================================
        _startPomo() {
            const subject = document.getElementById('subjectInput').value.trim();
            if (!subject) {
                window.toast?.('Digite o nome da matéria antes de iniciar.', true);
                return;
            }
            const p = this.pomo;
            // Le configuracoes
            p.config.focusMin = Math.max(1, parseInt(document.getElementById('pomoFocusMin').value) || 25);
            p.config.breakMin = Math.max(1, parseInt(document.getElementById('pomoBreakMin').value) || 5);
            p.config.cycles = Math.max(1, parseInt(document.getElementById('pomoCycles').value) || 4);

            if (p.nextPhase) {
                // Usuario clicou "Esperar" antes — avança para proxima fase
                const next = p.nextPhase;
                p.nextPhase = null;
                if (next === 'break') {
                    this._beginBreak();
                } else if (next === 'focus') {
                    if (p.currentCycle < p.config.cycles) {
                        this._beginFocus();
                    } else {
                        this._finishPomo();
                    }
                }
                return;
            }

            if (p.phase === 'idle' || p.phase === 'done') {
                p.phasesCompleted = [];
                p.focusTotal = 0;
                p.breakTotal = 0;
                p.currentCycle = 0;
                this._beginFocus();
                this._playStartSound();
            } else {
                // Resume da pausa
                p.running = true;
                p.phaseStartTime = Date.now() - p.phaseElapsed * 1000;
                p.intervalId = setInterval(() => this._tickPomo(), 200);
                this._setButtons(true, false, false, false);
            }
        },

        _beginFocus() {
            this._stopAlarm();
            const p = this.pomo;
            p.currentCycle++;
            p.phase = 'focus';
            p.phaseTotal = p.config.focusMin * 60;
            p.phaseElapsed = 0;
            p.running = true;
            p.phaseStartTime = Date.now();
            p.intervalId = setInterval(() => this._tickPomo(), 200);
            document.getElementById('timerDisplay').className = 'timer-display phase-focus';
            this._setButtons(true, false, false, false);
            this._updatePomoUI();
            window.toast?.(`🍅 Foco ${p.currentCycle}/${p.config.cycles} iniciado!`);
        },

        _beginBreak() {
            this._stopAlarm();
            const p = this.pomo;
            const isLongBreak = studyConfig.longBreakEvery > 0
                && p.currentCycle > 0
                && p.currentCycle % studyConfig.longBreakEvery === 0;
            p.phase = 'break';
            p.phaseTotal = isLongBreak ? studyConfig.longBreakMin * 60 : p.config.breakMin * 60;
            p.phaseElapsed = 0;
            p.running = true;
            p.phaseStartTime = Date.now();
            p.intervalId = setInterval(() => this._tickPomo(), 200);
            document.getElementById('timerDisplay').className = 'timer-display phase-break';
            this._setButtons(true, false, false, false);
            this._updatePomoUI();
            const breakMin = Math.round(p.phaseTotal / 60);
            const label = isLongBreak ? '☕ Pausa Longa' : '☕ Descanso';
            window.toast?.(`${label} ${p.currentCycle}/${p.config.cycles} — ${breakMin} min`);
        },

        _tickPomo() {
            const p = this.pomo;
            const now = Date.now();
            p.phaseElapsed = Math.floor((now - p.phaseStartTime) / 1000);
            const remaining = Math.max(0, p.phaseTotal - p.phaseElapsed);
            document.getElementById('timerDisplay').textContent = this.formatTime(remaining);

            // Atualiza totais parciais
            if (p.phase === 'focus') {
                p.focusTotal = p.phasesCompleted
                    .filter(ph => ph.tipo === 'focus')
                    .reduce((sum, ph) => sum + ph.duracao, 0) + p.phaseElapsed;
            } else if (p.phase === 'break') {
                p.breakTotal = p.phasesCompleted
                    .filter(ph => ph.tipo === 'break')
                    .reduce((sum, ph) => sum + ph.duracao, 0) + p.phaseElapsed;
            }
            this._updatePomoStats();

            // Fase terminou
            if (remaining <= 0) {
                clearInterval(p.intervalId);
                p.intervalId = null;
                p.running = false;

                const elapsed = p.phaseTotal;
                p.phasesCompleted.push({ tipo: p.phase, duracao: elapsed });
                if (p.phase === 'focus') p.focusTotal += elapsed;
                else p.breakTotal += elapsed;

                this._playAlarmSound();
                this._updatePomoUI();
                this._handlePhaseComplete(p.phase);
            }
        },

        _finishPomo() {
            this._stopAlarm();
            const p = this.pomo;
            p.phase = 'done';
            p.running = false;
            p.nextPhase = null;

            const session = this._buildPomoSession();
            this._saveSession(session);
            this._playCompleteSound();
            this._resetPomo();
            this._resetState();
            document.getElementById('timerDisplay').className = 'timer-display';
            window.toast?.('🎉 Pomodoro completo! Todas as sessões salvas!');
        },

        _handlePhaseComplete(completedPhase) {
            const p = this.pomo;
            const isFocus = completedPhase === 'focus';

            // Se auto-transição está ligada, espera o alarme tocar algumas vezes
            if (isFocus && !studyConfig.askBreak) {
                this._setButtons(true, false, false, false);
                this._autoTimeout = setTimeout(() => {
                    this._autoTimeout = null;
                    this._beginBreak();
                }, 3500);
                return;
            }
            if (!isFocus && !studyConfig.askFocus) {
                this._setButtons(true, false, false, false);
                this._autoTimeout = setTimeout(() => {
                    this._autoTimeout = null;
                    if (p.currentCycle < p.config.cycles) {
                        this._beginFocus();
                    } else {
                        this._finishPomo();
                    }
                }, 3500);
                return;
            }

            // Mostra diálogo
            const nextLabel = isFocus ? 'Descanso' : 'Foco';
            const skipLabel = isFocus ? 'Pular Descanso' : 'Pular Foco';

            document.getElementById('phaseDialogTitle').textContent = isFocus ? '🎯 Foco Concluído!' : '☕ Descanso Concluído!';
            document.getElementById('phaseBtnPrimary').innerHTML = `▶ Começar ${nextLabel}`;
            document.getElementById('phaseBtnPrimary').onclick = () => {
                document.getElementById('phase-dialog').close();
                this._afterPhaseDialog(isFocus, 'start');
            };
            document.getElementById('phaseBtnWait').onclick = () => {
                document.getElementById('phase-dialog').close();
                this._afterPhaseDialog(isFocus, 'wait');
            };
            document.getElementById('phaseBtnSkip').innerHTML = `⏭ ${skipLabel}`;
            document.getElementById('phaseBtnSkip').onclick = () => {
                document.getElementById('phase-dialog').close();
                this._afterPhaseDialog(isFocus, 'skip');
            };
            document.getElementById('phase-dialog').showModal();
        },

        _afterPhaseDialog(isFocus, action) {
            this._stopAlarm();
            const p = this.pomo;
            if (action === 'start') {
                if (isFocus) {
                    this._beginBreak();
                } else {
                    if (p.currentCycle < p.config.cycles) {
                        this._beginFocus();
                    } else {
                        this._finishPomo();
                    }
                }
            } else if (action === 'wait') {
                p.nextPhase = isFocus ? 'break' : 'focus';
                this._setButtons(false, true, true);
                document.getElementById('timerDisplay').className = 'timer-display';
                window.toast?.('⏸ Pronto para continuar. Clique em ▶ quando quiser.');
            } else if (action === 'skip') {
                // Loga a fase pulada com a duração configurada
                const skippedDuration = isFocus ? p.config.breakMin * 60 : p.config.focusMin * 60;
                p.phasesCompleted.push({ tipo: isFocus ? 'break' : 'focus', duracao: skippedDuration });
                if (isFocus) {
                    p.breakTotal += skippedDuration;
                    if (p.currentCycle < p.config.cycles) {
                        this._beginFocus();
                    } else {
                        this._finishPomo();
                    }
                } else {
                    p.focusTotal += skippedDuration;
                    p.currentCycle++;
                    if (p.currentCycle < p.config.cycles) {
                        p.phase = 'idle';
                        this._beginBreak();
                    } else {
                        this._finishPomo();
                    }
                }
            }
        },

        // ===========================================================
        //  POMODORO — PAUSE / STOP
        // ===========================================================
        _pausePomo() {
            const p = this.pomo;
            if (!p.running) return;
            p.running = false;
            clearInterval(p.intervalId);
            p.intervalId = null;
            this._setButtons(false, true, false);
            this._playPauseSound();
            window.toast?.('⏸ Pomodoro pausado.');
        },

        _stopPomo() {
            this._stopAlarm();
            this._clearAutoTimeout();
            const p = this.pomo;
            p.running = false;
            if (p.intervalId) { clearInterval(p.intervalId); p.intervalId = null; }

            // Registra o tempo parcial da fase atual
            if (p.phase === 'focus' || p.phase === 'break') {
                const tipo = p.phase === 'focus' ? 'focus' : 'break';
                const duracao = Math.min(p.phaseElapsed, p.phaseTotal);
                if (duracao > 0) {
                    p.phasesCompleted.push({ tipo, duracao });
                    if (tipo === 'focus') p.focusTotal += duracao;
                    else p.breakTotal += duracao;
                }
            }

            const session = this._buildPomoSession();
            this._saveSession(session);
            this._playCompleteSound();
            this._resetPomo();
            this._resetState();
            document.getElementById('timerDisplay').className = 'timer-display';
            window.toast?.('✅ Sessão registrada no histórico!');
        },

        // ===========================================================
        //  BUILD SESSION OBJECTS
        // ===========================================================
        _buildSimpleSession() {
            const elapsed = this.elapsed;
            const subject = document.getElementById('subjectInput').value.trim() || 'Sem assunto';
            const notes = document.getElementById('sessionNotes').value.trim();
            const now = new Date();
            return {
                id: Date.now(),
                modo: 'simples',
                materia: subject,
                notas: notes || '',
                tempo: this.formatTime(elapsed),
                totalSeconds: elapsed,
                data: now.toLocaleDateString('pt-BR'),
                hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                timestamp: now.toISOString()
            };
        },

        _buildPomoSession() {
            const p = this.pomo;
            const subject = document.getElementById('subjectInput').value.trim() || 'Sem assunto';
            const notes = document.getElementById('sessionNotes').value.trim();
            const now = new Date();
            const focusTotal = p.focusTotal;
            const breakTotal = p.breakTotal;
            const totalTime = focusTotal + breakTotal;

            return {
                id: Date.now(),
                modo: 'pomodoro',
                materia: subject,
                notas: notes || '',
                tempo: this.formatTime(totalTime),
                totalSeconds: totalTime,
                data: now.toLocaleDateString('pt-BR'),
                hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                timestamp: now.toISOString(),
                ciclosPrevistos: p.config.cycles,
                ciclosCompletados: p.phasesCompleted.filter(ph => ph.tipo === 'focus').length,
                focoTotal: focusTotal,
                descansoTotal: breakTotal,
                fases: p.phasesCompleted.slice()
            };
        },

        // ===========================================================
        //  INTEGRACAO DE EVENTOS
        //  Chamado a cada conclusao de sessao (ambos os modos):
        //
        //    session.modo          — 'simples' | 'pomodoro'
        //    session.materia       — nome da materia
        //    session.totalSeconds  — duracao total
        //
        //  Se session.modo === 'pomodoro':
        //    session.ciclosCompletados — ciclos de foco concluidos
        //    session.ciclosPrevistos   — total configurado
        //    session.focoTotal         — segundos de foco
        //    session.descansoTotal     — segundos de descanso
        //
        //  Exemplo de uso:
        //    if (typeof window.grantStudyRewards === 'function') {
        //        window.grantStudyRewards(session);
        //    }
        // ===========================================================
        // >> onSessionComplete(session) <<

        // ===========================================================
        //  UI HELPERS
        // ===========================================================
        _setButtons(startDisabled, pauseDisabled, stopDisabled, skipDisabled) {
            document.getElementById('btnStart').disabled = startDisabled;
            document.getElementById('btnPause').disabled = pauseDisabled;
            document.getElementById('btnStop').disabled = stopDisabled;
            document.getElementById('btnSkip').disabled = skipDisabled ?? true;
        },

        _updatePomoUI() {
            const p = this.pomo;
            const phaseLabels = { idle: '—', focus: '🎯 Foco', break: '☕ Descanso', done: '✅ Concluído' };
            document.getElementById('pomoCycle').textContent =
                p.phase === 'idle' || p.phase === 'done'
                    ? `${p.config.cycles}/${p.config.cycles}`
                    : `${p.currentCycle}/${p.config.cycles}`;
            document.getElementById('pomoPhase').textContent = phaseLabels[p.phase] || '—';
            this._updatePomoStats();
        },

        _updatePomoStats() {
            const p = this.pomo;
            document.getElementById('pomoFocusTotal').textContent = this.formatTime(p.focusTotal);
            document.getElementById('pomoBreakTotal').textContent = this.formatTime(p.breakTotal);
        },

        // ===========================================================
        //  PERSISTENCIA
        // ===========================================================
        _saveSession(session) {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                const list = raw ? JSON.parse(raw) : [];
                list.unshift(session);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
                this._renderHistory();

                // Sincroniza com a nuvem se logado
                if (!window.isGuestMode && window.currentUser && window.saveStudySession) {
                    window.saveStudySession(window.currentUser.uid, session)
                        .catch(e => console.warn('Falha ao salvar sessão na nuvem:', e));
                }
            } catch (e) {
                console.warn('Erro ao salvar historico:', e);
            }
        },

        async _syncFromCloud() {
            if (window.isGuestMode || !window.currentUser || !window.loadStudySessions) return;
            try {
                const remote = await window.loadStudySessions(window.currentUser.uid);
                if (remote && remote.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
                    this._renderHistory();
                }
            } catch (e) {
                console.warn('Erro ao carregar histórico da nuvem:', e);
            }
        },

        _renderHistory() {
            const container = document.getElementById('historyBody');
            const countEl = document.getElementById('sessionCount');
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                const list = raw ? JSON.parse(raw) : [];
                if (!Array.isArray(list) || list.length === 0) {
                    container.innerHTML = '<div class="history-empty">Nenhuma sessão registrada ainda. Complete seu primeiro foco!</div>';
                    if (countEl) countEl.textContent = '0 sessões';
                    return;
                }
                if (countEl) countEl.textContent = `${list.length} sessão${list.length !== 1 ? 'es' : ''}`;
                container.innerHTML = `
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Matéria</th>
                                <th>Modo</th>
                                <th>Ciclos</th>
                                <th>Foco</th>
                                <th>Descanso</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${list.map(s => {
                                const isPomo = s.modo === 'pomodoro';
                                const ciclos = isPomo ? `${s.ciclosCompletados || 0}/${s.ciclosPrevistos || '-'}` : '—';
                                const foco = isPomo ? this.formatTime(s.focoTotal || 0) : '—';
                                const desc = isPomo ? this.formatTime(s.descansoTotal || 0) : '—';
                                return `
                                    <tr>
                                        <td>${s.data || '-'}</td>
                                        <td>${s.hora || '-'}</td>
                                        <td style="font-weight:800;">${s.materia || '—'}</td>
                                        <td><span class="tag-modo ${s.modo || 'simples'}">${s.modo === 'pomodoro' ? '🍅' : '⏱'} ${s.modo || 'simples'}</span></td>
                                        <td style="text-align:center;">${ciclos}</td>
                                        <td>${foco}</td>
                                        <td>${desc}</td>
                                        <td style="font-weight:800;color:var(--accent);">${s.tempo || '—'}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                `;
            } catch {
                container.innerHTML = '<div class="history-empty">Erro ao carregar histórico.</div>';
                if (countEl) countEl.textContent = '0 sessões';
            }
        },

        clearHistory() {
            if (!confirm('Tem certeza? Todo o histórico de sessões será apagado permanentemente.')) return;
            localStorage.removeItem(STORAGE_KEY);
            this._renderHistory();
            if (!window.isGuestMode && window.currentUser && window.deleteAllStudySessions) {
                window.deleteAllStudySessions(window.currentUser.uid)
                    .catch(e => console.warn('Falha ao limpar histórico na nuvem:', e));
            }
            window.toast?.('🗑 Histórico limpo.');
        },

        // ===========================================================
        //  HISTÓRICO — BENTO GRID / DETALHE
        // ===========================================================

        _loadHistoryList() {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        },

        _historySortOptions: [
            { val: 'date-desc', label: 'Data (recente → antigo)', fn: (a, b) => new Date(b.timestamp) - new Date(a.timestamp) },
            { val: 'date-asc', label: 'Data (antigo → recente)', fn: (a, b) => new Date(a.timestamp) - new Date(b.timestamp) },
            { val: 'subject-asc', label: 'Matéria (A → Z)', fn: (a, b) => (a.materia || '').localeCompare(b.materia || '') },
            { val: 'subject-desc', label: 'Matéria (Z → A)', fn: (a, b) => (b.materia || '').localeCompare(a.materia || '') },
            { val: 'dur-desc', label: 'Duração (maior → menor)', fn: (a, b) => (b.totalSeconds || 0) - (a.totalSeconds || 0) },
            { val: 'dur-asc', label: 'Duração (menor → maior)', fn: (a, b) => (a.totalSeconds || 0) - (b.totalSeconds || 0) },
        ],

        openHistoryGrid() {
            const list = this._loadHistoryList();
            if (!list.length) {
                window.toast?.('Nenhuma sessão no histórico.');
                return;
            }
            this._historyList = list;
            this._renderHistoryGrid('date-desc');
            document.getElementById('history-bento-dialog').showModal();
        },

        _renderHistoryGrid(sortVal) {
            const list = this._historyList;
            const sortOpt = this._historySortOptions.find(o => o.val === sortVal) || this._historySortOptions[0];
            const sorted = [...list].sort(sortOpt.fn);

            this._currentSortVal = sortVal;
            const currentLabel = sortOpt.label;

            document.getElementById('historyDialogTitle').textContent = '📋 Histórico de Sessões';
            document.getElementById('historyDialogBackBtn').style.display = 'none';

            const content = document.getElementById('historyDialogContent');
            content.innerHTML = `
                <div class="history-sort-bar">
                    <label>Ordenar:</label>
                    <button class="history-sort-btn" onclick="showHistorySortDialog()">${currentLabel}</button>
                </div>
                <div class="history-bento-grid">
                    ${sorted.map(s => {
                        const hasNotes = s.notas && s.notas.trim();
                        const isPomo = s.modo === 'pomodoro';
                        const modeIcon = isPomo ? '🍅' : '⏱';
                        return `
                            <button class="history-bento-item" onclick="openHistoryDetail(${s.id})">
                                <div class="hbi-date">${s.data || '-'} · ${s.hora || '-'}</div>
                                <div class="hbi-subject">${s.materia || '—'}</div>
                                <div class="hbi-meta">
                                    <span class="hbi-mode">${modeIcon} ${s.modo || 'simples'}</span>
                                    <span class="hbi-total">${s.tempo || '—'}</span>
                                </div>
                                ${hasNotes ? '<div class="hbi-notes-indicator">📝 Anotações</div>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
        },

        openHistoryDetail(id) {
            const s = this._historyList.find(e => e.id === id);
            if (!s) return;

            document.getElementById('historyDialogTitle').textContent = '🔍 Detalhes da Sessão';
            document.getElementById('historyDialogBackBtn').style.display = 'flex';

            const isPomo = s.modo === 'pomodoro';
            const modeIcon = isPomo ? '🍅' : '⏱';
            const hasNotes = s.notas && s.notas.trim();

            let phasesHtml = '';
            if (isPomo && s.fases && s.fases.length) {
                phasesHtml = `
                    <div class="hd-phases">
                        <h4>Fases</h4>
                        ${s.fases.map(f => `
                            <div class="hd-phase">
                                <span class="hd-phase-type">
                                    <span class="${f.tipo === 'focus' ? 'focus-dot' : 'break-dot'}"></span>
                                    ${f.tipo === 'focus' ? 'Foco' : 'Descanso'}
                                </span>
                                <span class="hd-phase-dur">${this.formatTime(f.duracao)}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            const content = document.getElementById('historyDialogContent');
            content.innerHTML = `
                <div class="history-detail">
                    <div class="hd-header">
                        <div>
                            <div class="hd-date">${s.data || '-'} · ${s.hora || '-'}</div>
                            <div class="hd-subject">${s.materia || '—'}</div>
                        </div>
                        <span class="hd-mode-tag">${modeIcon} ${s.modo || 'simples'}</span>
                    </div>
                    <div class="hd-stats">
                        <div class="hd-stat">
                            <div class="hd-stat-label">Duração</div>
                            <div class="hd-stat-value">${s.tempo || '—'}</div>
                        </div>
                        ${isPomo ? `
                        <div class="hd-stat">
                            <div class="hd-stat-label">Ciclos</div>
                            <div class="hd-stat-value">${s.ciclosCompletados || 0}/${s.ciclosPrevistos || '-'}</div>
                        </div>
                        <div class="hd-stat">
                            <div class="hd-stat-label">Foco Total</div>
                            <div class="hd-stat-value">${this.formatTime(s.focoTotal || 0)}</div>
                        </div>
                        <div class="hd-stat">
                            <div class="hd-stat-label">Descanso</div>
                            <div class="hd-stat-value">${this.formatTime(s.descansoTotal || 0)}</div>
                        </div>
                        ` : ''}
                    </div>
                    ${hasNotes ? `
                    <div class="hd-notes">
                        <h4>📝 Anotações</h4>
                        <p>${s.notas}</p>
                    </div>
                    ` : ''}
                    ${phasesHtml}
                </div>
            `;
        },

        closeHistoryDialog() {
            document.getElementById('history-bento-dialog').close();
        },

        historyBackToGrid() {
            this._renderHistoryGrid(this._lastSortVal || 'date-desc');
        },

        changeHistorySort(val) {
            this._lastSortVal = val;
            this._renderHistoryGrid(val);
        },

        showHistorySortDialog() {
            const container = document.getElementById('historySortOptions');
            const current = this._currentSortVal || 'date-desc';
            container.innerHTML = this._historySortOptions.map(o => `
                <button class="${o.val === current ? 'is-active' : ''}" onclick="selectHistorySort('${o.val}')">
                    ${o.val === current ? '✓ ' : ''}${o.label}
                </button>
            `).join('');
            document.getElementById('history-sort-dialog').showModal();
        },

        selectHistorySort(val) {
            document.getElementById('history-sort-dialog').close();
            this.changeHistorySort(val);
        },

        closeHistorySortDialog() {
            document.getElementById('history-sort-dialog').close();
        },

        // ===========================================================
        //  NAVEGACAO INTELIGENTE
        // ===========================================================
        goBack() {
            const params = new URLSearchParams(window.location.search);
            const from = params.get('from');
            if (from === 'hub') navigateTo('index.html');
            else if (from === 'painel') navigateTo('panel.html');
            else navigateTo('panel.html'); // fallback padrao
        }
    };

    // ============================================================
    //  HISTÓRICO — WRAPPERS GLOBAIS
    // ============================================================
    function openHistoryGrid() { studyTimer.openHistoryGrid(); }
    function closeHistoryDialog() { studyTimer.closeHistoryDialog(); }
    function historyBackToGrid() { studyTimer.historyBackToGrid(); }
    function changeHistorySort(val) { studyTimer.changeHistorySort(val); }
    function openHistoryDetail(id) { studyTimer.openHistoryDetail(id); }
    function showHistorySortDialog() { studyTimer.showHistorySortDialog(); }
    function selectHistorySort(val) { studyTimer.selectHistorySort(val); }
    function closeHistorySortDialog() { studyTimer.closeHistorySortDialog(); }
    function clearStudyHistory() { studyTimer.clearHistory(); }
    window.clearStudyHistory = clearStudyHistory;

    // Inicializa ao carregar o conteudo
    function renderStudy() {
        const loading = document.getElementById('auth-loading');
        const content = document.getElementById('study-content');
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';

        document.getElementById('btnSkip').style.display = 'none';

        // Botao voltar inteligente
        const params = new URLSearchParams(window.location.search);
        const from = params.get('from');
        const btn = document.getElementById('btnBack');
        if (from === 'hub') { btn.innerHTML = '🏠 Hub'; btn.title = 'Voltar ao Hub'; }
        else if (from === 'painel') { btn.innerHTML = '⚔️ Painel'; btn.title = 'Voltar ao Painel'; }
        else { btn.innerHTML = '⬅ Voltar'; btn.title = 'Voltar'; }

        studyTimer._renderHistory();
        studyTimer._updatePomoUI();
        if (window.updateGuestUI) window.updateGuestUI();

        // Sincroniza com nuvem se logado
        if (!window.isGuestMode && window.currentUser) {
            setTimeout(async () => {
                // Migra dados locais para nuvem (só na primeira vez)
                if (window.migrateStudySessions) {
                    const count = await window.migrateStudySessions(window.currentUser.uid);
                    if (count > 0) window.toast?.(`☁️ ${count} sessões sincronizadas com a nuvem!`);
                }
                // Carrega dados da nuvem
                await studyTimer._syncFromCloud();
            }, 300);
        }
    }

    window.renderStudy = renderStudy;
