/* ---- PERGUNTA 1: ROUTER (multi-select) ---- */
const Q_FOCUS_AREAS = {
    id: "focusAreas",
    icon: "🎯",
    label: "O que faz parte da sua vida? (marque um ou mais)",
    type: "multiselect",
    hint: "Isso define quais perguntas você vai responder",
    options: [
        { v: "vest", l: "🎓 Prestar Vestibular / ENEM", i: "🎓" },
        { v: "conc", l: "📋 Passar em Concurso Público", i: "📋" },
        { v: "work", l: "💼 Crescer no Mercado de Trabalho", i: "💼" },
        { v: "fit",  l: "💪 Mudar o Shape / Saúde", i: "💪" },
        { v: "learn",l: "📚 Aprender por prazer", i: "📚" }
    ]
};

/* ---- PERGUNTAS GLOBAIS ---- */
const Q_BIRTH_YEAR = {
    id: "birthYear",
    icon: "🎂",
    label: "Qual o seu ano de nascimento?",
    type: "number",
    min: 1970,
    max: 2016,
    placeholder: "Ex: 2008",
    track: "global"
};

const Q_CHALLENGE = {
    id: "mainChallenge",
    icon: "🧗",
    label: "Qual desafio mais atrapalha sua rotina?",
    type: "select",
    track: "global",
    options: [
        { v: "inercia",      l: "Começar — a inércia inicial", i: "⏳" },
        { v: "distracao",    l: "Manter o foco — me distraio fácil", i: "📱" },
        { v: "consistencia", l: "Manter a consistência na semana", i: "📅" },
        { v: "ansiedade",    l: "Ansiedade e autossabotagem", i: "😰" },
        { v: "cansaço",      l: "Cansaço físico / mental", i: "😴" },
        { v: "organizacao",  l: "Falta de planejamento", i: "🗂️" },
        { v: "comparacao",   l: "Me comparar com os outros", i: "😞" }
    ]
};

const Q_STUDY_PERIOD = {
    id: "studyPeriod",
    icon: "🌙",
    label: "Em qual período do dia você rende mais?",
    type: "select",
    track: "global",
    options: [
        { v: "manha",     l: "Manhã — logo ao acordar", i: "🌅" },
        { v: "tarde",     l: "Tarde — pós-almoço", i: "☀️" },
        { v: "noite",     l: "Noite — após o jantar", i: "🌆" },
        { v: "madrugada", l: "Madrugada — silêncio total", i: "🌃" },
        { v: "flexivel",  l: "Flexível — qualquer horário", i: "🔄" }
    ]
};

const Q_EDU_LEVEL = {
    id: "eduLevel",
    icon: "📖",
    label: "Qual seu nível de escolaridade atual?",
    type: "select",
    track: "global",
    options: [
        { v: "fundamental",        l: "Ensino Fundamental", i: "🏫" },
        { v: "medio-cursando",     l: "Ensino Médio (cursando)", i: "📝" },
        { v: "medio-completo",     l: "Ensino Médio (completo)", i: "✅" },
        { v: "cursinho",           l: "Cursinho Preparatório", i: "📚" },
        { v: "superior-cursando",  l: "Ensino Superior (cursando)", i: "🎓" },
        { v: "superior-completo",  l: "Ensino Superior (completo)", i: "📜" },
        { v: "pos-graduacao",      l: "Pós / Mestrado / Doutorado", i: "🔬" }
    ]
};

/* ---- TRACK VESTIBULAR ---- */
const Q_COURSE_AREA = {
    id: "courseArea",
    icon: "📚",
    label: "Qual área de conhecimento você mais se identifica?",
    type: "select",
    track: "vest",
    options: [
        { v: "saude",        l: "Ciências da Saúde", i: "🩺" },
        { v: "engenharias",  l: "Engenharias", i: "🏗️" },
        { v: "exatas-ti",    l: "Exatas & TI", i: "💻" },
        { v: "humanas",      l: "Humanas & Sociais", i: "📜" },
        { v: "artes",        l: "Artes, Comunicação & Design", i: "🎨" },
        { v: "biologicas",   l: "Biológicas & Agrárias", i: "🌿" },
        { v: "militar",      l: "Militar & Policial", i: "🎖️" }
    ]
};

const Q_TARGET_COURSE = {
    id: "targetCourse",
    icon: "🎯",
    label: "Qual curso você mais quer?",
    type: "select",
    track: "vest",
    dependsOn: { field: "courseArea", source: "COURSES_BY_AREA" }
};

const Q_UNI_TYPE = {
    id: "uniType",
    icon: "🏛️",
    label: "Qual tipo de universidade você almeja?",
    type: "select",
    track: "vest",
    options: [
        { v: "federal",    l: "Federal (Pública Federal)", i: "🏛️" },
        { v: "estadual",   l: "Estadual (Pública Estadual)", i: "🏛️" },
        { v: "municipal",  l: "Municipal (Pública Municipal)", i: "🏛️" },
        { v: "privada",    l: "Privada (com bolsa/ProUni/FIES)", i: "💳" },
        { v: "militar",    l: "Militar (EsPCEx, AFA, EFOMM)", i: "🎖️" },
        { v: "if",         l: "IF / Tecnológica", i: "🔧" },
        { v: "exterior",   l: "Fora do país", i: "🌍" },
        { v: "indeciso",   l: "Ainda não decidi", i: "🤔" }
    ]
};

const Q_STUDY_HOURS = {
    id: "studyHours",
    icon: "⏰",
    label: "Quanto tempo você estuda por dia?",
    type: "select",
    track: ["vest", "conc", "learn"],
    options: [
        { v: "leve",     l: "Leve — Até 1 hora", i: "🌱" },
        { v: "moderado", l: "Moderado — 1 a 2 horas", i: "🔥" },
        { v: "padrao",   l: "Padrão — 2 a 4 horas", i: "⚡" },
        { v: "intenso",  l: "Intenso — 4 a 6 horas", i: "💪" },
        { v: "extremo",  l: "Extremo — Mais de 6 horas", i: "🏋️" }
    ]
};

const Q_STUDY_METHOD = {
    id: "studyMethod",
    icon: "✏️",
    label: "Qual método de estudo você mais usa?",
    type: "select",
    track: ["vest", "conc", "learn"],
    options: [
        { v: "exercicios",  l: "Exercícios e questões", i: "📝" },
        { v: "leitura",     l: "Leitura e releitura", i: "📖" },
        { v: "mapas",       l: "Mapas mentais e resumos", i: "🧠" },
        { v: "flashcards",  l: "Flashcards e repetição", i: "🃏" },
        { v: "video",       l: "Videoaulas", i: "🎬" },
        { v: "pratico",     l: "Projetos práticos", i: "🔧" },
        { v: "questoes",    l: "Provas anteriores", i: "📋" }
    ]
};

const Q_EXAM_ATTEMPTED = {
    id: "examAttempted",
    icon: "🔄",
    label: "Já prestou vestibular / ENEM antes?",
    type: "select",
    track: "vest",
    options: [
        { v: "nunca",   l: "Nunca — é minha primeira vez", i: "🌟" },
        { v: "sim",     l: "Sim — já tentei antes", i: "🔄" },
        { v: "passei",  l: "Sim — e já passei em algo", i: "✅" }
    ]
};

/* ---- TRACK CONCURSO ---- */
const Q_CONTEST_LEVEL = {
    id: "contestLevel",
    icon: "📋",
    label: "Qual nível de concurso você busca?",
    type: "select",
    track: "conc",
    options: [
        { v: "municipal",  l: "Municipal", i: "🏙️" },
        { v: "estadual",   l: "Estadual", i: "🗺️" },
        { v: "federal",    l: "Federal", i: "🏛️" },
        { v: "legislativo",l: "Legislativo", i: "📜" },
        { v: "tribunais",  l: "Tribunais (Judiciário)", i: "⚖️" }
    ]
};

const Q_CONTEST_AREA = {
    id: "contestArea",
    icon: "📂",
    label: "Qual área de concurso mais te interessa?",
    type: "select",
    track: "conc",
    options: [
        { v: "administrativa", l: "Administrativa", i: "📊" },
        { v: "fiscal",         l: "Fiscal / Tributária", i: "💰" },
        { v: "policial",       l: "Policial (PC, PRF, PF)", i: "🚔" },
        { v: "militar",        l: "Militar (EsPCEx, AFA, EFOMM)", i: "🎖️" },
        { v: "juridica",       l: "Jurídica (Juiz, Promotor)", i: "⚖️" },
        { v: "bancaria",       l: "Bancária / Finanças", i: "🏦" },
        { v: "saude",          l: "Saúde Pública", i: "🏥" },
        { v: "educacao",       l: "Educação (Professor)", i: "📚" },
        { v: "tecnologia",     l: "Tecnologia da Informação", i: "💻" }
    ]
};

const Q_ALREADY_CIVIL = {
    id: "alreadyCivilServant",
    icon: "🏅",
    label: "Você já é concursado?",
    type: "select",
    track: "conc",
    options: [
        { v: "nao",      l: "Não — começando agora", i: "🌟" },
        { v: "estudo",   l: "Não — mas já estudo há +1 ano", i: "📚" },
        { v: "sim",      l: "Sim — já sou concursado(a)", i: "✅" }
    ]
};

/* ---- TRACK MERCADO DE TRABALHO ---- */
const Q_WORK_SECTOR = {
    id: "workSector",
    icon: "💼",
    label: "Qual seu ramo de atuação?",
    type: "select",
    track: "work",
    options: [
        { v: "tecnologia",      l: "Tecnologia", i: "💻" },
        { v: "saude",           l: "Saúde", i: "🩺" },
        { v: "educacao",        l: "Educação", i: "📚" },
        { v: "engenharia",      l: "Engenharia & Indústria", i: "🏭" },
        { v: "adm-financas",    l: "Administração & Finanças", i: "📊" },
        { v: "direito",         l: "Direito", i: "⚖️" },
        { v: "comunicacao",     l: "Comunicação & Artes", i: "🎨" },
        { v: "comercio",        l: "Comércio & Vendas", i: "🏪" },
        { v: "servico-publico", l: "Serviço Público", i: "🏛️" },
        { v: "autonomo",        l: "Autônomo / Freelancer", i: "🆓" },
        { v: "conteudo",        l: "Produção de Conteúdo", i: "🎬" },
        { v: "nao-trabalho",    l: "Não trabalho / Estudo apenas", i: "📖" }
    ]
};

const Q_TARGET_PROFESSION = {
    id: "targetProfession",
    icon: "🆔",
    label: "Qual sua profissão ou cargo atual?",
    type: "select",
    track: "work",
    dependsOn: { field: "workSector", source: "PROFESSIONS_BY_SECTOR" }
};

const Q_CAREER_GOAL = {
    id: "careerGoal",
    icon: "🚀",
    label: "Qual sua meta profissional agora?",
    type: "select",
    track: "work",
    options: [
        { v: "emprego",      l: "Conseguir meu primeiro emprego", i: "🌟" },
        { v: "promocao",     l: "Ser promovido / crescer", i: "📈" },
        { v: "transicao",    l: "Fazer transição de carreira", i: "🔄" },
        { v: "estabilidade", l: "Buscar estabilidade financeira", i: "🔒" },
        { v: "empreender",   l: "Empreender / abrir negócio", i: "🚀" },
        { v: "aprender",     l: "Aprender novas habilidades", i: "📚" }
    ]
};

/* ---- TRACK FIT ---- */
const Q_BODY_GOAL = {
    id: "bodyGoal",
    icon: "💪",
    label: "Qual sua meta de shape?",
    type: "select",
    track: "fit",
    options: [
        { v: "seco-definido",   l: "Seco / Definido — tanquinho à vista", i: "🔥" },
        { v: "musculoso",       l: "Musculoso / Grande — volume máximo", i: "💪" },
        { v: "atletico",        l: "Atlético / Esportivo — performance", i: "⚡" },
        { v: "hipertrofia",     l: "Hipertrofia / Massa magra", i: "🏋️" },
        { v: "magro-natural",   l: "Magro natural — manter biotipo", i: "🧘" },
        { v: "emagrecer",       l: "Emagrecimento — perder peso", i: "📉" },
        { v: "simetrico",       l: "Simétrico / Estético — proporção", i: "🎨" },
        { v: "calistenia",      l: "Calistenia / Peso corporal", i: "🤸" },
        { v: "potencia",        l: "Potência / Força bruta", i: "🏋️‍♂️" },
        { v: "resistencia",     l: "Resistência / Condicionamento", i: "🏃" },
        { v: "saude-bemestar",  l: "Saúde e bem-estar", i: "🌿" },
        { v: "nenhuma",         l: "Não tenho meta de shape", i: "😐" }
    ]
};

const Q_TRAINING_FREQ = {
    id: "trainingFreq",
    icon: "📅",
    label: "Com que frequência você treina?",
    type: "select",
    track: "fit",
    options: [
        { v: "nunca",    l: "Não treino ainda", i: "😴" },
        { v: "leve",     l: "1 a 2 vezes por semana", i: "🌱" },
        { v: "medio",    l: "3 a 4 vezes por semana", i: "🔥" },
        { v: "intenso",  l: "5 vezes ou mais por semana", i: "💪" },
        { v: "diario",   l: "Todos os dias", i: "🏆" }
    ]
};

const Q_TRAINING_TYPE = {
    id: "trainingType",
    icon: "🏋️",
    label: "Qual tipo de treino é sua praia?",
    type: "select",
    track: "fit",
    options: [
        { v: "musculacao",  l: "Musculação / Academia", i: "🏋️" },
        { v: "calistenia",  l: "Calistenia / Rua", i: "🤸" },
        { v: "crossfit",    l: "Crossfit / Funcional", i: "💥" },
        { v: "corrida",     l: "Corrida / Street", i: "🏃" },
        { v: "natacao",     l: "Natação / Aquático", i: "🏊" },
        { v: "lutas",       l: "Lutas / Artes Marciais", i: "🥋" },
        { v: "coletivos",   l: "Esportes Coletivos", i: "⚽" },
        { v: "yoga",        l: "Yoga / Pilates / Alongamento", i: "🧘" },
        { v: "outro",       l: "Outro tipo", i: "🔀" }
    ]
};

/* ---- TRACK APRENDIZADO PESSOAL ---- */
const Q_PERSONAL_INTEREST = {
    id: "personalInterest",
    icon: "📚",
    label: "O que você quer aprender por prazer?",
    type: "select",
    track: "learn",
    options: [
        { v: "idiomas",      l: "Idiomas (inglês, espanhol...)", i: "🌍" },
        { v: "musica",       l: "Música / Instrumento", i: "🎵" },
        { v: "artes",        l: "Artes / Design / Criatividade", i: "🎨" },
        { v: "filosofia",    l: "Filosofia / Autoconhecimento", i: "🧠" },
        { v: "programacao",  l: "Programação / Tecnologia", i: "💻" },
        { v: "foto-video",   l: "Fotografia / Vídeo / Edição", i: "📸" },
        { v: "escrita",      l: "Escrita / Criação de conteúdo", i: "✍️" },
        { v: "historia",     l: "História / Cultura / Sociedade", i: "📜" },
        { v: "ciencias",     l: "Ciências / Curiosidade", i: "🔬" },
        { v: "gastronomia",  l: "Gastronomia / Culinária", i: "🍳" },
        { v: "outro",        l: "Outro", i: "🔀" }
    ]
};

/* ---- VERSÃO DO DIAGNÓSTICO ---- */
const DIAGNOSTIC_VERSION = 2;

/* ---- LISTA MESTRA ---- */
const DIAGNOSTIC_QUESTIONS = [
    Q_FOCUS_AREAS,
    Q_BIRTH_YEAR,
    Q_CHALLENGE,
    Q_STUDY_PERIOD,
    Q_EDU_LEVEL,
    Q_COURSE_AREA,
    Q_TARGET_COURSE,
    Q_UNI_TYPE,
    Q_STUDY_HOURS,
    Q_STUDY_METHOD,
    Q_EXAM_ATTEMPTED,
    Q_CONTEST_LEVEL,
    Q_CONTEST_AREA,
    Q_ALREADY_CIVIL,
    Q_WORK_SECTOR,
    Q_TARGET_PROFESSION,
    Q_CAREER_GOAL,
    Q_BODY_GOAL,
    Q_TRAINING_FREQ,
    Q_TRAINING_TYPE,
    Q_PERSONAL_INTEREST
];

/* ---- ÁRVORE DE CURSOS ---- */
const COURSES_BY_AREA = {
    saude: [
        { v: "medicina",         l: "Medicina", i: "🩺" },
        { v: "enfermagem",       l: "Enfermagem", i: "🏥" },
        { v: "odontologia",      l: "Odontologia", i: "🦷" },
        { v: "farmacia",         l: "Farmácia", i: "💊" },
        { v: "fisioterapia",     l: "Fisioterapia", i: "🦿" },
        { v: "nutricao",         l: "Nutrição", i: "🥗" },
        { v: "psicologia",       l: "Psicologia", i: "🧠" },
        { v: "biomedicina",      l: "Biomedicina", i: "🔬" },
        { v: "educacao-fisica",  l: "Educação Física", i: "🏋️" },
        { v: "veterinaria",      l: "Medicina Veterinária", i: "🐾" },
        { v: "fonoaudiologia",   l: "Fonoaudiologia", i: "🗣️" }
    ],
    engenharias: [
        { v: "eng-civil",        l: "Engenharia Civil", i: "🏗️" },
        { v: "eng-computacao",   l: "Engenharia de Computação", i: "💻" },
        { v: "eng-producao",     l: "Engenharia de Produção", i: "🏭" },
        { v: "eng-mecanica",     l: "Engenharia Mecânica", i: "⚙️" },
        { v: "eng-eletrica",     l: "Engenharia Elétrica", i: "⚡" },
        { v: "eng-quimica",      l: "Engenharia Química", i: "🧪" },
        { v: "eng-ambiental",    l: "Engenharia Ambiental", i: "🌿" },
        { v: "eng-mecatronica",  l: "Engenharia Mecatrônica", i: "🤖" },
        { v: "eng-aeroespacial", l: "Engenharia Aeroespacial", i: "🚀" }
    ],
    "exatas-ti": [
        { v: "ccomp",            l: "Ciência da Computação", i: "💻" },
        { v: "sistemas",         l: "Sistemas de Informação", i: "📊" },
        { v: "eng-software",     l: "Engenharia de Software", i: "🖥️" },
        { v: "dados-ia",         l: "Ciência de Dados / IA", i: "🤖" },
        { v: "matematica",       l: "Matemática", i: "➕" },
        { v: "fisica",           l: "Física", i: "⚛️" },
        { v: "estatistica",      l: "Estatística", i: "📈" },
        { v: "quimica",          l: "Química", i: "🧪" }
    ],
    humanas: [
        { v: "direito",          l: "Direito", i: "⚖️" },
        { v: "administracao",    l: "Administração", i: "📊" },
        { v: "contabeis",        l: "Ciências Contábeis", i: "📋" },
        { v: "economia",         l: "Economia", i: "💰" },
        { v: "pedagogia",        l: "Pedagogia", i: "📚" },
        { v: "historia",         l: "História", i: "📜" },
        { v: "geografia",        l: "Geografia", i: "🌍" },
        { v: "filosofia",        l: "Filosofia", i: "🤔" },
        { v: "sociologia",       l: "Sociologia", i: "👥" },
        { v: "servico-social",   l: "Serviço Social", i: "🤝" },
        { v: "jornalismo",       l: "Jornalismo", i: "📰" },
        { v: "publicidade",      l: "Publicidade e Propaganda", i: "📢" },
        { v: "relacoes-internacionais", l: "Relações Internacionais", i: "🌐" },
        { v: "letras",           l: "Letras / Português", i: "📝" }
    ],
    artes: [
        { v: "arquitetura",      l: "Arquitetura e Urbanismo", i: "🏛️" },
        { v: "design-grafico",   l: "Design Gráfico", i: "🎨" },
        { v: "design-moda",      l: "Design de Moda", i: "👗" },
        { v: "design-interiores",l: "Design de Interiores", i: "🏠" },
        { v: "cinema",           l: "Cinema e Audiovisual", i: "🎬" },
        { v: "artes-visuais",    l: "Artes Visuais", i: "🖼️" },
        { v: "musica",           l: "Música", i: "🎵" },
        { v: "teatro",           l: "Teatro", i: "🎭" },
        { v: "fotografia",       l: "Fotografia", i: "📸" }
    ],
    biologicas: [
        { v: "biologia",         l: "Ciências Biológicas", i: "🧬" },
        { v: "agronomia",        l: "Agronomia", i: "🌱" },
        { v: "eng-florestal",    l: "Engenharia Florestal", i: "🌲" },
        { v: "zootecnia",        l: "Zootecnia", i: "🐄" },
        { v: "oceanografia",     l: "Oceanografia", i: "🌊" },
        { v: "ecologia",         l: "Ecologia", i: "🌿" },
        { v: "gestao-ambiental", l: "Gestão Ambiental", i: "♻️" }
    ],
    militar: [
        { v: "especex",          l: "EsPCEx (Exército)", i: "🎖️" },
        { v: "afa",              l: "AFA (Aeronáutica)", i: "✈️" },
        { v: "efomm",            l: "EFOMM (Marinha)", i: "⚓" },
        { v: "policia-federal",  l: "Polícia Federal", i: "🚔" },
        { v: "policia-militar",  l: "Polícia Militar", i: "👮" },
        { v: "bombeiro",         l: "Bombeiro Militar", i: "🚒" }
    ]
};

/* ---- ÁRVORE DE PROFISSÕES ---- */
const PROFESSIONS_BY_SECTOR = {
    tecnologia: [
        { v: "dev-frontend",    l: "Desenvolvedor Frontend", i: "🎨" },
        { v: "dev-backend",     l: "Desenvolvedor Backend", i: "⚙️" },
        { v: "dev-mobile",      l: "Desenvolvedor Mobile", i: "📱" },
        { v: "dados-ia",        l: "Cientista de Dados / IA", i: "🤖" },
        { v: "infra-cloud",     l: "Analista de Infra / Cloud", i: "☁️" },
        { v: "seguranca",       l: "Analista de Segurança", i: "🔒" },
        { v: "suporte-ti",      l: "Analista de Suporte / TI", i: "🔧" },
        { v: "product-manager", l: "Product Manager", i: "📋" },
        { v: "ux-ui",           l: "UX / UI Designer", i: "🖌️" },
        { v: "devops",          l: "DevOps / SRE", i: "🔄" },
        { v: "qa",              l: "QA / Tester", i: "🧪" }
    ],
    saude: [
        { v: "medico",          l: "Médico", i: "🩺" },
        { v: "enfermeiro",      l: "Enfermeiro", i: "🏥" },
        { v: "dentista",        l: "Dentista", i: "🦷" },
        { v: "farmaceutico",    l: "Farmacêutico", i: "💊" },
        { v: "fisioterapeuta",  l: "Fisioterapeuta", i: "🦿" },
        { v: "nutricionista",   l: "Nutricionista", i: "🥗" },
        { v: "psicologo",       l: "Psicólogo", i: "🧠" },
        { v: "biomedico",       l: "Biomédico", i: "🔬" },
        { v: "educador-fisico", l: "Educador Físico", i: "🏋️" },
        { v: "veterinario",     l: "Veterinário", i: "🐾" },
        { v: "fonoaudiologo",   l: "Fonoaudiólogo", i: "🗣️" },
        { v: "tecnico-saude",   l: "Técnico em Saúde", i: "🩻" }
    ],
    educacao: [
        { v: "prof-infantil",   l: "Professor Infantil / Fundamental", i: "👶" },
        { v: "prof-medio",      l: "Professor Ensino Médio", i: "📖" },
        { v: "prof-superior",   l: "Professor Ensino Superior", i: "🎓" },
        { v: "prof-cursinho",   l: "Professor de Cursinho", i: "📝" },
        { v: "pedagogo",        l: "Pedagogo / Orientador", i: "🧭" },
        { v: "tutor",           l: "Tutor / Coach Educacional", i: "🎯" }
    ],
    engenharia: [
        { v: "eng-civil",       l: "Engenheiro Civil", i: "🏗️" },
        { v: "eng-computacao",  l: "Engenheiro de Computação", i: "💻" },
        { v: "eng-producao",    l: "Engenheiro de Produção", i: "🏭" },
        { v: "eng-mecanico",    l: "Engenheiro Mecânico", i: "⚙️" },
        { v: "eng-eletrico",    l: "Engenheiro Elétrico", i: "⚡" },
        { v: "eng-quimico",     l: "Engenheiro Químico", i: "🧪" },
        { v: "tecnico-indust",  l: "Técnico Industrial", i: "🔧" }
    ],
    "adm-financas": [
        { v: "administrador",   l: "Administrador", i: "📊" },
        { v: "contador",        l: "Contador", i: "📋" },
        { v: "economista",      l: "Economista", i: "💰" },
        { v: "analista-fin",    l: "Analista Financeiro", i: "📈" },
        { v: "analista-rh",     l: "Analista de RH", i: "👥" },
        { v: "consultor",       l: "Consultor", i: "💡" }
    ],
    direito: [
        { v: "advogado",        l: "Advogado", i: "⚖️" },
        { v: "juiz",            l: "Juiz", i: "🏛️" },
        { v: "promotor",        l: "Promotor / Procurador", i: "📜" },
        { v: "defensor",        l: "Defensor Público", i: "🛡️" },
        { v: "tecnico-jur",     l: "Técnico Jurídico", i: "📝" }
    ],
    comunicacao: [
        { v: "jornalista",      l: "Jornalista", i: "📰" },
        { v: "publicitario",    l: "Publicitário", i: "📢" },
        { v: "designer",        l: "Designer", i: "🎨" },
        { v: "produtor-audio",  l: "Produtor Audiovisual", i: "🎬" },
        { v: "fotografo",       l: "Fotógrafo", i: "📸" },
        { v: "social-media",    l: "Social Media", i: "📱" },
        { v: "redator",         l: "Redator / Copywriter", i: "✍️" }
    ],
    comercio: [
        { v: "vendedor",        l: "Vendedor / Consultor", i: "🛍️" },
        { v: "corretor",        l: "Corretor de Imóveis", i: "🏠" },
        { v: "representante",   l: "Representante Comercial", i: "📞" },
        { v: "gerente-vendas",  l: "Gerente de Vendas", i: "📈" },
        { v: "ecommerce",       l: "E-commerce / Digital", i: "🛒" }
    ],
    "servico-publico": [
        { v: "servidor-municipal", l: "Servidor Municipal", i: "🏙️" },
        { v: "servidor-estadual",  l: "Servidor Estadual", i: "🗺️" },
        { v: "servidor-federal",   l: "Servidor Federal", i: "🏛️" },
        { v: "militar-forcas",     l: "Militar (Forças Armadas)", i: "🎖️" },
        { v: "policial",           l: "Policial", i: "🚔" },
        { v: "tecnico-legislativo",l: "Técnico Legislativo", i: "📜" }
    ],
    autonomo: [
        { v: "freela-ti",       l: "Freelancer de TI", i: "💻" },
        { v: "freela-criativo", l: "Freelancer Criativo", i: "🎨" },
        { v: "produtor-conteudo",l: "Produtor de Conteúdo", i: "📱" },
        { v: "criador-digital", l: "Criador Digital", i: "🌟" },
        { v: "motorista-app",   l: "Motorista de App", i: "🚗" },
        { v: "entregador",      l: "Entregador / Ifood", i: "🛵" }
    ],
    conteudo: [
        { v: "youtuber",        l: "YouTuber", i: "▶️" },
        { v: "streamer",        l: "Streamer", i: "🔴" },
        { v: "podcaster",       l: "Podcaster", i: "🎙️" },
        { v: "influenciador",   l: "Influenciador Digital", i: "📸" },
        { v: "blogueiro",       l: "Blogueiro / Escritor", i: "✍️" }
    ]
};

/* ---- LABELS ---- */
const FOCUS_AREA_LABELS = {
    vest: "Vestibular / ENEM", conc: "Concurso Público",
    work: "Mercado de Trabalho", fit: "Fit & Saúde", learn: "Aprendizado Pessoal"
};

const COURSE_AREA_LABELS = {
    saude: "Saúde", engenharias: "Engenharias", "exatas-ti": "Exatas & TI",
    humanas: "Humanas & Sociais", artes: "Artes & Design",
    biologicas: "Biológicas & Agrárias", militar: "Militar & Policial"
};

const COURSE_LABELS = {};
for (const arr of Object.values(COURSES_BY_AREA)) {
    for (const c of arr) COURSE_LABELS[c.v] = c.l;
}

const UNI_TYPE_LABELS = {
    federal: "Federal", estadual: "Estadual", municipal: "Municipal",
    privada: "Privada", militar: "Militar", if: "IF / Tecnológica",
    exterior: "Exterior", indeciso: "Indeciso"
};

const WORK_SECTOR_LABELS = {
    tecnologia: "Tecnologia", saude: "Saúde", educacao: "Educação",
    engenharia: "Engenharia & Indústria", "adm-financas": "ADM & Finanças",
    direito: "Direito", comunicacao: "Comunicação & Artes",
    comercio: "Comércio & Vendas", "servico-publico": "Serviço Público",
    autonomo: "Autônomo / Freelancer", conteudo: "Produção de Conteúdo",
    "nao-trabalho": "Não trabalho"
};

const PROFESSION_LABELS = {};
for (const arr of Object.values(PROFESSIONS_BY_SECTOR)) {
    for (const p of arr) PROFESSION_LABELS[p.v] = p.l;
}

const BODY_GOAL_LABELS = {
    "seco-definido": "Seco / Definido", musculoso: "Musculoso",
    atletico: "Atlético", hipertrofia: "Hipertrofia",
    "magro-natural": "Magro natural", emagrecer: "Emagrecimento",
    simetrico: "Simétrico / Estético", calistenia: "Calistenia",
    potencia: "Potência / Força", resistencia: "Resistência",
    "saude-bemestar": "Saúde e bem-estar", nenhuma: "Sem meta"
};

const TRAINING_FREQ_LABELS = {
    nunca: "Não treina", leve: "1-2x/sem", medio: "3-4x/sem",
    intenso: "5+x/sem", diario: "Todo dia"
};

const TRAINING_TYPE_LABELS = {
    musculacao: "Musculação", calistenia: "Calistenia", crossfit: "Crossfit",
    corrida: "Corrida", natacao: "Natação", lutas: "Lutas / Artes Marciais",
    coletivos: "Esportes Coletivos", yoga: "Yoga / Pilates", outro: "Outro"
};

const EDU_LEVEL_LABELS = {
    fundamental: "Ensino Fundamental", "medio-cursando": "Ensino Médio (cursando)",
    "medio-completo": "Ensino Médio (completo)", cursinho: "Cursinho",
    "superior-cursando": "Superior (cursando)", "superior-completo": "Superior (completo)",
    "pos-graduacao": "Pós / Mestrado / Doutorado"
};

const CHALLENGE_LABELS = {
    inercia: "inércia inicial", distracao: "distrações",
    consistencia: "consistência", ansiedade: "ansiedade",
    "cansaço": "cansaço", organizacao: "organização", comparacao: "comparação"
};

const STUDY_HOURS_LABELS = {
    leve: "até 1h/dia", moderado: "1-2h/dia", padrao: "2-4h/dia",
    intenso: "4-6h/dia", extremo: "mais de 6h/dia"
};

const STUDY_METHOD_LABELS = {
    exercicios: "Exercícios", leitura: "Leitura", mapas: "Mapas mentais",
    flashcards: "Flashcards", video: "Videoaulas", pratico: "Prático",
    questoes: "Provas anteriores"
};

const STUDY_PERIOD_LABELS = {
    manha: "Manhã", tarde: "Tarde", noite: "Noite",
    madrugada: "Madrugada", flexivel: "Flexível"
};

const CONTEST_LEVEL_LABELS = {
    municipal: "Municipal", estadual: "Estadual", federal: "Federal",
    legislativo: "Legislativo", tribunais: "Tribunais"
};

const CONTEST_AREA_LABELS = {
    administrativa: "Administrativa", fiscal: "Fiscal / Tributária",
    policial: "Policial", militar: "Militar", juridica: "Jurídica",
    bancaria: "Bancária", saude: "Saúde", educacao: "Educação", tecnologia: "TI"
};

const CAREER_GOAL_LABELS = {
    emprego: "Primeiro emprego", promocao: "Promoção",
    transicao: "Transição de carreira", estabilidade: "Estabilidade",
    empreender: "Empreender", aprender: "Novas habilidades"
};

const PERSONAL_INTEREST_LABELS = {
    idiomas: "Idiomas", musica: "Música", artes: "Artes / Design",
    filosofia: "Filosofia / Autoconhecimento", programacao: "Programação",
    "foto-video": "Fotografia / Vídeo", escrita: "Escrita",
    historia: "História / Cultura", ciencias: "Ciências",
    gastronomia: "Gastronomia", outro: "Outro"
};

const EXAM_ATTEMPTED_LABELS = {
    nunca: "Nunca prestou", sim: "Já tentou antes", passei: "Já passou"
};

const ALREADY_CIVIL_LABELS = {
    nao: "Não concursado", estudo: "Estuda há +1 ano", sim: "Já concursado"
};
