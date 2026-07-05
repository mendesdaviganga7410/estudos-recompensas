# Copilot Instructions — Réplica de AGENTS.md para GitHub Copilot

> Sincronizado de AGENTS.md. Rode `npm run sync-agents` para atualizar.

---

## ETAPA 1 — LEITURA OBRIGATÓRIA (nesta ordem)

Leia integralmente antes de qualquer sugestão:

1. `docs/AI_CONSTITUTION.md` — autoridade máxima, regras absolutas
2. `docs/PRODUCT.md` — produto, funcionalidades, regras de negócio
3. `docs/ARCHITECTURE.md` — stack, estrutura, convenções, design system
4. `docs/KNOWN_ISSUES.md` — problemas conhecidos na área
5. `docs/ROADMAP.md` — funcionalidades implementadas
6. `docs/IDEAS.md` — hipóteses e oportunidades (não sugerir implementação)

---

## ETAPA 2 — REGRAS DE EXECUÇÃO

### Tecnologias aprovadas
Vite 8.x · TypeScript 6.x · Firebase 10.8.0 via CDN · Vitest 4.x · Vanilla CSS

### Proibido sugerir
React, Vue, Angular, Svelte, Solid, Tailwind, Bootstrap, lodash, axios, Redux, Jest, Webpack.

### Padrões obrigatórios
- `window.*` para comunicação entre módulos
- `window.saveState()` para persistência
- `window.getTodayStr()` para datas — nunca UTC
- `var(--accent)` etc. para cores — nunca hex/rgb direto
- `window.funcao = funcao` no final de cada arquivo
- `escapeHtml` já existe em `modals.ts` — não criar outro
- Menor delta: menor mudança que resolve o problema

### Jamais
- Mover HTMLs da raiz (Vite MPA)
- Adicionar dependência de produção ao `package.json`
- Alterar `SLOT_ECONOMICS` em `templates.ts`
- Remover `@ts-nocheck` de arquivos que já o usam
- Assumir visão ou roadmap do produto

---

## ETAPA 3 — VERIFICAÇÃO PÓS-SUGESTÃO

- Tecnologia proibida introduzida? ✗
- Data UTC usada para gamificação? ✗
- Cor hardcodada? ✗
- `escapeHtml` duplicado? ✗
- `package.json` com nova dependência? ✗

---

## ETAPA 4 — DOCUMENTAÇÃO

Se a sugestão afeta produto, arquitetura ou descobre issue, os respectivos docs em `docs/` devem ser atualizados.
