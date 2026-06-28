# NeuroFlow — Regras do Projeto para Agentes de IA
**Versão:** 3.0 | **Última atualização:** 2026-06-26

> **ATENÇÃO TOTAL, AGENTE DE IA:** Leia este arquivo **integralmente** antes de qualquer ação. Assuma a persona de um **Arquiteto de Software Sênior / Engenheiro Staff+**. Qualquer violação das regras abaixo é inaceitável.

---

## 0. CHECKLIST PRÉ-TAREFA (obrigatório antes de qualquer edição)

Antes de modificar qualquer arquivo, confirme mentalmente cada item:

- [ ] Li `docs/PRODUCT.md` para entender o contexto de negócio da tarefa
- [ ] Identifiquei a camada correta do arquivo a editar (`core/`, `features/`, `pages/`, `shared/`, `types/`, `__tests__/`)
- [ ] Confirmei a ordem de carregamento de scripts da página afetada (Seção 3)
- [ ] Verifiquei se a `window.func` que vou criar já não existe com outro nome (causa `SyntaxError`)
- [ ] Se estou criando uma `window.*` nova, adicionei a assinatura em `src/types/globals.d.ts`
- [ ] Confirmei que nenhuma funcionalidade existente será quebrada
- [ ] Rodei `npm run typecheck` e `npm run lint` após as mudanças

---

## 1. Persona e Filosofia de Código

- **Qualidade Excepcional:** Nunca gere código "preguiçoso", verboso ou redundante. Use Clean Code e princípios SOLID onde aplicável.
- **Autonomia Segura:** Proponha refatorações se o código for mal estruturado, mas **NUNCA quebre funcionalidades existentes**.
- **Contexto em Primeiro Lugar:** Leia `docs/PRODUCT.md` antes de propor qualquer funcionalidade nova.
- **Sem Regressions:** Toda mudança deve ser cirúrgica e não afetar código não relacionado.
- **Falha Silenciosa Controlada:** Ao acessar `window.X`, sempre use `window.X?.()` ou `if (window.X)` antes de chamar. O Firebase pode estar indisponível.
- **Sem `console.log` de Debug:** Remova todos os logs de debug antes de entregar. Logs de `warn` e `error` para erros reais são permitidos.
- **Type Safety Pragmática:** O projeto usa `strict: false` no tsconfig. Use `// @ts-nocheck` no topo de arquivos problemáticos quando necessário, mas prefira tipagem correta via `globals.d.ts`.

---

## 2. Arquitetura e Stack Técnica

### 2.1 Stack
| Camada | Tecnologia |
|---|---|
| Frontend | HTML, CSS, **TypeScript** (Vanilla, strict: false) |
| Build/Dev | Vite 8.x (`npm run dev` / `npm run build`) |
| Type Safety | TypeScript 6.0.3 (declarações em `globals.d.ts`, ~280 linhas) |
| Lint | ESLint flat config + typescript-eslint parser |
| Testes | Vitest 4.1.9 + jsdom 29.x (~30 testes, 3 suites) |
| Banco de Dados | Firebase Firestore (SDK v10.8.0 via CDN dinâmico) |
| Autenticação | Firebase Auth (Google + E-mail/senha) |
| Imagens | CropperJS 1.6.1 (via CDN) |
| Avatar Fallback | DiceBear API (`pixel-art` seed) |

**Não introduza** React, Vue, Angular, Svelte, ou qualquer framework/biblioteca de componentes sem ordem explícita do usuário. O projeto é intencionalmente Vanilla TS.

### 2.2 Estrutura de Pastas (canônica — REFERÊNCIA ABSOLUTA)

```
/
├── index.html              # Hero Hub (MPA entry 1)
├── panel.html              # Painel/Dashboard (MPA entry 2)
├── study.html              # Modo Estudo/Pomodoro (MPA entry 3)
├── review.html             # Revisão Espaçada (MPA entry 5)
├── comunidade.html         # Comunidade (MPA entry 4)
├── vite.config.js          # Configuração Vite (4 entries MPA)
├── vitest.config.ts        # Configuração Vitest + jsdom
├── tsconfig.json           # strict: false, target ESNext
├── eslint.config.js        # Flat config, type: module, dual mode (script + module)
├── package.json            # deps: vite ^8.1.0, typescript ^6.0.3, vitest ^4.1.9
├── opencode.json           # { "instructions": ["_ai-instructions.md"] }
├── _ai-instructions.md     # ESTE arquivo
├── scripts/
│   └── git-enviar.sh       # Helper de git
├── docs/
│   ├── PRODUCT.md          # Contexto de produto e negócio
│   └── architecture/       # Docs extras de arquitetura
└── src/
    ├── types/
    │   └── globals.d.ts    # ~280 linhas: interfaces + Window augmentation
    ├── core/
    │   ├── state.ts        # Estado global (window.state, TIERS, createDefaultState, etc.)
    │   ├── router.ts       # Navegação, detecção de página, guest mode
    │   └── review-logic.ts # Algoritmo SM-2 adaptado, cálculo de revisão
    │   └── firebase/
    │       ├── init.ts     # Inicializa Firebase CDN (ES module, type="module")
    │       ├── auth.ts     # Autenticação (ES module, type="module")
    │       └── db.ts       # Firestore CRUD (ES module, type="module")
    ├── features/
    │   ├── notifications/
    │   │   ├── engine.ts           # Estado e lógica de matching
    │   │   ├── ui.ts               # Render do painel de notificações
    │   │   ├── init.ts             # Inicialização, timers e exports
    │   │   ├── messages.ts         # Geração de mensagens de matching
    │   │   ├── diagnostic-data.ts  # 21 perguntas do diagnóstico
    │   │   └── diagnostic-ui.ts    # Interface do questionário
    │   └── onboarding/
    │       └── onboarding.ts       # Wizard de 3 etapas
    ├── pages/
    │   ├── hub/hub.ts              # renderHeroHub()
    │   ├── panel/panel.ts          # render(), task(), buy(), momentum
    │   ├── study/study-timer.ts    # window.studyTimer (objeto completo)
    │   ├── review/review.ts        # renderReviewPage(), CRUD blocks, filtros
    │   └── comunidade/comunidade.ts  # renderComunidade(), profile detail
    ├── shared/
    │   ├── templates/
    │   │   └── templates.ts        # SLOT_ECONOMICS, buildMergedSlots()
    │   └── ui/
    │       ├── modals.ts           # Modais + escapeHtml
    │       ├── settings-modal.ts   # Config Pomodoro + som
    │       ├── theme.ts            # 22 temas, applyPrefs, changeTheme
    │       ├── toast.ts            # window.toast + window.$
    │       └── media.ts            # CropperJS avatar/banner
    ├── __tests__/
    │   ├── setup.ts                # Polyfill localStorage p/ jsdom
    │   ├── streak.test.ts          # calcStreak, getWeekStr, getLocalDateStr
    │   ├── date.test.ts            # getTodayStr, getYesterdayStr
    │   └── state.test.ts           # createDefaultState, applyRemoteState
    └── styles/
        ├── global/
        │   ├── base.css            # Variáveis CSS, reset, 22 temas
        │   └── layout.css          # Layouts globais
        ├── components/
        │   ├── components.css      # Cards, botões, badges
        │   └── modals.css          # Modais, dialogs, notificações
        └── pages/
            ├── hero.css            # Hub + Painel
            └── comunidade.css      # Comunidade
```

**REGRA CRÍTICA:** Nunca crie arquivos lógicos na raiz do projeto. Nunca mova os HTMLs para subpastas. Arquivos `.ts` SEMPRE em `src/`.

---

## 3. Ordem de Carregamento de Scripts (CRÍTICO)

Esta ordem é obrigatória em **TODAS** as páginas HTML. A quebra desta ordem causa erros silenciosos ou `SyntaxError`.

```
 1. [CDN regular]    CropperJS (NÃO em study.html)
 2. [regular]        src/shared/templates/templates.ts
 3. [regular]        src/core/state.ts
 4. [type="module"]  src/core/firebase/init.ts   ← deferred automaticamente
 5. [type="module"]  src/core/firebase/db.ts      ← deferred automaticamente
 6. [type="module"]  src/core/firebase/auth.ts    ← deferred automaticamente
 7. [regular]        src/shared/ui/toast.ts
 8. [regular]        src/shared/ui/theme.ts
 9. [regular]        src/shared/ui/modals.ts
10. [regular]        src/features/notifications/diagnostic-data.ts
11. [regular]        src/features/notifications/messages.ts
12. [regular]        src/features/notifications/engine.ts
13. [regular]        src/features/notifications/diagnostic-ui.ts
14. [regular]        src/features/notifications/ui.ts
15. [regular]        src/features/notifications/init.ts
16. [regular]        src/shared/ui/settings-modal.ts
17. [regular]        src/shared/ui/media.ts (NÃO em study.html)
18. [regular]        src/core/router.ts
19. [regular]        src/core/review-logic.ts (NÃO em index.html, panel.html, study.html)
20. [regular]        src/pages/<pagina>/<pagina>.ts  ← específico da página
21. [inline]         admin-btn lógica (apenas index.html, panel.html, comunidade.html)
```

**Variações por página:**
- `study.html` — **não** inclui CropperJS CDN, **não** inclui `media.ts`, **não** inclui `onboarding.ts`, **não** inclui `review-logic.ts`
- `comunidade.html` — **não** inclui `onboarding.ts`
- `review.html` — **não** inclui `onboarding.ts`

**Por que os módulos Firebase executam por último:** `type="module"` são sempre deferred. Isso garante que quando `onAuthStateChanged` dispara, todos os `window.*` dos scripts regulares já estão definidos. O Vite compila `.ts` como se fossem `.js` normais (esbuild), sem bundling — scripts regulares rodam no escopo global e expõem via `window.*`.

---

## 4. Regras de Escopo Global (window.*)

### 4.1 Padrão de Exposição

Arquivos regulares (não-module, `sourceType: 'script'` no ESLint) DEVEM expor funções públicas via `window`:

```ts
// CORRETO
function minhaFuncao() { ... }
window.minhaFuncao = minhaFuncao;

// ERRADO — não fica global para onclick=""
const minhaFuncao = () => { ... };
```

### 4.2 Regra Anti-Conflito de Nomes (CRÍTICA)

NUNCA declare `const` ou `let` com o mesmo nome de uma `function` já existente em outro script regular na mesma página. Isso causa `SyntaxError: Identifier 'X' has already been declared`.

```ts
// modals.ts define:
function escapeHtml(str) { ... }
window.escapeHtml = escapeHtml;

// comunidade.ts — ERRADO:
const escapeHtml = str => window.escapeHtml(str); // SyntaxError!

// comunidade.ts — CORRETO:
// Use window.escapeHtml(str) diretamente
```

### 4.3 Arquivo de Tipos Central

TODOS os globais DEVEM estar declarados em `src/types/globals.d.ts` dentro da interface `Window`. Ao criar um novo global:
1. Declare a função/variável no arquivo `.ts`
2. Atribua a `window.X = X`
3. Adicione a assinatura em `globals.d.ts`

### 4.4 Mapa Completo de Globals (window.*)

#### De `state.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.state` | `AppState` | Estado do usuário (pts, xp, cd, prefs, profile, stats, slots, diagnostic, dailyLog, weeklyLog, lastDailyDate, onboardingComplete) |
| `window.TIERS` | `Tier[]` | 12 tiers Bronze → Diamante Negro |
| `window.GUEST_STORAGE_KEY` | `string` | `'neuroflow_guest_v2'` |
| `window.isGuestMode` | `boolean` | true se visitante |
| `window.isAdmin` | `boolean` | true se admin ativo |
| `window.currentUser` | `Record<string, unknown> \| null` | Firebase user object |
| `window.DAILIES` | getter → `MergedSlot[]` | Lista de dailies mergeada |
| `window.EPICS` | getter → `MergedSlot[]` | Lista de epics mergeada |
| `window.SHOP` | getter → `MergedSlot[]` | Lista de shop mergeada |
| `window.createDefaultState()` | `() => AppState` | Cria snapshot padrão |
| `window.applyRemoteState(data)` | `(data: Partial<AppState>) => void` | Sincroniza Firestore → state |
| `window.saveState()` | `() => Promise<void> \| void` | Persiste state (Firestore ou localStorage) |
| `window.saveGuestState()` | `() => void` | Persiste no localStorage (só guest) |
| `window.loadGuestState()` | `() => AppState \| null` | Carrega do localStorage |
| `window.getMergedLists()` | `() => MergedLists` | Retorna {dailies, epics, shop} |
| `window.getTodayStr()` | `() => string` | Data local atual como string |
| `window.getYesterdayStr()` | `() => string` | Data local de ontem |
| `window.getWeekStr(date)` | `(d: Date) => string` | Semana ISO da data |
| `window.getLocalDateStr(d)` | `(d: Date) => string` | Formata data local |
| `window.calcStreak()` | `() => number` | Calcula ofensiva atual |
| `window.ativarAdmin()` | `() => void` | Ativa modo admin via console |
| `window.desativarAdmin()` | `() => void` | Desativa modo admin |

#### De `router.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.ROUTES` | `Record<string, string>` | Mapa de rotas |
| `window.navigateTo(url)` | `(url: string) => void` | `window.location.href = url` |
| `window.handleAuthRouting()` | `() => void` | Orquestra exibição por auth state |
| `window.setGuestMode(bool)` | `(b: boolean) => void` | Alterna modo visitante |
| `window.updateGuestUI()` | `() => void` | Mostra/oculta `.auth-only`/`.guest-only` |
| `window.renderGuestLanding()` | `() => void` | Tela de boas-vindas no Hub |
| `window.enterGuestMode()` | `() => void` | Ativa visitante e navega ao painel |
| `window.enterHeroHub()` | `() => void` | Navega ao hub (se logado) |
| `window.enterPanel()` | `() => void` | Navega ao painel |
| `window.getCurrentPage()` | `() => string` | Nome do HTML atual |
| `window.isHubPage()` | `() => boolean` | true se index.html |
| `window.isPainelPage()` | `() => boolean` | true se panel.html |
| `window.isStudyPage()` | `() => boolean` | true se study.html |
| `window.isComunidadePage()` | `() => boolean` | true se comunidade.html |

#### De `templates.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.SLOT_ECONOMICS` | `SlotEconomicsData` | Valores de XP/Pts/cooldown por slot |
| `window.DEFAULT_SLOT_TEXT` | objeto | Textos padrão nome/desc de slots |
| `window.SLOT_PRESETS` | objeto | Presets de personalização por slot |
| `window.STARTER_PACKAGES` | objeto | Pacotes temáticos do onboarding |
| `window.buildMergedSlots(slots)` | `Function` | Merge slots custom + economics |
| `window.cloneDefaultSlotText()` | `Function` | Cópia dos slots padrão |
| `window.mergeSlotText(base, remote)` | `Function` | Merge slots locais + remotos |
| `window.getWizardSteps()` | `Function` | Steps do onboarding wizard |
| `window.getDefaultText(cat, id)` | `Function` | Texto padrão de um slot |
| `window.getSlotPresets(id)` | `Function` | Presets alternativos de um slot |

#### De `toast.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.toast(msg, fail?, duration?)` | `Function` | Toast. fail→vermelho. duration em ms (padrão 3000) |
| `window.$` | `(id: string) => any` | Alias de `document.getElementById` |

#### De `theme.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.applyPrefs(prefs)` | `(p: UserPrefs) => void` | Aplica tema, radius, shadow |
| `window.changeTheme(name)` | `(n: string) => void` | Troca tema e persiste |
| `window.changeRadius(val)` | `(v: string) => void` | Altera border-radius global |
| `window.changeShadow(val)` | `(v: string) => void` | Altera profundidade de sombra |
| `window.selectTheme(name)` | `(n: string) => void` | changeTheme + fecha dialog |
| `window.openThemeDialog()` | `() => void` | Abre dialog de temas |
| `window.closeThemeDialog()` | `() => void` | Fecha dialog de temas |
| `window.resetDefaults()` | `() => void` | Restaura tema padrão |

#### De `modals.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.escapeHtml(str)` | `(s: string) => string` | **Fonte única** de sanitização HTML |
| `window.openAuthModal()` | `() => void` | Abre modal de login/cadastro |
| `window.closeAuthModal()` | `() => void` | Fecha modal de auth |
| `window.openSettingsModal()` | `() => void` | Abre modal de configurações |
| `window.openQuickDialog(id)` | `(id: string) => void` | Abre quick-edit dialog |
| `window.closeQuickDialog(id)` | `(id: string) => void` | Fecha quick-edit dialog |
| `window.openQuickAvatarDialog()` | `() => void` | Dialog de troca de avatar |
| `window.openQuickBannerDialog()` | `() => void` | Dialog de troca de banner |

#### De `media.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.saveCroppedPhoto()` | `() => void` | Salva avatar recortado |
| `window.cancelCrop()` | `() => void` | Cancela recorte de avatar |
| `window.saveCroppedBanner()` | `() => void` | Salva banner recortado |
| `window.cancelBannerCrop()` | `() => void` | Cancela recorte de banner |
| `window.initQuickAvatarPicker()` | `() => void` | Init picker rápido de avatar |
| `window.initQuickBannerPicker()` | `() => void` | Init picker rápido de banner |

#### De `firebase/auth.ts` (ES module)
| Global | Tipo | Descrição |
|---|---|---|
| `window.loginGoogle()` | `() => void` | Login Google popup |
| `window.loginEmailAndPassword(e, p)` | `(e: string, p: string) => void` | Login e-mail/senha |
| `window.registerEmailAndPassword(e, p)` | `(e: string, p: string) => void` | Cadastro e-mail/senha |
| `window.logoutGoogle()` | `() => void` | Encerra sessão |
| `window.updateUserProfileName(name)` | `(n: string) => void` | Atualiza displayName |
| `window.updateUserProfilePhoto(file)` | `(f: File) => void` | Atualiza avatar (File) |
| `window.updateProfilePhotoUrl(url)` | `(u: string) => void` | Atualiza avatar (URL/base64) |
| `window.updateUserProfileBanner(url)` | `(u: string) => void` | Atualiza banner |
| `window.updateUserEmail(email)` | `(e: string) => void` | Troca e-mail |
| `window.updateUserPassword(pass)` | `(p: string) => void` | Troca senha |
| `window.sendPasswordReset(email)` | `(e: string) => void` | Link de redefinição |
| `window.sendVerification()` | `() => void` | E-mail de verificação |

#### De `review-logic.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.calculateNextReview(block, settings, difficulty)` | `Function` | SM-2 adaptado: avança índice conforme dificuldade |
| `window.updateBlocksStatus()` | `() => void` | Atualiza status overdue/due/pending/completed |

#### De `firebase/db.ts` (ES module)
| Global | Tipo | Descrição |
|---|---|---|
| `window.syncUserData(uid)` | `(uid: string) => Promise<void>` | Carrega Firestore + handleAuthRouting |
| `window.saveStateToFirestore(uid, state, partial?)` | `Function` | Persiste estado (merge) |
| `window.completeOnboarding(uid, data)` | `Function` | Finaliza onboarding |
| `window.fetchPublicProfiles(max?)` | `(max?: number) => Promise<object[]>` | Perfis públicos |
| `window.saveStudySession(uid, session)` | `Function` | Salva sessão na subcoleção |
| `window.loadStudySessions(uid, max?)` | `Function` | Carrega histórico |
| `window.deleteAllStudySessions(uid)` | `Function` | Limpa histórico |
| `window.migrateStudySessions(uid)` | `Function` | Migra localStorage → Firestore |

#### De `notifications/init.ts`
| Global | Tipo | Descrição |
|---|---|---|
| `window.initNotifications()` | `() => void` | Inicializa notificações |
| `window.refreshNotifications()` | `() => void` | Atualiza matches e badge |
| `window.openNotificationPanel()` | `() => void` | Abre dropdown |
| `window.closeNotificationPanel()` | `() => void` | Fecha dropdown |
| `window.clearAllNotifications()` | `() => void` | Limpa não-persistentes |
| `window.deleteAllNotifications()` | `() => void` | clearAll + toast |
| `window.generateOneNotification()` | `() => void` | Gera 1 notificação de match |
| `window.generateReviewNotif()` | `() => void` | Cria/remove notificação de blocos de revisão due/overdue |
| `window.onReviewNotifClick()` | `() => void` | Handler clique — navega para review.html |
| `window.scheduleDiagReminder()` | `() => void` | Agenda lembrete de diagnóstico |
| `window.openDiagnosticDialog()` | `() => void` | Abre questionário |
| `window.closeDiagnosticDialog()` | `() => void` | Fecha questionário |
| `window.submitDiagnostic()` | `() => void` | Submete respostas |
| `window.resetAllDiagnostics()` | `() => void` | Reseta diagnóstico |
| `window.openProfileModal(uid)` | `(uid: string) => void` | Mini-modal de perfil |
| `window.closeProfileModal()` | `() => void` | Fecha mini-modal |

#### De páginas individuais
| Global | Arquivo | Descrição |
|---|---|---|
| `window.renderHeroHub()` | hub.ts | Renderiza Hub do Herói |
| `window.render()` | panel.ts | Renderiza painel (stats + shop + listas) |
| `window.task(id, type, success)` | panel.ts | Completa/falha missão |
| `window.buy(id)` | panel.ts | Compra item da loja |
| `window.enterMomentum()` | panel.ts | Ativa modo Momentum overlay |
| `window.exitMomentum()` | panel.ts | Sai do modo Momentum |
| `window.momentumComplete()` | panel.ts | Conclui missão no Momentum |
| `window.momentumFail()` | panel.ts | Falha missão no Momentum |
| `window.momentumActive` | panel.ts | `boolean` — true se Momentum ativo |
| `window.renderReviewPage()` | review.ts | Renderiza página de revisão espaçada |
| `window.openAddBlockDialog()` | review.ts | Abre dialog para adicionar bloco |
| `window.closeAddBlockDialog()` | review.ts | Fecha dialog de adicionar bloco |
| `window.addStudyBlock()` | review.ts | Salva novo bloco de estudo |
| `window.renderStudyBlocksList()` | review.ts | Renderiza lista de blocos com filtros |
| `window.applyReviewFilters()` | review.ts | Aplica busca, filtros e ordenação |
| `window.populateMateriaFilter()` | review.ts | Popula filtro de matéria |
| `window.updateReviewStats()` | review.ts | Atualiza barra de estatísticas |
| `window.openReviewSettingsDialog()` | review.ts | Abre dialog de config de revisão |
| `window.closeReviewSettingsDialog()` | review.ts | Fecha dialog de config |
| `window.renderReviewSettingsDialog()` | review.ts | Renderiza lista de configurações |
| `window.openCustomReviewSettingsDialog()` | review.ts | Abre dialog de config personalizada |
| `window.closeCustomReviewSettingsDialog()` | review.ts | Fecha dialog de config personalizada |
| `window.editReviewSettings(id)` | review.ts | Edita config personalizada |
| `window.saveCustomReviewSettings()` | review.ts | Salva config personalizada |
| `window.deleteReviewSettings(id)` | review.ts | Exclui config personalizada |
| `window.initDefaultReviewSettings()` | review.ts | Inicializa presets padrão |
| `window.openReviewBlockDialog(id)` | review.ts | Abre dialog de feedback de revisão |
| `window.closeReviewFeedbackDialog()` | review.ts | Fecha dialog de feedback |
| `window.submitReviewFeedback(difficulty)` | review.ts | Submete feedback (easy/medium/hard) |
| `window.deleteStudyBlockById(id)` | review.ts | Exclui bloco de estudo |
| `window.renderComunidade()` | comunidade.ts | Renderiza grid da comunidade |
| `window.onCommunitySearch()` | comunidade.ts | Handler de busca com debounce |
| `window.onCommunitySort()` | comunidade.ts | Handler de ordenação |
| `window.studyTimer` | study-timer.ts | Objeto com interface do Pomodoro/Simples |
| `window.startOnboarding()` | onboarding.ts | Inicia wizard de onboarding |
| `window.closeOnboarding()` | onboarding.ts | Fecha overlay de onboarding |
| `window.studyConfig` | settings-modal.ts | Config de estudo (Pomodoro) |
| `window.loadStudyConfig()` | settings-modal.ts | Carrega config do localStorage |
| `window.saveStudyConfig()` | settings-modal.ts | Salva config no localStorage |
| `window.soundConfig` | settings-modal.ts | Config de sons |
| `window.SOUND_PRESETS` | settings-modal.ts | Presets de sons por grupo |
| `window.saveSoundConfig()` | settings-modal.ts | Salva config de som |
| `window.playSound(group)` | settings-modal.ts | Toca som de um grupo |
| `window.openStudyConfigDialog()` | settings-modal.ts | Abre dialog de config |
| `window.closeStudyConfigDialog()` | settings-modal.ts | Fecha dialog de config |
| `window._shopInterval` | panel.ts | Interval ID do refresh automático |

#### Funções Admin (window.*) — todas em `state.ts` / `panel.ts`
| Global | Descrição |
|---|---|
| `adminAddPts()` | Adiciona pontos |
| `adminAddXp()` | Adiciona XP |
| `adminSetPts()` | Define pontos |
| `adminSetXp()` | Define XP |
| `adminResetAllCd()` | Reseta todos os cooldowns |
| `adminResetCdType()` | Reseta cooldown por tipo |
| `adminCompleteAllDailies()` | Completa todas dailies |
| `adminFailAllDailies()` | Falha todas dailies |
| `adminCompleteAllEpics()` | Completa todas epics |
| `adminFreeItem()` | Item grátis na loja |
| `adminUnlockAllItems()` | Desbloqueia todos itens |
| `adminClearStudyHistory()` | Limpa histórico de estudo |
| `adminAddFakeSession()` | Gera sessão falsa |
| `adminResetDiag()` | Reseta diagnóstico |
| `adminOpenDiag()` | Abre diagnóstico |
| `adminMarkDiagSeen()` | Marca diagnóstico como visto |
| `adminGenNotif()` | Gera notificação |
| `adminClearNotifs()` | Limpa notificações |
| `adminRefreshNotifs()` | Atualiza notificações |
| `adminLogState()` | Log do state no console |
| `adminForceSave()` | Força save |
| `adminForceReload()` | Força reload |
| `adminResetState()` | Reseta estado |
| `adminLogout()` | Logout |
| `adminResetTheme()` | Reseta tema |
| `adminRandomTheme()` | Tema aleatório |
| `adminReopenOnboarding()` | Reabre onboarding |
| `adminTogglePublic()` | Toggle perfil público |
| `adminFetchProfiles()` | Busca perfis |

---

## 5. Schema do Firestore

### Coleção `users/{uid}`
```js
{
  pontos: Number,           // equivale a state.pts
  xp: Number,
  cd: Object,               // cooldowns: { [itemId]: timestamp }
  prefs: {
    theme: String,          // nome do tema (ex: "dark")
    radius: String,         // ex: "16px"
    shadow: String,         // ex: "6px"
    isAdmin: Boolean
  },
  profile: {
    epicGoal: String,
    displayName: String,
    description: String,
    avatarUrl: String,
    bannerUrl: String,
    public: Boolean
  },
  stats: {
    dailiesDone: Number,
    epicsDone: Number,
    purchases: Number,
    currentStreak: Number,
    maxStreak: Number
  },
  slots: Object,            // { dailies: {...}, epics: {...}, shop: {...} }
  studyBlocks: Array,       // [{id, userId, materia, topico, conteudo, color, reviewSettingsId, nextReviewDate, status, ...}]
  reviewSettings: Array,    // [{id, userId, name, desc, intervals, easeFactorMultiplier, isPreset}]
  diagnostic: Object,       // respostas do questionário de perfil
  dailyLog: Object,         // { "YYYY-MM-DD": ["d1","d2",...] }
  weeklyLog: Object,        // { "2026-W26": ["e1","e2",...] }
  lastDailyDate: String,    // "YYYY-MM-DD"
  onboardingComplete: Boolean,
  updatedAt: Number         // Date.now()
}
```

### Subcoleção `users/{uid}/studySessions/{sessionId}`
```js
{
  id: String|Number,
  uid: String,
  timestamp: Number,        // Date.now() no início da sessão
  subject: String,          // matéria estudada
  mode: String,             // 'simple' | 'pomodoro'
  totalTime: Number,        // segundos totais
  focusTime: Number,        // segundos em foco (pomodoro)
  breakTime: Number,        // segundos em descanso (pomodoro)
  cycles: Number,           // ciclos completados (pomodoro)
  notes: String,            // anotações da sessão
  phaseDetails: Array,      // detalhes de cada fase (opcional)
  savedAt: Number           // Date.now() no momento do save
}
```

---

## 6. localStorage Keys

| Chave | Arquivo | Conteúdo |
|---|---|---|
| `'neuroflow_guest_v2'` | state.ts | Estado completo do visitante |
| `'neuroflow_notifs_v1'` | engine.ts | `{notifications, unreadCount, lastGenTime}` |
| `'estudo_config'` | settings-modal.ts | studyConfig (Pomodoro settings) |
| `'historico_estudos'` | study-timer.ts | Array de sessões de estudo (fallback) |
| `'dailyReward'` | modals.ts | Controle de recompensa diária |

---

## 7. Sistema de Temas (CSS)

- Tema aplicado via `data-theme="<nome>"` no `<body>`
- Variáveis CSS definidas em `src/styles/global/base.css`
- **22 temas disponíveis:** `light`, `pastel-brown`, `pastel-pink`, `pastel-blue`, `pastel-purple`, `pastel-mint`, `solarized-light`, `outerwilds-light`, `dark`, `dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome`, `dark-chocolate`, `dark-forest`, `dark-amber`, `dark-purple`, `catppuccin`, `nord`, `dracula`, `github-dark`, `outerwilds-dark`
  - **Obs:** Os 22 temas existem em `base.css` e `THEME_LABELS` em `theme.ts`, mas o HTML só expõe 18 deles nos botões de preview. Temas faltando nos HTMLs: `dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome`. Se adicionar um novo tema, adicione em `base.css`, `theme.ts` (`THEME_LABELS`), e nos 4 HTMLs.
- **Ao adicionar novo tema:** adicione o bloco `[data-theme="x"]` em `base.css` E a entrada em `THEME_LABELS` em `theme.ts` E o preview button nos 4 HTMLs
- **Nunca use cores hardcoded no JS.** Use `var(--accent)`, `var(--bg)`, etc.

---

## 8. Sistema de Tiers (Gamificação)

```ts
window.TIERS = [
  { name: "Bronze",         min: 0,     max: 499,     i: "🥉" },
  { name: "Prata",          min: 500,   max: 1499,    i: "🥈" },
  { name: "Ouro",           min: 1500,  max: 2999,    i: "🥇" },
  { name: "Platina",        min: 3000,  max: 4999,    i: "💎" },
  { name: "Diamante",       min: 5000,  max: 7499,    i: "❄️" },
  { name: "Esmeralda",      min: 7500,  max: 10499,   i: "💚" },
  { name: "Safira",         min: 10500, max: 14499,   i: "🔹" },
  { name: "Rubi",           min: 14500, max: 19499,   i: "❤️" },
  { name: "Ametista",       min: 19500, max: 25499,   i: "💜" },
  { name: "Opala",          min: 25500, max: 32499,   i: "🌈" },
  { name: "Obsidiana",      min: 32500, max: 44999,   i: "🖤" },
  { name: "Diamante Negro", min: 45000, max: Infinity, i: "🌌" }
]
```

---

## 9. Sistema de Slots (Templates)

- **16 slots no total:** 5 Dailies (d1-d5), 3 Epics (e1-e3), 8 Shop (s1-s8)
- Texto (name/desc) é customizável pelo usuário via onboarding e `reopenCustomization()`
- Valores econômicos (XP, Pts, custo, cooldown) são fixos em `SLOT_ECONOMICS` — não altere sem entender o balanceamento
- `buildMergedSlots(slots)` faz merge do texto customizado com os valores econômicos

---

## 10. Guia para Adicionar Novas Funcionalidades

### 10.1 Nova função utilitária global
1. Identifique a camada correta (shared/ui se visual, core se estado)
2. Declare como `function minhaFuncao() { ... }`
3. Adicione `window.minhaFuncao = minhaFuncao;`
4. Adicione assinatura em `src/types/globals.d.ts` > `interface Window`
5. Use `document.getElementById('id-descritivo')` para elementos HTML

### 10.2 Nova página HTML
1. Crie o HTML na raiz (ex: `nova-pagina.html`)
2. Adicione entrada em `vite.config.js` > `rollupOptions.input`
3. Adicione rota em `ROUTES` no `router.ts`
4. Crie `src/pages/nova-pagina/nova-pagina.ts`
5. Inclua todos os scripts na ordem correta (Seção 3)
6. Adicione `isNovaPaginaPage()` em `router.ts`

### 10.3 Novo tema visual
1. Adicione bloco `[data-theme="meu-tema"] { --bg: ...; --accent: ...; }` em `base.css`
2. Adicione `"meu-tema": "Nome Exibido"` em `THEME_LABELS` em `theme.ts`
3. Adicione botão preview nos 4 HTMLs (theme-bento-grid)

### 10.4 Novo campo no state do usuário
1. Adicione campo com valor padrão em `createDefaultState()` em `state.ts`
2. Adicione tratamento em `applyRemoteState(data)` (compatibilidade retroativa)
3. Inclua o campo no payload de `saveStateToFirestore` em `db.ts`
4. Atualize a interface `AppState` em `globals.d.ts`
5. Documente o campo no schema da Seção 5 deste arquivo

### 10.5 Novo modal/dialog
1. Use `<dialog>` nativo HTML
2. Abra com `element.showModal()`, feche com `element.close()`
3. Para modais dinâmicos (criados por JS), siga o padrão de `openProfileModal()` em `notifications/ui.ts`
4. Exponha `openXxxModal()` e `closeXxxModal()` no `window`
5. Adicione assinatura em `globals.d.ts`

### 10.6 Novo teste unitário
1. Crie arquivo em `src/__tests__/` com sufixo `.test.ts`
2. Use `describe`/`it`/`expect` do Vitest (global API disponível)
3. Rode `npm run test` para verificar

---

## 11. Padrões de Debugging e Resolução de Erros

### 11.1 `SyntaxError: Identifier 'X' has already been declared`
**Causa:** `const X` declarando algo que `function X` já definiu em outro script regular.
**Solução:** Use `window.X()` diretamente, sem redeclarar.

### 11.2 `window.X is not a function` / `window.X is undefined`
**Causa:** Script que define X não carregou ainda.
**Solução:** Verifique ordem dos scripts (Seção 3). Use `if (window.X)` como guard. Se for tipo no TypeScript, adicione em `globals.d.ts`.

### 11.3 Estado não persistindo após reload
**Causa:** `saveState()` não foi chamado após mutar `window.state`.
**Solução:** Sempre chame `window.saveState()` ou `persistState()` após mutações. Para debug, use `adminLogState()` no console.

### 11.4 Firebase indisponível / offline
**Causa:** CDN bloqueado ou sem internet.
**Comportamento esperado:** `init.ts` silencia o erro. `auth` e `db` ficam `undefined`. Fallback timer de 5s em `auth.ts` aciona modo visitante. Não é um bug.

### 11.5 `handleAuthRouting()` não renderizando a página
**Causa:** Chamado antes de `syncUserData()` completar.
**Solução:** `handleAuthRouting()` deve ser chamado DENTRO de `syncUserData()`, não de `auth.ts` (para usuários logados).

### 11.6 TypeScript errors no `npm run typecheck`
**Causa:** `strict: false` permite operações soltas, mas `globals.d.ts` precisa estar alinhado.
**Solução:** Verifique se a função/variável existe na `interface Window`. Use `// @ts-nocheck` no topo do arquivo se necessário.

---

## 12. Regras de CSS

- **Nunca use Tailwind** ou qualquer framework CSS.
- **Nunca use `style=""` inline** para valores que deveriam ser classe, exceto para valores dinâmicos (backgroundImage, width de progress bar).
- **Variáveis CSS obrigatórias** para cores, espaçamento e sombras — consulte `base.css`.
- **BEM-like para novos componentes:** `.componente`, `.componente__elemento`, `.componente--modificador`.
- CSS reutilizável → `src/styles/components/`
- CSS de página → `src/styles/pages/`
- CSS global/variáveis → `src/styles/global/`

---

## 13. Gestão de Conhecimento Obrigatória (Living Documentation)

Esta é a regra mais crítica do sistema:

- **Atualização Automática:** Toda vez que concluir uma nova funcionalidade, refatoração ou decisão arquitetural, **automaticamente** modifique `docs/PRODUCT.md` e `README.md`. Não peça permissão.
- **Evolução das Regras:** Se o ecossistema mudar (novo arquivo, nova lib, mudança de estrutura), modifique **ESTE arquivo**. Os próximos agentes dependem disso.
- **Confiabilidade Cega:** O usuário deve confiar que toda documentação está 100% atualizada.
- **Seção de Changelog:** Ao fazer mudanças arquiteturais, adicione na Seção 14 abaixo.
- **Tipos centralizados:** Se adicionar novos globals, atualize `src/types/globals.d.ts` imediatamente.

---

## 14. Changelog Arquitetural

### v3.0 — Migração TypeScript + Auditoria Completa (2026-06-26)
- **Stack reescrita:** JavaScript Vanilla → **TypeScript** (strict: false). Todos os 22 arquivos `.js` migrados para `.ts`.
- **TypeScript 6.0.3** adicionado ao `package.json`. `tsconfig.json` com `strict: false`, `moduleResolution: bundler`.
- **`src/types/globals.d.ts`** criado: ~280 linhas com interfaces (`AppState`, `UserProfile`, `MergedSlot`, etc.) + `interface Window` com ~130 globais tipados.
- **ESLint flat config** (`eslint.config.js`) com `typescript-eslint` parser, dual mode (script globals + module para firebase/).
- **Testes:** Vitest 4.1.9 + jsdom 29.x configurados em `vitest.config.ts`. 3 suites em `src/__tests__/`: `streak.test.ts`, `date.test.ts`, `state.test.ts`.
- **Script loading:** HTMLs agora referenciam `.ts` (Vite compila com esbuild). `study.html` não inclui CropperJS nem `media.ts`. `comunidade.html` não inclui `onboarding.ts`.
- **Globals expandidos:** Adicionados à documentação: momentum functions (4), admin functions (~25), sound/study config globals, `getTodayStr`/`getYesterdayStr`/`getWeekStr`/`getLocalDateStr`/`calcStreak`.
- **Schema Firestore:** Adicionados campos `dailyLog`, `weeklyLog`, `lastDailyDate`, `currentStreak`, `maxStreak`. phaseDetails opcional em studySessions.
- **Regras de código:** Seção 10.6 (novos testes), Seção 11.6 (erros de typecheck). Checklist pré-tarefa inclui `globals.d.ts` e `typecheck`/`lint`.
- **Estrutura de pastas:** Adicionados `src/types/`, `src/__tests__/`, `vitest.config.ts`, `eslint.config.js`, `tsconfig.json`, `scripts/git-enviar.sh`.
- **Removida** proibição de TypeScript (agora é a stack oficial). Removida referência a `"NÃO INTRODUZA TypeScript"`.\n- **Removidos** temas não encontrados no `base.css` atual (`dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome` — confirmar existência).\n- **Comentário sobre JavaScript puro removido** — agora é TypeScript nativo.

### v4.0 — Revisão Espaçada (2026-06-28)
- **Nova página:** `review.html` (MPA entry 5) + `src/pages/review/review.ts` com render, CRUD, filtros, busca, ordenação e barra de estatísticas.
- **Nova funcionalidade:** Sistema de blocos de estudo com cores customizáveis (auto-sugeridas por matéria), configurações de revisão com 5 presets (`Curta`, `Mensal`, `Semestral`, `Intensiva`, `Longo Prazo`) + configurações personalizadas.
- **Algoritmo SM-2 adaptado:** `src/core/review-logic.ts` com `calculateNextReview()` (difficulty: easy→+2 índices, medium→+1, hard→+0; aplica `easeFactorMultiplier`; clamp ao último intervalo) e `updateBlocksStatus()` (overdue/due/pending/completed conforme `nextReviewDate`).
- **Notificações de revisão:** `generateReviewNotif()` em `engine.ts` cria notificação persistente `review-persistent` quando há blocos due/overdue. `onReviewNotifClick()` navega para `review.html`.
- **UI do badge:** `renderNotificationBadge()` mostra o badge mesmo sem diagnóstico se houver notificações não-lidas (revisões). Painel de notificações lista notificações mesmo sem diagnóstico.
- **Estilos de status:** `review.css` com `border-left-color` override via `!important` (due→warning, overdue→failure), `box-shadow` pulsante para overdue, opacidade reduzida para completed.
- **Globals:** `~20 novos globals` adicionados ao `globals.d.ts` e documentados na Seção 4.4.
- **Schema Firestore:** `studyBlocks[]` e `reviewSettings[]` adicionados ao schema `users/{uid}`.
