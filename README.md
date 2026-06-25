# NeuroFlow

Gerenciador de tarefas gamificado e focado em produtividade. Transforma o ato de estudar em uma jornada heroica com XP, tiers, missões, loja de recompensas e conexão social entre estudantes.

## Estrutura do Projeto

Este projeto utiliza uma arquitetura Web Vanilla profissional, com separação Domain-Driven:

- `/src/core` — Configurações centrais, Firebase (init, db, auth), Router e State.
- `/src/features` — Lógica de domínio de negócio: Notificações (diagnóstico + matching) e Onboarding.
- `/src/pages` — Scripts específicos por página (Hub, Panel, Comunidade, Study/Pomodoro).
- `/src/shared` — UI components, templates de slots, modais, temas, toasts e utilitários.
- `/src/styles` — CSS organizado em global (variáveis, reset), components e pages.
- `/docs` — Documentação de produto e arquitetura.
- `/.agents` — Regras e contexto para agentes de IA (lido automaticamente via `opencode.json`).
- `opencode.json` — Config do opencode: `{ "instructions": [".agents/AGENTS.md"] }`.

Arquivos HTML na raiz (`index.html`, `panel.html`, `study.html`, `comunidade.html`) por compatibilidade com o MPA do Vite.

## Dependências
- **Vite** (devDependency) — servidor de desenvolvimento e bundler para produção
- **Firebase** (via CDN, SDK v10.8.0) — Auth + Firestore, importado dinamicamente em `src/core/firebase/`
- **CropperJS** (via CDN) — Recorte de imagens para avatar e banner
- **Google Fonts** — Tipografia

## Execução

### Desenvolvimento Local
```bash
npm install
npm run dev
```
Servidor em http://localhost:5173 com HMR.

### Build para Produção
```bash
npm run build
```
Gera `dist/` com HTML/CSS/JS otimizados. Hospede o conteúdo dessa pasta em qualquer CDN estático.

## Páginas da Aplicação

| Página | Arquivo | Descrição |
|---|---|---|
| Hero Hub | `index.html` | Perfil do herói, stats, navegação |
| Painel | `panel.html` | Missões diárias, marcos épicos, loja |
| Estudo | `study.html` | Timer Pomodoro/Simples + histórico |
| Comunidade | `comunidade.html` | Grid social de heróis |

## Arquitetura Técnica

### Firebase (ES Modules via CDN)
Os módulos do Firebase (`init.js`, `db.js`, `auth.js`) são carregados como `type="module"` e importam o SDK dinamicamente. Executam **após** os scripts regulares (deferred), garantindo que `window.state`, `window.handleAuthRouting`, `window.render` etc. já estejam definidos quando o callback de auth dispara.

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
- `engine.js` — estado (`__notifications[]`), lógica de matching, persistência em localStorage
- `ui.js` — render do painel dropdown e mini-modais de perfil
- `init.js` — timers, inicialização e exports globais
- Diagnóstico de perfil: notificação persistente (não apagável)
- Matching: máximo 1 notificação regular por vez, agendada para 00:00 ou 12:00 local

### Sistema de Slots (Templates)
- 16 slots: 5 Dailies, 3 Epics, 8 Shop
- Texto customizável pelo usuário (onboarding/reopenCustomization)
- Valores econômicos (XP, Pts, custo, cooldown) fixos em `SLOT_ECONOMICS` — não altere sem revisão de balanceamento

### escapeHtml
A função `escapeHtml` é **definida uma única vez** em `modals.js` e exposta como `window.escapeHtml`. Todos os outros scripts a usam via `window.escapeHtml(str)` diretamente. Nunca crie uma segunda declaração com `const escapeHtml`.

### Estudo / Pomodoro
O timer completo está em `src/pages/study/study-timer.js` (extraído do inline de `study.html`). Expõe `window.studyTimer` com modos `'simple'` e `'pomodoro'`. Configurações de break auto/manual em `settings-modal.js`.

## Scripts Removidos (histórico)
- `scripts/refactor.cjs` e `refactor2.cjs` — utilitários de refatoração obsoletos
- `src/core/firebase/config.js` — cópia redundante de `init.js`
- `src/features/notifications/notifications.js` — 909 linhas de código morto
