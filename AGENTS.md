# AGENTS.md — Protocolo Universal para Agentes de IA

> **LEIA ESTE ARQUIVO PRIMEIRO.** Este é o ponto de entrada mestre.
> Ferramentas: Claude, GPT, Gemini, Cursor, Copilot, Codex, Aider, Roo, Windsurf — qualquer agente futuro.

---

## ETAPA 1 — LEITURA OBRIGATÓRIA (nesta ordem)

1. [`docs/AI_CONSTITUTION.md`](docs/AI_CONSTITUTION.md) — autoridade máxima, regras absolutas
2. [`docs/PRODUCT.md`](docs/PRODUCT.md) — produto, funcionalidades, regras de negócio
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, estrutura, convenções, design system
4. [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md) — problemas conhecidos na área
5. [`docs/ROADMAP.md`](docs/ROADMAP.md) — funcionalidades implementadas
6. [`docs/IDEAS.md`](docs/IDEAS.md) — hipóteses e oportunidades (não implementar)

---

## ETAPA 2 — EXECUÇÃO REGULADA

### Stack

| Categoria | Tecnologia |
|---|---|
| Build | Vite 8.x |
| Linguagem | TypeScript 6.x (`strict: false`) |
| Auth/DB | Firebase 10.8.0 via CDN dinâmico |
| Testes | Vitest 4.x + jsdom |
| Estilos | Vanilla CSS com variáveis `data-theme` |

### Proibido
React, Vue, Angular, Svelte, Solid, Tailwind, Bootstrap, lodash, axios, Redux, Jest, Webpack — qualquer biblioteca não listada como aprovada.

### Padrões Críticos
- Comunicação: `window.*` (barramento global intencional)
- Persistência: `window.saveState()`
- Datas: `window.getTodayStr()` — nunca `new Date().toISOString()`
- Cores: `var(--accent)` — nunca hardcode
- Export: `window.funcao = funcao` no final do arquivo
- `escapeHtml`: única instância em `modals.ts` — nunca crie outra
- `$`: cada módulo define localmente `const $ = (id) => document.getElementById(id)` — não é jQuery
- `@ts-nocheck`: não remova sem corrigir erros; não adicione em arquivos novos
- `SLOT_ECONOMICS`: `Object.freeze()` em `templates.ts` — nunca alterar
- **Menor delta**: menor mudança que resolve completamente o problema

### Soberania do Planejamento
- **Não** crie roadmap, defina prioridades, invente funcionalidades, assuma visão do produto
- Sugestões não aprovadas pertencem a `docs/IDEAS.md`, nunca ao `ROADMAP.md`

---

## ETAPA 3 — VERIFICAÇÃO PÓS-EXECUÇÃO (OBRIGATÓRIA)

- [ ] Nenhuma tecnologia proibida foi introduzida
- [ ] Nenhuma data UTC usada para gamificação
- [ ] Nenhuma cor hardcodada
- [ ] `escapeHtml` não foi duplicado
- [ ] `package.json` não recebeu dependência de produção
- [ ] HTMLs da raiz não foram movidos
- [ ] Build compila (`npm run typecheck && npm run lint`)
- [ ] Testes passam (`npm run test`)

---

## ETAPA 4 — ATUALIZAÇÃO DE DOCUMENTAÇÃO

| Se | Então |
|---|---|
| Funcionalidade nova ou alterada | Atualize `PRODUCT.md` |
| Arquitetura, estrutura, stack alterada | Atualize `ARCHITECTURE.md` |
| Bug ou inconsistência descoberto | Atualize `KNOWN_ISSUES.md` |
| Sugestão não aprovada surgiu | Adicione em `IDEAS.md` |
| Funcionalidade do ROADMAP concluída | Atualize `ROADMAP.md` |

---

## ETAPA 5 — SINCRONIZAÇÃO

Este arquivo (`AGENTS.md`) é o **mestre**. Réplicas:

| Arquivo | Ferramenta |
|---|---|
| `CLAUDE.md` | Claude Code (lido automaticamente) |
| `.cursorrules` | Cursor |
| `.windsurfrules` | Windsurf |
| `copilot-instructions.md` | GitHub Copilot |

Para sincronizar: `npm run sync-agents`

---

## ETAPA 6 — RELATÓRIO DE CONFORMIDADE

Informe: arquivos lidos, alteração feita, regras verificadas, docs atualizados, violações detectadas.
