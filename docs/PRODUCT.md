# Produto: NeuroFlow
**Versão:** 2.0 | **Última atualização:** 2026-06-25

> Este documento centraliza o conhecimento de negócios, visão de produto e funcionalidades do NeuroFlow. É leitura **obrigatória** para qualquer agente de IA antes de executar tarefas neste repositório.

---

## 1. Visão Geral (A Ideia)

O **NeuroFlow** é um gerenciador de tarefas altamente gamificado, desenvolvido para aumentar a produtividade de estudantes através de dinâmicas de RPG. O foco é transformar o ato de estudar e concluir tarefas cotidianas em uma jornada heroica (o *Hero Hub*).

### 1.1 Público-Alvo
- Estudantes vestibulares e concurseiros
- Pessoas em mercado de trabalho que estudam paralelamente
- Entusiastas de fitness e aprendizado pessoal

### 1.2 Proposta de Valor
- Transforma tarefas rotineiras em missões com recompensas tangíveis (XP, pontos, itens da loja)
- Cria senso de progressão visível através do sistema de tiers
- Conecta estudantes compatíveis através de diagnóstico de perfil
- Funciona sem login (modo visitante) e com sincronização na nuvem (autenticado)

### 1.3 Pilares do Design
- **Vibrante e engajador:** micro-interações, toasts, animações de recompensa
- **Gamificação séria:** o sistema de XP/Pts deve parecer justo e motivador, não inflado
- **Performance:** Vanilla JS sem frameworks pesados, Firebase via CDN

---

## 2. Principais Módulos da Aplicação

### 2.1. Hero Hub (`index.html`)
**Página principal e centro de identidade do herói.**

- **Usuário logado:** exibe perfil completo (avatar, banner, nome, meta épica, descrição, tier atual, XP, pontos), estatísticas (missões concluídas, marcos épicos, compras realizadas) e cards de navegação para Painel, Comunidade e Estudo
- **Quick-edit:** dialogs inline para editar nome, meta épica, descrição, avatar e banner sem abrir settings
- **Visitante:** exibe tela de boas-vindas com opções de login (Google / E-mail) ou modo visitante

**Funções-chave:** `window.renderHeroHub()`, `window.renderGuestLanding()`

### 2.2. Painel / Dashboard (`panel.html`)
**Gerenciador de tarefas gamificado — coração do produto.**

- **Ranking e XP:** barra de progresso visual entre tiers, XP acumulado, pontos de dopamina
- **Missões Diárias (5 slots):** tarefas com recompensa (+XP, +Pts) e penalidade por falha (-XP)
- **Marcos Épicos (3 slots):** metas de longo prazo com recompensa maior, sem penalidade
- **Loja de Recompensas (8 slots):** itens compráveis com pontos e cooldown individual por item
- **Persistência:** Firestore (logado) ou localStorage (visitante)
- **Atualização automática:** loja re-renderizada a cada 30s para atualizar cooldowns

**Funções-chave:** `window.render()`, `window.task(id, type, success)`, `window.buy(id)`

### 2.3. Modo Estudo / Pomodoro (`study.html`)
**Ferramenta de foco com histórico e sons.**

- **Modo Simples:** cronômetro livre — registra matéria, tempo total e anotações
- **Modo Pomodoro:** ciclos configuráveis de foco/descanso com número de ciclos definido pelo usuário
  - Suporte a pausa longa automática a cada N ciclos
  - Transição manual (confirmar) ou automática entre fases
  - Alarme sonoro configurável com presets por grupo (iniciar, pausar, concluir, alarme)
- **Histórico:** tabela de sessões com data, matéria, modo, ciclos, tempo foco/descanso e total. Expandível com ordenação e detalhes individuais
- **Sincronização:** histórico persistido em localStorage (`historico_estudos`) e sincronizado com Firestore via subcoleção `studySessions` quando logado
- **Config de Pomodoro:** acessível via settings-modal (abas separadas)

**Objeto-chave:** `window.studyTimer` (exposto por `study-timer.js`)

### 2.4. Comunidade (`comunidade.html`)
**Elemento social para conexão entre estudantes.**

- Grid de cards de outros heróis com avatar, banner, nome, meta épica, tier e XP
- Busca em tempo real por nome ou meta épica (debounce 200ms)
- Ordenação por XP ou nome
- Detalhe de perfil: view completa de outro herói com ranking global, progresso de tier e estatísticas
- **Visitantes:** veem aviso de login, não têm acesso ao grid

**Funções-chave:** `window.renderComunidade()`, `window.openProfileDetail(data)`, `window.fetchPublicProfiles(max?)`

### 2.5. Autenticação e Modos de Acesso

| Modo | Acesso | Persistência |
|---|---|---|
| Visitante | Painel + Estudo (sem Hub completo nem Comunidade) | localStorage (`neuroflow_guest_v2`) |
| Autenticado (Google) | Todas as páginas + Comunidade + Gamificação + Matching | Firebase Firestore |
| Autenticado (E-mail) | Idem ao Google | Firebase Firestore |

- **Onboarding:** wizard de 3 etapas obrigatório para novos usuários autenticados
  1. **Identidade:** meta épica, nome de exibição, avatar/banner, perfil público on/off
  2. **Pacotes:** seleção de pacote temático de missões iniciais OU personalização avançada
  3. **Wizard de Slots:** personalização de cada slot (16 slots, nome e descrição)
- **Redirecionamento:** usuários logados sem onboarding completo são redirecionados ao Hub

---

## 3. Funcionalidades em Detalhe

### 3.1. Sistema de Notificações
- **Notificação persistente:** diagnóstico de perfil sempre visível no painel de notificações (id: `'diag-persistent'`, `persistent: true`)
- **Notificações regulares:** matching entre usuários — no máximo 1 por vez, gerada em horários fixos (00:00 ou 12:00 local), não acumula
- **Toast de lembrete:** "Responda ao Diagnóstico" exibido a cada 2 minutos para quem não respondeu
- **Badge:** número de não-lidas no ícone de sino; ponto laranja quando diagnóstico pendente
- **Armazenamento:** notificações persistidas em localStorage `'neuroflow_notifs_v1'` entre navegações
- **Arquivos:** `engine.js` (estado + matching), `ui.js` (render), `init.js` (timers + exports)

### 3.2. Diagnóstico de Perfil
- Questionário adaptativo de ~8 perguntas (de um total de 21 em `diagnostic-data.js`)
- Organizado em tracks: `vest` (vestibulando), `conc` (concurseiro), `work` (mercado de trabalho), `fit` (fitness), `learn` (aprendizado pessoal)
- Pergunta inicial (`focusAreas`) define quais tracks o usuário verá
- Usado para calcular compatibilidade de matching com outros usuários (score de proximidade em `engine.js`)
- Resultado armazenado no Firestore como `state.diagnostic`
- Versão do diagnóstico: `DIAGNOSTIC_VERSION` — quando a versão muda, diagnóstico é resetado automaticamente

### 3.3. Onboarding (Wizard Gamificado)
- **Estrutura:** overlay fullscreen com 3 etapas numeradas
- **Etapa 1 — Identidade:** meta épica, nome de exibição, toggle de perfil público, upload de avatar e banner com CropperJS
- **Etapa 2 — Pacotes:** seleção de pacote temático OU personalização avançada dos slots
- **Etapa 3 — Wizard de Slots:** 16 cards editáveis com presets alternativos por slot
- **Finalização:** `window.completeOnboarding(uid, data)` persiste no Firestore e redireciona ao Hub

### 3.4. Modo Administrador
- Ativado via console do navegador (`ativarAdmin()`) ou por flag `state.prefs.isAdmin === true` no Firestore
- Botão `🛠️` aparece no canto superior direito quando ativo
- Modal admin com gerador de sessões de estudo falsas para testes de histórico
- Desativação: `desativarAdmin()` via console

### 3.5. Sistema de Temas
- 22 temas disponíveis (8 claros, 14 escuros)
  - **Claros:** Padrão Claro, Café com Leite, Flor de Cerejeira, Brisa do Mar, Lavanda Suave, Menta Fresca, Solarized Light, Lareira Gentil
  - **Escuros:** Dark Padrão, Dark Industrial, Cyberpunk, Dark Ocean, Monochrome, Cacau Intenso, Floresta Noturna, Âmbar Profundo, Noite de Vampiro, Catppuccin Mocha, Nordic Ice, Dracula Sync, GitHub Premium, Fogueira Cósmica
- Aplicado via `data-theme` no `<body>` — variáveis CSS controlam toda a paleta
- Persistido em `state.prefs.theme` (Firestore ou localStorage)
- Customização adicional: border-radius global e profundidade de sombra (persistidos em `prefs.radius` e `prefs.shadow`)

---

## 4. Stack Técnica e Decisões Arquiteturais

### 4.1 Por que Vanilla JS (sem frameworks)?
- **Performance:** zero bundle overhead, carregamento imediato
- **Hospedagem simples:** qualquer CDN estático serve o `dist/`
- **Manutenibilidade:** qualquer dev com conhecimento básico de JS/HTML/CSS entende o código
- **Restrição:** não introduza React, Vue ou Angular sem ordem explícita do usuário

### 4.2 Por que Firebase via CDN dinâmico?
- Evita bundle com o SDK (economiza ~200KB no JS final)
- Fallback gracioso quando CDN está indisponível (modo visitante automático)
- Versão fixa: `firebase-app/auth/firestore 10.8.0`

### 4.3 Fluxo de Auth (crítico)
```
onAuthStateChanged dispara
    ↓
[se user] → syncUserData(uid)
    ↓
applyRemoteState(data) → applyPrefs() → handleAuthRouting() → render/renderHeroHub/renderComunidade
    ↓
initNotifications()

[se null] → loadGuestState() → applyPrefs() → handleAuthRouting() → render/renderStudy
```

### 4.4 Multi-Page App (MPA) com Vite
- 4 entries no `vite.config.js`: `index.html`, `panel.html`, `study.html`, `comunidade.html`
- HTMLs ficam na raiz (requerimento do Vite MPA)
- `npm run dev` → servidor HMR na porta 5173
- `npm run build` → gera `dist/` com assets otimizados

---

## 5. Regras de Negócio e Balanceamento da Gamificação

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

**REGRA:** Não altere esses valores sem revisão do balanceamento completo. Uma mudança no custo de s7 pode quebrar a percepção de valor de todo o sistema.

### 5.3 Progressão de Tiers
- 12 tiers do Bronze ao Diamante Negro
- Tier máximo: 45.000 XP (Diamante Negro)
- Usuário médio dedicado: ~50 XP/dia → tier Ouro em ~1 mês

---

## 6. Diretrizes de Design e UX

- **Vibrante e Recompensador:** cada ação deve gerar feedback visual (toast, animação, atualização instantânea de stats)
- **Micro-interações:** conclusão de missão, upgrade de tier, compra na loja — todos devem ter resposta imediata
- **Consistência Visual:** sempre use as variáveis CSS do tema ativo; nunca hardcode cores no JS
- **Mobile-first:** o design deve funcionar em telas de 375px+; use unidades responsivas (`rem`, `%`, `clamp`)
- **Acessibilidade básica:** use `title=""` em botões de ícone, `alt=""` em imagens, `role=""` em modais

---

## 7. Backlog / Roadmap (Ideias para o Futuro)

> Seção informativa — implemente apenas com aprovação explícita do usuário.

- [ ] Sistema de conquistas (badges desbloqueáveis por marcos)
- [ ] Streaks de dias consecutivos de estudo
- [ ] Notificações push via Firebase Messaging
- [ ] Exportação de histórico de estudos (CSV/PDF)
- [ ] Ranking global público na Comunidade
- [ ] Chat entre usuários com alta compatibilidade de matching
- [ ] Perfis de tema compartilháveis
- [ ] Integração com calendário para agendamento de sessões

---

## 8. Histórico de Evoluções do Produto

### 2026-06-25 — v2.0 (Auditoria e Documentação Completa)
- PRODUCT.md reescrito com cobertura total: fluxo de auth, balanceamento de gamificação, regras de negócio, stack e decisões arquiteturais.
- Adicionadas tabelas de economia de XP/Pts e cooldowns da loja.
- Adicionado fluxo de auth documentado.
- Adicionadas diretrizes de design e UX.
- Adicionado backlog de roadmap futuro.

### Histórico Anterior
- Sistema de notificações reformulado (diagnóstico persistente, 1 notificação por vez, agendamento fixo)
- Timer Pomodoro extraído de `study.html` inline para `study-timer.js`
- Scripts legados removidos (`refactor.cjs`, `config.js`, `notifications.js` antigo)
- Correções gerais: `escapeHtml` consolidado, ordem de carregamento corrigida, `dailyReward` key corrigida
