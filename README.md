# NeuroFlow

Gerenciador de tarefas gamificado e focado em produtividade. Transforma o ato de estudar em uma jornada heroica com XP, tiers, missões, loja de recompensas e conexão social entre estudantes.

## Estrutura do Projeto

Este projeto utiliza uma arquitetura Web Vanilla com TypeScript e MPA (Multi-Page App) via Vite.

```
/                           # HTMLs na raiz (requisito Vite MPA)
├── index.html              # Hero Hub
├── panel.html              # Painel/Dashboard
├── study.html              # Modo Estudo/Pomodoro
├── comunidade.html         # Comunidade Social
├── src/
│   ├── core/               # State, Router, Firebase (init/db/auth)
│   ├── features/           # Notificações (diagnóstico+matching), Onboarding
│   ├── pages/              # Scripts por página (hub, panel, study-timer, comunidade)
│   ├── shared/             # UI (modais, temas, toasts, media, settings), Templates de slots
│   ├── styles/             # CSS organizado: global (variáveis, reset), components, pages
│   ├── types/              # globals.d.ts (~120 globais tipados)
│   └── __tests__/          # Testes unitários (Vitest + jsdom)
├── docs/                   # Documentação de produto e arquitetura
├── .agents/                # Regras para agentes de IA (lido via opencode.json)
├── vite.config.js          # 4 entradas MPA
├── vitest.config.ts        # Configuração Vitest
├── eslint.config.js        # ESLint flat config
└── tsconfig.json           # strict: false, allowJs: true
```

## Integração com Agentes de IA

Este repositório usa `opencode.json` na raiz para instruir agentes de IA com as regras em `.agents/AGENTS.md`. O arquivo contém o mapeamento completo de globais (`window.*`), ordem de carregamento de scripts, localStorage keys, schema do Firestore, regras de CSS e padrões de debugging.

> Ao trabalhar neste projeto com um agente de IA, garanta que ele leia `.agents/AGENTS.md` e `docs/PRODUCT.md` antes de qualquer edição.

## Stack

**Sem frameworks pesados** — Vanilla TypeScript puro. Nenhuma dependência de produção.

| Categoria | Tecnologia |
|---|---|
| Build | Vite 8.x (`dev`, `build`, `preview`) |
| TypeScript | TS 6.x (`typecheck`) |
| Lint | ESLint 10.x + typescript-eslint (`lint`, `lint:fix`) |
| Testes | Vitest 4.x + jsdom (`test`, `test:watch`) |
| Banco + Auth | Firebase SDK v10.8.0 via CDN dinâmico |
| Imagens | CropperJS via CDN, DiceBear API (fallback avatar) |
| Tipografia | Google Fonts (Space Grotesk) |

## Execução

### Desenvolvimento Local
```bash
npm install
npm run dev
```
Servidor em http://localhost:5173 com HMR.

### Build para Produção
```bash
npm run build       # gera dist/ com assets otimizados
npm run preview     # serve localmente o conteúdo de dist/
```
Hospede o conteúdo de `dist/` em qualquer CDN estático.

### Testes
```bash
npm run test        # executa uma vez
npm run test:watch  # modo watch
```

### Type Checking + Lint
```bash
npm run typecheck
npm run lint
```

## Páginas da Aplicação

| Página | Arquivo | Descrição |
|---|---|---|
| Hero Hub | `index.html` | Perfil do herói, stats, navegação |
| Painel | `panel.html` | Missões diárias, marcos épicos, loja |
| Estudo | `study.html` | Timer Pomodoro/Simples + histórico |
| Comunidade | `comunidade.html` | Grid social de heróis |

## Arquitetura Técnica

### Firebase (ES Modules via CDN)
Os módulos do Firebase (`init.ts`, `db.ts`, `auth.ts`) são carregados como `type="module"` e importam o SDK dinamicamente. Executam **após** os scripts regulares (deferred), garantindo que `window.state`, `window.handleAuthRouting`, `window.render` etc. já estejam definidos quando o callback de auth dispara.

### Fluxo de Autenticação
```
onAuthStateChanged
  ↓ user logado
  syncUserData(uid) → applyRemoteState() → applyPrefs() → handleAuthRouting() → render()
  initNotifications()
  ↓ visitante
  loadGuestState() → applyPrefs() → handleAuthRouting() → render()
```

### Sistema de Notificações
- `engine.ts` — estado (`__notifications[]`), lógica de matching, persistência em localStorage
- `ui.ts` — render do painel dropdown e mini-modais de perfil
- `init.ts` — timers, inicialização e exports globais
- Diagnóstico de perfil: notificação persistente (não apagável)
- Matching: máximo 1 notificação regular por vez, agendada para 00:00 ou 12:00 local

### Sistema de Slots (Templates)
- 16 slots: 5 Dailies, 3 Epics, 8 Shop
- Texto customizável pelo usuário (onboarding/reopenCustomization)
- Valores econômicos (XP, Pts, custo, cooldown) fixos em `SLOT_ECONOMICS` — não altere sem revisão de balanceamento

### escapeHtml
A função `escapeHtml` é **definida uma única vez** em `modals.ts` e exposta como `window.escapeHtml`. Todos os outros scripts a usam via `window.escapeHtml(str)` diretamente. Nunca crie uma segunda declaração com `const escapeHtml`.

### Estudo / Pomodoro
O timer completo está em `src/pages/study/study-timer.ts` (extraído do inline de `study.html`). Expõe `window.studyTimer` com modos `'simple'` e `'pomodoro'`. Configurações de break auto/manual em `settings-modal.ts`.

## Scripts Removidos (histórico)
- `scripts/refactor.cjs` e `refactor2.cjs` — utilitários de refatoração obsoletos
- `src/core/firebase/config.js` — cópia redundante de `init.js`
- `src/features/notifications/notifications.js` — 909 linhas de código morto
