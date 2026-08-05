# PRODUCT.md — Documento Vivo do NeuroFlow

> **ÚNICO documento vivo do projeto.** Toda mudança no app (funcionalidade, página, regra de negócio, economia, bug corrigido) DEVE ser registrada aqui **na mesma tarefa**, antes de concluir.
> Se este documento não refletir o que o código faz, ele está desatualizado — corrija.

**Versão atual:** 4.2 | **Última atualização:** 2026-08-04

---

## 1. O QUE É

**NeuroFlow** — gerenciador de tarefas gamificado para estudantes. Transforma estudar em uma jornada de RPG: XP, pontos, níveis (trilha de 80), missões diárias/semanais, loja de recompensas, modo Momentum, timer Pomodoro, revisão espaçada (SM-2), flashcards, diagnóstico de perfil e comunidade.

- **Interface:** Português BR | **Código:** Inglês (exceções históricas: `pontos`, `pts`, `ofensiva`)
- **Arquitetura:** Multi-Page App (MPA), Vanilla TypeScript + Vite, sem frameworks
- **Zero dependências de produção.** Firebase via CDN dinâmico.

---

## 2. PÁGINAS (7 — HTMLs na raiz, nunca mover)

| Página | Arquivo | Rota | Propósito |
|---|---|---|---|
| Hero Hub | `index.html` | `/` | Perfil do herói, stats, navegação, quick-edit |
| Painel | `panel.html` | `/panel.html` | Missões diárias (5) e semanais (3), loja (8), Momentum |
| Estudo | `study.html` | `/study.html` | Timer Pomodoro/Simples, ciclos, sons, histórico |
| Revisão | `review.html` | `/review.html` | Revisão espaçada (SM-2 adaptado) |
| Comunidade | `comunidade.html` | `/comunidade.html` | Grid social, busca, perfis públicos |
| Flashcards | `flashcards.html` | `/flashcards.html` | CRUD de flashcards + import/export |
| Trilha | `trilha.html` | `/trilha.html` | Trilha vertical battle pass: 80 níveis, recompensas, progresso |

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

### 3.3 Níveis (80) — trilha exponencial

Substitui os antigos tiers. Vive em `LEVELS` (`src/core/state.ts`), com `getLevelInfo(xp)` exposto via `window.*`.

- **Curva exponencial:** `T(n) = round(36.76 × 1.2^(n-1))`. Nível 40 = 45.024 XP (≈ antigo máximo de 45.000). Nível 80 = 66.174.999 XP (teto, "Nível Máximo").
- **10 postos (renomes a cada 8 níveis):** Semente 🌱 → Broto 🌿 → Explorador 🗺️ → Aventureiro 🏹 → Guerreiro ⚔️ → Campeão 🏆 → Mestre 🎓 → Herói 🦸 → Lenda ⭐ → Imortal 👑.
- **Recompensas:** cada nível tem uma recompensa nomeada "Recompensa N" (placeholder — conteúdo indefinido de propósito). Desbloqueada quando o XP atinge o mínimo do nível; a trilha marca 🔓/🔒.
- **UI:** trilha vertical estilo battle pass em `trilha.html` (nós alternados, linha central preenchida até o nível atual, divisórias por posto, destaque pulsante no nível atual, scroll automático até ele). Card "Trilha da Evolução" no hub, ao lado do Painel de Controle.
- **Consumidores:** painel (`updateStatsUI`), hub (`hero-rank`), comunidade (cards + perfil), modais (card de jogador) e notificações (mesmo nível / acima / abaixo).

---

## 4. ACESSO, AUTENTICAÇÃO E PERSISTÊNCIA

| Modo | Acesso | Persistência |
|---|---|---|
| Visitante | Painel, Estudo, Revisão, Flashcards, Trilha (sem Hub completo nem Comunidade) | localStorage (`neuroflow_guest_v2`) |
| Autenticado (Google/E-mail) | Todas as páginas + Comunidade | Firestore `users/{uid}` |

- **Onboarding:** wizard de 3 etapas obrigatório para novos usuários autenticados.
- **Sessões de estudo:** localStorage (`historico_estudos`) + Firestore (`users/{uid}/studySessions`) quando logado.
- **Notificações:** persistidas em `neuroflow_notifs_v1`; diagnóstico persistente (`diag-persistent`, não deletável); matching com máx. 1 notificação por vez em 00:00/12:00 local; lembrete de diagnóstico a cada 2 min.
- **Datas:** sempre locais (`getTodayStr`, `getLocalDateStr`, `getWeekStr`) — nunca UTC.

---

## 5. TEMAS

2 temas via `data-theme` no `<body>`: **Modo Claro** (`pastel-blue`, Brisa do Mar claro) e **Modo Escuro** (`pastel-blue-dark`, versão escura da mesma paleta).
- Tema padrão: `pastel-blue`. Prefs legadas com tema removido caem no padrão (guarda de migração em `applyPrefs` via `VALID_THEMES`).
- Temas antigos (22) arquivados em `docs/THEMES_ARCHIVE.md` — não são mais suportados; instruções de reativação no próprio arquivo.
**Estilo de visual:** em Configurações → Aparência, duas categorias independentes controlam `prefs.radius` (`--base-radius`) e `prefs.shadow` (`--shadow-depth`): Arredondamento (Plano/Equilibrado/Confortável) e Sombra (Plano/Equilibrado/Confortável).

---

## 6. HISTÓRICO DE MUDANÇAS

### 2026-08-04 — Bugfix: missões diárias/semanais não davam XP nem marcavam ✓
- **Bug:** a migração para `LEVELS` deixou `task()` (`src/pages/panel/panel.ts`) chamando `getTier` (removido). A exceção ocorria **antes** de somar XP/pontos, re-renderizar e disparar o confete — missões não subiam XP, o ✓ não aparecia, a animação de conclusão não rodava e o Modo Momentum também quebrava (mesma chamada).
- **Fix:** `task()` usa `getLevelInfo` (como `updateStatsUI`); toast de subida vira "🎉 Novo nível alcançado".

### 2026-08-04 — Sistema de níveis (80) + página Trilha da Evolução
- **Tiers removidos** (12 tiers de metal de `TIERS`) e substituídos por **80 níveis exponenciais** em `LEVELS` (`src/core/state.ts`), com helper único `getLevelInfo(xp)` (`window.*`) substituindo as 4 cópias locais de lookup.
- **Curva:** `T(n) = round(36.76 × 1.2^(n-1))`; nível 40 = 45.024 XP (marco do antigo Diamante Negro), nível 80 = 66.174.999 XP (teto).
- **10 postos** (a cada 8 níveis): Semente 🌱, Broto 🌿, Explorador 🗺️, Aventureiro 🏹, Guerreiro ⚔️, Campeão 🏆, Mestre 🎓, Herói 🦸, Lenda ⭐, Imortal 👑.
- **Recompensas:** uma por nível, rotulada "Recompensa N" (placeholder intencional); desbloqueiam ao atingir o mínimo do nível.
- **Nova página `trilha.html`** (registrada em `vite.config.js` e `ROUTES` do router): trilha vertical estilo battle pass com nós alternados, linha central preenchida, divisórias por posto, recompensas 🔓/🔒, nível atual pulsante e scroll automático. Acessível via card **"Trilha da Evolução"** no hub (ao lado do Painel de Controle) e pelo botão do painel no topo da página.
- **Sentido da trilha:** começa de baixo para cima (escalada) — nível 1 no rodapé, nível 80 no topo; a linha de progresso cresce da base para o nível atual.
- **Consumidores atualizados:** `panel.ts`, `hub.ts`, `comunidade.ts` (cards + perfil detalhado), `modals.ts`, notificações (`ui.ts`, `engine.ts` — "mesmo nível/abaixo/acima" agora por índice de nível).
- Label de rank agora usa `ícone + Nível N` (ex.: "🌱 Nível 3"); painel mostra "Próximo: Nível N (XP)".
- Testes: contrato de `TIERS` substituído por 80 níveis (thresholds crescentes, nível 40 ≈ 45.000, recompensas, `getLevelInfo`).
- `README.md`/listas de páginas: "6 páginas" → "7 páginas" (trilha).

### 2026-08-04 — Destruição de temas: só Brisa do Mar
- **Temas:** removidos 22 temas (7 claros, 15 escuros). Restam apenas 2: **Modo Claro** (`pastel-blue`, Brisa do Mar claro) e **Modo Escuro** (`pastel-blue-dark`, versão escura da mesma paleta — azul oceânico, `#0b1b2b`→`#102a3c`). Nomes da galeria: "Modo Claro" e "Modo Escuro".
- Todos os temas antigos arquivados em **`docs/THEMES_ARCHIVE.md`** com CSS completo, label e swatch de preview, para reativação futura.
- Galeria de temas nos 6 HTMLs agora mostra 2 botões; `<body data-theme="light">` → `data-theme="pastel-blue"`; tema padrão e "Restaurar Padrões" agora usam `pastel-blue`.
- Guarda de migração: `applyPrefs` ignora temas desconhecidos/legados (`VALID_THEMES`) e aplica `pastel-blue`.
- Inconsistência conhecida dos 4 temas sem preview (dark-industrial, dark-cyberpunk, dark-ocean, dark-monochrome) resolvida pela remoção.

### 2026-08-04 — Presets de estilo visual (substituição dos sliders)
- **Configurações → Aparência:** os sliders de arredondamento e sombra foram substituídos por presets em **duas categorias independentes**, cada uma com 3 botões curtos:
  - **Arredondamento:** Plano (`0px`), Equilibrado (`16px`, padrão), Confortável (`22px`).
  - **Sombra (Relevo):** Plano (`0px`), Equilibrado (`6px`, padrão), Confortável (`10px`).
- Botões implementados em `settings-modal.ts` (HTML), `theme.ts` (`STYLE_PRESETS` por dimensão, `syncPresetButtons`, `syncPresetGroup`) e `modals.css` (`.style-preset-group` flex com gap amplo, botões compactos).
- `radiusSlider`/`shadowSlider`/`radiusValue`/`shadowValue` removidos da UI. `changeRadius`/`changeShadow` agora sincronizam o botão ativo e permanecem expostos via `window.*`.

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
