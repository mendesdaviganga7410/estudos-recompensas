# PRODUCT.md — Documento Vivo do NeuroFlow

> **ÚNICO documento vivo do projeto.** Toda mudança no app (funcionalidade, página, regra de negócio, economia, bug corrigido) DEVE ser registrada aqui **na mesma tarefa**, antes de concluir.
> Se este documento não refletir o que o código faz, ele está desatualizado — corrija.

**Versão atual:** 4.1 | **Última atualização:** 2026-07-23

---

## 1. O QUE É

**NeuroFlow** — gerenciador de tarefas gamificado para estudantes. Transforma estudar em uma jornada de RPG: XP, pontos, tiers, missões diárias/semanais, loja de recompensas, modo Momentum, timer Pomodoro, revisão espaçada (SM-2), flashcards, diagnóstico de perfil e comunidade.

- **Interface:** Português BR | **Código:** Inglês (exceções históricas: `pontos`, `pts`, `ofensiva`)
- **Arquitetura:** Multi-Page App (MPA), Vanilla TypeScript + Vite, sem frameworks
- **Zero dependências de produção.** Firebase via CDN dinâmico.

---

## 2. PÁGINAS (6 — HTMLs na raiz, nunca mover)

| Página | Arquivo | Rota | Propósito |
|---|---|---|---|
| Hero Hub | `index.html` | `/` | Perfil do herói, stats, navegação, quick-edit |
| Painel | `panel.html` | `/panel.html` | Missões diárias (5) e semanais (3), loja (8), Momentum |
| Estudo | `study.html` | `/study.html` | Timer Pomodoro/Simples, ciclos, sons, histórico |
| Revisão | `review.html` | `/review.html` | Revisão espaçada (SM-2 adaptado) |
| Comunidade | `comunidade.html` | `/comunidade.html` | Grid social, busca, perfis públicos |
| Flashcards | `flashcards.html` | `/flashcards.html` | CRUD de flashcards + import/export |

**Regras de negócio das missões:**
- Diárias: concluíveis 1x/dia; penalidade automática de XP ao virar o dia se não concluídas (registro no `dailyLog` impede dupla aplicação).
- Semanais: 1x/semana, sem penalidade.
- Ao concluir missão: 16 partículas de confete (`sparkle-fly`).

---

## 3. GAMIFICAÇÃO — ECONOMIA IMUTÁVEL

> Esses valores vivem em `SLOT_ECONOMICS` (`src/shared/templates/templates.ts`, `Object.freeze()`). **Nunca alterar** sem revisão completa de balanceamento — mudança em `s7` quebra a percepção de valor de todo o sistema.

### 3.1 XP / Pontos por missão

| Slot | ID | XP | Pts | Penalidade XP |
|---|---|---|---|---|
| Daily 1 | `d1` | 10 | 5 | -5 |
| Daily 2 | `d2` | 15 | 10 | -10 |
| Daily 3 | `d3` | 25 | 20 | -15 |
| Daily 4 | `d4` | 30 | 25 | -15 |
| Daily 5 | `d5` | 25 | 20 | -10 |
| Epic 1 | `e1` | 200 | 150 | nenhuma |
| Epic 2 | `e2` | 180 | 120 | nenhuma |
| Epic 3 | `e3` | 150 | 100 | nenhuma |

### 3.2 Loja — custo e cooldown

| Slot | Custo | Tipo | Cooldown |
|---|---|---|---|
| s1 | 35 Pts | Diário | 24h |
| s2 | 80 Pts | Diário | 24h |
| s3 | 120 Pts | Diário | 24h |
| s4 | 200 Pts | Semanal | 7 dias |
| s5 | 500 Pts | Semanal | 7 dias |
| s6 | 800 Pts | Semanal | 7 dias |
| s7 | 1.500 Pts | Mensal | 30 dias |
| s8 | 2.000 Pts | Mensal | 30 dias |

### 3.3 Tiers (12)

Bronze (0–499) → Prata (500–1.499) → Ouro (1.500–2.999) → Platina (3.000–4.999) → Diamante (5.000–7.499) → Esmeralda (7.500–10.499) → Safira (10.500–14.499) → Rubi (14.500–19.499) → Ametista (19.500–25.499) → Opala (25.500–32.499) → Obsidiana (32.500–44.999) → Diamante Negro (45.000+).

---

## 4. ACESSO, AUTENTICAÇÃO E PERSISTÊNCIA

| Modo | Acesso | Persistência |
|---|---|---|
| Visitante | Painel, Estudo, Revisão, Flashcards (sem Hub completo nem Comunidade) | localStorage (`neuroflow_guest_v2`) |
| Autenticado (Google/E-mail) | Todas as páginas + Comunidade | Firestore `users/{uid}` |

- **Onboarding:** wizard de 3 etapas obrigatório para novos usuários autenticados.
- **Sessões de estudo:** localStorage (`historico_estudos`) + Firestore (`users/{uid}/studySessions`) quando logado.
- **Notificações:** persistidas em `neuroflow_notifs_v1`; diagnóstico persistente (`diag-persistent`, não deletável); matching com máx. 1 notificação por vez em 00:00/12:00 local; lembrete de diagnóstico a cada 2 min.
- **Datas:** sempre locais (`getTodayStr`, `getLocalDateStr`, `getWeekStr`) — nunca UTC.

---

## 5. TEMAS

22 temas (7 claros, 15 escuros) via `data-theme` no `<body>` + `prefs.radius`/`prefs.shadow`.
**Inconsistência conhecida:** 4 temas (`dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome`) existem no CSS mas não têm botão de preview nos HTMLs. Ao adicionar tema: atualize `base.css`, `THEME_LABELS` em `theme.ts` e os HTMLs do seletor.

---

## 6. HISTÓRICO DE MUDANÇAS

### 2026-08-04 — Consolidação de regras e documentação
- **Consolidação de regras:** o projeto passou de 3 documentos (~1.700 linhas, repetitivos e contraditórios) para 2 arquivos: `AGENTS.md` (única fonte de regras para agentes de IA) e este `docs/PRODUCT.md` (único documento vivo).
- `docs/AI_CONSTITUTION.md` e `docs/ARCHITECTURE.md` removidos.
- Os symlinks de configuração de IA na raiz (`CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `copilot-instructions.md`, `AI.md`) removidos — `AGENTS.md` é a única fonte.
- `README.md` corrigido: lista as 6 páginas (inclui `flashcards.html`), comandos reais e referências limpas.

### 2026-07-23 — v4.1
- Correção crítica: `notifications/init.ts` não importava 4 funções de `engine.ts` (`getPersistentDiagNotif`, `markPersistentDiagSeen`, `clearAllNotifications`, `onReviewNotifClick`), causando `ReferenceError` no bundle de produção (GitHub Pages) e loading travado.
- Regra documentada: toda função exposta via `window.*` em `init.ts` deve estar explicitamente importada no mesmo arquivo.

### 2026-07-02 — Documentação consolidada
- `docs/PRODUCT.md` reescrito como fonte única de verdade do produto; auditoria completa do repositório; personas (incluindo público implícito TDAH) adicionadas.

### 2026-06-28 — v4.0
- Página `review.html`: revisão espaçada SM-2 adaptado, blocos de estudo, presets (Curta, Mensal, Semestral, Intensiva, Longo), filtros, notificações integradas, 20+ novos globals.

### 2026-06-25 — v3.x
- v3.2: Vitest + 30 testes unitários (date, streak, state).
- v3.1: `modals.ts` tipado (`@ts-nocheck` removido), ~120 globais tipados em `globals.d.ts`.
- v3.0: migração JS → TS (22 arquivos), ESLint flat config.
- v2.x: Modo Momentum, correção de fuso (data local), persistência de `dailyLog`/`weeklyLog` no Firestore, sistema de streaks, limites diário/semanal, onbarding gamificado, diagnóstico + matching, 22 temas, Pomodoro com histórico.
