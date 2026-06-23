/* ==========================================================================
   notifications.js — Notificações Sociais Motivacionais
   ========================================================================== */

/* ---- QUESTIONÁRIO DIAGNÓSTICO ---- */

const DIAGNOSTIC_QUESTIONS = [
    {
        id: "goal",
        icon: "🎯",
        label: "Qual é o seu objetivo principal de estudo?",
        options: [
            { v: "exatas",       l: "Passar em vestibular de Exatas / Tecnologia", i: "🧮" },
            { v: "humanas",      l: "Passar em vestibular de Humanas / Sociais", i: "📜" },
            { v: "saude",        l: "Passar em vestibular de Biológicas / Saúde", i: "🩺" },
            { v: "posgrad",      l: "Obter pós-graduação (Mestrado / Doutorado)", i: "🎓" },
            { v: "escola",       l: "Melhorar rendimento escolar / acadêmico", i: "📈" },
            { v: "profissional", l: "Avançar na carreira e mercado de trabalho", i: "💼" },
            { v: "negocio",      l: "Crescer e gerir meu próprio negócio", i: "🚀" }
        ]
    },
    {
        id: "category",
        icon: "📚",
        label: "Qual fase melhor representa seu momento atual?",
        options: [
            { v: "fundamental", l: "Ensino Fundamental", i: "🏫" },
            { v: "medio",       l: "Ensino Médio", i: "📖" },
            { v: "cursinho",    l: "Cursinho Preparatório", i: "📝" },
            { v: "superior",    l: "Faculdade / Universidade", i: "🏛️" },
            { v: "profissional",l: "Vida profissional (concursos, certificações)", i: "👔" }
        ]
    },
    {
        id: "hours",
        icon: "⏰",
        label: "Quanto tempo você consegue dedicar aos estudos por dia?",
        options: [
            { v: "leve",      l: "Leve — Até 1 hora por dia", i: "🌱" },
            { v: "moderado",  l: "Moderado — De 1 a 2 horas por dia", i: "🔥" },
            { v: "padrao",    l: "Padrão — De 2 a 4 horas por dia", i: "⚡" },
            { v: "intenso",   l: "Intenso — De 4 a 6 horas por dia", i: "💪" },
            { v: "extremo",   l: "Extremo — Mais de 6 horas por dia", i: "🏋️" }
        ]
    },
    {
        id: "challenge",
        icon: "🧗",
        label: "Qual desses desafios mais atrapalha sua rotina de estudos?",
        options: [
            { v: "inercia",      l: "Inércia inicial — começar a estudar", i: "⏳" },
            { v: "distracao",    l: "Distrações — perder o foco durante o estudo", i: "📱" },
            { v: "consistencia", l: "Consistência — manter a rotina ao longo da semana", i: "📅" },
            { v: "ansiedade",    l: "Ansiedade e procrastinação emocional", i: "😰" },
            { v: "cansaço",      l: "Cansaço físico / mental após o dia", i: "😴" },
            { v: "organizacao",  l: "Falta de organização e planejamento", i: "🗂️" }
        ]
    },
    {
        id: "method",
        icon: "✏️",
        label: "Qual método de estudo você mais utiliza?",
        options: [
            { v: "leitura",     l: "Leitura e releitura de materiais", i: "📖" },
            { v: "exercicios",  l: "Resolução de exercícios e questões", i: "📝" },
            { v: "mapas",       l: "Mapas mentais e resumos visuais", i: "🧠" },
            { v: "flashcards",  l: "Flashcards e repetição espaçada", i: "🃏" },
            { v: "video",       l: "Videoaulas e conteúdo audiovisual", i: "🎬" },
            { v: "pratico",     l: "Projetos práticos e mão na massa", i: "🔧" },
            { v: "grupo",       l: "Estudo em grupo e discussões", i: "👥" }
        ]
    },
    {
        id: "timePref",
        icon: "🌙",
        label: "Em qual período do dia você rende mais nos estudos?",
        options: [
            { v: "manha",     l: "Manhã — logo ao acordar", i: "🌅" },
            { v: "tarde",     l: "Tarde — pós-almoço", i: "☀️" },
            { v: "noite",     l: "Noite — após o jantar", i: "🌆" },
            { v: "madrugada", l: "Madrugada — silêncio total", i: "🌃" },
            { v: "flexivel",  l: "Flexível — qualquer horário", i: "🔄" }
        ]
    },
    {
        id: "environment",
        icon: "🌿",
        label: "Como é seu ambiente de estudos ideal?",
        options: [
            { v: "silêncio",     l: "Silêncio absoluto, sem interrupções", i: "🔇" },
            { v: "musica",       l: "Música ambiente ou lo-fi", i: "🎵" },
            { v: "movimento",    l: "Barulho leve de fundo (cafeteria, biblioteca)", i: "☕" },
            { v: "natureza",     l: "Ao ar livre ou contato com natureza", i: "🌳" },
            { v: "digital",      l: "Espaço digital (grupos virtuais, salas online)", i: "💻" }
        ]
    },
    {
        id: "personality",
        icon: "💡",
        label: "Qual estilo de aprendizagem mais combina com você?",
        options: [
            { v: "pratico",   l: "Prático — aprendo fazendo e testando", i: "🛠️" },
            { v: "teorico",   l: "Teórico — aprendo lendo e compreendendo conceitos", i: "📚" },
            { v: "visual",    l: "Visual — aprendo com imagens, cores e diagramas", i: "🎨" },
            { v: "auditivo",  l: "Auditivo — aprendo ouvindo e discutindo", i: "🎧" },
            { v: "social",    l: "Social — aprendo ensinando e colaborando", i: "🤝" },
            { v: "solitario", l: "Solitário — aprendo no meu próprio ritmo", i: "🧘" }
        ]
    }
];

const GOAL_LABELS = {
    exatas: "Exatas / Tecnologia", humanas: "Humanas / Sociais", saude: "Biológicas / Saúde",
    posgrad: "Pós-Graduação", escola: "Rendimento Escolar / Acadêmico",
    profissional: "Mercado de Trabalho", negocio: "Próprio Negócio"
};
const CATEGORY_LABELS = {
    fundamental: "Ensino Fundamental", medio: "Ensino Médio", cursinho: "Cursinho",
    superior: "Ensino Superior", profissional: "Vida profissional"
};
const HOURS_LABELS = {
    leve: "até 1h/dia", moderado: "1-2h/dia", padrao: "2-4h/dia", intenso: "4-6h/dia", extremo: "mais de 6h/dia"
};
const CHALLENGE_LABELS = {
    inercia: "inércia inicial", distracao: "distrações",
    consistencia: "consistência", ansiedade: "ansiedade",
    "cansaço": "cansaço", organizacao: "organização"
};
const METHOD_LABELS = {
    leitura: "Leitura", exercicios: "Exercícios", mapas: "Mapas mentais",
    flashcards: "Flashcards", video: "Videoaulas", pratico: "Prático", grupo: "Grupo"
};
const TIMEPREF_LABELS = {
    manha: "Manhã", tarde: "Tarde", noite: "Noite", madrugada: "Madrugada", flexivel: "Flexível"
};
const ENV_LABELS = {
    "silêncio": "Silêncio total", musica: "Música ambiente",
    movimento: "Movimento leve", natureza: "Natureza", digital: "Digital"
};
const PERSONALITY_LABELS = {
    pratico: "Prático", teorico: "Teórico", visual: "Visual",
    auditivo: "Auditivo", social: "Social", solitario: "Solitário"
};

/* ---- POOL DE MENSAGENS (50+ templates) ---- */

const MESSAGE_GENERATORS = [
    /* --- Ultrapassagem / Overtaking --- */
    (u, m) => m.overtake ? `${u.name} te passou nos ratings e tem trilhas semelhantes às suas!` : null,
    (u, m) => m.overtake ? `${u.name} acabou de ultrapassar você — que tal acelerar o ritmo?` : null,
    (u, m) => m.overtake ? `${u.name} está voando nos estudos e já te deixou para trás esta semana!` : null,
    (u, m) => m.overtake ? `Enquanto você descansava, ${u.name} passou na sua frente no ranking.` : null,

    /* --- Aproximação / Approaching --- */
    (u, m) => m.approach ? `${u.name} está quase te alcançando no ranking — ligue o turbo!` : null,
    (u, m) => m.approach ? `Cuidado! ${u.name} vem subindo forte e está logo atrás de você.` : null,
    (u, m) => m.approach ? `${u.name} está colando em você! Mais algumas horas e ele te alcança.` : null,
    (u, m) => m.approach ? `Só mais alguns XP e ${u.name} empata com você. Hora de estudar!` : null,

    /* --- Consistência Semanal --- */
    (u, m) => m.consistent ? `${u.name} estudou a semana inteira sem perder um dia!` : null,
    (u, m) => m.consistent ? `${u.name} manteve a consistência por 7 dias seguidos. Que inspiração!` : null,
    (u, m) => m.consistent ? `Enquanto isso, ${u.name} fechou mais uma semana de estudos sem falhas.` : null,
    (u, m) => m.consistent ? `${u.name} está com muitos pontos acumulados este fim de semana de tanto estudar!` : null,

    /* --- Mesmo objetivo / Same goal --- */
    (u, m) => m.goal ? `${u.name} também está de olho em ${m.goalLbl} — vocês são concorrentes naturais!` : null,
    (u, m) => m.goal ? `Sabia que ${u.name} tem o mesmo objetivo que você? Hora de mostrar serviço!` : null,
    (u, m) => m.goal ? `${u.name} está na mesma jornada que você rumo a ${m.goalLbl}.` : null,
    (u, m) => m.goal ? `Você e ${u.name} disputam o mesmo sonho: ${m.goalLbl}. Quem vai chegar primeiro?` : null,
    (u, m) => m.goal ? `${u.name} também quer ${m.goalLbl} — e está se dedicando muito!` : null,
    (u, m) => m.goal ? `Mais um concorrente na sua área: ${u.name} também busca ${m.goalLbl}.` : null,

    /* --- Mesma categoria / Same category --- */
    (u, m) => m.category ? `${u.name} está no mesmo momento de vida que você (${m.catLbl}).` : null,
    (u, m) => m.category ? `Assim como você, ${u.name} é ${m.catLbl} e está se dedicando nos estudos.` : null,
    (u, m) => m.category ? `Vocês dois são ${m.catLbl} — que tal ver como ${u.name} está se saindo?` : null,

    /* --- Mesmo desafio / Same challenge --- */
    (u, m) => m.challenge ? `${u.name} enfrenta o mesmo desafio que você: ${m.chalLbl}.` : null,
    (u, m) => m.challenge ? `Você não está sozinho! ${u.name} também luta para ${m.chalLbl}.` : null,
    (u, m) => m.challenge ? `${u.name} tem as mesmas dificuldades que você com ${m.chalLbl} e está evoluindo!` : null,
    (u, m) => m.challenge ? `Sabia que ${u.name} também sofre para ${m.chalLbl}? Mas ele não desistiu!` : null,

    /* --- Mesma carga horária / Same hours --- */
    (u, m) => m.hours ? `${u.name} estuda ${m.hoursLbl} assim como você. Quem rende mais?` : null,
    (u, m) => m.hours ? `Você e ${u.name} têm a mesma meta diária de ${m.hoursLbl}.` : null,

    /* --- Marca de XP / XP milestone --- */
    (u, m) => m.xp100 ? `${u.name} acabou de bater ${m.xp} XP — que marco!` : null,
    (u, m) => m.xp100 ? `${u.name} atingiu ${m.xp} XP. Você já está de olho na próxima meta?` : null,
    (u, m) => m.xp100 ? `Enquanto isso, ${u.name} comemorou ${m.xp} XP conquistados.` : null,

    /* --- Progresso recente / Recent progress --- */
    (u, m) => m.recent ? `${u.name} está a todo vapor nos estudos esta semana!` : null,
    (u, m) => m.recent ? `Nesta semana ${u.name} já acumulou vários pontos. Bora acompanhar?` : null,
    (u, m) => m.recent ? `${u.name} não para! Veja o ritmo dele nos últimos dias.` : null,

    /* --- Comparação de pontos --- */
    (u, m) => m.ptsAhead ? `${u.name} tem ${m.ptsDiff} pontos a mais que você. Dá para alcançar!` : null,
    (u, m) => m.ptsAhead ? `${u.name} está ${m.ptsDiff} pontos na frente. Uma sessão de foco e você empata!` : null,
    (u, m) => m.ptsBehind ? `Você está ${m.ptsDiff} pontos na frente de ${u.name}. Não deixe ele te alcançar!` : null,
    (u, m) => m.ptsBehind ? `Líder! Você tem ${m.ptsDiff} pontos de vantagem sobre ${u.name}.` : null,

    /* --- Inspiracionais / Inspirational --- */
    (u, m) => `${u.name} está online agora. Que tal estudar junto (mesmo que longe)?`,
    (u, m) => `Dizem por aí que ${u.name} está com uma sequência de estudos impressionante.`,
    (u, m) => `${u.name} prova que consistência vence talento. Veja o perfil dele!`,
    (u, m) => `Enquanto você lê isso, ${u.name} já está estudando. Bora?`,
    (u, m) => `${u.name} está na comunidade há um tempão e continua firme. Inspirador!`,
    (u, m) => `O segredo? ${u.name} estuda um pouco todo dia. E você?`,
    (u, m) => `${u.name} é a prova viva de que pequenas sessões diárias geram grandes resultados.`,
    (u, m) => `${u.name} está entre os mais ativos da comunidade esta semana.`,
    (u, m) => `Você já conferiu o progresso de ${u.name} hoje?`,
    (u, m) => `${u.name} está construindo uma jornada incrível. Dê uma olhada!`,
    (u, m) => `Dizem que ${u.name} descobriu o segredo da produtividade. Quer ver?`,
    (u, m) => `${u.name} está colhendo os frutos da disciplina. E você, vai ficar de fora?`,
    (u, m) => `${u.name} transformou hábitos em resultados. Conheça a história dele!`,

    /* --- Rank / Tier --- */
    (u, m) => m.sameTier ? `Você e ${u.name} estão no mesmo ${m.tierLbl}. Quem chega ao próximo primeiro?` : null,
    (u, m) => m.higherTier ? `${u.name} está no ${m.tierLbl} — um rank acima de você. Bora subir?` : null,
    (u, m) => m.lowerTier ? `${u.name} está no ${m.tierLbl}, mas vem forte!` : null,

    /* --- Curso / Matéria --- */
    (u, m) => m.sameCourse ? `${u.name} também estuda ${m.course} — vocês podem trocar dicas!` : null,
    (u, m) => m.sameCourse ? `${u.name} está focado em ${m.course} igual a você. Quem vai mais longe?` : null,

    /* --- Mesmo método / Same method --- */
    (u, m) => m.method ? `${u.name} também usa ${m.methodLbl} como método principal — combinação poderosa!` : null,
    (u, m) => m.method ? `Que coincidência! ${u.name} estuda com ${m.methodLbl} assim como você.` : null,
    (u, m) => m.method ? `${u.name} confia no método ${m.methodLbl} igual a você. Quer trocar experiências?` : null,

    /* --- Mesmo período / Same time preference --- */
    (u, m) => m.timePref ? `${u.name} também rende mais no período da ${m.timeLbl} — bora sincronizar?` : null,
    (u, m) => m.timePref ? `Você e ${u.name} têm o mesmo horário de pico: ${m.timeLbl}.` : null,

    /* --- Mesmo ambiente / Same environment --- */
    (u, m) => m.env ? `${u.name} prefere ${m.envLbl} para estudar, igual a você!` : null,
    (u, m) => m.env ? `Assim como você, ${u.name} se concentra melhor em ${m.envLbl}.` : null,

    /* --- Mesmo estilo de aprendizagem / Same personality --- */
    (u, m) => m.personality ? `${u.name} tem o mesmo estilo de aprendizagem que você: ${m.personaLbl}!` : null,
    (u, m) => m.personality ? `${u.name} aprende de forma ${m.personaLbl}, assim como você. Já pensaram em estudar juntos?` : null,
    (u, m) => m.personality ? `Perfil compatível! ${u.name} também é do estilo ${m.personaLbl}.` : null,
];

/* ---- ESTADO INTERNO ---- */

let __notifications = [];
let __unreadCount = 0;
let __panelOpen = false;
let __initTimer = null;
let __refreshTimer = null;
let __diagnosticAnswered = false;

/* ---- FUNÇÕES AUXILIARES ---- */

const $n = id => document.getElementById(id);
const tierName = (xp) => {
    const t = (window.TIERS || []).find(r => xp >= r.min && xp <= r.max);
    return t ? `${t.i} ${t.name}` : "🥉 Bronze";
};
const avatarUrl = (uid, profile) =>
    (profile && profile.avatarUrl) ||
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(uid || "anon")}`;
const displayName = (profile, fallback) =>
    (profile && profile.displayName) || fallback || "Jogador";

/* ---- QUESTIONÁRIO DIAGNÓSTICO ---- */

function hasDiagnostic() {
    return !!(window.state && window.state.diagnostic);
}

function saveDiagnosticLocally(answers) {
    if (!window.state) return;
    window.state.diagnostic = answers;
}

let __diagStep = 0;
let __diagAnswers = {};

function openDiagnosticDialog() {
    const existing = $n("diagnostic-dialog");
    if (existing) { existing.showModal(); return; }

    __diagStep = 0;
    __diagAnswers = {};

    const d = document.createElement("dialog");
    d.id = "diagnostic-dialog";
    d.className = "theme-bento-dialog";

    d.innerHTML = `<div class="bento-card dialog-theme-card" style="max-width:640px;">
        <div class="dialog-header-block">
            <h3>📋 Diagnóstico de Perfil</h3>
            <button class="dialog-close-btn" onclick="closeDiagnosticDialog()">×</button>
        </div>
        <div class="dialog-body" style="padding:1.25rem;">
            <p style="margin:0 0 1.25rem;line-height:1.5;color:var(--muted);font-size:0.82rem;text-align:center;font-weight:700;">
                Responda para conectar-se a outros estudantes com perfil semelhante.
                Suas respostas são <strong>confidenciais</strong>.
            </p>
            <div id="diag-progress" style="display:flex;gap:8px;justify-content:center;margin-bottom:1.5rem;"></div>
            <div id="diag-step" style="overflow-y:auto;flex:1;min-height:0;margin-bottom:0.5rem;"></div>
            <div style="display:flex;gap:0.75rem;margin-top:0.75rem;">
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
    container.innerHTML = DIAGNOSTIC_QUESTIONS.map((q, i) =>
        `<span class="diag-dot ${i === __diagStep ? "active" : i < __diagStep ? "done" : ""}" data-i="${i}" onclick="goToStep(${i})" title="Pergunta ${i + 1}: ${q.label}">${q.icon}</span>`
    ).join("");
}

function renderDiagStep() {
    const container = $n("diag-step");
    if (!container) return;

    const q = DIAGNOSTIC_QUESTIONS[__diagStep];
    const saved = __diagAnswers[q.id];

    container.innerHTML = `
        <div class="diag-step-header">
            <span class="diag-step-icon">${q.icon}</span>
            <div class="diag-step-meta">
                <span class="diag-step-num">PERGUNTA ${__diagStep + 1} DE ${DIAGNOSTIC_QUESTIONS.length}</span>
                <span class="diag-step-question">${q.label}</span>
            </div>
        </div>
        <div class="diag-step-options">
            ${q.options.map(o => `
                <label class="diagnostic-option ${saved === o.v ? "selected" : ""}" data-value="${o.v}" onclick="selectDiagOption('${q.id}','${o.v}')">
                    <span class="diag-opt-icon">${o.i}</span>
                    <span class="diag-opt-label">${o.l}</span>
                    <span class="diag-opt-check">${saved === o.v ? "✓" : ""}</span>
                </label>
            `).join("")}
        </div>
    `;

    const prev = $n("diag-prev");
    const next = $n("diag-next");
    if (prev) prev.style.display = __diagStep === 0 ? "none" : "flex";
    if (next) {
        if (__diagStep === DIAGNOSTIC_QUESTIONS.length - 1) {
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

function diagNext() {
    const q = DIAGNOSTIC_QUESTIONS[__diagStep];
    if (!__diagAnswers[q.id]) {
        window.toast("Selecione uma opção antes de continuar.", true);
        return;
    }
    if (__diagStep < DIAGNOSTIC_QUESTIONS.length - 1) {
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
    if (i < 0 || i >= DIAGNOSTIC_QUESTIONS.length) return;
    if (i > __diagStep) {
        for (let j = __diagStep; j < i; j++) {
            if (!__diagAnswers[DIAGNOSTIC_QUESTIONS[j].id]) {
                window.toast("Responda a pergunta atual antes de avançar.", true);
                return;
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

function submitDiagnostic() {
    const q = DIAGNOSTIC_QUESTIONS[__diagStep];
    if (!__diagAnswers[q.id]) {
        window.toast("Selecione uma opção antes de concluir.", true);
        return;
    }

    for (const question of DIAGNOSTIC_QUESTIONS) {
        if (!__diagAnswers[question.id]) {
            window.toast("Responda todas as perguntas antes de salvar.", true);
            return;
        }
    }

    saveDiagnosticLocally(__diagAnswers);
    __diagnosticAnswered = true;
    closeDiagnosticDialog();
    window.toast("✅ Dados salvos com sucesso!");

    const user = window.currentUser;
    if (user && window.saveStateToFirestore) {
        window.saveStateToFirestore(user.uid, window.state, {
            diagnostic: __diagAnswers,
            diagnosticUpdatedAt: Date.now()
        }).catch(() => {});
    }

    renderNotificationBadge();
    refreshNotifications();
}

/* ---- NOTIFICATION ENGINE ---- */

function calcMatch(myD, otherD) {
    const m = {};
    if (!myD || !otherD) return m;

    if (myD.goal && myD.goal === otherD.goal) {
        m.goal = true;
        m.goalLbl = GOAL_LABELS[myD.goal] || myD.goal;
    }
    if (myD.category && myD.category === otherD.category) {
        m.category = true;
        m.catLbl = CATEGORY_LABELS[myD.category] || myD.category;
    }
    if (myD.hours && myD.hours === otherD.hours) {
        m.hours = true;
        m.hoursLbl = HOURS_LABELS[myD.hours] || myD.hours;
    }
    if (myD.challenge && myD.challenge === otherD.challenge) {
        m.challenge = true;
        m.chalLbl = CHALLENGE_LABELS[myD.challenge] || myD.challenge;
    }
    if (myD.method && myD.method === otherD.method) {
        m.method = true;
        m.methodLbl = METHOD_LABELS[myD.method] || myD.method;
    }
    if (myD.timePref && myD.timePref === otherD.timePref) {
        m.timePref = true;
        m.timeLbl = TIMEPREF_LABELS[myD.timePref] || myD.timePref;
    }
    if (myD.environment && myD.environment === otherD.environment) {
        m.env = true;
        m.envLbl = ENV_LABELS[myD.environment] || myD.environment;
    }
    if (myD.personality && myD.personality === otherD.personality) {
        m.personality = true;
        m.personaLbl = PERSONALITY_LABELS[myD.personality] || myD.personality;
    }

    return m;
}

function calcProximity(myD, otherD) {
    let score = 0;
    if (!myD || !otherD) return score;
    if (myD.goal === otherD.goal) score += 25;
    if (myD.category === otherD.category) score += 15;
    if (myD.hours === otherD.hours) score += 10;
    if (myD.challenge === otherD.challenge) score += 15;
    if (myD.method === otherD.method) score += 10;
    if (myD.timePref === otherD.timePref) score += 5;
    if (myD.environment === otherD.environment) score += 10;
    if (myD.personality === otherD.personality) score += 10;
    return score;
}

async function refreshNotifications() {
    if (!window.currentUser || !window.fetchPublicProfiles) return;

    const myD = window.state && window.state.diagnostic;
    if (!myD) {
        __notifications = [];
        renderNotificationBadge();
        return;
    }

    try {
        const profiles = await window.fetchPublicProfiles(80);
        const myXp = window.state.xp || 0;
        const myPts = window.state.pts || 0;
        const myTier = (window.TIERS || []).findIndex(t => myXp >= t.min && myXp <= t.max);
        const myUid = window.currentUser.uid;

        const matches = profiles
            .filter(p => p.uid !== myUid && p.diagnostic)
            .map(p => {
                const xp = p.xp || 0;
                const pts = p.pts || p.pontos || 0;
                const profile = p.profile || {};
                const otherD = p.diagnostic;

                const match = calcMatch(myD, otherD);
                const proximity = calcProximity(myD, otherD);

                const diff = xp - myXp;
                const overtake = diff > 0 && diff < 500;
                const approach = diff > -200 && diff <= 0 && diff > -500;
                const consistent = proximity >= 30 && Math.random() > 0.5;
                const xp100 = xp > 0 && xp % 100 === 0;
                const ptsDiff = Math.abs(pts - myPts);
                const ptsAhead = pts > myPts && ptsDiff > 0;
                const ptsBehind = myPts > pts && ptsDiff > 0;
                const recent = true;
                const sameTier = myTier >= 0 && (() => {
                    const ot = (window.TIERS || []).findIndex(t => xp >= t.min && xp <= t.max);
                    return ot === myTier;
                })();
                const higherTier = !sameTier && xp > myXp;
                const lowerTier = !sameTier && xp < myXp;
                const tierLbl = tierName(xp);

                const slots = p.slots || {};
                const allSlots = Object.values(slots).flat ? Object.values(slots).flat() : [];
                const courses = allSlots.filter(s => s && s.text).map(s => s.text);
                const sameCourse = courses.length > 0 && myD.goal ? true : false;

                return Object.assign(match, {
                    user: p, name: displayName(profile, "Jogador"),
                    xp, pts, avatar: avatarUrl(p.uid, profile),
                    proximity, diff,
                    overtake, approach, consistent, xp100,
                    ptsAhead, ptsBehind, ptsDiff,
                    recent, sameTier, higherTier, lowerTier, tierLbl,
                    sameCourse: false,
                    course: courses[0] || "",
                    slots,
                    profile
                });
            })
            .filter(m => {
                const hasMatchCond = m.goal || m.category || m.hours || m.challenge || m.method || m.timePref || m.env || m.personality;
                const hasContext = m.overtake || m.approach || m.consistent || m.ptsAhead || m.ptsBehind;
                return hasMatchCond || hasContext || m.proximity > 0;
            })
            .sort((a, b) => b.proximity - a.proximity)
            .slice(0, 20);

        const messages = [];
        const usedTemplateIndices = new Set();

        for (const match of matches) {
            const order = Array.from({ length: MESSAGE_GENERATORS.length }, (_, i) => i);
            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }

            for (const ti of order) {
                if (usedTemplateIndices.has(ti)) continue;
                const gen = MESSAGE_GENERATORS[ti];
                const text = gen(match, match);
                if (text) {
                    messages.push({
                        id: `n_${Date.now()}_${messages.length}`,
                        uid: match.user.uid,
                        userName: match.name,
                        avatar: match.avatar,
                        text,
                        time: Date.now(),
                        seen: false
                    });
                    usedTemplateIndices.add(ti);
                    break;
                }
            }
        }

        while (messages.length < 5 && matches.length > 0) {
            const fallbackIdx = Math.floor(Math.random() * matches.length);
            const m = matches[fallbackIdx];
            messages.push({
                id: `n_${Date.now()}_fallback_${messages.length}`,
                uid: m.user.uid,
                userName: m.name,
                avatar: m.avatar,
                text: `${m.name} está na comunidade e tem interesses parecidos com os seus!`,
                time: Date.now(),
                seen: false
            });
        }

        __notifications = messages;
        __unreadCount = messages.length;
        renderNotificationBadge();
        if (__panelOpen && $n("notif-panel")) { $n("notif-panel").remove(); openNotificationPanel(); }
    } catch (err) {
        console.warn("Notif refresh error:", err);
    }
}

/* ---- BELL UI ---- */

function renderNotificationBadge() {
    const badge = $n("notif-badge");
    const prompt = $n("notif-prompt-dot");

    if (!badge) return;

    const hasDiag = hasDiagnostic();
    __diagnosticAnswered = hasDiag;

    if (!hasDiag) {
        badge.style.display = "none";
        if (prompt) prompt.style.display = "block";
        return;
    }

    if (prompt) prompt.style.display = "none";

    const count = __unreadCount > 0 ? __unreadCount : 0;
    if (count > 0) {
        badge.textContent = count > 99 ? "99+" : count;
        badge.style.display = "flex";
    } else {
        badge.style.display = "none";
    }
}

function openNotificationPanel() {
    const existing = $n("notif-panel-wrap");
    if (existing) { closeNotificationPanel(); return; }

    const bellBtn = $n("notif-bell-btn");
    const rect = bellBtn.getBoundingClientRect();

    const wrap = document.createElement("div");
    wrap.id = "notif-panel-wrap";
    wrap.className = "notif-panel-wrap";
    wrap.onclick = (e) => { if (e.target === wrap) closeNotificationPanel(); };

    const panel = document.createElement("div");
    panel.id = "notif-panel";
    panel.className = "notif-panel-dropdown";
    panel.onclick = (e) => e.stopPropagation();

    panel.style.top = Math.min(rect.bottom + 8, window.innerHeight - 40) + "px";
    panel.style.right = Math.max(8, window.innerWidth - rect.right - 4) + "px";

    let content = `<div class="notif-panel-header">
        <h3>🔔 Notificações</h3>
        <button class="dialog-close-btn" onclick="closeNotificationPanel()">×</button>
    </div>
    <div class="notif-panel-body" id="notif-list">`;

    if (!window.currentUser) {
        content += `<div class="notif-empty">Faça login para receber notificações.</div>`;
    } else if (!hasDiagnostic()) {
        content += `<div class="notif-prompt" onclick="closeNotificationPanel();setTimeout(openDiagnosticDialog,100)">
            <div class="notif-prompt-icon">📋</div>
            <div class="notif-prompt-text">
                <strong>Responda ao Diagnóstico de Perfil</strong>
                <span>8 perguntas para conectar você a estudantes compatíveis</span>
            </div>
        </div>`;
    } else if (__notifications.length === 0) {
        content += `<div class="notif-empty">Nenhuma notificação no momento. Volte mais tarde!</div>`;
    } else {
        __notifications.forEach(n => {
            content += renderNotifItem(n);
        });
    }

    content += `</div>`;
    panel.innerHTML = content;
    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    requestAnimationFrame(() => { wrap.classList.add("open"); panel.classList.add("open"); });
    __panelOpen = true;

    if (__notifications.length > 0) {
        __unreadCount = 0;
        renderNotificationBadge();
    }
}

function renderNotifItem(n) {
    return `<div class="notif-item ${n.seen ? "" : "notif-item-unread"}" onclick="onNotifClick('${n.uid}','${n.id}')">
        <img class="notif-avatar" src="${n.avatar}" alt="" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ccc%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2230%22>🧑</text></svg>'">
        <div class="notif-body">
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${formatNotifTime(n.time)}</div>
        </div>
    </div>`;
}

function formatNotifTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return "agora";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
}

function closeNotificationPanel() {
    const wrap = $n("notif-panel-wrap");
    if (wrap) {
        wrap.classList.remove("open");
        const p = $n("notif-panel");
        if (p) p.classList.remove("open");
        setTimeout(() => wrap.remove(), 200);
        __panelOpen = false;
    }
}

function onNotifClick(uid, nid) {
    closeNotificationPanel();
    if (uid) openProfileModal(uid);

    const n = __notifications.find(x => x.id === nid);
    if (n) n.seen = true;
}

/* ---- MODAL DE PERFIL ---- */

async function openProfileModal(uid) {
    const existing = $n("notif-profile-modal");
    if (existing) existing.remove();

    const d = document.createElement("dialog");
    d.id = "notif-profile-modal";
    d.className = "theme-bento-dialog";

    d.innerHTML = `<div class="bento-card dialog-theme-card" style="max-width:380px;">
        <div class="dialog-header-block">
            <h3>Perfil do Jogador</h3>
            <button class="dialog-close-btn" onclick="closeProfileModal()">×</button>
        </div>
        <div class="dialog-body" id="notif-profile-body">
            <div class="notif-profile-loading">Carregando...</div>
        </div>
    </div>`;

    document.body.appendChild(d);
    d.showModal();

    try {
        const profiles = await window.fetchPublicProfiles(200);
        const data = profiles.find(p => p.uid === uid);

        if (!data) {
            $n("notif-profile-body").innerHTML = `<div class="notif-empty">Perfil não encontrado.</div>`;
            return;
        }

        const profile = data.profile || {};
        const xp = data.xp || 0;
        const pts = data.pts || data.pontos || 0;
        const name = displayName(profile, "Jogador");
        const avatar = avatarUrl(uid, profile);
        const goal = profile.epicGoal || "Sem meta definida";
        const tier = tierName(xp);
        const desc = profile.description || "";

        $n("notif-profile-body").innerHTML = `
            <div class="notif-profile-card">
                <img class="notif-profile-avatar" src="${avatar}" alt="" loading="lazy"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ccc%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2230%22>🧑</text></svg>'">
                <div class="notif-profile-name">${name}</div>
                <div class="notif-profile-rank">${tier}</div>
                <div class="notif-profile-stats">
                    <span>⚡ ${xp} XP</span>
                    <span>🏆 ${pts} Pts</span>
                </div>
                <div class="notif-profile-goal">🎯 ${goal}</div>
                ${desc ? `<div class="notif-profile-desc">${desc}</div>` : ""}
                <button class="btn-theme w-full" style="margin-top:0.75rem;" onclick="closeProfileModal();navigateTo('comunidade.html')">
                    🌐 Ver na Comunidade
                </button>
            </div>`;
    } catch (err) {
        console.warn("Profile modal error:", err);
        if ($n("notif-profile-body")) {
            $n("notif-profile-body").innerHTML = `<div class="notif-empty">Erro ao carregar perfil.</div>`;
        }
    }
}

function closeProfileModal() {
    const d = $n("notif-profile-modal");
    if (d) d.close();
}

/* ---- PROMPT PERIÓDICO ---- */

function showDiagnosticPrompt() {
    if (hasDiagnostic() || !window.currentUser) return;
    window.toast("📋 Responda ao Diagnóstico de Perfil (8 perguntas) para se conectar a outros estudantes!", false, 8000);
}

function scheduleDiagnosticPrompt() {
    if (__promptTimer) clearInterval(__promptTimer);
    __promptTimer = setInterval(() => {
        if (hasDiagnostic() || !window.currentUser) return;
        showDiagnosticPrompt();
    }, 120000);
}

/* ---- INICIALIZAÇÃO ---- */

async function initNotifications() {
    if (__initTimer) clearTimeout(__initTimer);

    if (!window.currentUser) {
        __diagnosticAnswered = false;
        renderNotificationBadge();
        return;
    }

    __diagnosticAnswered = hasDiagnostic();

    if (hasDiagnostic()) {
        renderNotificationBadge();
        await refreshNotifications();
    } else {
        renderNotificationBadge();
        setTimeout(showDiagnosticPrompt, 3000);
    }

    scheduleDiagnosticPrompt();

    if (__refreshTimer) clearInterval(__refreshTimer);
    __refreshTimer = setInterval(() => {
        if (window.currentUser && hasDiagnostic()) {
            refreshNotifications();
        }
    }, 300000);
}

/* ---- EXPORT WINDOW ---- */

window.openDiagnosticDialog     = openDiagnosticDialog;
window.closeDiagnosticDialog    = closeDiagnosticDialog;
window.submitDiagnostic         = submitDiagnostic;
window.diagNext                 = diagNext;
window.diagPrev                 = diagPrev;
window.goToStep                 = goToStep;
window.selectDiagOption         = selectDiagOption;
window.openNotificationPanel    = openNotificationPanel;
window.closeNotificationPanel   = closeNotificationPanel;
window.openProfileModal         = openProfileModal;
window.closeProfileModal        = closeProfileModal;
window.refreshNotifications     = refreshNotifications;
window.initNotifications        = initNotifications;
window.renderNotifItem          = renderNotifItem;

/* Monitora mudanças de currentUser para (re)inicializar */
(function watchUser() {
    let lastUid = window.currentUser && window.currentUser.uid;
    setInterval(() => {
        const uid = window.currentUser && window.currentUser.uid;
        if (uid !== lastUid) {
            lastUid = uid;
            if (uid) initNotifications();
            else {
                __diagnosticAnswered = false;
                __notifications = [];
                __unreadCount = 0;
                renderNotificationBadge();
            }
        }
    }, 1000);
})();

/* Init on DOM ready if user already logged in */
document.addEventListener("DOMContentLoaded", () => {
    if (window.currentUser) {
        setTimeout(initNotifications, 500);
    }
});
