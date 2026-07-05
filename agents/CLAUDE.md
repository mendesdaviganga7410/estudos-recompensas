# CLAUDE.md — Instruções para Claude

Você está trabalhando no projeto **NeuroFlow** (`estudos-recompensas`).

---

## ETAPA 1 — LEITURA OBRIGATÓRIA (nesta ordem)

Leia **integralmente** antes de qualquer operação:

1. [`docs/AI_CONSTITUTION.md`](docs/AI_CONSTITUTION.md) — autoridade máxima, regras absolutas, stack, identidade visual
2. [`docs/PRODUCT.md`](docs/PRODUCT.md) — produto, funcionalidades, regras de negócio
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, estrutura, convenções técnicas, design system
4. [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md) — problemas conhecidos na área que vai modificar
5. [`docs/ROADMAP.md`](docs/ROADMAP.md) — funcionalidades implementadas para não recriar nada
6. [`docs/IDEAS.md`](docs/IDEAS.md) — hipóteses e oportunidades (não implementar sem aprovação)

---

## ETAPA 2 — REGRAS ABSOLUTAS DE EXECUÇÃO

### Proibido
- React, Vue, Angular, Tailwind, Bootstrap — qualquer framework não aprovado
- Segunda implementação de `escapeHtml` — única em `modals.ts`
- Data UTC (`new Date().toISOString()`) para gamificação — use `window.getTodayStr()`
- Mover HTMLs da raiz (`index.html`, `panel.html`, `study.html`, `review.html`, `comunidade.html`)
- Alterar `SLOT_ECONOMICS` sem autorização
- Adicionar dependência de produção ao `package.json`
- Hardcode de cores — use `var(--accent)`, `var(--bg)`, etc.
- Acessar `localStorage` diretamente para dados de estado — use `window.saveState()`
- Criar segundo sistema de roteamento, toast, temas
- Remover `@ts-nocheck` de arquivos sem corrigir todos os erros de tipo
- Remover funcionalidades existentes
- Assumir desejos futuros do proprietário

### Obrigatório
- `window.saveState()` para persistir estado
- `window.escapeHtml(str)` para sanitizar HTML dinâmico
- `window.getTodayStr()` para datas de gamificação
- `var(--accent)` e demais variáveis CSS para cores
- `window.funcao = funcao` no final de cada arquivo para exportar globais
- Verificar se a funcionalidade já existe antes de criar algo novo
- Verificar padrão predominante antes de criar estilo novo
- Testar funções puras com Vitest quando aplicável
- Princípio do **menor delta**: menor mudança que resolve completamente o problema
- **Soberania do Planejamento**: não criar roadmap, não inventar funcionalidades, não definir prioridades

---

## ETAPA 3 — VERIFICAÇÃO PÓS-EXECUÇÃO (OBRIGATÓRIA)

Após concluir a alteração, execute esta checklist:

- [ ] Releia `AI_CONSTITUTION.md` seção 15 (Regras Absolutas) e confirme que nenhuma foi violada
- [ ] Verifique se nenhuma tecnologia proibida foi introduzida
- [ ] Verifique se nenhuma data UTC foi usada
- [ ] Verifique se nenhuma cor foi hardcodada
- [ ] Verifique se `escapeHtml` não foi duplicado
- [ ] Verifique se `package.json` não recebeu dependência de produção
- [ ] Verifique se HTMLs da raiz não foram movidos
- [ ] Verifique se o código compila/builda (`npm run typecheck && npm run lint`)

---

## ETAPA 4 — ATUALIZAÇÃO DE DOCUMENTAÇÃO

Se a alteração afetou o produto, a arquitetura ou introduziu problemas:

| Se | Então |
|---|---|
| Funcionalidade nova ou alterada | Atualize `docs/PRODUCT.md` |
| Arquitetura, estrutura, stack alterada | Atualize `docs/ARCHITECTURE.md` |
| Bug ou inconsistência descoberto | Atualize `docs/KNOWN_ISSUES.md` |
| Sugestão não aprovada surgiu | Adicione em `docs/IDEAS.md` |
| Funcionalidade do ROADMAP foi concluída | Atualize `docs/ROADMAP.md` (marque como implementada) |

**Regra:** nunca acumule versões antigas. Substitua o conteúdo. Mantenha a fonte única de verdade.

---

## ETAPA 5 — RELATÓRIO DE CONFORMIDADE

Ao finalizar, informe:
- Quais arquivos foram lidos (etapa 1)
- Qual alteração foi feita
- Quais regras foram verificadas (etapa 3)
- Quais documentos foram atualizados (etapa 4)
- Se alguma violação foi detectada

---

## Em Caso de Ambiguidade

Pare. Releia `AI_CONSTITUTION.md`. Escolha a solução mais compatível com os padrões existentes. Se necessário, pergunte ao usuário com contexto específico.
