# AGENTS.md — Regras do NeuroFlow para Agentes de IA

> **LEIA ESTE ARQUIVO POR INTEIRO ANTES DE QUALQUER TAREFA.**
> Este é o único arquivo de regras do projeto.
> Ferramentas: Claude, GPT, Gemini, Cursor, Copilot, Codex, Aider, Roo, Windsurf — qualquer agente.

---

## 1. O QUE É O PROJETO

**NeuroFlow** — gerenciador de tarefas gamificado para estudantes (RPG de produtividade: XP, pontos, tiers, missões, loja, Pomodoro, revisão espaçada, comunidade).

- **Tipo:** Multi-Page App (MPA) — Vanilla TypeScript + Vite, sem frameworks
- **Idioma do produto:** Português BR | **Idioma do código:** Inglês (exceções históricas: `pontos`, `pts`, `ofensiva`)

---

## 2. STACK

| Categoria | Tecnologia |
|---|---|
| Build | Vite 8.x |
| Linguagem | TypeScript 6.x (`strict: false`) |
| Auth/DB | Firebase 10.8.0 via CDN dinâmico (nunca via npm) |
| Testes | Vitest 4.x + jsdom |
| Estilos | Vanilla CSS com variáveis `data-theme` |

### PROIBIDO
React, Vue, Angular, Svelte, Solid, Tailwind, Bootstrap, lodash, axios, Redux, Jest, Webpack — qualquer biblioteca fora da tabela acima. **Nunca** adicione dependência de produção ao `package.json`.

---

## 3. REGRAS RÍGIDAS (NÃO NEGOCIÁVEIS)

### 3.1 Obedeça o código existente
- **Antes de mexer em qualquer coisa, leia o arquivo-alvo e os vizinhos.** O código real é a fonte de verdade do estilo — não invente um estilo novo.
- **Nunca re-invente:** se já existe implementação, USE-A. Exemplos de singletons que não podem ter cópia: `escapeHtml` (em `modals.ts`), `toast`, `applyPrefs`, `saveState`, `handleAuthRouting`.
- **Nunca crie segunda implementação** de função, sistema ou componente que já exista.

### 3.2 Menor delta
- Faça a **menor mudança** que resolve completamente o problema.
- Não reorganize, renomeie ou reformate código não relacionado à tarefa.

### 3.3 Não remova nada sem autorização
- Não apague funcionalidade, arquivo, regra ou `@ts-nocheck` existente sem permissão explícita.

### 3.4 Documentação — OBRIGATÓRIA
- Se a mudança alterou o app (funcionalidade, página, regra de negócio, economia, bug corrigido), **atualize `docs/PRODUCT.md` na mesma tarefa, antes de concluir.**
- `docs/PRODUCT.md` é o **único** documento vivo do projeto. Ele deve refletir a realidade do app. Se você mudou o app e o doc ficou desatualizado, o trabalho não terminou.

### 3.5 Verificação — OBRIGATÓRIA
- Ao final: `npm run typecheck && npm run lint && npm run test`. Só conclua com tudo passando.

### 3.6 Datas e cores
- Datas de gamificação: **sempre data local** — `window.getTodayStr()`, `window.getLocalDateStr()`, `window.getWeekStr()`. **Nunca** `new Date().toISOString().slice(0, 10)`.
- Cores: **sempre** `var(--accent)`, `var(--text)`, etc. Nunca hardcode.

### 3.7 Padrões do projeto (siga sempre)
- Comunicação entre módulos: `window.*` (barramento global intencional).
- `$` = `const $ = (id) => document.getElementById(id)` — definido localmente em cada módulo (não é jQuery).
- Exposição de funções: `window.nome = nome` no final do arquivo.
- Persistência: `window.saveState()` — nunca localStorage direto fora de `state.ts`.
- `SLOT_ECONOMICS` em `templates.ts` é `Object.freeze()` — nunca alterar sem revisão de balanceamento.
- Estilo visual: neomorfismo flat (`box-shadow: var(--shadow-depth) var(--shadow-depth) 0px var(--shadow-color)`), `.bento-card`, `.btn-theme`.
- HTMLs das páginas ficam **na raiz** (requisito do Vite MPA). Nunca mova.

---

## 4. COMO TRABALHAR

- **Antes:** leia `docs/PRODUCT.md` e o arquivo-alvo + vizinhos; entenda o padrão predominante.
- **Durante:** menor delta; termine a tarefa pedida primeiro; ao achar bugs ou inconsistências adicionais, termine a tarefa e **depois** reporte.
- **Em dúvida:** pare e pergunte ao usuário com contexto — não improvise nem invente.
- **Sugestões novas:** não implemente de moto próprio. Proponha ao usuário; se aprovadas, entram em `docs/PRODUCT.md`.
- **Soberania:** não crie roadmap, prioridades ou visão de produto — isso pertence ao dono.

---

## 5. RELATÓRIO DE CONFORMIDADE (informe ao final de toda tarefa)

- Arquivos lidos
- Alteração feita
- Regras verificadas
- `docs/PRODUCT.md` atualizado? (sim/não)
- Violações detectadas (se houver)

---

## 6. COMANDOS

```bash
npm run dev          # Servidor local com HMR (localhost:5173)
npm run build        # Build de produção -> dist/
npm run preview      # Serve dist/ localmente
npm run test         # Testes Vitest
npm run test:watch   # Testes em modo watch
npm run typecheck    # Checagem de tipos (tsc)
npm run lint         # ESLint
npm run lint:fix     # ESLint com auto-fix
```
