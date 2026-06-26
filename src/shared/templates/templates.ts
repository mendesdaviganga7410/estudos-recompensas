const SLOT_ECONOMICS = Object.freeze({
    dailies: Object.freeze([
        Object.freeze({ id: 'd1' as const, xp: 10,  pts: 5,  fXp: 5  }),
        Object.freeze({ id: 'd2' as const, xp: 15,  pts: 10, fXp: 10 }),
        Object.freeze({ id: 'd3' as const, xp: 25,  pts: 20, fXp: 15 }),
        Object.freeze({ id: 'd4' as const, xp: 30,  pts: 25, fXp: 15 }),
        Object.freeze({ id: 'd5' as const, xp: 25,  pts: 20, fXp: 10 })
    ]),
    epics: Object.freeze([
        Object.freeze({ id: 'e1' as const, xp: 200, pts: 150 }),
        Object.freeze({ id: 'e2' as const, xp: 180, pts: 120 }),
        Object.freeze({ id: 'e3' as const, xp: 150, pts: 100 })
    ]),
    shop: Object.freeze([
        Object.freeze({ id: 's1' as const, cost: 35,   type: 'day' as const, label: 'Diário',  cd: 86400000   }),
        Object.freeze({ id: 's2' as const, cost: 80,   type: 'day' as const, label: 'Diário',  cd: 86400000   }),
        Object.freeze({ id: 's3' as const, cost: 120,  type: 'day' as const, label: 'Diário',  cd: 86400000   }),
        Object.freeze({ id: 's4' as const, cost: 200,  type: 'wk'  as const, label: 'Semanal', cd: 604800000  }),
        Object.freeze({ id: 's5' as const, cost: 500,  type: 'wk'  as const, label: 'Semanal', cd: 604800000  }),
        Object.freeze({ id: 's6' as const, cost: 800,  type: 'wk'  as const, label: 'Semanal', cd: 604800000  }),
        Object.freeze({ id: 's7' as const, cost: 1500, type: 'mo'  as const, label: 'Mensal',  cd: 2592000000 }),
        Object.freeze({ id: 's8' as const, cost: 2000, type: 'mo'  as const, label: 'Mensal',  cd: 2592000000 })
    ])
});

const DEFAULT_SLOT_TEXT = {
    dailies: {
        d1: { name: "Isolar Celular & Organizar Mesa",  desc: "Elimina os gatilhos visuais de distração antes de começar." },
        d2: { name: "Bloco de Foco Absoluto (25min)",   desc: "Sessão profunda de focus direcionado sem interrupções." },
        d3: { name: "Estudo Ativo / Autoexplicação",    desc: "Forçar a recuperação da memória simulando uma aula." },
        d4: { name: "Resolução de Exercícios",          desc: "Bater meta mínima de 10 questões práticas do conteúdo." },
        d5: { name: "Sessão de Revisão Espaçada",       desc: "Revisar conceitos antigos mapeados no cronograma." }
    },
    epics: {
        e1: { name: "Simulado Geral Cronometrado",    desc: "Execução completa de simulado sob as regras e tempo reais de prova." },
        e2: { name: "Consistência Semanal Perfeita",  desc: "Concluir com sucesso todas as metas mínimas por 5 dias seguidos." },
        e3: { name: "Mapeamento e Correção de Erros", desc: "Análise profunda de todas as questões erradas no período recente." }
    },
    shop: {
        s1: { name: "15 min de Redes/YouTube" },
        s2: { name: "Ver 1 Episódio de Série" },
        s3: { name: "Café Especial / Lanche" },
        s4: { name: "Sessão de Jogo (1 Hora)" },
        s5: { name: "Tarde Livre Sem Culpa" },
        s6: { name: "Mimo / Desejo Pessoal" },
        s7: { name: "Day Off Inteiro" },
        s8: { name: "Fast Food / Jantar Premium" }
    }
};

const SLOT_PRESETS = {
    d1: [
        { profile: "Digital",    name: "Modo Avião + Apps Bloqueados",     desc: "Celular fora da equação antes de começar." },
        { profile: "Ambiente",   name: "Mesa Limpa + Luz Ajustada",        desc: "Espaço físico pronto para foco imediato." },
        { profile: "Mental",     name: "2 Min de Respiração + Intenção",   desc: "Ancoragem mental antes da primeira tarefa." }
    ],
    d2: [
        { profile: "Pomodoro",   name: "Timer 25min — Uma Matéria Só",     desc: "Ciclo clássico sem trocar de assunto." },
        { profile: "Criativo",   name: "Sprint de Escrita ou Design",      desc: "Bloco de criação sem interrupções." },
        { profile: "Técnico",    name: "Sessão de Código ou Cálculo",      desc: "Foco profundo em problema técnico único." }
    ],
    d3: [
        { profile: "Oral",       name: "Explicar o Tema em Voz Alta",      desc: "Simular aula para forçar recuperação ativa." },
        { profile: "Visual",     name: "Desenhar Mapa Mental do Tópico",   desc: "Reconstruir conceitos visualmente sem consulta." },
        { profile: "Social",     name: "Debater Tema com Parceiro",      desc: "Confrontar ideias com outra pessoa." }
    ],
    d4: [
        { profile: "Exatas",     name: "Resolver 10 Questões Numéricas",  desc: "Volume de prática em cálculos e lógica." },
        { profile: "Humanas",    name: "10 Questões de Interpretação",     desc: "Textos, argumentação e análise crítica." },
        { profile: "Concurso",   name: "Lista Cronometrada de Questões",   desc: "Simular pressão de tempo de prova." }
    ],
    d5: [
        { profile: "Caderno",    name: "Folhear Anotações da Semana",      desc: "Revisão física do material escrito." },
        { profile: "App",        name: "Deck de Flashcards (20 cards)",    desc: "Revisão espaçada via app ou cartões." },
        { profile: "Professor",  name: "Gravar Áudio-Resumo de 3 Tópicos", desc: "Condensar aprendizado em voz própria." }
    ],
    e1: [
        { profile: "Vestibular", name: "Simulado ENEM/Vestibular Completo", desc: "Prova inteira em tempo real, sem consulta." },
        { profile: "Carreira",   name: "Simulação de Case ou Certificação", desc: "Avaliação no formato da sua área profissional." },
        { profile: "Autodidata", name: "Teste Geral de Todo o Conteúdo",    desc: "Avaliar domínio global do que estudou." }
    ],
    e2: [
        { profile: "Rotina",     name: "7 Dias Seguidos Sem Falhar Dailies", desc: "Consistência total nas rotinas diárias." },
        { profile: "Volume",     name: "Bater Meta de Horas da Semana",      desc: "Cumprir carga horária planejada." },
        { profile: "Streak",     name: "Manter Sequência por 5 Dias",        desc: "Não quebrar a corrente de progresso." }
    ],
    e3: [
        { profile: "Caderno",    name: "Atualizar Caderno de Erros",         desc: "Catalogar cada falha com causa e correção." },
        { profile: "Prática",    name: "Refazer Todas as Questões Erradas",  desc: "Repetir até dominar os pontos fracos." },
        { profile: "Mentoria",   name: "Pedir Feedback e Corrigir Lacunas",  desc: "Validar evolução com professor ou par." }
    ],
    s1: [
        { profile: "Social",     name: "15 min de Instagram/TikTok" },
        { profile: "Info",       name: "15 min de YouTube Livre" },
        { profile: "Descanso",   name: "15 min Ouvindo Música" }
    ],
    s2: [
        { profile: "Série",      name: "1 Episódio de Série Favorita" },
        { profile: "Anime",      name: "1 Episódio de Anime" },
        { profile: "Doc",        name: "1 Episódio de Documentário" }
    ],
    s3: [
        { profile: "Café",       name: "Café Especial numa Cafeteria" },
        { profile: "Doce",       name: "Sobremesa que Você Evitou" },
        { profile: "Salgado",    name: "Lanche Salgado Premium" }
    ],
    s4: [
        { profile: "Gamer",      name: "1 Hora de Videogame" },
        { profile: "Esporte",    name: "1 Hora de Esporte por Lazer" },
        { profile: "Leitura",    name: "1 Hora de Livro/Ficção" }
    ],
    s5: [
        { profile: "Social",     name: "Sair com Amigos (sem culpa)" },
        { profile: "Caseiro",    name: "Maratona de Filme no Sofá" },
        { profile: "Explorador", name: "Visitar Lugar Novo na Cidade" }
    ],
    s6: [
        { profile: "Consumo",    name: "Comprar Algo que Queria Há Meses" },
        { profile: "Evento",     name: "Ingresso de Show ou Evento" },
        { profile: "Skill",      name: "Aula ou Workshop de Hobby" }
    ],
    s7: [
        { profile: "Descanso",   name: "Dia Inteiro Sem Trabalho/Estudo" },
        { profile: "Viagem",     name: "Day Trip para Cidade Vizinha" },
        { profile: "Spa",        name: "Dia de Autocuidado (spa, massagem)" }
    ],
    s8: [
        { profile: "Gourmet",    name: "Jantar em Restaurante Caro" },
        { profile: "Delivery",   name: "Pedir Delivery Premium" },
        { profile: "Celebração", name: "Jantar Especial com Alguém Querido" }
    ]
};

const STARTER_PACKAGES = {
    vestibular: {
        id: 'vestibular',
        icon: '🎓',
        name: 'Pacote Vestibular',
        desc: 'Rotinas e recompensas focadas em aprovação em universidade.',
        epicGoal: 'Passar na USP',
        slots: {
            dailies: {
                d1: { name: "Desligar Celular & Preparar Mesa",  desc: "Ambiente limpo, zero notificações." },
                d2: { name: "Pomodoro de Estudo (25min)",        desc: "Foco total em matéria do dia." },
                d3: { name: "Autoexplicação do Conteúdo",        desc: "Ensinar o tema em voz alta." },
                d4: { name: "Resolver 10 Questões",              desc: "Prática com correção imediata." },
                d5: { name: "Revisão Espaçada",                  desc: "Repassar tópicos de dias anteriores." }
            },
            epics: {
                e1: { name: "Simulado Vestibular Completo",   desc: "Prova inteira em tempo real." },
                e2: { name: "Semana Perfeita de Estudo",      desc: "5 dias seguidos sem falhar rotinas." },
                e3: { name: "Caderno de Erros Atualizado",    desc: "Mapear e corrigir todas as falhas." }
            },
            shop: {
                s1: { name: "15 min de YouTube" },
                s2: { name: "1 Episódio de Série" },
                s3: { name: "Café + Docinho" },
                s4: { name: "1 Hora de Game" },
                s5: { name: "Tarde Livre" },
                s6: { name: "Comprar Algo Legal" },
                s7: { name: "Dia Off de Estudo" },
                s8: { name: "Jantar Delivery" }
            }
        }
    },
    fitness: {
        id: 'fitness',
        icon: '💪',
        name: 'Pacote Fitness',
        desc: 'Hábitos de treino, nutrição e recuperação gamificados.',
        epicGoal: 'Transformar o Corpo em 90 Dias',
        slots: {
            dailies: {
                d1: { name: "Preparar Roupa & Garrafa",        desc: "Deixar tudo pronto na noite anterior." },
                d2: { name: "Treino Principal (45min)",        desc: "Sessão de força ou cardio planejada." },
                d3: { name: "Alongamento & Mobilidade",        desc: "10 min de cuidado articular." },
                d4: { name: "Registrar Refeições",             desc: "Log de macros ou porções do dia." },
                d5: { name: "Sono & Hidratação Check",         desc: "8h de sono e 2L de água validados." }
            },
            epics: {
                e1: { name: "Treino PR — Recorde Pessoal",    desc: "Bater marca em exercício principal." },
                e2: { name: "Semana Sem Pular Treino",        desc: "7 dias de consistência total." },
                e3: { name: "Avaliação Corporal Mensal",      desc: "Medidas, fotos e progresso registrado." }
            },
            shop: {
                s1: { name: "Shake Especial Pós-Treino" },
                s2: { name: "Episódio Favorito" },
                s3: { name: "Açaí / Smoothie Premium" },
                s4: { name: "Hora de Game" },
                s5: { name: "Sábado Sem Treino" },
                s6: { name: "Roupa/Tênis Novo" },
                s7: { name: "Cheat Day Completo" },
                s8: { name: "Jantar no Restaurante" }
            }
        }
    },
    produtividade: {
        id: 'produtividade',
        icon: '⚡',
        name: 'Pacote Produtividade',
        desc: 'Deep work, entregas e gestão de energia para profissionais.',
        epicGoal: 'Lançar Meu Projeto Principal',
        slots: {
            dailies: {
                d1: { name: "Revisar Agenda & Prioridades",    desc: "Top 3 tarefas do dia definidas." },
                d2: { name: "Bloco Deep Work (90min)",         desc: "Trabalho sem interrupções em tarefa crítica." },
                d3: { name: "Reunião / Comunicação Ativa",     desc: "Responder pendências e alinhar equipe." },
                d4: { name: "Entrega Incremental",             desc: "Avançar pelo menos 1 entregável." },
                d5: { name: "Shutdown Ritual",                desc: "Fechar o dia e planejar o próximo." }
            },
            epics: {
                e1: { name: "Milestone do Projeto Entregue",  desc: "Concluir fase principal do projeto." },
                e2: { name: "Semana de Entregas Perfeita",    desc: "Todas as deadlines cumpridas." },
                e3: { name: "Retrospectiva & Otimização",     desc: "Analisar processo e eliminar gargalos." }
            },
            shop: {
                s1: { name: "Pausa de Redes (15min)" },
                s2: { name: "Episódio de Podcast/Série" },
                s3: { name: "Café Especial da Tarde" },
                s4: { name: "Gaming Session" },
                s5: { name: "Meio-Dia Livre" },
                s6: { name: "Gadget / Ferramenta" },
                s7: { name: "Dia Sem Reuniões" },
                s8: { name: "Jantar Celebratório" }
            }
        }
    }
};

function cloneDefaultSlotText(): Record<string, Record<string, { name: string; desc?: string }>> {
    return JSON.parse(JSON.stringify(DEFAULT_SLOT_TEXT));
}

function mergeSlotText(base: Record<string, unknown>, override?: Record<string, unknown> | null): Record<string, Record<string, { name: string; desc?: string }>> {
    const result = cloneDefaultSlotText();
    const source = override || base || {};
    for (const category of ['dailies', 'epics', 'shop'] as const) {
        if (source[category]) {
            for (const [id, text] of Object.entries(source[category])) {
                result[category][id] = { ...result[category][id], ...text };
            }
        }
    }
    return result;
}

function buildMergedSlots(textSlots: Record<string, Record<string, { name?: string; desc?: string }>>) {
    const dailies = SLOT_ECONOMICS.dailies.map(e => ({
        ...e,
        name: textSlots.dailies?.[e.id]?.name || '',
        desc: textSlots.dailies?.[e.id]?.desc || ''
    }));
    const epics = SLOT_ECONOMICS.epics.map(e => ({
        ...e,
        name: textSlots.epics?.[e.id]?.name || '',
        desc: textSlots.epics?.[e.id]?.desc || ''
    }));
    const shop = SLOT_ECONOMICS.shop.map(e => ({
        ...e,
        name: textSlots.shop?.[e.id]?.name || ''
    }));

    return { dailies, epics, shop };
}

function getWizardSteps() {
    const steps: Array<{ category: string; id: string; economics: object; hasDesc: boolean }> = [];
    for (const e of SLOT_ECONOMICS.dailies) {
        steps.push({ category: 'dailies', id: e.id, economics: e, hasDesc: true });
    }
    for (const e of SLOT_ECONOMICS.shop) {
        steps.push({ category: 'shop', id: e.id, economics: e, hasDesc: false });
    }
    for (const e of SLOT_ECONOMICS.epics) {
        steps.push({ category: 'epics', id: e.id, economics: e, hasDesc: true });
    }
    return steps;
}

function getDefaultText(category: string, id: string) {
    return DEFAULT_SLOT_TEXT[category]?.[id] || { name: '', desc: '' };
}

function getSlotPresets(id: string) {
    return SLOT_PRESETS[id] || [];
}

window.SLOT_ECONOMICS    = SLOT_ECONOMICS;
window.DEFAULT_SLOT_TEXT = DEFAULT_SLOT_TEXT;
window.STARTER_PACKAGES  = STARTER_PACKAGES;
window.cloneDefaultSlotText = cloneDefaultSlotText;
window.mergeSlotText     = mergeSlotText;
window.buildMergedSlots  = buildMergedSlots;
window.getWizardSteps    = getWizardSteps;
window.getDefaultText    = getDefaultText;
window.getSlotPresets    = getSlotPresets;
