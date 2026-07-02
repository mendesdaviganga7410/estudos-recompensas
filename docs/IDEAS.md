# IDEAS.md — Hipóteses, Oportunidades e Sugestões

> **Este documento NÃO representa planejamento oficial.**
> Nenhuma entrada aqui está aprovada para implementação.
> Consulte `docs/ROADMAP.md` para funcionalidades oficialmente planejadas.

---

## Sistema de Conquistas (Badges)

| Campo | Valor |
|---|---|
| **Origem** | Auditoria institucional — agente anterior |
| **Tipo** | Hipótese |
| **Solicitado pelo proprietário** | Não |
| **Existe implementação parcial** | Não — apenas classes CSS `.badge` usadas como labels visuais de XP/pontos |
| **Evidência** | Nenhuma implementação. Mencionado na seção de backlog do `PRODUCT.md` antigo como sugestão |
| **Status** | Hipótese |
| **Observações** | Sugestão gerada por agente de IA. Não há código de conquistas, triggers, coleções ou progressão de badges. Não faz parte do produto oficial. |

---

## Notificações Push (Firebase Cloud Messaging)

| Campo | Valor |
|---|---|
| **Origem** | Auditoria institucional — agente anterior |
| **Tipo** | Hipótese |
| **Solicitado pelo proprietário** | Não |
| **Existe implementação parcial** | Não — apenas chave `messagingSenderId` na config do Firebase (campo padrão do SDK) |
| **Evidência** | Nenhum service worker, nenhuma lógica de push notification, nenhum registro de FCM |
| **Status** | Hipótese |
| **Observações** | Mencionado no backlog antigo. Sem implementação. Requer Firebase Cloud Messaging + service worker. |

---

## Exportação de Histórico (CSV/PDF)

| Campo | Valor |
|---|---|
| **Origem** | Auditoria institucional — agente anterior |
| **Tipo** | Hipótese |
| **Solicitado pelo proprietário** | Não |
| **Existe implementação parcial** | Não |
| **Evidência** | Nenhum código de geração CSV, PDF, blob, download ou exportação |
| **Status** | Hipótese |
| **Observações** | Mencionado no backlog antigo como sugestão. Sem implementação. |

---

## Ranking Global na Comunidade

| Campo | Valor |
|---|---|
| **Origem** | Auditoria institucional — agente anterior |
| **Tipo** | Oportunidade |
| **Solicitado pelo proprietário** | Não |
| **Existe implementação parcial** | Sim — rank position calculado no detail de perfil (`comunidade.ts:249`: `findIndex + 1`) |
| **Evidência** | No profile detail de outro herói, um número de posição é exibido (ex: "#2 de 50 heróis"). Não há página de leaderboard, ranking global, ou UI dedicada |
| **Status** | Oportunidade |
| **Observações** | A base existe (perfis públicos, ordenação por XP). Um leaderboard completo aproveitaria a estrutura existente. Mas não foi solicitado nem aprovado. |

---

## Chat entre Usuários Compatíveis

| Campo | Valor |
|---|---|
| **Origem** | Auditoria institucional — agente anterior |
| **Tipo** | Hipótese |
| **Solicitado pelo proprietário** | Não |
| **Existe implementação parcial** | Não |
| **Evidência** | Nenhuma — sem estruturas de mensagem, sem UI de chat, sem conexão em tempo real |
| **Status** | Hipótese |
| **Observações** | Mencionado no backlog antigo como sugestão. Requer subcoleção de mensagens no Firestore, notificações em tempo real. |

---

## Perfis de Tema Compartilháveis

| Campo | Valor |
|---|---|
| **Origem** | Auditoria institucional — agente anterior |
| **Tipo** | Hipótese |
| **Solicitado pelo proprietário** | Não |
| **Existe implementação parcial** | Não |
| **Evidência** | Nenhuma — sem serialização de tema, sem URL de compartilhamento, sem clipboard/share API |
| **Status** | Hipótese |
| **Observações** | Mencionado no backlog antigo. Baixo valor e baixa complexidade, mas não solicitado. |

---

## Integração com Calendário Externo

| Campo | Valor |
|---|---|
| **Origem** | Auditoria institucional — agente anterior |
| **Tipo** | Hipótese |
| **Solicitado pelo proprietário** | Não |
| **Existe implementação parcial** | Não — apenas mini streak calendar (7 dias inline) |
| **Evidência** | O streak calendar é um widget visual de ofensiva, não uma integração com calendário externo. Nenhum Google Calendar API, OAuth, ou ics |
| **Status** | Hipótese |
| **Observações** | Mencionado no backlog antigo. Alta complexidade. Não solicitado. |

---

## Critérios de Priorização Institucionais

| Campo | Valor |
|---|---|
| **Origem** | Auditoria institucional — agente anterior |
| **Tipo** | Sugestão Técnica |
| **Solicitado pelo proprietário** | Não |
| **Existe implementação parcial** | Não |
| **Evidência** | Nenhuma — critérios foram inventados pelo agente (valor percebido, custo, dependências, saúde do código) |
| **Status** | Sugestão Técnica |
| **Observações** | A definição de critérios de priorização é prerrogativa exclusiva do proprietário. Removido do ROADMAP.md. |

---

## Histórico de Revisões

| Data | Mudança |
|---|---|
| 2026-07-02 | Criação do documento — absorveu todo o conteúdo especulativo removido de `ROADMAP.md` |
