const MESSAGE_GENERATORS = [
  /* === MESMO CURSO === */
  (u, m) => m.sameCourse ? `${u.name} também está de olho em ${m.courseLbl}. A jornada é desafiadora, mas vocês podem ir longe juntos!` : null,
  (u, m) => m.sameCourse ? `${u.name} quer ${m.courseLbl} assim como você. Sabia que estudar em grupo pode acelerar o aprendizado?` : null,
  (u, m) => m.sameCourse ? `Você e ${u.name} compartilham o mesmo objetivo: ${m.courseLbl}. Cada hora de estudo conta!` : null,
  (u, m) => m.sameCourse ? `${u.name} também sonha com ${m.courseLbl}. Quem persiste sempre alcança!` : null,

  /* === MESMA PROFISSÃO === */
  (u, m) => m.sameProfession ? `${u.name} também atua como ${m.professionLbl}. Grandes mentes pensam igual!` : null,
  (u, m) => m.sameProfession ? `Você e ${u.name} compartilham a mesma profissão: ${m.professionLbl}. O mercado valoriza profissionais como vocês!` : null,

  /* === MESMO DESAFIO === */
  (u, m) => m.sameChallenge ? `${u.name} também enfrenta ${m.challengeLbl}. Você não está sozinho nessa batalha!` : null,
  (u, m) => m.sameChallenge ? `Sabia que ${u.name} também lida com ${m.challengeLbl}? Compartilhar estratégias pode ajudar ambos.` : null,
  (u, m) => m.sameChallenge ? `${u.name} sabe como é lidar com ${m.challengeLbl} e não desistiu. Você também consegue!` : null,

  /* === MESMA META DE SHAPE === */
  (u, m) => m.sameBodyGoal ? `${u.name} também busca ${m.bodyGoalLbl}. Corpo são, mente sã — o segredo do sucesso!` : null,
  (u, m) => m.sameBodyGoal ? `${u.name} está na mesma vibe fitness que você: ${m.bodyGoalLbl}. Que tal treinar junto (mesmo que longe)?` : null,

  /* === MESMO INTERESSE === */
  (u, m) => m.sameInterest ? `${u.name} também ama ${m.interestLbl}. Interesses em comum fortalecem conexões!` : null,
  (u, m) => m.sameInterest ? `Que coincidência! ${u.name} também curte ${m.interestLbl}.` : null,

  /* === MESMO FOCO === */
  (u, m) => m.focusMatch && m.focusMatches ? `${u.name} tem os mesmos focos que você! Conexão poderosa para crescer junto.` : null,

  /* === MESMA UNIVERSIDADE === */
  (u, m) => m.sameUniType ? `${u.name} também mira ${m.uniTypeLbl}. Sonhos grandes precisam de planejamento e disciplina!` : null,

  /* === MESMA CARGA HORÁRIA === */
  (u, m) => m.sameStudyHours ? `${u.name} também estuda ${m.studyHoursLbl}. Mesma disciplina, mesmo propósito!` : null,

  /* === MESMO PERÍODO === */
  (u, m) => m.samePeriod ? `${u.name} também rende mais ${m.periodLbl}. Ritmo sincronizado!` : null,

  /* === MESMO MÉTODO === */
  (u, m) => m.sameMethod ? `${u.name} também usa ${m.methodLbl}. Estratégias que funcionam!` : null,

  /* === MESMA ÁREA DE CONCURSO === */
  (u, m) => m.sameContestArea ? `${u.name} também foca em concursos na área ${m.contestAreaLbl}. Foco total!` : null,

  /* === MESMA META DE CARREIRA === */
  (u, m) => m.sameCareerGoal ? `${u.name} também busca ${m.careerGoalLbl}. Vocês podem se apoiar nessa jornada!` : null,

  /* === MESMA ÁREA DE CURSO === */
  (u, m) => m.sameCourseArea ? `${u.name} também é da área de ${m.courseAreaLbl}. Cérebros afiados por aqui!` : null,
  (u, m) => m.sameCourseArea ? `Você e ${u.name} têm interesses na mesma área: ${m.courseAreaLbl}. Que tal trocar uma ideia?` : null,

  /* === MESMO NÍVEL ESCOLAR === */
  (u, m) => m.sameEduLevel ? `${u.name} também está ${m.eduLevelLbl}. Fase parecida, jornada compartilhada!` : null,

  /* === USUÁRIO TEM CURSO (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.targetCourse ? `${u.name} está lutando firme para conquistar uma vaga em ${COURSE_LABELS[m.user.diagnostic.targetCourse] || m.user.diagnostic.targetCourse}. A persistência é o combustível do sucesso!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.targetCourse ? `${u.name} vem se dedicando aos estudos de ${COURSE_LABELS[m.user.diagnostic.targetCourse] || m.user.diagnostic.targetCourse}. Cada minuto de foco faz diferença!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.targetCourse ? `${u.name} está focado em ${COURSE_LABELS[m.user.diagnostic.targetCourse] || m.user.diagnostic.targetCourse}. A aprovação é questão de tempo!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.targetCourse ? `${u.name} não abre mão do sonho de passar em ${COURSE_LABELS[m.user.diagnostic.targetCourse] || m.user.diagnostic.targetCourse}. E você, como está?` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.targetCourse ? `${u.name} está construindo o futuro em ${COURSE_LABELS[m.user.diagnostic.targetCourse] || m.user.diagnostic.targetCourse}. Inspiração pura!` : null,

  /* === USUÁRIO TEM PROFISSÃO (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.targetProfession ? `${u.name} está construindo uma carreira sólida em ${PROFESSION_LABELS[m.user.diagnostic.targetProfession] || m.user.diagnostic.targetProfession}. O mercado reconhece quem se dedica!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.targetProfession ? `Sabia que ${u.name} atua como ${PROFESSION_LABELS[m.user.diagnostic.targetProfession] || m.user.diagnostic.targetProfession}? Cada jornada tem lições valiosas.` : null,

  /* === USUÁRIO TEM CONCURSO (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.contestArea ? `${u.name} está focado em concursos na área ${CONTEST_AREA_LABELS[m.user.diagnostic.contestArea] || m.user.diagnostic.contestArea}. Disciplina é o caminho para a aprovação!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.contestArea ? `${u.name} está se preparando para concursos de ${CONTEST_AREA_LABELS[m.user.diagnostic.contestArea] || m.user.diagnostic.contestArea}. Área promissora e cheia de oportunidades!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.contestLevel ? `${u.name} está de olho em concursos de nível ${CONTEST_LEVEL_LABELS[m.user.diagnostic.contestLevel] || m.user.diagnostic.contestLevel}. Coragem e preparação!` : null,

  /* === USUÁRIO TEM META FITNESS (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.bodyGoal ? `${u.name} está buscando ${BODY_GOAL_LABELS[m.user.diagnostic.bodyGoal] || m.user.diagnostic.bodyGoal}. Mente sã, corpo são — o equilíbrio dos campeões!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.trainingFreq ? `${u.name} treina ${TRAINING_FREQ_LABELS[m.user.diagnostic.trainingFreq] || m.user.diagnostic.trainingFreq} para chegar ao shape ideal. Que determinação!` : null,

  /* === USUÁRIO TEM DESAFIO (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.mainChallenge ? `${u.name} enfrenta ${CHALLENGE_LABELS[m.user.diagnostic.mainChallenge] || m.user.diagnostic.mainChallenge} com coragem. Você também pode superar seus desafios!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.mainChallenge ? `${u.name} sabe que ${CHALLENGE_LABELS[m.user.diagnostic.mainChallenge] || m.user.diagnostic.mainChallenge} não é fácil, mas segue firme. Persistência sempre!` : null,

  /* === USUÁRIO TEM CARGA HORÁRIA (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.studyHours ? `${u.name} mantém ${STUDY_HOURS_LABELS[m.user.diagnostic.studyHours] || m.user.diagnostic.studyHours} de estudo diário. Pequenos passos levam a grandes conquistas.` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.studyHours ? `${u.name} estuda ${STUDY_HOURS_LABELS[m.user.diagnostic.studyHours] || m.user.diagnostic.studyHours} por dia. A consistência é o verdadeiro segredo dos campeões!` : null,

  /* === USUÁRIO TEM PERÍODO (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.studyPeriod ? `${u.name} rende melhor ${STUDY_PERIOD_LABELS[m.user.diagnostic.studyPeriod] || m.user.diagnostic.studyPeriod.toLowerCase()}. Conhecer seu melhor horário é estratégia de campeão!` : null,

  /* === USUÁRIO TEM MÉTODO (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.studyMethod ? `${u.name} usa ${STUDY_METHOD_LABELS[m.user.diagnostic.studyMethod] || m.user.diagnostic.studyMethod} como método de estudo. Cada um encontra seu caminho!` : null,

  /* === USUÁRIO TEM NÍVEL ESCOLAR (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.eduLevel ? `${u.name} está ${EDU_LEVEL_LABELS[m.user.diagnostic.eduLevel] || m.user.diagnostic.eduLevel}. Cada etapa é um degrau para o sucesso!` : null,
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.eduLevel ? `${u.name} está na fase ${EDU_LEVEL_LABELS[m.user.diagnostic.eduLevel] || m.user.diagnostic.eduLevel}. Aproveite cada momento dessa jornada!` : null,

  /* === USUÁRIO TRABALHA (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.workSector ? `${u.name} atua na área de ${WORK_SECTOR_LABELS[m.user.diagnostic.workSector] || m.user.diagnostic.workSector}. Mercado de trabalho pede evolução constante!` : null,

  /* === USUÁRIO TEM CARREIRA (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.careerGoal ? `${u.name} busca ${CAREER_GOAL_LABELS[m.user.diagnostic.careerGoal] || m.user.diagnostic.careerGoal} na carreira. Cada passo conta para chegar lá!` : null,

  /* === USUÁRIO TEM INTERESSE (distante) === */
  (u, m) => m.user && m.user.diagnostic && m.user.diagnostic.personalInterest ? `${u.name} também curte ${PERSONAL_INTEREST_LABELS[m.user.diagnostic.personalInterest] || m.user.diagnostic.personalInterest}. Interesses diversos enriquecem a jornada!` : null,

  /* === XP E CONSISTÊNCIA === */
  (u, m) => m.xp > 0 && m.xp < 500 ? `${u.name} está começando agora e já está na ativa. Todo mestre já foi iniciante!` : null,
  (u, m) => m.xp > 1000 ? `${u.name} já acumulou ${m.xp} XP de experiência. A consistência realmente faz a diferença!` : null,
  (u, m) => m.xp > 5000 ? `${u.name} é um veterano com ${m.xp} XP. Inspiração para quem está começando!` : null,
  (u, m) => m.consistent ? `${u.name} manteve a consistência por dias seguidos. É assim que os resultados aparecem!` : null,

  /* === RANKING === */
  (u, m) => m.sameTier ? `Você e ${u.name} estão no mesmo ${m.tierLbl}. Quem chega ao próximo nível primeiro?` : null,
  (u, m) => m.higherTier ? `${u.name} está no ${m.tierLbl} — um rank acima. Use isso como motivação para subir!` : null,
  (u, m) => m.lowerTier ? `${u.name} está no ${m.tierLbl} mas vem forte. Nunca subestime quem está escalando!` : null,

  /* === GERAIS MOTIVACIONAIS === */
  (u, m) => `${u.name} está na comunidade focado em seus objetivos. Inspire-se e continue firme!`,
  (u, m) => `Dizem por aí que ${u.name} está com uma sequência de estudos impressionante.`,
  (u, m) => `${u.name} prova que consistência vence talento. Conheça o perfil dele!`,
  (u, m) => `${u.name} está entre os mais dedicados da comunidade esta semana.`,
  (u, m) => `${u.name} está construindo uma jornada incrível. Que tal dar uma olhada?`,
  (u, m) => `${u.name} transformou hábitos em resultados. A disciplina sempre vence!`,
  (u, m) => `Enquanto você lê isso, ${u.name} já está estudando. Bora?`,
  (u, m) => `${u.name} está colhendo os frutos da disciplina. E você, vai ficar de fora?`,
  (u, m) => `${u.name} está online agora. Que tal estudar junto (mesmo que longe)?`,
  (u, m) => `${u.name} está na comunidade há um tempão e continua firme. Inspirador!`,
  (u, m) => `O segredo? ${u.name} estuda um pouco todo dia. E você?`,
  (u, m) => `${u.name} é a prova viva de que pequenas sessões diárias geram grandes resultados.`,
  (u, m) => `Você já conferiu o progresso de ${u.name} hoje?`,
  (u, m) => `Mente, corpo e carreira — ${u.name} está cuidando dos três. Equilíbrio é tudo!`,
];
