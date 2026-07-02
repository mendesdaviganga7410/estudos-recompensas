# KNOWN_ISSUES.md — Inconsistências e Problemas Conhecidos

> **Documento vivo.** Atualize sempre que um problema for descoberto ou resolvido.
> Nenhum item deve ser corrigido sem autorização explícita do dono do projeto.

---

## 1. Temas sem botão de preview nos HTMLs

| Campo | Valor |
|---|---|
| **Problema** | 4 temas (`dark-industrial`, `dark-cyberpunk`, `dark-ocean`, `dark-monochrome`) não têm botão de preview nos 4 HTMLs que usam o seletor de temas |
| **Impacto** | Usuários não conseguem selecionar esses temas visualmente, embora existam no código |
| **Área afetada** | `index.html`, `panel.html`, `study.html`, `comunidade.html` |
| **Severidade** | Média |
| **Possível solução** | Adicionar botão de preview para cada tema nos 4 HTMLs, seguindo o padrão dos existentes |
| **Status** | Aberto |
| **Data descoberta** | 2026-06-28 |
| **Última revisão** | 2026-07-02 |

**Nota:** Ao adicionar um novo tema, lembre-se de atualizar também os 4 HTMLs com os botões de preview.

---

## 2. Alias `pontos` vs `pts`

| Campo | Valor |
|---|---|
| **Problema** | O campo se chama `pontos` no Firestore (alias histórico) e `pts` no `state`. `applyRemoteState` trata ambos |
| **Impacto** | Nenhum — funciona corretamente. Mas a duplicação pode causar confusão em novos desenvolvedores |
| **Área afetada** | Firestore schema (`users/{uid}`), `src/core/state.ts` |
| **Severidade** | Baixa |
| **Possível solução** | Manter o mapeamento. Não unificar sem migração de dados no Firestore |
| **Status** | Aceito (não-planejado) |
| **Data descoberta** | 2026-06-25 |
| **Última revisão** | 2026-07-02 |

---

## 3. `@ts-nocheck` em arquivos core

| Campo | Valor |
|---|---|
| **Problema** | `state.ts`, `router.ts`, `review-logic.ts`, `engine.ts`, `panel.ts`, `hub.ts`, `review.ts`, `comunidade.ts`, `onboarding.ts`, `auth.ts`, `db.ts`, `init.ts` usam `@ts-nocheck` por razões históricas |
| **Impacto** | Perda parcial de segurança de tipos nesses arquivos |
| **Área afetada** | 12 arquivos listados acima |
| **Severidade** | Média |
| **Possível solução** | Remover `@ts-nocheck` gradativamente, corrigindo todos os erros de tipo de cada arquivo. O restante foi migrado na v3.1 |
| **Status** | Em andamento (parcial) |
| **Data descoberta** | 2026-06-25 |
| **Última revisão** | 2026-07-02 |

**Regra:** Não adicione mais arquivos com `@ts-nocheck`.

---

## 4. `auth.ts` — dupla chamada de render

| Campo | Valor |
|---|---|
| **Problema** | Em `db.ts:syncUserData`, `render()` é chamada. Em `auth.ts`, também pode chamar `render()`. Ocorre dupla renderização |
| **Impacto** | Performance menor em páginas com render pesado; flicker visual em algumas páginas |
| **Área afetada** | `src/core/firebase/auth.ts`, `src/core/firebase/db.ts` |
| **Severidade** | Baixa |
| **Possível solução** | Consolidar chamadas de render em um único ponto pós-sincronização |
| **Status** | Aceito (intencional — fallback de segurança) |
| **Data descoberta** | 2026-06-25 |
| **Última revisão** | 2026-07-02 |

**Nota:** É intencional como fallback de segurança. Não alterar sem entender o fluxo completo de auth.

---

## 5. `review-logic.ts` — variável `lastReviewDate` não utilizada

| Campo | Valor |
|---|---|
| **Problema** | Linha 42 declara `const lastReviewDate = Date.now()` mas a variável não é usada na lógica subsequente |
| **Impacto** | Nenhum — variável morta |
| **Área afetada** | `src/core/review-logic.ts:42` |
| **Severidade** | Muito baixa |
| **Possível solução** | Remover a declaração não utilizada |
| **Status** | Candidato a limpeza futura |
| **Data descoberta** | 2026-06-28 |
| **Última revisão** | 2026-07-02 |

---

## 6. `router.ts` — double-wrap de `handleAuthRouting`

| Campo | Valor |
|---|---|
| **Problema** | `handleAuthRouting` é definido como função síncrona, depois sobrescrito com versão async que chama a original |
| **Impacto** | Complexidade desnecessária; difícil de depurar |
| **Área afetada** | `src/core/router.ts` |
| **Severidade** | Baixa |
| **Possível solução** | Refatorar para uma única implementação async |
| **Status** | Aceito (necessário para lógica da página de revisão) |
| **Data descoberta** | 2026-06-28 |
| **Última revisão** | 2026-07-02 |

**Nota:** Esse double-wrap é necessário para a página de revisão. Não desfazer.

---

## 7. `docs/architecture/README.md` — redundante com ARCHITECTURE.md (RESOLVIDO)

| Campo | Valor |
|---|---|
| **Problema** | `docs/architecture/README.md` continha visão de alto nível já consolidada em `docs/ARCHITECTURE.md`. Viola o princípio da fonte única de verdade |
| **Impacto** | Risco de divergência entre os dois documentos |
| **Área afetada** | `docs/architecture/README.md` |
| **Severidade** | Baixa |
| **Possível solução** | Removido — conteúdo já integralmente coberto por `ARCHITECTURE.md` |
| **Status** | Resolvido |
| **Data descoberta** | 2026-07-02 |
| **Última revisão** | 2026-07-02 |

---

## 8. Seção de inconsistências na Constituição (obsoleto)

| Campo | Valor |
|---|---|
| **Problema** | Os itens 1–6 acima estavam originalmente em `AI_CONSTITUTION.md` seção 17, violando o princípio de que a Constituição não deve conter informação mutável |
| **Impacto** | Risco de a Constituição ficar desatualizada |
| **Área afetada** | `docs/AI_CONSTITUTION.md` |
| **Severidade** | Baixa |
| **Possível solução** | Resolvido — seção migrada para `KNOWN_ISSUES.md` |
| **Status** | Resolvido |
| **Data descoberta** | 2026-07-02 |
| **Última revisão** | 2026-07-02 |

---

## Histórico de Revisões

| Data | Mudança |
|---|---|
| 2026-07-02 | Criação do documento — extraído de `AI_CONSTITUTION.md` seção 17 + item 7 e 8 adicionados |
