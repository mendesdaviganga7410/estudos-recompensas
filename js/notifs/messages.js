const MESSAGE_GENERATORS = [
    /* === MESMO CURSO (vest) === */
    (u, m) => m.sameCourse ? `${u.name} também quer ${m.courseLbl}! Concorrência pesada 🔥` : null,
    (u, m) => m.sameCourse ? `Você e ${u.name} disputam a mesma vaga em ${m.courseLbl}. Quem vai mais longe?` : null,
    (u, m) => m.sameCourse ? `${u.name} está na mesma jornada que você rumo a ${m.courseLbl}!` : null,
    (u, m) => m.sameCourse ? `Sabia que ${u.name} também sonha com ${m.courseLbl}? Hora de mostrar serviço!` : null,
    (u, m) => m.sameCourse ? `${u.name} quer ${m.courseLbl} igual a você. Talvez vocês estudem na mesma faculdade um dia!` : null,
    (u, m) => m.sameCourse ? `Mais um concorrente de peso: ${u.name} também busca ${m.courseLbl}.` : null,
    (u, m) => m.sameCourse ? `${u.name} também está de olho em ${m.courseLbl}. Bora ver quem chega primeiro?` : null,

    /* === MESMA ÁREA (vest) === */
    (u, m) => m.sameCourseArea ? `${u.name} também é da área de ${m.courseAreaLbl}! Cérebros afiados por aqui 🧠` : null,
    (u, m) => m.sameCourseArea ? `Você e ${u.name} têm interesses na mesma área: ${m.courseAreaLbl}.` : null,
    (u, m) => m.sameCourseArea ? `${u.name} também curte ${m.courseAreaLbl}! Que tal trocar uma ideia?` : null,

    /* === MESMO TIPO DE UNIVERSIDADE === */
    (u, m) => m.sameUniType ? `${u.name} também mira uma universidade ${m.uniTypeLbl.toLowerCase()}! Sonho grande 🎯` : null,
    (u, m) => m.sameUniType ? `Você e ${u.name} têm o mesmo tipo de universidade como alvo: ${m.uniTypeLbl}.` : null,
    (u, m) => m.sameUniType ? `${u.name} também quer ${m.uniTypeLbl === "Federal" ? "uma federal" : m.uniTypeLbl === "Privada" ? "uma particular" : m.uniTypeLbl === "Militar" ? "carreira militar" : m.uniTypeLbl === "Exterior" ? "estudar fora" : m.uniTypeLbl.toLowerCase()}.` : null,

    /* === MESMA SITUAÇÃO DE VESTIBULAR === */
    (u, m) => m.sameExamStatus && m.examStatusLbl === "Nunca prestou" ? `${u.name} também nunca prestou vestibular! Calouros unidos 🤝` : null,
    (u, m) => m.sameExamStatus && m.examStatusLbl === "Já tentou antes" ? `${u.name} também já tentou vestibular antes. Persistência é tudo!` : null,
    (u, m) => m.sameExamStatus && m.examStatusLbl === "Já passou" ? `${u.name} também já passou! Veterano como você.` : null,

    /* === MESMO NÍVEL DE CONCURSO === */
    (u, m) => m.sameContestLevel ? `${u.name} também busca concurso ${m.contestLevelLbl.toLowerCase()}. Concorrência de elite!` : null,
    (u, m) => m.sameContestLevel ? `Você e ${u.name} estão no mesmo nível de concurso: ${m.contestLevelLbl}.` : null,

    /* === MESMA ÁREA DE CONCURSO === */
    (u, m) => m.sameContestArea ? `${u.name} também está na área ${m.contestAreaLbl.toLowerCase()} de concursos. Foco total!` : null,
    (u, m) => m.sameContestArea ? `Sabia que ${u.name} também quer concurso na área ${m.contestAreaLbl.toLowerCase()}?` : null,

    /* === MESMA PROFISSÃO === */
    (u, m) => m.sameProfession ? `${u.name} também é ${m.professionLbl}! Cérebro de elite 💻` : null,
    (u, m) => m.sameProfession ? `Outro ${m.professionLbl} por aqui! ${u.name} também atua na mesma área que você.` : null,
    (u, m) => m.sameProfession ? `${u.name} também trabalha como ${m.professionLbl}. Bora trocar experiências?` : null,

    /* === MESMO RAMO PROFISSIONAL === */
    (u, m) => m.sameWorkSector ? `${u.name} também é da área de ${m.workSectorLbl}! Conexão profissional 🤝` : null,
    (u, m) => m.sameWorkSector ? `Você e ${u.name} atuam no mesmo ramo: ${m.workSectorLbl}.` : null,

    /* === MESMA META DE CARREIRA === */
    (u, m) => m.sameCareerGoal && m.careerGoalLbl === "Primeiro emprego" ? `${u.name} também busca o primeiro emprego! Bora se apoiar 💪` : null,
    (u, m) => m.sameCareerGoal && m.careerGoalLbl === "Promoção" ? `${u.name} também quer crescer na carreira. Ambos merecem aquela promoção!` : null,
    (u, m) => m.sameCareerGoal && m.careerGoalLbl === "Transição de carreira" ? `${u.name} também está em transição de carreira. Coragem! 🔄` : null,
    (u, m) => m.sameCareerGoal && m.careerGoalLbl === "Empreender" ? `${u.name} também quer empreender. Futuros donos do próprio negócio!` : null,

    /* === MESMA META DE SHAPE === */
    (u, m) => m.sameBodyGoal ? `${u.name} também busca o shape ${m.bodyGoalLbl.toLowerCase()}! Treino e estudos em dia 💪` : null,
    (u, m) => m.sameBodyGoal ? `Mente sã, corpo são! ${u.name} também treina pra ${m.bodyGoalLbl.toLowerCase()}.` : null,
    (u, m) => m.sameBodyGoal ? `${u.name} também quer chegar no ${m.bodyGoalLbl.toLowerCase()}. Bora treinar junto?` : null,
    (u, m) => m.sameBodyGoal ? `Shape de ${m.bodyGoalLbl.toLowerCase()} é o foco de ${u.name} também.` : null,

    /* === MESMA FREQUÊNCIA DE TREINO === */
    (u, m) => m.sameTrainingFreq && m.trainingFreqLbl === "Não treina" ? `${u.name} também não treina ainda. Hora de começar juntos? 🔥` : null,
    (u, m) => m.sameTrainingFreq && m.trainingFreqLbl !== "Não treina" ? `${u.name} também treina ${m.trainingFreqLbl.toLowerCase()}. Disciplina é tudo!` : null,

    /* === MESMO INTERESSE PESSOAL === */
    (u, m) => m.sameInterest ? `${u.name} também curte ${m.interestLbl.toLowerCase()}! Alma gêmea intelectual 📚` : null,
    (u, m) => m.sameInterest ? `Que coincidência! ${u.name} também ama ${m.interestLbl.toLowerCase()}.` : null,

    /* === MESMO DESAFIO === */
    (u, m) => m.sameChallenge ? `${u.name} também sofre com ${m.challengeLbl}. Vocês podem se apoiar! 🤝` : null,
    (u, m) => m.sameChallenge ? `Não está sozinho! ${u.name} também enfrenta ${m.challengeLbl}.` : null,
    (u, m) => m.sameChallenge ? `${u.name} sabe bem como é lidar com ${m.challengeLbl}. Bora trocar dicas?` : null,
    (u, m) => m.sameChallenge ? `Enquanto isso, ${u.name} também luta contra ${m.challengeLbl} e não desistiu!` : null,

    /* === MESMA CARGA HORÁRIA === */
    (u, m) => m.sameStudyHours ? `${u.name} também estuda ${m.studyHoursLbl}. Mesma disciplina! ⏰` : null,
    (u, m) => m.sameStudyHours ? `Você e ${u.name} têm a mesma meta de ${m.studyHoursLbl} de estudo. Quem rende mais?` : null,

    /* === MESMO PERÍODO === */
    (u, m) => m.samePeriod ? `${u.name} também rende mais ${m.periodLbl === "Manhã" ? "de manhã" : m.periodLbl === "Tarde" ? "à tarde" : m.periodLbl === "Noite" ? "à noite" : m.periodLbl === "Madrugada" ? "de madrugada" : "em qualquer horário"}! Ritmo sincronizado 🌙` : null,

    /* === MESMO MÉTODO === */
    (u, m) => m.sameMethod ? `${u.name} também usa ${m.methodLbl.toLowerCase()} como método. Estratégia poderosa!` : null,
    (u, m) => m.sameMethod ? `${u.name} confia em ${m.methodLbl.toLowerCase()} assim como você.` : null,

    /* === MESMO NÍVEL ESCOLAR === */
    (u, m) => m.sameEduLevel ? `${u.name} também está ${m.eduLevelLbl.toLowerCase()}! Fase parecida 📖` : null,
    (u, m) => m.sameEduLevel && m.eduLevelLbl === "Cursinho" ? `${u.name} também está no cursinho! Bora gabaritar juntos?` : null,
    (u, m) => m.sameEduLevel && m.eduLevelLbl === "Ensino Médio (cursando)" ? `${u.name} também está no Ensino Médio. Hora de construir o futuro!` : null,

    /* === FOCUS MATCH (mesma combinação de tracks) === */
    (u, m) => m.focusMatch ? `${u.name} tem os mesmos focos que você! Almas gêmeas da produtividade 🎯` : null,
    (u, m) => m.focusMatch ? `${u.name} está na mesma vibe que você!` : null,

    /* === OVERTAKING === */
    (u, m) => m.overtake ? `${u.name} te passou nos ratings e tem trilhas semelhantes às suas!` : null,
    (u, m) => m.overtake ? `${u.name} acabou de ultrapassar você — que tal acelerar o ritmo?` : null,
    (u, m) => m.overtake ? `${u.name} está voando e já te deixou para trás esta semana!` : null,
    (u, m) => m.overtake ? `Enquanto você descansava, ${u.name} passou na sua frente no ranking.` : null,

    /* === APPROACHING === */
    (u, m) => m.approach ? `${u.name} está quase te alcançando no ranking — ligue o turbo!` : null,
    (u, m) => m.approach ? `Cuidado! ${u.name} vem subindo forte e está logo atrás de você.` : null,
    (u, m) => m.approach ? `${u.name} está colando em você! Mais algumas horas e ele te alcança.` : null,
    (u, m) => m.approach ? `Só mais alguns XP e ${u.name} empata com você. Hora de estudar!` : null,

    /* === CONSISTÊNCIA SEMANAL === */
    (u, m) => m.consistent ? `${u.name} estudou a semana inteira sem perder um dia!` : null,
    (u, m) => m.consistent ? `${u.name} manteve a consistência por 7 dias seguidos. Que inspiração!` : null,
    (u, m) => m.consistent ? `Enquanto isso, ${u.name} fechou mais uma semana de estudos sem falhas.` : null,
    (u, m) => m.consistent ? `${u.name} está com muitos pontos acumulados este fim de semana de tanto estudar!` : null,

    /* === XP MILESTONE === */
    (u, m) => m.xp100 ? `${u.name} acabou de bater ${m.xp} XP — que marco!` : null,
    (u, m) => m.xp100 ? `${u.name} atingiu ${m.xp} XP. Você já está de olho na próxima meta?` : null,
    (u, m) => m.xp100 ? `Enquanto isso, ${u.name} comemorou ${m.xp} XP conquistados.` : null,

    /* === PONTOS AHEAD/BEHIND === */
    (u, m) => m.ptsAhead ? `${u.name} tem ${m.ptsDiff} pontos a mais que você. Dá para alcançar!` : null,
    (u, m) => m.ptsAhead ? `${u.name} está ${m.ptsDiff} pontos na frente. Uma sessão de foco e você empata!` : null,
    (u, m) => m.ptsBehind ? `Você está ${m.ptsDiff} pontos na frente de ${u.name}. Não deixe ele te alcançar!` : null,
    (u, m) => m.ptsBehind ? `Líder! Você tem ${m.ptsDiff} pontos de vantagem sobre ${u.name}.` : null,

    /* === TIER / RANK === */
    (u, m) => m.sameTier ? `Você e ${u.name} estão no mesmo ${m.tierLbl}. Quem chega ao próximo primeiro?` : null,
    (u, m) => m.higherTier ? `${u.name} está no ${m.tierLbl} — um rank acima de você. Bora subir?` : null,
    (u, m) => m.lowerTier ? `${u.name} está no ${m.tierLbl}, mas vem forte!` : null,

    /* === MESMO CURSO (slots) === */
    (u, m) => m.sameCourse ? `${u.name} também estuda ${m.course} — vocês podem trocar dicas!` : null,

    /* === INSPIRACIONAIS === */
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
    (u, m) => `${u.name} está colhendo os frutos da disciplina. E você, vai ficar de fora?`,
    (u, m) => `${u.name} transformou hábitos em resultados. Conheça a história dele!`,
    (u, m) => `Mente, corpo e carreira — ${u.name} está cuidando dos três. Inspiração pura!`,
];
