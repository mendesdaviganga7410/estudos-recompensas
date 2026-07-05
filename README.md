# NeuroFlow

Gerenciador de tarefas gamificado focado em produtividade para estudantes. Transforma o ato de estudar em uma jornada heroica com XP, tiers, missões, loja de recompensas, timer Pomodoro, revisão espaçada e conexão social.

## Stack

| Categoria | Tecnologia |
|---|---|
| Build | Vite 8.x |
| Linguagem | TypeScript 6.x (`strict: false`) |
| Auth/DB | Firebase 10.8.0 via CDN dinâmico |
| Testes | Vitest 4.x + jsdom |
| Estilos | Vanilla CSS com variáveis `data-theme` (22 temas) |
| Imagens | CropperJS via CDN, DiceBear API (fallback avatar) |
| Tipografia | Space Grotesk (Google Fonts) |

**Zero dependências de produção.** Sem React, Vue, Angular, Tailwind, Bootstrap ou qualquer framework não listado.

## Estrutura

```
├── index.html              # Hero Hub
├── panel.html              # Painel / Dashboard
├── study.html              # Modo Estudo / Pomodoro
├── review.html             # Revisão Espaçada (SM-2)
├── comunidade.html         # Comunidade Social
├── src/
│   ├── core/               # Estado global, roteamento, Firebase
│   ├── features/           # Notificações, Onboarding
│   ├── pages/              # Scripts por página (1:1 com HTMLs)
│   ├── shared/             # UI (modais, temas, toasts), Templates de slots
│   ├── styles/             # CSS: global (temas, reset), components, pages
│   ├── types/              # globals.d.ts (~120 globais tipados)
│   └── __tests__/          # Testes unitários (Vitest)
├── agents/                 # Réplicas de config para ferramentas de IA
├── docs/                   # Documentação de produto e arquitetura
├── scripts/                # Scripts auxiliares (sync-agents, git-enviar)
```

## Páginas

| Página | Arquivo | Descrição |
|---|---|---|
| Hero Hub | `index.html` | Perfil, stats, navegação |
| Painel | `panel.html` | Missões diárias, épicas, loja, modo Momentum |
| Estudo | `study.html` | Timer Pomodoro / Simples + histórico |
| Revisão | `review.html` | Repetição espaçada (SM-2 adaptado) |
| Comunidade | `comunidade.html` | Grid social de heróis |

## Comandos

```bash
npm install          # Instalar dependências
npm run dev          # Servidor dev (HMR) em localhost:5173
npm run build        # Build produção → dist/
npm run preview      # Servir dist/ localmente
npm run test         # Testes unitários (Vitest)
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run sync-agents  # Sincronizar AGENTS.md → agents/
npm run verify-agents # Verificar integridade das réplicas
```

## Agentes de IA

O `AGENTS.md` na raiz é o protocolo mestre. Réplicas em `agents/` com symlinks na raiz para compatibilidade com Claude Code, Cursor, Windsurf e Copilot.

Ao trabalhar neste projeto com um agente de IA, inclua "LEIA E OBEDEÇA O AGENTS.md" no prompt, ou configure a ferramenta para ler `AGENTS.md` automaticamente.
