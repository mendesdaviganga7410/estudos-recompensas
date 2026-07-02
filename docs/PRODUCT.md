# Produto: NeuroFlow
**Versão:** 4.0 | **Última atualização:** 2026-07-02 | **Revisão documental:** 2

> Este documento centraliza a verdade oficial do produto NeuroFlow — sua visão, funcionalidades, regras de negócio e decisões técnicas. É leitura **obrigatória** para qualquer agente de IA. Leia também `docs/AI_CONSTITUTION.md` antes de executar qualquer tarefa.

---

## 1. Visão Geral

O **NeuroFlow** é um gerenciador de tarefas altamente gamificado, desenvolvido para aumentar a produtividade de estudantes através de dinâmicas de RPG. O foco é transformar o ato de estudar e concluir tarefas cotidianas em uma jornada heroica — o *Hero Hub*.

### 1.1 Público-Alvo

- Estudantes vestibulares e concurseiros
- Pessoas no mercado de trabalho que estudam paralelamente
- Entusiastas de fitness e aprendizado pessoal

### 1.2 Proposta de Valor

- Transforma tarefas rotineiras em missões com recompensas tangíveis (XP, pontos, itens da loja)
- Cria senso de progressão visível através do sistema de tiers (Bronze ao Diamante Negro)
- Conecta estudantes compatíveis através de diagnóstico de perfil e algoritmo de matching
- Funciona sem login (modo visitante com localStorage) e com sincronização na nuvem (Firestore)

### 1.3 Personas

Três personas principais orientam as decisões de produto:

- **Vestibulando(a):** 16–18 anos, ensino médio, precisa de consistência para ENEM/vestibular. Baixa tolerância a interfaces complexas. Valoriza simplicidade e recompensas imediatas.
- **Concurseiro(a):** 20–35 anos, trabalha e estuda paralelamente. Precisa de planejamento de longo prazo e motivação sustentada. Valoriza estatísticas, progressão visível e modo foco.
- **Estudante TDAH (implícito):** qualquer faixa etária, dificuldade com constância. O design considera TDAH como público implícito — as mecânicas de micro-recompensas frequentes, penalidades suaves, modo Momentum (isolamento de tarefa) e timer Pomodoro integrado são deliberadamente desenhados para perfis com baixa tolerância a atrito e necessidade de feedback imediato.

### 1.4 Pilares do Design

- **Vibrante e engajador:** micro-interações, toasts, animações de recompensa, confetes
- **Gamificação séria:** o sistema de XP/Pts deve parecer justo e motivador, não inflado
- **Performance:** Vanilla TypeScript sem frameworks pesados, Firebase via CDN dinâmico
- **Acessibilidade básica:** `title=""` em botões de ícone, `alt=""` em imagens, `role=""` em modais
- **Mobile-first:** funciona em telas de 375px+

---

## 2. Páginas da Aplicação

### 2.1 Hero Hub (`index.html`)

**Página principal e centro de identidade do herói.**

**Usuário logado:**
- Exibe perfil completo: avatar, banner, nome, meta épica, descrição, tier atual, XP, pontos
- Estatísticas: missões concluídas, marcos épicos, compras realizadas, ofensiva atual
- Mini-calendário de 7 dias da ofensiva com indicador do melhor streak
- Cards de navegação para Painel, Comunidade e Estudo
- **Quick-edit:** dialogs inline para editar nome, meta épica, descrição, avatar e banner sem abrir settings

**Visitante:**
- Tela de boas-vindas com opções de login (Google / E-mail) ou entrar como visitante

**Funções-chave:** `window.renderHeroHub()`, `window.renderGuestLanding()`

### 2.2 Painel / Dashboard (`panel.html`)

**Gerenciador de tarefas gamificado — coração do produto.**

- **Ranking e XP:** barra de progresso visual entre tiers, XP acumulado, pontos de dopamina
- **Ofensiva:** número de dias consecutivos + mini-calendário de 7 dias
- **Missões Diárias (5 slots):** tarefas com recompensa (+XP, +Pts) e penalidade por falha (-XP). Só podem ser concluídas uma vez por dia. Penalidade automática ao virar o dia se não concluídas.
- **Missões Semanais (3 slots):** metas de longo prazo com recompensa maior, sem penalidade. Só podem ser concluídas uma vez por semana.
- **Loja de Recompensas (8 slots):** itens compráveis com pontos e cooldown individual por item. Re-renderizada a cada 30s para atualizar cooldowns.
- **Modo Momentum:** overlay de foco que isola a primeira missão diária não concluída, eliminando distrações. Avança automaticamente ao completar/falhar. Tecla Escape sai do modo.
- **Persistência:** Firestore (logado) ou localStorage (visitante)

**Funções-chave:** `window.render()`, `window.task(id, type, success)`, `window.buy(id)`, `window.enterMomentum()`

### 2.3 Modo Estudo / Pomodoro (`study.html`)

**Ferramenta de foco com histórico e sons.**

- **Modo Simples:** cronômetro livre — registra matéria, tempo total e anotações
- **Modo Pomodoro:** ciclos configuráveis de foco/descanso com número de ciclos definido pelo usuário
  - Suporte a pausa longa automática a cada N ciclos
  - Transição manual (confirmar) ou automática entre fases
  - Alarme sonoro configurável com presets por grupo (iniciar, pausar, concluir, alarme)
- **Histórico:** tabela de sessões com data, matéria, modo, ciclos, tempo foco/descanso e total. Expandível com ordenação e detalhes individuais
- **Sincronização:** histórico persistido em localStorage (`historico_estudos`) e sincronizado com Firestore via subcoleção `studySessions` quando logado
- **Config de Pomodoro:** acessível via settings-modal (abas separadas)

**Objeto-chave:** `window.studyTimer` (exposto por `study-timer.ts`)

### 2.4 Comunidade (`comunidade.html`)

**Elemento social para conexão entre estudantes.**

- Grid de cards de outros heróis com avatar, banner, nome, meta épica, tier e XP
- Busca em tempo real por nome ou meta épica (debounce 200ms)
- Ordenação por XP ou nome
- Detalhe de perfil: view completa de outro herói com ranking global, progresso de tier e estatísticas
- **Visitantes:** veem aviso de login — não têm acesso ao grid

**Funções-chave:** `window.renderComunidade()`, `window.openProfileDetail(data)`, `window.fetchCommunityProfiles(limit?)`

### 2.5 Revisão Espaçada (`review.html`)

**Sistema de repetição espaçada para blocos de estudo.**

- **Blocos de Estudo:** cards com matéria, tópico, conteúdo e cor customizável (auto-sugerida por matéria)
- **Configurações de Revisão:** 5 presets padrão (Curta, Mensal, Semestral, Intensiva, Longo Prazo) + configurações personalizadas (nome, array de intervalos, easeFactorMultiplier)
- **Algoritmo SM-2 adaptado:** avanço de índice baseado na dificuldade (Fácil→+2, Médio→+1, Difícil→+0)
- **Status visuais:** verde (revisado hoje), laranja (pendente), vermelho (atrasado), cor padrão (sem revisão)
- **Ferramentas:** busca por texto, filtro por status/matéria, ordenação por data/material/criação, barra de estatísticas
- **Notificações:** badge no sino com contagem de blocos due/overdue, notificação persistente no painel
- **Persistência:** dados salvos em `state.studyBlocks` e `state.reviewSettings` — Firestore (logado) ou localStorage (visitante)

**Funções-chave:** `window.renderReviewPage()`, `window.addStudyBlock()`, `window.submitReviewFeedback(difficulty)`, `window.calculateNextReview()`

---

## 3. Modos de Acesso e Autenticação

| Modo | Acesso | Persistência |
|---|---|---|
| Visitante | Painel + Estudo + Revisão (sem Hub completo nem Comunidade) | localStorage (`neuroflow_guest_v2`) |
| Autenticado (Google) | Todas as páginas + Comunidade + Gamificação + Matching | Firebase Firestore |
| Autenticado (E-mail) | Idem ao Google | Firebase Firestore |

### 3.1 Onboarding (Wizard Gamificado)

Obrigatório para novos usuários autenticados. Estrutura: overlay fullscreen com 3 etapas numeradas.

**Etapa 1 — Identidade:**
- Meta épica, nome de exibição, toggle de perfil público
- Upload de avatar e banner com CropperJS

**Etapa 2 — Pacotes:**
- Seleção de pacote temático de missões iniciais OU personalização avançada dos slots

**Etapa 3 — Wizard de Slots:**
- 16 cards editáveis com presets alternativos por slot
- Finalização: `window.completeOnboarding(uid, data)` persiste no Firestore e redireciona ao Hub

### 3.2 Redirecionamento

Usuários logados sem onboarding completo são redirecionados ao Hub (`index.html`) ao acessar qualquer outra página.

---

## 4. Sistemas Internos

### 4.1 Sistema de Notificações

- **Notificação persistente:** diagnóstico de perfil sempre visível (id: `'diag-persistent'`, `persistent: true`)
- **Notificações regulares:** matching entre usuários — no máximo 1 por vez, gerada em horários fixos (00:00 ou 12:00 local)
- **Toast de lembrete:** "Responda ao Diagnóstico" exibido a cada 2 minutos para quem não respondeu
- **Badge:** número de não-lidas no ícone de sino; ponto laranja quando diagnóstico pendente
- **Armazenamento:** notificações persistidas em `'neuroflow_notifs_v1'` entre navegações
- **Arquivos:** `engine.ts` (estado + matching), `ui.ts` (render), `init.ts` (timers + exports)

### 4.2 Diagnóstico de Perfil

- Questionário adaptativo de ~8 perguntas (de um total de 21 em `diagnostic-data.ts`)
- Organizado em tracks: `vest` (vestibulando), `conc` (concurseiro), `work` (mercado de trabalho), `fit` (fitness), `learn` (aprendizado pessoal)
- Pergunta inicial (`focusAreas`) define quais tracks o usuário verá
- Resultado armazenado no Firestore como `state.diagnostic`
- `DIAGNOSTIC_VERSION` — quando a versão muda, diagnóstico é resetado automaticamente

### 4.3 Sistema de Temas

- 22 temas disponíveis (7 claros, 15 escuros)
- Aplicado via `data-theme` no `<body>` — variáveis CSS controlam toda a paleta
- Persistido em `state.prefs.theme` (Firestore ou localStorage)
- Customização adicional: border-radius global e profundidade de sombra (`prefs.radius`, `prefs.shadow`)

**Nota de inconsistência:** 4 temas (`dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome`) existem no código mas não têm botão de preview nos HTMLs. Ao adicionar qualquer novo tema, atualize `base.css`, `theme.ts` e os 4 HTMLs.

### 4.4 Modo Administrador

- Ativado via console do navegador (`ativarAdmin()`) ou por flag `state.prefs.isAdmin === true` no Firestore
- Botão `🛠️` aparece no canto superior direito quando ativo
- Modal admin com gerador de sessões de estudo falsas para testes de histórico
- Desativação: `desativarAdmin()` via console

---

## 5. Regras de Negócio e Balanceamento

### 5.1 Economia de XP e Pontos

| Slot | XP Ganho | Pts Ganhos | Penalidade XP |
|---|---|---|---|
| Daily d1 | 10 | 5 | -5 |
| Daily d2 | 15 | 10 | -10 |
| Daily d3 | 25 | 20 | -15 |
| Daily d4 | 30 | 25 | -15 |
| Daily d5 | 25 | 20 | -10 |
| Epic e1 | 200 | 150 | nenhuma |
| Epic e2 | 180 | 120 | nenhuma |
| Epic e3 | 150 | 100 | nenhuma |

### 5.2 Cooldowns da Loja

| Slot | Custo | Tipo | Cooldown |
|---|---|---|---|
| s1 | 35 Pts | Diário | 24h |
| s2 | 80 Pts | Diário | 24h |
| s3 | 120 Pts | Diário | 24h |
| s4 | 200 Pts | Semanal | 7 dias |
| s5 | 500 Pts | Semanal | 7 dias |
| s6 | 800 Pts | Semanal | 7 dias |
| s7 | 1500 Pts | Mensal | 30 dias |
| s8 | 2000 Pts | Mensal | 30 dias |

> **REGRA:** Não altere esses valores sem revisão do balanceamento completo. Uma mudança no custo de s7 pode quebrar a percepção de valor de todo o sistema.

### 5.3 Progressão de Tiers

- 12 tiers do Bronze ao Diamante Negro
- Tier máximo: 45.000 XP (Diamante Negro)
- Usuário médio dedicado: ~50 XP/dia → tier Ouro em ~1 mês

### 5.4 Ofensiva (Streak)

- Calculada a partir do `dailyLog`: dias consecutivos (incluindo hoje) com pelo menos 1 missão diária concluída
- Exibida no Hub como número (`🔥 Ofensiva`) e mini-calendário dos últimos 7 dias
- Exibida no Painel como número + mini-calendário no card de ranking
- Exibida nos perfis da Comunidade (card + detalhe)
- Armazenada em `state.stats.currentStreak` (atual) e `state.stats.maxStreak` (recorde)

### 5.5 Feedback Visual (Confete)

Ao concluir uma missão (diária ou semanal), 16 partículas coloridas explodem do botão usando animação CSS `sparkle-fly`.

### 5.6 Penalidade Automática de Missões Diárias

Ao virar o dia (detectado na abertura do painel), missões diárias não concluídas e que ainda não falharam recebem penalidade de XP automaticamente. O registro no `dailyLog` garante que a penalidade não seja aplicada duas vezes.

---

## 6. Stack Técnica e Decisões Arquiteturais

### 6.1 Por que Vanilla TypeScript (sem frameworks React)?

- **Performance:** zero bundle overhead, carregamento imediato
- **Hospedagem simples:** qualquer CDN estático serve o `dist/`
- **Manutenibilidade:** TypeScript com `strict: false` — qualquer dev com conhecimento básico de TS/HTML/CSS entende o código
- **Segurança de tipos:** ~120 globais tipados em `globals.d.ts`, typecheck com `tsc`, lint com ESLint flat config + typescript-eslint
- **Testes automatizados:** Vitest + jsdom para funções puras (30 testes, ~1.1s)
- **Restrição:** não introduza React, Vue ou Angular sem ordem explícita do usuário

### 6.2 Por que Firebase via CDN dinâmico?

- Evita bundle com o SDK (economiza ~200KB no JS final)
- Fallback gracioso quando CDN está indisponível (modo visitante automático)
- Versão fixa: `firebase-app/auth/firestore 10.8.0`

### 6.3 Fluxo de Auth

```
onAuthStateChanged dispara
    |
[se user] -> syncUserData(uid)
    |
applyRemoteState(data) -> applyPrefs() -> handleAuthRouting() -> render/renderHeroHub/renderComunidade
    |
initNotifications()

[se null] -> loadGuestState() -> saveGuestState() -> applyPrefs() -> handleAuthRouting() -> render/renderStudy
```

### 6.4 Multi-Page App (MPA) com Vite + TypeScript

- 5 entries no `vite.config.js`: `index.html`, `panel.html`, `study.html`, `review.html`, `comunidade.html`
- HTMLs ficam na raiz (requerimento do Vite MPA)
- Scripts importados como `.ts` — Vite compila com esbuild
- `npm run dev` -> servidor HMR na porta 5173
- `npm run build` -> gera `dist/` com assets otimizados

---

## 7. Diretrizes de Design e UX

- **Vibrante e Recompensador:** cada ação deve gerar feedback visual (toast, animação, atualização instantânea de stats)
- **Micro-interações:** conclusão de missão, upgrade de tier, compra na loja — todos devem ter resposta imediata
- **Consistência Visual:** sempre use as variáveis CSS do tema ativo; nunca hardcode cores no JS
- **Mobile-first:** o design deve funcionar em telas de 375px+; use unidades responsivas (`rem`, `%`, `clamp`)
- **Acessibilidade básica:** use `title=""` em botões de ícone, `alt=""` em imagens, `role=""` em modais

### Design System — Neomorfismo Flat

Sombras offset sólidas (não gaussianas):
```css
box-shadow: var(--shadow-depth) var(--shadow-depth) 0px var(--shadow-color);
```

Hover: `transform: translate(-1px, -1px)` + sombra maior
Active: `transform: translate(2px, 2px)` + sombra menor

---

## 8. Roadmap

Consulte [`docs/ROADMAP.md`](docs/ROADMAP.md) para funcionalidades implementadas e planejamento aprovado. Consulte [`docs/IDEAS.md`](docs/IDEAS.md) para hipóteses e oportunidades não aprovadas.

---

## 9. Histórico de Versões

### 2026-07-02 — Documentação v2 (auditoria completa)

- `docs/AI_CONSTITUTION.md` criado a partir de auditoria total do repositório
- `docs/PRODUCT.md` reescrito para eliminar inconsistências e seções desatualizadas
- Inventário de inconsistências conhecidas documentado
- Catálogo completo de variáveis globais documentado
- Seção de personas e TDAH adicionada (1.3)
- Backlog/Roadmap migrado para `docs/ROADMAP.md` (seção 8) — posteriormente depurado: itens fictícios movidos para `docs/IDEAS.md`

### 2026-06-28 — v4.0 (Revisão Espaçada)

- **Nova página:** `review.html` com sistema completo de repetição espaçada (SM-2 adaptado)
- **Blocos de estudo:** criação, revisão com feedback de dificuldade, cores customizáveis, status visuais
- **Configurações de revisão:** 5 presets padrão + suporte a configurações personalizadas
- **Filtros e busca:** toolbar com busca textual, filtro por status/matéria, ordenação e barra de estatísticas
- **Notificações integradas:** notificação persistente no painel de notificações para blocos due/overdue
- **20+ novos globals** expostos em `window.*` e documentados

### 2026-06-25 — v3.2 (Testes Automatizados)

- Vitest 4.1.9 + jsdom instalado; `npm run test` / `npm run test:watch`
- 3 suites de teste (~30 testes): `date.test.ts`, `streak.test.ts`, `state.test.ts`
- Setup file com polyfill de localStorage para Node.js

### 2026-06-25 — v3.1 (Type Safety)

- `modals.ts`: 47 erros de tipo corrigidos — `@ts-nocheck` removido
- `globals.d.ts`: `Document.getElementById` com overload `any` (pragmático para DOM não-estrito)
- `npm run typecheck`, `lint`, `build` — zero erros

### 2026-06-25 — v3.0 (TypeScript Migration + ESLint)

- Todos os 22 arquivos `.js` migrados para `.ts`
- TypeScript 6.0.3 + `tsconfig.json` com `strict: false`
- ESLint flat config com `typescript-eslint` parser
- `src/types/globals.d.ts` com ~120 globais tipados
- Lint e typecheck passando limpo

### 2026-06-25 — v2.5 (Modo Momentum)

- Botão na métrica "Momentum" dentro do ranking card do Painel
- Overlay fullscreen com `backdrop-filter: blur(6px)` isola a primeira missão diária não concluída
- Ao completar ou falhar, avança automaticamente para a próxima missão
- Quando todas as missões diárias são resolvidas: "Todas as missões do dia concluídas!" + botão "Voltar"
- Tecla Escape sai do modo a qualquer momento

### 2026-06-25 — v2.4 (Correção de Fuso + Persistência Firestore + Factory Reset)

- `getTodayStr()`, `getYesterdayStr()`, `calcStreak()` corrigidos de UTC para data local
- `getLocalDateStr(d)` adicionado como utilitário central
- **Correção grave:** `dailyLog`, `weeklyLog` e `lastDailyDate` finalmente persistidos no Firestore
- Logout reseta estado para fábrica (incluindo tema) ao invés de restaurar guest state do localStorage
- Botão "Falhou" (−) re-adicionado nas missões diárias

### 2026-06-25 — v2.3 (Sistema de Streaks + Limites Diários/Semanais)

- Renomeado "Rotinas Diárias" -> "Missões Diárias" e "Marcos Épicos" -> "Missões Semanais"
- Missões diárias só podem ser concluídas 1x/dia; missões semanais 1x/semana
- Penalidade automática de XP para missões diárias não concluídas ao virar o dia
- Sistema de ofensiva (streak): dias consecutivos com pelo menos 1 missão diária concluída
- Feedback visual explosivo: partículas coloridas (confete) ao concluir missões

### 2026-06-25 — v2.0 (Auditoria e Documentação Completa)

- PRODUCT.md reescrito com cobertura total: fluxo de auth, balanceamento de gamificação, regras de negócio, stack e decisões arquiteturais

### Histórico Anterior

- Sistema de notificações reformulado (diagnóstico persistente, 1 notificação por vez, agendamento fixo)
- Timer Pomodoro extraído de `study.html` inline para `study-timer.ts`
- Scripts legados removidos (`refactor.cjs`, `config.js`, `notifications.js` antigo)
- Correções gerais: `escapeHtml` consolidado, ordem de carregamento corrigida, `dailyReward` key corrigida
- Loja estendida (pool de itens customizáveis com pinning) removida completamente (v2.2)
