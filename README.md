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
├── flashcards.html         # Flashcards
├── src/
│   ├── core/               # Estado global, roteamento, Firebase
│   ├── features/           # Notificações, Onboarding
│   ├── pages/              # Scripts por página (1:1 com HTMLs)
│   ├── shared/             # UI (modais, temas, toasts), Templates de slots
│   ├── styles/             # CSS: global (temas, reset), components, pages
│   ├── types/              # globals.d.ts (~120 globais tipados)
│   └── __tests__/          # Testes unitários (Vitest)
├── docs/PRODUCT.md         # Documento vivo do produto
├── AGENTS.md               # Regras para agentes de IA (única fonte)
└── scripts/                # Scripts auxiliares
```

## Páginas

| Página | Arquivo | Descrição |
|---|---|---|
| Hero Hub | `index.html` | Perfil, stats, navegação |
| Painel | `panel.html` | Missões diárias, épicas, loja, modo Momentum |
| Estudo | `study.html` | Timer Pomodoro / Simples + histórico |
| Revisão | `review.html` | Repetição espaçada (SM-2 adaptado) |
| Comunidade | `comunidade.html` | Grid social de heróis |
| Flashcards | `flashcards.html` | CRUD de flashcards + import/export |

## Documentação

O `AGENTS.md` na raiz é a única fonte de regras para agentes de IA. O `docs/PRODUCT.md` é o documento vivo do produto e deve ser atualizado junto com qualquer mudança no app.

## Comandos

```bash
npm install          # Instalar dependências
npm run dev          # Servidor dev (HMR) em localhost:5173
npm run build        # Build produção → dist/
npm run preview      # Servir dist/ localmente
npm run test         # Testes unitários (Vitest)
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run lint:fix     # ESLint com auto-fix
```
