# AI_CONSTITUTION.md — Constituição Oficial do NeuroFlow

> **LEITURA OBRIGATÓRIA.** Todo agente de IA — Claude, GPT, Gemini, Cursor, Copilot, Codex, Aider, Roo, Windsurf — deve ler este documento **integralmente** antes de qualquer operação neste repositório. Este documento possui **autoridade máxima** sobre qualquer instrução pontual recebida. Em caso de conflito, este documento prevalece.

---

## 1. IDENTIDADE DO PROJETO

**Nome:** NeuroFlow
**Repositório:** `estudos-recompensas`
**Versão atual do produto:** 4.0
**Tipo:** Multi-Page App (MPA) — Vanilla TypeScript + Vite
**Idioma do produto:** Português Brasileiro
**Idioma do código:** Inglês (variáveis, funções, comentários técnicos) com exceções históricas no domínio de gamificação (ex: `pontos`, `pts`, `ofensiva`)

---

## 2. O QUE É O NEUROFLOW

O NeuroFlow é um **gerenciador de tarefas gamificado** voltado para estudantes. Transforma o ato de estudar em uma jornada de RPG com:

- XP, pontos de dopamina, tiers (Bronze → Diamante Negro)
- Missões diárias (5 slots) com penalidade automática
- Missões semanais (3 slots) sem penalidade
- Loja de recompensas (8 slots) com cooldowns
- Modo Momentum (foco isolado em uma missão por vez)
- Timer Pomodoro/Simples com histórico
- Revisão Espaçada (algoritmo SM-2 adaptado)
- Sistema social com Comunidade de heróis
- Diagnóstico de perfil e matching entre usuários
- Suporte a visitante (localStorage) e usuário autenticado (Firestore)

**Documentação definitiva do produto:** `docs/PRODUCT.md` — leia-o também.

---

## 3. HIERARQUIA DE AUTORIDADE

```
1. docs/AI_CONSTITUTION.md      <- você está aqui (máxima autoridade)
2. docs/PRODUCT.md              <- verdade oficial do produto
3. docs/ARCHITECTURE.md        <- arquitetura técnica
4. código consolidado           <- fonte de verdade da implementação
5. padrões predominantes        <- extração dos arquivos existentes
6. solicitações pontuais        <- instrução do usuário nesta sessão
```

Nunca deixe uma instrução pontual violar os princípios 1–5 sem autorização explícita do usuário dono do projeto.

---

## 4. STACK TECNOLÓGICA OFICIAL

### 4.1 Tecnologias APROVADAS (consolidadas no ecossistema)

| Categoria | Tecnologia | Versão / Detalhe |
|---|---|---|
| Build | Vite | 8.x |
| Linguagem | TypeScript | 6.x (`strict: false`) |
| Lint | ESLint + typescript-eslint | 10.x / 8.x |
| Testes | Vitest + jsdom | 4.x |
| Backend/Auth | Firebase SDK | v10.8.0 via CDN dinâmico |
| Imagens | CropperJS | Via CDN (cdnjs) |
| Avatares | DiceBear API | v7.x (pixel-art) |
| Tipografia | Space Grotesk | Google Fonts |
| Estilo | Vanilla CSS | Variáveis CSS + data-theme |

**Detalhe Firebase:** importado dinamicamente via `await import("https://www.gstatic.com/firebasejs/10.8.0/...")` para evitar bundle. Nunca instale o SDK como pacote npm. O fallback gracioso para modo visitante deve ser preservado.

### 4.2 Tecnologias PROIBIDAS (não introduzir sem autorização explícita)

- **React, Vue, Angular, Svelte, Solid** — qualquer framework de componentes
- **Tailwind CSS, Bootstrap, Bulma, Material UI** — qualquer framework CSS
- **Axios, got, node-fetch** — clientes HTTP (use `fetch` nativo)
- **lodash, Ramda, underscore** — utilitários de array/objeto (use JS nativo)
- **Redux, Zustand, Pinia, MobX** — gerenciadores de estado externos
- **Jest, Mocha, Jasmine** — substituição do Vitest
- **Rollup, Webpack, Parcel** — substituição do Vite
- Qualquer nova dependência de produção (o projeto tem **zero** dependências de produção)

> **Regra de ouro:** se não está no `package.json` atual, não existe no projeto. Para adicionar qualquer biblioteca, exija autorização explícita.

---

## 5. ARQUITETURA E ESTRUTURA

### 5.1 MPA — Regra crítica de entrada

Existem **6 páginas** (entradas do Vite). Os HTMLs ficam **na raiz** por requisito do Vite MPA:

| Arquivo HTML | Rota | Propósito |
|---|---|---|
| `index.html` | `/` | Hero Hub (perfil do herói) |
| `panel.html` | `/panel.html` | Painel/Dashboard (missões + loja) |
| `study.html` | `/study.html` | Modo Estudo / Pomodoro |
| `review.html` | `/review.html` | Revisão Espaçada |
| `comunidade.html` | `/comunidade.html` | Comunidade Social |
| `flashcards.html` | `/flashcards.html` | Flashcards |

**Nunca mova os HTMLs da raiz.** Nunca crie um SPA wrapper. A navegação entre páginas é via `window.location.href`.

### 5.2 Estrutura de Diretórios

```
/
├── index.html, panel.html, study.html, review.html, comunidade.html
├── src/
│   ├── core/                 # Estado global, roteamento, Firebase
│   │   ├── state.ts          # window.state, TIERS, lógica de persistência
│   │   ├── router.ts         # handleAuthRouting, navigateTo, setGuestMode
│   │   ├── review-logic.ts   # calculateNextReview, updateBlocksStatus
│   │   └── firebase/
│   │       ├── init.ts       # Inicialização dinâmica do SDK
│   │       ├── auth.ts       # Login/logout/onAuthStateChanged
│   │       └── db.ts         # CRUD Firestore (state + studySessions + studyBlocks)
│   ├── features/
│   │   ├── notifications/    # Sistema completo de notificações
│   │   │   ├── engine.ts     # Estado + matching
│   │   │   ├── ui.ts         # Render do painel dropdown
│   │   │   ├── init.ts       # Timers + exports globais
│   │   │   ├── messages.ts   # Mensagens das notificações
│   │   │   ├── diagnostic-data.ts  # 21 perguntas do diagnóstico
│   │   │   └── diagnostic-ui.ts    # Interface do diagnóstico
│   │   └── onboarding/
│   │       └── onboarding.ts # Wizard gamificado de 3 etapas
│   ├── pages/                # Scripts por página (1 arquivo por página)
│   │   ├── hub/hub.ts
│   │   ├── panel/panel.ts
│   │   ├── study/study-timer.ts
│   │   ├── review/review.ts
│   │   ├── flashcards/flashcards.ts
│   │   └── comunidade/comunidade.ts
│   ├── shared/               # Reutilizáveis entre páginas
│   │   ├── ui/
│   │   │   ├── modals.ts     # Auth modal + settings modal abertura
│   │   │   ├── settings-modal.ts  # Modal de configurações completo + sons
│   │   │   ├── theme.ts      # Sistema de temas (22 temas)
│   │   │   ├── toast.ts      # Função toast()
│   │   │   ├── media.ts      # CropperJS (avatar + banner)
│   │   │   └── review-settings-dialog.ts
│   │   └── templates/
│   │       └── templates.ts  # SLOT_ECONOMICS, DEFAULT_SLOT_TEXT, SLOT_PRESETS
│   ├── styles/
│   │   ├── global/
│   │   │   ├── base.css      # Reset, variáveis CSS, todos os 22 temas
│   │   │   └── layout.css    # Container, bento-layout, top-bar, responsividade
│   │   ├── components/
│   │   │   ├── components.css  # btn-theme, bento-card, shop-node, etc.
│   │   │   └── modals.css      # Todos os estilos de modais
│   │   └── pages/
│   │       ├── hero.css      # Estilos exclusivos do Hero Hub
│   │       ├── review.css    # Estilos da Revisão Espaçada
│   │       └── comunidade.css  # Estilos da Comunidade
│   ├── types/
│   │   └── globals.d.ts      # ~120 globais tipados (window.*)
│   └── __tests__/
│       ├── setup.ts
│       ├── date.test.ts
│       ├── streak.test.ts
│       └── state.test.ts
├── docs/
│   ├── AI_CONSTITUTION.md    <- este arquivo (soberana)
│   ├── PRODUCT.md            <- verdade do produto
│   ├── ARCHITECTURE.md       <- arquitetura técnica
│   ├── KNOWN_ISSUES.md       <- problemas conhecidos
│   ├── ROADMAP.md            <- planejamento aprovado
│   └── IDEAS.md              <- hipóteses e oportunidades
└── scripts/
    └── git-enviar.sh
```

### 5.3 Padrão de Comunicação entre Módulos

O projeto usa **`window.*` como barramento global** entre scripts. Isso é uma decisão arquitetural intencional (não um anti-padrão acidental) para suportar o MPA sem bundler de estado compartilhado.

**Regras:**
- Cada módulo expõe suas funções via `window.nomeFuncao = nomeFuncao` no final do arquivo
- Scripts importados como `type="module"` no HTML (Firebase) executam após scripts regulares
- O padrão de chamada defensiva é sempre `window.funcao?.()` em vez de `funcao()`
- `$` é um atalho para `document.getElementById` — definido localmente em cada script

### 5.4 Padrão `$` (Shorthand)

Cada página/módulo define seu próprio `$` local:
```typescript
const $ = (id: string) => document.getElementById(id);
```
Nunca assuma que `$` é jQuery. Nunca instale jQuery.

---

## 6. SISTEMA DE ESTADO

### 6.1 Estrutura do estado (`window.state`)

```typescript
interface AppState {
  pts: number;           // Pontos de dopamina
  xp: number;            // Experience Points
  cd: Record<string, number>;  // Cooldowns da loja (timestamp)
  prefs: UserPrefs;      // { theme, radius, shadow, isAdmin? }
  profile: UserProfile;  // { epicGoal, displayName, description, avatarUrl, bannerUrl, public }
  stats: UserStats;      // { dailiesDone, epicsDone, purchases, currentStreak, maxStreak }
  slots: Slots;          // Texto customizado dos 16 slots
  diagnostic?: Record<string, unknown>;
  dailyLog: Record<string, string[]>;   // { "2026-06-25": ["d1", "d2"] }
  weeklyLog: Record<string, string[]>;  // { "2026-W26": ["e1"] }
  lastDailyDate: string;
  activeReviewSetting: ActiveReviewSetting | null;
  onboardingComplete: boolean;
  studyBlocks: StudyBlock[];
}
```

### 6.2 Chaves de Persistência

| Chave | Escopo | Conteúdo |
|---|---|---|
| `neuroflow_guest_v2` | localStorage | Estado completo do visitante |
| `neuroflow_notifs_v1` | localStorage | Notificações + badge count |
| `historico_estudos` | localStorage | Histórico de sessões de estudo |
| `estudo_config_som` | localStorage | Preferências de sons do Pomodoro |
| `users/{uid}` | Firestore | Documento principal do usuário |
| `users/{uid}/studySessions/{id}` | Firestore | Sessões de estudo |
| `users/{uid}/studyBlocks/{id}` | Firestore | Blocos de revisão espaçada |

### 6.3 Fluxo de Auth (crítico — não altere sem autorização)

```
onAuthStateChanged dispara
    |
[user] -> syncUserData(uid)
    |
applyRemoteState(data) -> applyPrefs() -> handleAuthRouting() -> render()
initNotifications()

[null] -> loadGuestState() -> applyPrefs() -> handleAuthRouting() -> render()
```

**Fallback:** se Firebase não resolver em 5 segundos, `authFallbackTimer` em `auth.ts` aciona modo visitante automaticamente.

---

## 7. SISTEMA DE GAMIFICAÇÃO (VALORES IMUTÁVEIS)

### 7.1 Economia de XP e Pontos

| Slot | ID | XP Ganho | Pts Ganhos | Penalidade XP |
|---|---|---|---|---|
| Daily 1 | `d1` | 10 | 5 | -5 |
| Daily 2 | `d2` | 15 | 10 | -10 |
| Daily 3 | `d3` | 25 | 20 | -15 |
| Daily 4 | `d4` | 30 | 25 | -15 |
| Daily 5 | `d5` | 25 | 20 | -10 |
| Epic 1 | `e1` | 200 | 150 | nenhuma |
| Epic 2 | `e2` | 180 | 120 | nenhuma |
| Epic 3 | `e3` | 150 | 100 | nenhuma |

### 7.2 Cooldowns da Loja

| Slot | ID | Custo | Tipo | Cooldown (ms) |
|---|---|---|---|---|
| Shop 1 | `s1` | 35 Pts | Diário | 86.400.000 |
| Shop 2 | `s2` | 80 Pts | Diário | 86.400.000 |
| Shop 3 | `s3` | 120 Pts | Diário | 86.400.000 |
| Shop 4 | `s4` | 200 Pts | Semanal | 604.800.000 |
| Shop 5 | `s5` | 500 Pts | Semanal | 604.800.000 |
| Shop 6 | `s6` | 800 Pts | Semanal | 604.800.000 |
| Shop 7 | `s7` | 1.500 Pts | Mensal | 2.592.000.000 |
| Shop 8 | `s8` | 2.000 Pts | Mensal | 2.592.000.000 |

> CRITICO: Esses valores estão em `SLOT_ECONOMICS` em `templates.ts` e são `Object.freeze()`. Nunca altere sem revisão completa de balanceamento. Uma mudança em `s7` quebra a percepção de valor de todo o sistema.

### 7.3 Progressão de Tiers (12 níveis)

| Tier | Emoji | XP Min | XP Max |
|---|---|---|---|
| Bronze | 🥉 | 0 | 499 |
| Prata | 🥈 | 500 | 1.499 |
| Ouro | 🥇 | 1.500 | 2.999 |
| Platina | 💎 | 3.000 | 4.999 |
| Diamante | ❄️ | 5.000 | 7.499 |
| Esmeralda | 💚 | 7.500 | 10.499 |
| Safira | 🔹 | 10.500 | 14.499 |
| Rubi | ❤️ | 14.500 | 19.499 |
| Ametista | 💜 | 19.500 | 25.499 |
| Opala | 🌈 | 25.500 | 32.499 |
| Obsidiana | 🖤 | 32.500 | 44.999 |
| Diamante Negro | 🌌 | 45.000 | infinito |

---

## 8. SISTEMA DE TEMAS

### 8.1 Os 22 temas disponíveis

**Claros (7):** `light`, `pastel-brown`, `pastel-pink`, `pastel-blue`, `pastel-purple`, `pastel-mint`, `solarized-light`
**Escuros (15):** `dark`, `dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome`, `dark-chocolate`, `dark-forest`, `dark-amber`, `dark-purple`, `catppuccin`, `nord`, `dracula`, `github-dark`, `outerwilds-dark`, `outerwilds-light`

### 8.2 Variáveis CSS obrigatórias por tema

```css
--bg             /* fundo principal */
--surface        /* superfície de cards/panels */
--panel          /* fundo de painéis internos */
--card-bg        /* fundo de cards */
--text           /* cor de texto principal */
--stroke         /* bordas e outlines */
--shadow-color   /* cor de sombras neomorficas */
--accent         /* cor de destaque/ação */
--accent-text    /* texto sobre --accent */
--muted          /* texto secundário */
--success        /* verde de sucesso */
--failure        /* vermelho de falha */
--select-arrow   /* ícone SVG inline para selects */
```

### 8.3 Variáveis globais de customização

```css
--base-radius    /* raio base (padrão: 16px) */
--card-radius    /* = --base-radius */
--element-radius /* = calc(--base-radius * 0.5) */
--shadow-depth   /* profundidade de sombra (padrão: 6px) */
```

### 8.4 Regras para adicionar um tema

1. Adicionar bloco `[data-theme="nome"]` em `base.css` com **todas** as variáveis acima
2. Adicionar entrada em `THEME_LABELS` em `theme.ts`
3. Adicionar botão de preview nos **4 HTMLs** que usam o seletor de temas
4. Verificar contraste do `--select-arrow` (precisa ser SVG com a cor do texto do tema)

---

## 9. PADROES DE CÓDIGO

### 9.1 TypeScript

- `strict: false` — não altere isso. A base de código usa `@ts-nocheck` em vários arquivos legados
- Arquivos com `// @ts-nocheck`: `state.ts`, `router.ts`, `review-logic.ts`, `engine.ts`, `panel.ts`, `hub.ts`, `review.ts`, `comunidade.ts`, `onboarding.ts`, `auth.ts`, `db.ts`, `init.ts`
- **Não remova `@ts-nocheck`** de arquivos existentes sem garantir que todos os erros de tipo sejam corrigidos (padrão estabelecido na v3.1)
- Arquivos novos devem ser tipados adequadamente

### 9.2 Funções Globais Críticas

#### `escapeHtml` — REGRA ABSOLUTA

```typescript
// CORRETO — definida UMA VEZ em modals.ts, usada via window
window.escapeHtml(str)

// PROIBIDO — nunca crie uma segunda declaração
const escapeHtml = (str) => { ... }
```

#### `$` (getElementById shorthand)

```typescript
// Cada módulo define localmente:
const $ = (id: string) => document.getElementById(id);
// Nunca assuma que $ é global ou jQuery
```

#### `toast(msg, fail?, duration?)`

```typescript
window.toast('Mensagem de sucesso!');
window.toast('Erro!', true);         // toast vermelho
window.toast('Info', false, 5000);   // duração customizada
```

### 9.3 Datas — REGRA CRÍTICA

**Sempre use data local, nunca UTC:**

```typescript
// CORRETO
window.getTodayStr()          // "2026-06-25" (hora local)
window.getLocalDateStr(date)  // formata Date para "YYYY-MM-DD" local
window.getYesterdayStr()

// PROIBIDO para lógica de gamificação
new Date().toISOString().slice(0, 10) // retorna data UTC — quebra streak em timezones
```

**Semanas (missões semanais):**
```typescript
window.getWeekStr(date) // "2026-W26" (ISO week, segunda como dia 1)
```

### 9.4 Persistência

**Salvar estado sempre via:**
```typescript
await window.saveState(); // detecta automaticamente modo (guest vs Firestore)
```

**Nunca acesse localStorage diretamente** para dados de estado do usuário fora de `state.ts`.

---

## 10. SISTEMA DE NOTIFICAÇÕES

### 10.1 Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `engine.ts` | Estado (__notifications[]), lógica de matching, persistência |
| `ui.ts` | Render do painel dropdown e mini-modais de perfil |
| `init.ts` | Timers, inicialização, exports globais |
| `messages.ts` | Templates de mensagens |
| `diagnostic-data.ts` | 21 perguntas do diagnóstico em 5 tracks |
| `diagnostic-ui.ts` | Interface do questionário |

### 10.2 Regras de notificações

- **Diagnóstico persistente:** ID `'diag-persistent'`, `persistent: true` — não pode ser deletado pelo usuário
- **Matching:** máximo 1 notificação regular por vez; gerada em 00:00 ou 12:00 local
- **Badge:** número de não-lidas no ícone de sino; ponto laranja quando diagnóstico pendente
- **Storage key:** `'neuroflow_notifs_v1'`
- Toast de lembrete: "Responda ao Diagnóstico" a cada 2 minutos para quem não respondeu

---

## 11. SISTEMA DE REVISÃO ESPAÇADA

### 11.1 Algoritmo SM-2 Adaptado

```
hard   -> repete o mesmo índice de intervalo
medium -> avança 1 índice
easy   -> avança 2 índices (ou vai ao máximo disponível)
```

### 11.2 Status dos blocos

| Status | Cor visual | Condição |
|---|---|---|
| `pending` | cor padrão | Próxima revisão > hoje |
| `due` | laranja | Próxima revisão == hoje |
| `overdue` | vermelho | Próxima revisão < hoje |
| `completed` | verde | Revisado hoje |

### 11.3 Presets padrão (IDs reservados)

- `curta` — intervalos: [1, 3, 7, 15, 30]
- `mensal` — intervalos: [7, 14, 30, 60, 90]
- `semestral` — intervalos: [1, 7, 21, 60, 180]
- `intensiva` — intervalos: [1, 2, 4, 7, 14]
- `longo` — intervalos: [3, 10, 30, 90, 180]
- `custom` — definido pelo usuário

---

## 12. IDENTIDADE VISUAL

### 12.1 Design System

O projeto usa **neomorfismo flat** com sombras offset sólidas (não gaussianas):

```css
box-shadow: var(--shadow-depth) var(--shadow-depth) 0px var(--shadow-color);
```

Hover de botão:
```css
transform: translate(-1px, -1px);
box-shadow: 4px 4px 0px var(--shadow-color);
```

Active de botão:
```css
transform: translate(2px, 2px);
box-shadow: 1px 1px 0px var(--shadow-color);
```

### 12.2 Componentes padrão

| Componente | Classe CSS | Onde definido |
|---|---|---|
| Card padrão | `.bento-card` | `components.css` |
| Botão principal | `.btn-theme` | `components.css` |
| Layout de grade | `.bento-layout` | `layout.css` |
| Container máximo | `.container` (max-width: 1100px) | `layout.css` |
| Barra superior | `.top-bar` | `layout.css` |
| Tag de tipo | `.node-tag.t-day`, `.t-wk`, `.t-mo` | `components.css` |
| Toast | `.toast`, `.toast.fail` | modais |

### 12.3 Tipografia

- **Fonte primária:** `Space Grotesk` (Google Fonts)
- **Fallback:** `Inter`, `system-ui`, `sans-serif`
- Declarada em `*` selector em `base.css` — não override sem motivo

### 12.4 Responsividade

- `max-width: 900px` — grid de 3 colunas colapsa para 1
- `max-width: 640px` — ajustes de top-bar, modais, tipografia

---

## 13. SCHEMA DO FIRESTORE

### Colecão `users/{uid}`

```
pontos: number        // alias de pts
xp: number
cd: { [slotId]: timestamp }
prefs: { theme, radius, shadow, isAdmin? }
profile: { epicGoal, displayName, description, avatarUrl, bannerUrl, public }
stats: { dailiesDone, epicsDone, purchases, currentStreak, maxStreak }
slots: { dailies: {d1..d5}, epics: {e1..e3}, shop: {s1..s8} }
dailyLog: { "YYYY-MM-DD": ["d1", "d2"] }
weeklyLog: { "YYYY-Www": ["e1"] }
lastDailyDate: string
activeReviewSetting: ActiveReviewSetting | null
onboardingComplete: boolean
studyBlocks: StudyBlock[]   // também na subcoleção
updatedAt: number
diagnostic: { ... }   // resultado do diagnóstico
```

### Subcoleção `users/{uid}/studySessions/{sessionId}`

```
id, timestamp, materia, mode, focusTime, breakTime, totalTime, cycles?, notes?, uid, savedAt
```

### Subcoleção `users/{uid}/studyBlocks/{blockId}`

```
id, userId, materia, topico, conteudo, createdAt, lastReviewDate, nextReviewDate,
status, reviewSettingsId?, currentIntervalIndex, repetition, color, savedAt
```

---

## 14. VARIÁVEIS GLOBAIS WINDOW DOCUMENTADAS

As ~120 variáveis globais estão tipadas em `src/types/globals.d.ts`. As mais críticas:

### Core
- `window.state` — AppState
- `window.currentUser` — Firebase User | null
- `window.isGuestMode` — boolean
- `window.isAdmin` — boolean
- `window.TIERS` — Tier[]

### Funções de Estado
- `window.saveState()` — persiste (auto-detecta modo)
- `window.loadGuestState()` / `window.saveGuestState()`
- `window.applyRemoteState(data)` — aplica dados do Firestore
- `window.createDefaultState()` — estado limpo

### Funções de Data
- `window.getTodayStr()` — "YYYY-MM-DD" local
- `window.getYesterdayStr()` — "YYYY-MM-DD" local
- `window.getLocalDateStr(d)` — Date -> "YYYY-MM-DD" local
- `window.getWeekStr(date)` — "YYYY-Www"
- `window.calcStreak()` — número de dias consecutivos

### Navegação/Auth
- `window.handleAuthRouting()` — roteamento pós-auth
- `window.navigateTo(url)` — navegação entre páginas
- `window.setGuestMode(bool)` — alterna modo visitante
- `window.enterGuestMode()` / `window.enterHeroHub()` / `window.enterPanel()`

### Render por Página
- `window.render()` — Painel
- `window.renderHeroHub()` — Hero Hub
- `window.renderComunidade()` — Comunidade
- `window.renderStudy()` — Estudo
- `window.renderReviewPage()` — Revisão

### Firebase
- `window.syncUserData(uid)`
- `window.saveStateToFirestore(uid, state, partial?)`
- `window.completeOnboarding(uid, data)`
- `window.fetchPublicProfiles(max?)`
- `window.loginGoogle()` / `window.logoutGoogle()`
- `window.loginEmailAndPassword(email, pwd)`
- `window.registerEmailAndPassword(email, pwd)`

### Templates/Slots
- `window.SLOT_ECONOMICS` — readonly, valores econômicos
- `window.DAILIES` — getter que retorna dailies mesclados
- `window.EPICS` — getter que retorna epics mesclados
- `window.SHOP` — getter que retorna shop mesclados
- `window.buildMergedSlots(slots)` — merge templates + customização
- `window.cloneDefaultSlotText()` — clone profundo dos defaults
- `window.mergeSlotText(base, overrides)` — aplicar overrides do usuário

### UI
- `window.toast(msg, fail?, duration?)` — notificação temporária
- `window.escapeHtml(str)` — sanitização HTML (única instância)
- `window.applyPrefs(prefs)` — aplica tema, radius, shadow
- `window.changeTheme(name)` / `window.changeRadius(val)` / `window.changeShadow(val)`
- `window.openSettingsModal()` / `window.closeSettingsModal()`
- `window.openAuthModal()` / `window.closeAuthModal()`

### Revisão Espaçada
- `window.calculateNextReview(block, settings, difficulty, referenceDate?)`
- `window.updateBlocksStatus()` — atualiza status de todos os blocos
- `window.renderStudyBlocksList()` — renderiza lista de blocos
- `window.generateReviewNotif()` — gera/atualiza notificação de revisão

### Admin
- `window.ativarAdmin()` — ativa modo admin via console
- `window.desativarAdmin()` — desativa modo admin via console
- `window.isAdmin` — flag de admin

---

## 15. REGRAS ABSOLUTAS DE COMPORTAMENTO

### O que NUNCA fazer:

1. **Nunca remover funcionalidades** sem autorização explícita
2. **Nunca alterar `SLOT_ECONOMICS`** sem revisão de balanceamento aprovada
3. **Nunca introduzir novos frameworks ou bibliotecas** sem autorização
4. **Nunca criar segunda implementação de `escapeHtml`** — existe uma única em `modals.ts`
5. **Nunca usar data UTC** para lógica de streak, dailyLog ou weeklyLog
6. **Nunca mover HTMLs da raiz** — é requisito do Vite MPA
7. **Nunca criar React components, Vue components, ou equivalentes**
8. **Nunca hardcode cores** — sempre use variáveis CSS do tema ativo
9. **Nunca acessar localStorage diretamente** para estado do usuário fora de `state.ts`
10. **Nunca adicionar dependência de produção ao `package.json`**
11. **Nunca criar um segundo sistema de roteamento** — `router.ts` é o único
12. **Nunca criar um segundo sistema de toasts** — `toast.ts` é o único
13. **Nunca criar um segundo sistema de temas** — `theme.ts` é o único

### O que SEMPRE fazer:

1. **Ler `PRODUCT.md`** além desta constituição
2. **Verificar se já existe** implementação antes de criar algo novo
3. **Usar variáveis CSS** para todas as cores (`var(--accent)`, etc.)
4. **Usar `window.saveState()`** para persistir qualquer dado de estado
5. **Usar `window.escapeHtml(str)`** para sanitizar HTML renderizado dinamicamente
6. **Usar `window.getTodayStr()`** para obter data atual no formato correto
7. **Expor novas funções via `window.nome = funcao`** no final do arquivo
8. **Testar funções puras** com Vitest quando aplicável
9. **Verificar padrão predominante** antes de criar qualquer estilo novo
10. **Manter `@ts-nocheck`** em arquivos que já o possuem, a não ser que todos os erros sejam corrigidos

---

## 16. MODO DE OPERAÇÃO PARA AGENTES

### Antes de qualquer tarefa:

1. Ler `AI_CONSTITUTION.md` (este arquivo)
2. Ler `docs/PRODUCT.md` para contexto de produto
3. Identificar o arquivo que será modificado
4. Verificar se existe implementação similar
5. Verificar padrões do arquivo-alvo e arquivos próximos

### Durante a execução:

- Princípio do **menor delta**: a menor mudança que resolve completamente o problema
- **Não reorganize** código não relacionado à tarefa
- **Não renomeie** variáveis por preferência estética
- **Não reformate** código não modificado
- Ao descobrir inconsistências ou bugs adicionais: **termine a tarefa solicitada primeiro**, então reporte

### Em caso de ambiguidade:

1. **Pare**
2. Não improvise nem invente
3. Releia esta constituição e `PRODUCT.md`
4. Escolha a solução mais compatível com os padrões existentes
5. Se necessário, pergunte ao usuário com contexto específico

---

## 17. DOCUMENTAÇÃO COMPLEMENTAR

Consulte os seguintes documentos para informações não cobertas por esta constituição:

- [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md) — inventário completo de inconsistências, problemas conhecidos e débitos técnicos
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — funcionalidades implementadas e planejamento aprovado pelo proprietário
- [`docs/IDEAS.md`](docs/IDEAS.md) — hipóteses, oportunidades e sugestões não aprovadas (sem compromisso)

---

## 18. PRINCÍPIO DA SOBERANIA DO PLANEJAMENTO

A direção estratégica do produto pertence exclusivamente ao proprietário do projeto.

**Agentes podem:**

- identificar oportunidades
- identificar funcionalidades parcialmente implementadas
- identificar sistemas abandonados
- identificar melhorias técnicas
- identificar inconsistências
- identificar possíveis evoluções

**Agentes não podem:**

- criar roadmap
- definir prioridades
- inventar funcionalidades
- assumir desejos futuros
- assumir visão do produto
- promover sugestões a funcionalidades oficiais
- alterar direção estratégica

**Regra:** `docs/ROADMAP.md` representa apenas decisões já tomadas pelo proprietário. Toda sugestão não aprovada pertence exclusivamente a `docs/IDEAS.md`.

## 19. HISTÓRICO DE VERSÕES RELEVANTE

| Versão | Data | Mudança crítica |
|---|---|---|
| 4.0 | 2026-06-28 | Revisão espaçada (review.html, SM-2, blocos de estudo) |
| 3.2 | 2026-06-25 | Vitest + 30 testes unitários |
| 3.1 | 2026-06-25 | Type safety — `@ts-nocheck` removido de `modals.ts` |
| 3.0 | 2026-06-25 | Migração JS->TS (22 arquivos), ESLint flat config |
| 2.5 | 2026-06-25 | Modo Momentum |
| 2.4 | 2026-06-25 | Correção de fuso horário, dailyLog->Firestore |
| 2.3 | 2026-06-25 | Sistema de streaks, limite diário/semanal de missões |
| 2.0 | 2026-06-25 | Documentação completa, fluxo de auth documentado |

---

## 20. COMANDOS DE DESENVOLVIMENTO

```bash
npm run dev          # Servidor HMR em localhost:5173
npm run build        # Build de produção -> dist/
npm run preview      # Serve dist/ localmente
npm run test         # Vitest run (30 testes)
npm run test:watch   # Vitest modo watch
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run lint:fix     # ESLint com auto-fix
```

---

*Este documento foi criado em 2026-07-02 a partir de auditoria completa do repositório.*
*Mantenha-o atualizado a cada mudança arquitetural significativa.*
*Versão da constituição: 1.2 — 2026-07-02: adicionado Princípio da Soberania do Planejamento, referência a IDEAS.md*
