# AGENTS.md — Protocolo Universal para Agentes de IA
 
> **LEIA ESTE ARQUIVO PRIMEIRO.** Este é o ponto de entrada mestre.
> Ferramentas: Claude, GPT, Gemini, Cursor, Copilot, Codex, Aider, Roo, Windsurf — qualquer agente futuro.
 
---
 
## ETAPA 1 — LEITURA OBRIGATÓRIA (nesta ordem)
 
1. [`docs/AI_CONSTITUTION.md`](docs/AI_CONSTITUTION.md) — autoridade máxima, regras absolutas
2. [`docs/PRODUCT.md`](docs/PRODUCT.md) — produto, funcionalidades, regras de negócio, roadmap e ideias
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, estrutura, convenções, design system, débitos técnicos e questões conhecidas
 
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
- Sugestões não aprovadas pertencem à seção de Ideias em `docs/PRODUCT.md`, nunca ao Roadmap
 
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
| Funcionalidade nova ou alterada | Atualize `docs/PRODUCT.md` |
| Roadmap atualizado ou concluído | Atualize `docs/PRODUCT.md` (seção 10) |
| Sugestão não aprovada surgiu | Adicione em `docs/PRODUCT.md` (seção 11) |
| Arquitetura, estrutura, stack alterada | Atualize `docs/ARCHITECTURE.md` |
| Bug, débito ou inconsistência descoberto | Atualize `docs/ARCHITECTURE.md` (seção 17) |
 
---
 
## ETAPA 5 — CONFIGURAÇÕES DE AGENTES
 
Este arquivo (`AGENTS.md`) é a única fonte de verdade de regras para agentes. Para evitar duplicação, os arquivos de configuração das ferramentas de IA na raiz são symlinks apontando diretamente para `AGENTS.md`:
 
- `CLAUDE.md` → `AGENTS.md`
- `.cursorrules` → `AGENTS.md`
- `.windsurfrules` → `AGENTS.md`
- `copilot-instructions.md` → `AGENTS.md`
- `AI.md` → `AGENTS.md`
 
---
 
## ETAPA 6 — RELATÓRIO DE CONFORMIDADE
 
Informe: arquivos lidos, alteração feita, regras verificadas, docs atualizados, violações detectadas.
