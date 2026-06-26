# NeuroFlow — Regras do Projeto para Agentes de IA
**Versão:** 2.0 | **Última atualização:** 2026-06-25

> **ATENÇÃO TOTAL, AGENTE DE IA:** Leia este arquivo **integralmente** antes de qualquer ação. Assuma a persona de um **Arquiteto de Software Sênior / Engenheiro Staff+**. Qualquer violação das regras abaixo é inaceitável.

---

## 0. CHECKLIST PRÉ-TAREFA (obrigatório antes de qualquer edição)

Antes de modificar qualquer arquivo, confirme mentalmente cada item:

- [ ] Li `docs/PRODUCT.md` para entender o contexto de negócio da tarefa
- [ ] Identifiquei a camada correta do arquivo a editar (`core/`, `features/`, `pages/`, `shared/`)
- [ ] Confirmei a ordem de carregamento de scripts da página afetada (Seção 3)
- [ ] Verifiquei se a `window.func` que vou criar já não existe com outro nome (causa `SyntaxError`)
- [ ] Confirmei que nenhuma funcionalidade existente será quebrada

---

## 1. Persona e Filosofia de Código

- **Qualidade Excepcional:** Nunca gere código "preguiçoso", verboso ou redundante. Use Clean Code e princípios SOLID onde aplicável.
- **Autonomia Segura:** Proponha refatorações se o código for mal estruturado, mas **NUNCA quebre funcionalidades existentes**.
- **Contexto em Primeiro Lugar:** Leia `docs/PRODUCT.md` antes de propor qualquer funcionalidade nova.
- **Sem Regressions:** Toda mudança deve ser cirúrgica e não afetar código não relacionado.
- **Falha Silenciosa Controlada:** Ao acessar `window.X`, sempre use `window.X?.()` ou `if (window.X)` antes de chamar. O Firebase pode estar indisponível.
- **Sem `console.log` de Debug:** Remova todos os logs de debug antes de entregar. Logs de `warn` e `error` para erros reais são permitidos.

---

## 2. Arquitetura e Stack Técnica

### 2.1 Stack
| Camada | Tecnologia |
|---|---|
| Frontend | HTML, CSS, JavaScript Vanilla |
| Build/Dev | Vite 8.x (`npm run dev` / `npm run build`) |
| Banco de Dados | Firebase Firestore (SDK v10.8.0 via CDN dinâmico) |
| Autenticação | Firebase Auth (Google + E-mail/senha) |
| Imagens | CropperJS (via CDN) |
| Avatar Fallback | DiceBear API (`pixel-art` seed) |

**NÃO INTRODUZA** React, Vue, Angular, TypeScript, ou qualquer framework/biblioteca pesado sem ordem explícita do usuário.

### 2.2 Estrutura de Pastas (canônica)

```
/
├── index.html          # Hero Hub (MPA entry 1)
├── panel.html          # Painel/Dashboard (MPA entry 2)
├── study.html          # Modo Estudo/Pomodoro (MPA entry 3)
├── comunidade.html     # Comunidade (MPA entry 4)
├── vite.config.js      # Configuração Vite (4 entries)
├── package.json        # deps: vite ^8.1.0
├── opencode.json       # { "instructions": [".agents/AGENTS.md"] }
├── .agents/AGENTS.md   # ESTE arquivo
├── docs/
│   ├── PRODUCT.md      # Contexto de produto e negócio
│   └── architecture/   # Docs extras de arquitetura
└── src/
    ├── core/
    │   ├── state.js        # Estado global (window.state)
    │   ├── router.js       # Navegação e detecção de página
    │   └── firebase/
    │       ├── init.js     # Inicializa Firebase (ES module, type="module")
    │       ├── auth.js     # Autenticação (ES module, type="module")
    │       └── db.js       # Firestore CRUD (ES module, type="module")
    ├── features/
    │   ├── notifications/
    │   │   ├── engine.js         # Estado e lógica de matching
    │   │   ├── ui.js             # Render do painel de notificações
    │   │   ├── init.js           # Inicialização, timers e exports
    │   │   ├── messages.js       # Geração de mensagens de matching
    │   │   ├── diagnostic-data.js  # 21 perguntas do diagnóstico
    │   │   └── diagnostic-ui.js    # Interface do questionário
    │   └── onboarding/
    │       └── onboarding.js     # Wizard de 3 etapas
    ├── pages/
    │   ├── hub/hub.js            # renderHeroHub()
    │   ├── panel/panel.js        # render(), task(), buy()
    │   ├── study/study-timer.js  # window.studyTimer
    │   └── comunidade/comunidade.js  # renderComunidade()
    ├── shared/
    │   ├── templates/
    │   │   └── templates.js      # SLOT_ECONOMICS, buildMergedSlots()
    │   └── ui/
    │       ├── modals.js         # Modais gerais + window.escapeHtml
    │       ├── settings-modal.js # Modal de configurações (Pomodoro config)
    │       ├── theme.js          # 22 temas, applyPrefs(), changeTheme()
    │       ├── toast.js          # window.toast(msg, fail, duration)
    │       └── media.js          # CropperJS para avatar/banner
    └── styles/
        ├── global/
        │   ├── base.css          # Variáveis CSS, reset, tipografia, temas
        │   └── layout.css        # Layouts globais
        ├── components/
        │   ├── components.css    # Cards, botões, badges, etc.
        │   └── modals.css        # Modais, dialogs, notificações
        └── pages/
            ├── hero.css          # Estilos específicos do Hub
            └── comunidade.css    # Estilos da Comunidade
```

**REGRA CRÍTICA:** Nunca crie arquivos lógicos (`.js`) na raiz do projeto. Nunca mova os HTMLs para subpastas.

---

## 3. Ordem de Carregamento de Scripts (CRÍTICO)

Esta ordem é obrigatória em **TODAS** as páginas HTML. A quebra desta ordem causa erros silenciosos ou `SyntaxError`.

```
 1. [CDN regular]    CropperJS
 2. [regular]        src/shared/templates/templates.js
 3. [regular]        src/core/state.js
 4. [type="module"]  src/core/firebase/init.js   ← deferred automaticamente
 5. [type="module"]  src/core/firebase/db.js      ← deferred automaticamente
 6. [type="module"]  src/core/firebase/auth.js    ← deferred automaticamente
 7. [regular]        src/shared/ui/toast.js
 8. [regular]        src/shared/ui/theme.js
 9. [regular]        src/shared/ui/modals.js
10. [regular]        src/features/notifications/diagnostic-data.js
11. [regular]        src/features/notifications/messages.js
12. [regular]        src/features/notifications/engine.js
13. [regular]        src/features/notifications/diagnostic-ui.js
14. [regular]        src/features/notifications/ui.js
15. [regular]        src/features/notifications/init.js
16. [regular]        src/shared/ui/settings-modal.js
17. [regular]        src/shared/ui/media.js
18. [regular]        src/core/router.js
19. [regular]        src/pages/<pagina>/<pagina>.js  ← específico da página
20. [inline]         admin-btn lógica
```

**Por que os módulos Firebase executam por último:** `type="module"` são sempre deferred. Isso garante que quando `onAuthStateChanged` dispara, todos os `window.*` dos scripts regulares já estão definidos.

---

## 4. Regras de Escopo Global (window.*)

### 4.1 Padrão de Exposição

Todo arquivo regular (não-module) DEVE expor funções públicas via `window`:

```js
// CORRETO
function minhaFuncao() { ... }
window.minhaFuncao = minhaFuncao;

// ERRADO — não fica global para onclick=""
const minhaFuncao = () => { ... };
```

### 4.2 Regra Anti-Conflito de Nomes (CRÍTICA)

NUNCA declare `const` ou `let` com o mesmo nome de uma `function` já existente em outro script regular da mesma página. Isso causa `SyntaxError: Identifier 'X' has already been declared`.

```js
// modals.js define:
function escapeHtml(str) { ... }
window.escapeHtml = escapeHtml;

// comunidade.js — ERRADO:
const escapeHtml = str => window.escapeHtml(str); // SyntaxError!

// comunidade.js — CORRETO:
// Use window.escapeHtml(str) diretamente
```

### 4.3 Mapa Completo de Globals (window.*)

#### De `state.js`
| Global | Tipo | Descrição |
|---|---|---|
| `window.state` | Object | Estado do usuário (pts, xp, cd, prefs, profile, stats, slots, diagnostic, onboardingComplete) |
| `window.TIERS` | Array[12] | Tiers Bronze → Diamante Negro |
| `window.GUEST_STORAGE_KEY` | String | `'neuroflow_guest_v2'` |
| `window.isGuestMode` | Boolean | true se visitante |
| `window.isAdmin` | Boolean | true se admin ativo |
| `window.currentUser` | Object/null | Firebase user object |
| `window.DAILIES` | Getter | Lista de dailies mergeada |
| `window.EPICS` | Getter | Lista de epics mergeada |
| `window.SHOP` | Getter | Lista de shop mergeada |
| `window.createDefaultState` | Function | Cria snapshot padrão |
| `window.applyRemoteState(data)` | Function | Sincroniza dados do Firestore para state |
| `window.saveState()` | Function | Persiste state (Firestore ou localStorage) |
| `window.saveGuestState()` | Function | Persiste no localStorage (só guest) |
| `window.loadGuestState()` | Function | Carrega do localStorage |
| `window.getMergedLists()` | Function | Retorna {dailies, epics, shop} |
| `window.ativarAdmin()` | Function | Ativa modo admin via console |
| `window.desativarAdmin()` | Function | Desativa modo admin |

#### De `router.js`
| Global | Tipo | Descrição |
|---|---|---|
| `window.ROUTES` | Object | Mapa: {inicio, hub, painel, guest, comunidade, estudo} |
| `window.navigateTo(url)` | Function | window.location.href = url |
| `window.handleAuthRouting()` | Function | Orquestra exibição por auth state |
| `window.setGuestMode(bool)` | Function | Alterna modo visitante |
| `window.updateGuestUI()` | Function | Mostra/oculta .auth-only/.guest-only |
| `window.renderGuestLanding()` | Function | Exibe tela de boas-vindas no Hub |
| `window.enterGuestMode()` | Function | Ativa visitante e navega ao painel |
| `window.enterHeroHub()` | Function | Navega ao hub (se logado) |
| `window.enterPanel()` | Function | Navega ao painel |
| `window.getCurrentPage()` | Function | Retorna nome do HTML atual |
| `window.isHubPage()` | Function | true se index.html |
| `window.isPainelPage()` | Function | true se panel.html |
| `window.isStudyPage()` | Function | true se study.html |
| `window.isComunidadePage()` | Function | true se comunidade.html |

#### De `templates.js`
| Global | Tipo | Descrição |
|---|---|---|
| `window.buildMergedSlots(slots)` | Function | Gera {dailies, epics, shop} mesclado |
| `window.cloneDefaultSlotText()` | Function | Retorna cópia dos slots padrão |
| `window.mergeSlotText(base, remote)` | Function | Merge slots locais com remotos |
| `window.SLOT_ECONOMICS` | Object | Valores de XP/Pts/cooldown por slot |
| `window.DEFAULT_SLOT_TEXT` | Object | Textos padrão de nome/desc de slots |
| `window.SLOT_PRESETS` | Object | Presets de personalização por slot |
| `window.getWizardSteps()` | Function | Retorna steps do onboarding wizard |

#### De `toast.js`
| Global | Tipo | Descrição |
|---|---|---|
| `window.toast(msg, fail?, duration?)` | Function | Toast. fail=true→vermelho. duration em ms (padrão 3000) |
| `window.$` | Function | Alias de document.getElementById |

#### De `theme.js`
| Global | Tipo | Descrição |
|---|---|---|
| `window.applyPrefs(prefs)` | Function | Aplica tema, radius, shadow |
| `window.changeTheme(name)` | Function | Troca tema e persiste |
| `window.changeRadius(val)` | Function | Altera border-radius global |
| `window.changeShadow(val)` | Function | Altera profundidade de sombra |
| `window.selectTheme(name)` | Function | changeTheme + fecha dialog |
| `window.openThemeDialog()` | Function | Abre dialog de temas |
| `window.closeThemeDialog()` | Function | Fecha dialog de temas |
| `window.resetDefaults()` | Function | Restaura tema padrão |

#### De `modals.js`
| Global | Tipo | Descrição |
|---|---|---|
| `window.escapeHtml(str)` | Function | **Fonte única de verdade** para sanitização HTML. NUNCA redeclare. |
| `window.openAuthModal()` | Function | Abre modal de login/cadastro |
| `window.closeAuthModal()` | Function | Fecha modal de auth |
| `window.openSettingsModal()` | Function | Abre modal de configurações |
| `window.openQuickDialog(id)` | Function | Abre quick-edit dialog por ID |
| `window.closeQuickDialog(id)` | Function | Fecha quick-edit dialog |
| `window.openQuickAvatarDialog()` | Function | Abre dialog de troca de avatar rápido |
| `window.openQuickBannerDialog()` | Function | Abre dialog de troca de banner rápido |

#### De `media.js`
| Global | Tipo | Descrição |
|---|---|---|
| `window.saveCroppedPhoto()` | Function | Salva avatar recortado |
| `window.cancelCrop()` | Function | Cancela recorte de avatar |
| `window.saveCroppedBanner()` | Function | Salva banner recortado |
| `window.cancelBannerCrop()` | Function | Cancela recorte de banner |
| `initQuickAvatarPicker()` | Function | Init picker rápido de avatar (hub.js chama) |
| `initQuickBannerPicker()` | Function | Init picker rápido de banner (hub.js chama) |

#### De `firebase/auth.js` (ES module)
| Global | Tipo | Descrição |
|---|---|---|
| `window.loginGoogle()` | Function | Login com popup Google |
| `window.loginEmailAndPassword(e, p)` | Function | Login e-mail/senha |
| `window.registerEmailAndPassword(e, p)` | Function | Cadastro e-mail/senha |
| `window.logoutGoogle()` | Function | Encerra sessão |
| `window.updateUserProfileName(name)` | Function | Atualiza displayName |
| `window.updateUserProfilePhoto(file)` | Function | Atualiza avatar (File object) |
| `window.updateProfilePhotoUrl(url)` | Function | Atualiza avatar (URL/base64) |
| `window.updateUserProfileBanner(url)` | Function | Atualiza banner |
| `window.updateUserEmail(email)` | Function | Troca e-mail |
| `window.updateUserPassword(pass)` | Function | Troca senha |
| `window.sendPasswordReset(email)` | Function | Envia link de redefinição |
| `window.sendVerification()` | Function | Envia e-mail de verificação |

#### De `firebase/db.js` (ES module)
| Global | Tipo | Descrição |
|---|---|---|
| `window.syncUserData(uid)` | Function | Carrega Firestore e chama handleAuthRouting |
| `window.saveStateToFirestore(uid, state, partial?)` | Function | Persiste estado completo (merge) |
| `window.completeOnboarding(uid, data)` | Function | Finaliza onboarding e persiste |
| `window.fetchPublicProfiles(max?)` | Function | Busca perfis públicos (padrão 50) |
| `window.saveStudySession(uid, session)` | Function | Salva sessão de estudo na subcoleção |
| `window.loadStudySessions(uid, max?)` | Function | Carrega histórico de sessões |
| `window.deleteAllStudySessions(uid)` | Function | Limpa histórico de sessões |
| `window.migrateStudySessions(uid)` | Function | Migra sessões do localStorage para Firestore |

#### De `notifications/init.js`
| Global | Tipo | Descrição |
|---|---|---|
| `window.initNotifications()` | Function | Inicializa sistema de notificações |
| `window.refreshNotifications()` | Function | Atualiza matches e badge |
| `window.openNotificationPanel()` | Function | Abre dropdown de notificações |
| `window.closeNotificationPanel()` | Function | Fecha dropdown |
| `window.clearAllNotifications()` | Function | Limpa notificações não-persistentes |
| `window.deleteAllNotifications()` | Function | clearAll + toast |
| `window.generateOneNotification()` | Function | Gera 1 notificação de match |
| `window.scheduleDiagReminder()` | Function | Agenda lembrete de diagnóstico |
| `window.openDiagnosticDialog()` | Function | Abre questionário diagnóstico |
| `window.closeDiagnosticDialog()` | Function | Fecha questionário |
| `window.submitDiagnostic()` | Function | Submete respostas do diagnóstico |
| `window.resetAllDiagnostics()` | Function | Reseta diagnóstico do usuário |
| `window.openProfileModal(uid)` | Function | Abre mini-modal de perfil de outro usuário |
| `window.closeProfileModal()` | Function | Fecha mini-modal de perfil |

#### De páginas individuais
| Global | Arquivo | Descrição |
|---|---|---|
| `window.renderHeroHub()` | hub.js | Renderiza Hub do Herói |
| `window.render()` | panel.js | Renderiza painel (stats + shop + listas) |
| `window.task(id, type, success)` | panel.js | Completa/falha missão |
| `window.buy(id)` | panel.js | Compra item da loja |
| `window.renderComunidade()` | comunidade.js | Renderiza grid da comunidade |
| `window.onCommunitySearch()` | comunidade.js | Handler de busca com debounce |
| `window.onCommunitySort()` | comunidade.js | Handler de ordenação |
| `window.studyTimer` | study-timer.js | Objeto com interface do Pomodoro/Simples |
| `window.startOnboarding()` | onboarding.js | Inicia wizard de onboarding |
| `window.closeOnboarding()` | onboarding.js | Fecha overlay de onboarding |

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
    purchases: Number
  },
  slots: Object,            // { dailies: {...}, epics: {...}, shop: {...} }
  diagnostic: Object,       // respostas do questionário de perfil
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
  savedAt: Number           // Date.now() no momento do save
}
```

---

## 6. localStorage Keys

| Chave | Arquivo | Conteúdo |
|---|---|---|
| `'neuroflow_guest_v2'` | state.js | Estado completo do usuário visitante |
| `'neuroflow_notifs_v1'` | engine.js | {notifications, unreadCount, lastGenTime} |
| `'estudo_config'` | settings-modal.js | studyConfig (Pomodoro settings) |
| `'historico_estudos'` | study-timer.js | Array de sessões de estudo (fallback) |
| `'dailyReward'` | modals.js | Controle de recompensa diária |

---

## 7. Sistema de Temas (CSS)

- Tema aplicado via `data-theme="<nome>"` no `<body>`
- Variáveis CSS definidas em `src/styles/global/base.css`
- **22 temas disponíveis:** `light`, `pastel-brown`, `pastel-pink`, `pastel-blue`, `pastel-purple`, `pastel-mint`, `solarized-light`, `dark`, `dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome`, `dark-chocolate`, `dark-forest`, `dark-amber`, `dark-purple`, `catppuccin`, `nord`, `dracula`, `github-dark`, `outerwilds-dark`, `outerwilds-light`
- **Ao adicionar novo tema:** adicione o bloco `[data-theme="x"]` em `base.css` E a entrada em `THEME_LABELS` em `theme.js`
- **Nunca use cores hardcoded no JS.** Use `var(--accent)`, `var(--bg)`, etc.

---

## 8. Sistema de Tiers (Gamificação)

```js
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
3. Adicione `window.minhaFuncao = minhaFuncao;` no bloco de exports do arquivo
4. Use `document.getElementById('id-descritivo')` para elementos HTML

### 10.2 Nova página HTML
1. Crie o HTML na raiz (ex: `nova-pagina.html`)
2. Adicione entrada em `vite.config.js` > `rollupOptions.input`
3. Adicione rota em `ROUTES` no `router.js`
4. Crie `src/pages/nova-pagina/nova-pagina.js`
5. Inclua todos os scripts na ordem correta (Seção 3)
6. Adicione `isNovaPaginaPage()` em `router.js`

### 10.3 Novo tema visual
1. Adicione bloco `[data-theme="meu-tema"] { --bg: ...; --accent: ...; }` em `base.css`
2. Adicione `"meu-tema": "Nome Exibido"` em `THEME_LABELS` dentro de `theme.js`

### 10.4 Novo campo no state do usuário
1. Adicione campo com valor padrão em `createDefaultState()` em `state.js`
2. Adicione tratamento em `applyRemoteState(data)` (compatibilidade retroativa)
3. Inclua o campo no payload de `saveStateToFirestore` em `db.js`
4. Documente o campo no schema da Seção 5 deste arquivo

### 10.5 Novo modal/dialog
1. Use `<dialog>` nativo HTML
2. Abra com `element.showModal()`, feche com `element.close()`
3. Para modais dinâmicos (criados por JS), siga o padrão de `openProfileModal()` em `notifications/ui.js`
4. Exponha `openXxxModal()` e `closeXxxModal()` no `window`

---

## 11. Padrões de Debugging e Resolução de Erros

### 11.1 `SyntaxError: Identifier 'X' has already been declared`
**Causa:** `const X` declarando algo que `function X` já definiu em outro script regular.
**Solução:** Use `window.X()` diretamente, sem redeclarar.

### 11.2 `window.X is not a function`
**Causa:** Script que define X não carregou ainda ou está em type="module" sem esperar.
**Solução:** Verifique ordem dos scripts. Use `if (window.X)` como guard.

### 11.3 Estado não persistindo após reload
**Causa:** `saveState()` não foi chamado após mutar `window.state`.
**Solução:** Sempre chame `window.saveState()` ou `persistState()` após mutações.

### 11.4 Firebase indisponível / offline
**Causa:** CDN bloqueado ou sem internet.
**Comportamento esperado:** `init.js` silencia o erro. `auth` e `db` ficam `undefined`. Fallback timer de 5s em `auth.js` aciona modo visitante. Não é um bug.

### 11.5 `handleAuthRouting()` não renderizando a página
**Causa:** Chamado antes de `syncUserData()` completar.
**Solução:** `handleAuthRouting()` deve ser chamado DENTRO de `syncUserData()`, não de `auth.js` (para usuários logados).

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

---

## 14. Changelog Arquitetural

### v1.0 — Refatoração Inicial
- `scripts/refactor.cjs` e `scripts/refactor2.cjs` deletados (obsoletos).
- `src/core/firebase/config.js` deletado (redundante com `init.js`).
- `src/features/notifications/notifications.js` deletado (909 linhas de código morto).
- `src/pages/study/study-timer.js` criado (extraído do inline de `study.html`, ~1368 linhas).

### v1.1 — Sistema de Notificações Reformulado
- Diagnóstico de perfil agora é notificação **persistente** em `__notifications[]` (id: `'diag-persistent'`).
- `clearAllNotifications()` preserva entradas com `persistent: true`.
- `generateOneNotification()` limpa não-persistentes antes de adicionar (máximo 1).
- `scheduleDiagReminder()` agenda para horário fixo (00:00 ou 12:00 local).
- Toast de diagnóstico só exibe para quem NÃO respondeu (`hasDiagnostic() === false`).

### v1.2 — Correções Gerais
- `panel.js`: `window.onload` → `document.addEventListener('DOMContentLoaded', ...)`.
- `toast.js`: Aceita 3º parâmetro `duration` (ms).
- `theme.js`: Adicionados temas faltantes ao `THEME_LABELS`.
- `modals.js`: Corrigido localStorage key (`neuroflow_daily_reward` → `dailyReward`), removidos `console.log`.
- `comunidade.js` e `onboarding.js`: `escapeHtml` delega para `window.escapeHtml`.
- `router.js`: `handleAuthRouting()` esconde `#auth-loading` em TODAS as páginas.

### v2.0 — AGENTS.md reescrito (auditoria completa)
- Adicionado checklist pré-tarefa obrigatório.
- Adicionado mapa completo de globals (`window.*`) com todos os ~80 exports documentados.
- Adicionado schema Firestore completo (users + studySessions).
- Adicionado mapa de todas as localStorage keys.
- Adicionado guia detalhado para adição de features (5 cenários).
- Adicionado padrões de debugging para os 5 erros mais comuns.
- Adicionado regras de CSS.
- Adicionado mapa canônico de estrutura de pastas.
- Adicionado tabela completa do stack técnico.
