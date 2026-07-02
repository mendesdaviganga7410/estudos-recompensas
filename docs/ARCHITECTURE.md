# ARCHITECTURE.md — Arquitetura Técnica do NeuroFlow

> Documento vivo. Deve ser atualizado sempre que houver mudança arquitetural real.
> Autoridade subordinada a `AI_CONSTITUTION.md`. Em caso de conflito, a Constituição prevalece.

---

## 1. Visão Geral

O NeuroFlow é uma **Multi-Page App (MPA)** construída com Vanilla TypeScript compilado por Vite. Não há framework de componentes. O estado é compartilhado via `window.*`. A persistência alterna entre localStorage (visitante) e Firebase Firestore (autenticado).

---

## 2. Stack Oficial

| Categoria | Tecnologia | Versão | Justificativa |
|---|---|---|---|
| Build | Vite | 8.x | HMR, esbuild, MPA nativo |
| Linguagem | TypeScript | 6.x | Segurança de tipos sem overhead |
| Lint | ESLint + typescript-eslint | 10.x / 8.x | Flat config, zero plugins externos |
| Testes | Vitest + jsdom | 4.x | Zero config, compatível com Vite |
| Auth/DB | Firebase SDK | 10.8.0 via CDN | Sem bundle (~200KB economizados) |
| Imagens | CropperJS | Via CDN cdnjs | Crop de avatar e banner |
| Avatares | DiceBear API | v7.x pixel-art | Fallback gerado por e-mail/seed |
| Tipografia | Space Grotesk | Google Fonts | Identidade visual do produto |
| Estilos | Vanilla CSS | — | Variáveis CSS + `data-theme` |

**Dependências de produção no package.json: zero.**

---

## 3. Tecnologias Proibidas

Não introduza nenhuma das tecnologias abaixo sem autorização explícita do dono do projeto:

- **Frameworks de componentes:** React, Vue, Angular, Svelte, Solid
- **Frameworks CSS:** Tailwind CSS, Bootstrap, Bulma, Material UI, Chakra UI
- **Clientes HTTP:** Axios, got, node-fetch — use `fetch` nativo
- **Utilitários JS:** lodash, Ramda, underscore — use JS nativo
- **Gerenciadores de estado:** Redux, Zustand, Pinia, MobX, Jotai
- **Frameworks de teste:** Jest, Mocha, Jasmine — use Vitest
- **Bundlers alternativos:** Rollup, Webpack, Parcel, Turbopack
- **Firebase SDK via npm** — sempre via CDN dinâmico

---

## 4. Estrutura de Diretórios

```
/
├── index.html          # Hero Hub
├── panel.html          # Painel/Dashboard
├── study.html          # Modo Estudo / Pomodoro
├── review.html         # Revisão Espaçada
├── comunidade.html     # Comunidade Social
│
├── src/
│   ├── core/           # Estado global, roteamento, Firebase
│   │   ├── state.ts
│   │   ├── router.ts
│   │   ├── review-logic.ts
│   │   └── firebase/
│   │       ├── init.ts
│   │       ├── auth.ts
│   │       └── db.ts
│   │
│   ├── features/       # Domínios de negócio autocontidos
│   │   ├── notifications/
│   │   │   ├── engine.ts
│   │   │   ├── ui.ts
│   │   │   ├── init.ts
│   │   │   ├── messages.ts
│   │   │   ├── diagnostic-data.ts
│   │   │   └── diagnostic-ui.ts
│   │   └── onboarding/
│   │       └── onboarding.ts
│   │
│   ├── pages/          # Scripts de cada página (1:1 com HTMLs)
│   │   ├── hub/hub.ts
│   │   ├── panel/panel.ts
│   │   ├── study/study-timer.ts
│   │   ├── review/review.ts
│   │   └── comunidade/comunidade.ts
│   │
│   ├── shared/         # Reutilizáveis entre páginas
│   │   ├── ui/
│   │   │   ├── modals.ts
│   │   │   ├── settings-modal.ts
│   │   │   ├── theme.ts
│   │   │   ├── toast.ts
│   │   │   ├── media.ts
│   │   │   └── review-settings-dialog.ts
│   │   └── templates/
│   │       └── templates.ts
│   │
│   ├── styles/
│   │   ├── global/
│   │   │   ├── base.css       # Reset + todos os 22 temas
│   │   │   └── layout.css     # Container, grid, responsividade
│   │   ├── components/
│   │   │   ├── components.css # Componentes reutilizáveis
│   │   │   └── modals.css     # Estilos de modais
│   │   └── pages/
│   │       ├── hero.css
│   │       ├── review.css
│   │       └── comunidade.css
│   │
│   ├── types/
│   │   └── globals.d.ts       # ~120 globais tipados
│   │
│   └── __tests__/
│       ├── setup.ts
│       ├── date.test.ts
│       ├── streak.test.ts
│       └── state.test.ts
│
├── docs/
│   ├── AI_CONSTITUTION.md     # Soberana
│   ├── PRODUCT.md
│   ├── ARCHITECTURE.md        # Este arquivo
│   ├── KNOWN_ISSUES.md
│   ├── ROADMAP.md
│   └── IDEAS.md
│
├── scripts/
│   └── git-enviar.sh
│
├── AI.md                      # Ponto de descoberta universal
├── CLAUDE.md                  # Instruções para Claude
├── AGENTS.md                  # Instruções universais para agentes
├── package.json
├── vite.config.js
├── tsconfig.json
├── vitest.config.ts
└── eslint.config.js
```

---

## 5. Regras de Posicionamento de Arquivos

### HTMLs na raiz — OBRIGATÓRIO

Os 5 HTMLs (`index.html`, `panel.html`, `study.html`, `review.html`, `comunidade.html`) ficam na raiz. Isso é **requisito do Vite MPA**. Nunca mova esses arquivos.

### Critério para `src/core/`

- Módulos que definem estado global ou roteamento
- Módulos que inicializam infraestrutura (Firebase)
- Nunca contém lógica de UI específica de página

### Critério para `src/features/`

- Alta coesão: lógica + UI + inicialização de um domínio ficam juntos
- Cada feature é autocontida — não depende de outra feature

### Critério para `src/pages/`

- Um arquivo por página HTML
- Contém apenas lógica específica daquela página
- Expõe a função `renderNomeDaPagina()` via `window.*`

### Critério para `src/shared/`

- Código reutilizável por múltiplas páginas ou features
- UI agnóstica (modais, toast, temas, media)
- Templates de slots (dados estáticos compartilhados)

### Critério para `src/styles/`

- `global/` — estilos que afetam toda a aplicação
- `components/` — classes de componentes reutilizáveis
- `pages/` — estilos específicos de uma página

### Critério para novos arquivos

Antes de criar qualquer arquivo, responda:
1. Já existe implementação similar? Se sim, use-a.
2. Em qual camada este código pertence? (core / features / pages / shared)
3. Existe acoplamento com outra camada que viola a hierarquia?

---

## 6. Padrão de Comunicação entre Módulos

### window.* como barramento global

Decisão arquitetural intencional — não é anti-padrão acidental. O MPA não tem bundler de estado compartilhado entre páginas, portanto `window.*` é o mecanismo oficial.

**Regra de exposição:**
```typescript
// No final de cada arquivo — sempre após toda a lógica
window.nomeFuncao = nomeFuncao;
window.outraFuncao = outraFuncao;
```

**Regra de consumo:**
```typescript
// Sempre defensivo — o módulo pode não ter carregado ainda
window.funcao?.();
window.funcao?.('arg');
```

### Ordem de carregamento nos HTMLs

1. Scripts regulares (sem `type="module"`) — carregam síncronos
2. Scripts `type="module"` — carregam após os síncronos (deferred)

Firebase (`init.ts`, `auth.ts`, `db.ts`) são `type="module"`. Portanto, quando `onAuthStateChanged` dispara, `window.state`, `window.handleAuthRouting` e `window.render` já estão definidos.

### Padrão `$` (shorthand getElementById)

Cada módulo define seu próprio `$` localmente:
```typescript
const $ = (id: string) => document.getElementById(id);
```
Nunca assuma que `$` é global. Nunca instale jQuery.

---

## 7. Sistema de Estado

### Estrutura

```typescript
window.state: AppState = {
  pts: number,              // Pontos de dopamina
  xp: number,              // Experience Points
  cd: Record<string, number>, // Cooldowns da loja
  prefs: { theme, radius, shadow, isAdmin? },
  profile: { epicGoal, displayName, description, avatarUrl, bannerUrl, public },
  stats: { dailiesDone, epicsDone, purchases, currentStreak, maxStreak },
  slots: { dailies: {d1..d5}, epics: {e1..e3}, shop: {s1..s8} },
  diagnostic?: Record<string, unknown>,
  dailyLog: Record<string, string[]>,
  weeklyLog: Record<string, string[]>,
  lastDailyDate: string,
  activeReviewSetting: ActiveReviewSetting | null,
  onboardingComplete: boolean,
  studyBlocks: StudyBlock[]
}
```

### Regra de persistência

**Sempre via `window.saveState()`** — auto-detecta modo:
- `isGuestMode === true` → `localStorage['neuroflow_guest_v2']`
- `isGuestMode === false` → Firestore `users/{uid}` via `saveStateToFirestore()`

Nunca acesse localStorage diretamente para dados de estado fora de `state.ts`.

### Chaves de localStorage

| Chave | Conteúdo |
|---|---|
| `neuroflow_guest_v2` | Estado completo do visitante |
| `neuroflow_notifs_v1` | Notificações + badge count |
| `historico_estudos` | Sessões de estudo (migradas para Firestore ao logar) |
| `estudo_config_som` | Preferências de sons do Pomodoro |

---

## 8. Padrões TypeScript

### Configuração

```json
{
  "strict": false,
  "allowJs": true,
  "checkJs": false,
  "target": "ESNext",
  "module": "ESNext",
  "moduleResolution": "bundler"
}
```

Não altere `strict: false`. É decisão intencional para manter legibilidade da base.

### `@ts-nocheck`

Arquivos com `@ts-nocheck` por razões históricas:
`state.ts`, `router.ts`, `review-logic.ts`, `engine.ts`, `panel.ts`, `hub.ts`, `review.ts`, `comunidade.ts`, `onboarding.ts`, `auth.ts`, `db.ts`, `init.ts`

**Regra:** Não remova `@ts-nocheck` sem corrigir todos os erros de tipo do arquivo. Não adicione `@ts-nocheck` em novos arquivos.

### Globais tipados

`src/types/globals.d.ts` contém ~120 declarações de `window.*`. Ao criar uma nova função global, declare-a neste arquivo.

---

## 9. Design System

### Neomorfismo Flat

Sombras offset sólidas — não gaussianas:

```css
/* Padrão de card */
box-shadow: var(--shadow-depth) var(--shadow-depth) 0px var(--shadow-color);

/* Hover de botão */
transform: translate(-1px, -1px);
box-shadow: 4px 4px 0px var(--shadow-color);

/* Active de botão */
transform: translate(2px, 2px);
box-shadow: 1px 1px 0px var(--shadow-color);
```

### Componentes Reutilizáveis

| Componente | Classe CSS | Arquivo |
|---|---|---|
| Card padrão | `.bento-card` | `components.css` |
| Botão principal | `.btn-theme` | `components.css` |
| Layout de grade | `.bento-layout` | `layout.css` |
| Container (max 1100px) | `.container` | `layout.css` |
| Barra superior | `.top-bar` | `layout.css` |
| Tag de tipo de slot | `.node-tag .t-day .t-wk .t-mo` | `components.css` |
| Auth panel | `.auth-panel .user-profile` | `components.css` |
| Pill de tema | `.theme-pill` | `components.css` |
| Layout de settings | `.settings-layout` | `layout.css` |
| Pílulas de status | `.tab-panel.active` | `layout.css` |

### Variáveis CSS por Tema

Cada tema deve definir todas as variáveis obrigatórias:

```css
--bg           --surface      --panel        --card-bg
--text         --stroke       --shadow-color
--accent       --accent-text  --muted
--success      --failure      --select-arrow
```

Variáveis de customização global (não por tema):
```css
--base-radius   --card-radius   --element-radius   --shadow-depth
```

### Tipografia

- **Primária:** `Space Grotesk` (Google Fonts)
- **Fallback:** `Inter`, `system-ui`, `sans-serif`
- Declarada no seletor `*` em `base.css` — não override

### Responsividade

- `max-width: 900px` — bento-layout colapsa para 1 coluna
- `max-width: 640px` — ajustes de top-bar, modais, tipografia
- Unidades: `rem`, `%`, `clamp()` — nunca `px` fixo para layout

---

## 10. Sistema de Temas

### Os 22 Temas

**Claros (7):**
`light`, `pastel-brown`, `pastel-pink`, `pastel-blue`, `pastel-purple`, `pastel-mint`, `solarized-light`

**Escuros (15):**
`dark`, `dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome`, `dark-chocolate`, `dark-forest`, `dark-amber`, `dark-purple`, `catppuccin`, `nord`, `dracula`, `github-dark`, `outerwilds-dark`, `outerwilds-light`

### Protocolo para Adicionar Novo Tema

1. Bloco `[data-theme="nome"]` em `src/styles/global/base.css` com **todas** as variáveis obrigatórias
2. Entrada em `THEME_LABELS` em `src/shared/ui/theme.ts`
3. Botão de preview nos **4 HTMLs** que usam o seletor de temas
4. `--select-arrow` deve ser SVG com a cor de texto do tema (não reutilize de outro tema)

---

## 11. Schema do Firestore

### Documento `users/{uid}`

```
pontos: number         // alias histórico de pts
xp: number
cd: { [slotId]: timestamp_ms }
prefs: { theme, radius, shadow, isAdmin? }
profile: { epicGoal, displayName, description, avatarUrl, bannerUrl, public }
stats: { dailiesDone, epicsDone, purchases, currentStreak, maxStreak }
slots: { dailies: {d1..d5: {name,desc}}, epics: {e1..e3}, shop: {s1..s8: {name}} }
dailyLog: { "YYYY-MM-DD": ["d1", "d3"] }
weeklyLog: { "YYYY-Www": ["e1"] }
lastDailyDate: string
activeReviewSetting: { id, name, intervals[], easeFactorMultiplier? } | null
onboardingComplete: boolean
studyBlocks: StudyBlock[]
updatedAt: number
diagnostic: { focusAreas[], birthYear?, mainChallenge?, ... }
```

### Subcoleção `users/{uid}/studySessions/{id}`

```
id, timestamp, materia, mode, focusTime, breakTime, totalTime, cycles?, notes?, uid, savedAt
```

### Subcoleção `users/{uid}/studyBlocks/{id}`

```
id, userId, materia, topico, conteudo, createdAt, lastReviewDate, nextReviewDate,
status, reviewSettingsId?, currentIntervalIndex, repetition, color, savedAt
```

---

## 12. Funções Singleton — Regra de Unicidade

Estas funções existem em **uma única implementação** no projeto. Nunca duplique:

| Função | Única implementação em |
|---|---|
| `escapeHtml(str)` | `src/shared/ui/modals.ts` |
| `toast(msg, fail?, duration?)` | `src/shared/ui/toast.ts` |
| `applyPrefs(prefs)` | `src/shared/ui/theme.ts` |
| `saveState()` | `src/core/state.ts` |
| `handleAuthRouting()` | `src/core/router.ts` |
| `calculateNextReview()` | `src/core/review-logic.ts` |

---

## 13. Regras de Datas

A lógica de gamificação depende de **data local**, nunca UTC.

```typescript
// CORRETO
window.getTodayStr()           // "YYYY-MM-DD" local
window.getLocalDateStr(date)   // Date -> "YYYY-MM-DD" local
window.getYesterdayStr()       // "YYYY-MM-DD" local
window.getWeekStr(date)        // "YYYY-Www" ISO week

// PROIBIDO para gamificação
new Date().toISOString().slice(0, 10)  // UTC — quebra streak em outros fusos
```

---

## 14. Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Funções globais | camelCase | `renderHeroHub`, `saveState` |
| IDs de slots | prefixo + número | `d1..d5`, `e1..e3`, `s1..s8` |
| Chaves de localStorage | kebab-case com versão | `neuroflow_guest_v2` |
| Classes CSS | kebab-case | `.bento-card`, `.btn-theme` |
| Variáveis CSS | `--kebab-case` | `--shadow-depth`, `--card-radius` |
| Chaves de tema | kebab-case | `dark-cyberpunk`, `pastel-blue` |
| Arquivos TypeScript | kebab-case | `study-timer.ts`, `review-logic.ts` |

---

## 15. Critérios para Mudanças Arquiteturais

### Critério para criar novo arquivo

- Funcionalidade não existe em nenhum arquivo atual
- Volume de código justifica separação (>50 linhas de nova lógica coesa)
- Pertence claramente a uma camada existente

### Critério para refatorar

- Duplicação clara e confirmada
- Complexidade que impede evolução
- Nunca por preferência estética

### Critério para excluir arquivo

- Código morto — zero referências no projeto
- Substituído completamente por implementação melhor
- Autorização explícita do dono do projeto

### Critério para nova dependência de produção

- Funcionalidade impossível de implementar com JS nativo razoavelmente
- Autorização explícita do dono do projeto
- Análise de impacto no bundle size

### Critério para reorganização de estrutura

- Coerência clara com a arquitetura de camadas definida
- Nunca por organização pessoal ou preferência do agente
- Autorização explícita do dono do projeto

---

## 16. Testes

### Suites atuais

| Arquivo | O que testa |
|---|---|
| `date.test.ts` | `getLocalDateStr`, `getTodayStr`, `getWeekStr` |
| `streak.test.ts` | `calcStreak` com vários cenários de dailyLog |
| `state.test.ts` | `createDefaultState`, `TIERS` |

### O que deve ser testado

- Funções puras sem efeitos colaterais de DOM
- Lógica de datas e strings
- Algoritmos (streak, SM-2, mergeSlotText)

### O que não deve ser testado com Vitest

- Render de DOM (interações com `document.*`)
- Chamadas ao Firestore
- Animações e transições CSS

---

*Última atualização: 2026-07-02*
*Este documento é vivo — atualize ao realizar mudanças arquiteturais reais.*
