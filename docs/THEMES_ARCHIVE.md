# Arquivo de Temas Antigos (Depreciados)

> **Este arquivo NÃO é um documento vivo.** Serve apenas como cofre de referência dos temas
> removidos do NeuroFlow em 2026-08-04. Para reativar um tema:
> 1. Cole o bloco CSS abaixo em `src/styles/global/base.css`.
> 2. Adicione o swatch de preview em `src/styles/components/modals.css` (bloco `.theme-preview-<key>`).
> 3. Adicione o label em `THEME_LABELS` em `src/shared/ui/theme.ts`.
> 4. Adicione o botão no dialog `theme-dialog` dos 6 HTMLs (index, panel, study, review, flashcards, comunidade).

## Temas mantidos
- `pastel-blue` — **Brisa do Mar** (claro)
- `pastel-blue-dark` — **Brisa do Mar Escuro** (escuro)

---

## Temas claros

### `light` — Padrão Claro
```css
[data-theme="light"] {
    --bg: #f3f4f6; --surface: #ffffff; --panel: #f9fafb; --card-bg: #ffffff;
    --text: #111827; --stroke: #111827; --shadow-color: #111827;
    --accent: #2563eb; --accent-text: #ffffff;
    --muted: #4b5563; --success: #10b981; --failure: #ef4444;
    --select-arrow: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23111827' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
}
```
Swatch: `bg #f3f4f6`, `accent #2563eb`, `card #ffffff`

### `pastel-brown` — Café com Leite
```css
[data-theme="pastel-brown"] {
    --bg: #f5efe6; --surface: #fffdf9; --panel: #ebd8c3; --card-bg: #f5efe6;
    --text: #3e2723; --stroke: #3e2723; --shadow-color: #4a3525;
    --accent: #a1887f; --accent-text: #3e2723;
    --muted: #795548; --success: #689f38; --failure: #d84315;
    --select-arrow: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233e2723' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
}
```
Swatch: `bg #f5efe6`, `accent #a1887f`, `card #ebd8c3`

### `pastel-pink` — Flor de Cerejeira
```css
[data-theme="pastel-pink"] {
    --bg: #fff0f5; --surface: #ffffff; --panel: #ffe4e1; --card-bg: #fae1e4;
    --text: #2a1b22; --stroke: #2a1b22; --shadow-color: #4c323f;
    --accent: #ff8da1; --accent-text: #2a1b22;
    --muted: #8b5a75; --success: #43a047; --failure: #e53935;
    --select-arrow: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232a1b22' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
}
```
Swatch: `bg #fff0f5`, `accent #ff8da1`, `card #fae1e4`

### `pastel-purple` — Lavanda Suave
```css
[data-theme="pastel-purple"] {
    --bg: #f3e8ff; --surface: #ffffff; --panel: #e9d5ff; --card-bg: #f3e8ff;
    --text: #1e1b4b; --stroke: #1e1b4b; --shadow-color: #3b1666;
    --accent: #a855f7; --accent-text: #ffffff;
    --muted: #6b21a8; --success: #16a34a; --failure: #e11d48;
    --select-arrow: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231e1b4b' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
}
```
Swatch: `bg #f3e8ff`, `accent #a855f7`, `card #e9d5ff`

### `pastel-mint` — Menta Fresca
```css
[data-theme="pastel-mint"] {
    --bg: #ecfdf5; --surface: #ffffff; --panel: #a7f3d0; --card-bg: #e6f6ee;
    --text: #064e3b; --stroke: #064e3b; --shadow-color: #022c22;
    --accent: #10b981; --accent-text: #022c22;
    --muted: #047857; --success: #059669; --failure: #dc2626;
    --select-arrow: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23064e3b' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
}
```
Swatch: `bg #ecfdf5`, `accent #10b981`, `card #a7f3d0`

### `solarized-light` — Solarized Light
```css
[data-theme="solarized-light"] {
    --bg: #fdf6e3; --surface: #f5eedc; --panel: #eee8d5; --card-bg: #eee8d5;
    --text: #002b36; --stroke: #002b36; --shadow-color: #073642;
    --accent: #b58900; --accent-text: #fdf6e3;
    --muted: #586e75; --success: #859900; --failure: #dc322f;
    --select-arrow: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23002b36' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
}
```
Swatch: `bg #fdf6e3`, `accent #b58900`, `card #eee8d5`

### `outerwilds-light` — Lareira Gentil
```css
[data-theme="outerwilds-light"] {
    --bg: #f4ebd9; --surface: #fffdf9; --panel: #ebd8c3; --card-bg: #fbf5eb;
    --text: #162436; --stroke: #a65b24; --shadow-color: #4a3424;
    --accent: #2a6f97; --accent-text: #fffdf9;
    --muted: #7f6d55; --success: #2d6a4f; --failure: #9b2226;
    --select-arrow: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23162436' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
}
```
Swatch: `bg #f4ebd9`, `accent #2a6f97`, `card #fbf5eb`

---

## Temas escuros

### `dark` — Dark Industrial
```css
[data-theme="dark"] {
    --bg: #0f172a; --surface: #1e293b; --panel: #334155; --card-bg: #1e293b;
    --text: #f8fafc; --stroke: #4a7a9a; --shadow-color: #1a3050;
    --accent: #38bdf8; --accent-text: #0f172a;
    --muted: #94a3b8; --success: #4ade80; --failure: #f87171;
}
```
Swatch: `bg #0f172a`, `accent #38bdf8`, `card #1e293b`

### `dark-chocolate` — Cacau Intenso
```css
[data-theme="dark-chocolate"] {
    --bg: #1c1310; --surface: #2c1e19; --panel: #422f27; --card-bg: #2c1e19;
    --text: #fbeee6; --stroke: #8a7a5a; --shadow-color: #3a2820;
    --accent: #d4a373; --accent-text: #1c1310;
    --muted: #a67c52; --success: #81b254; --failure: #e05a47;
}
```
Swatch: `bg #1c1310`, `accent #d4a373`, `card #2c1e19`

### `dark-cyberpunk` — Cyberpunk
```css
[data-theme="dark-cyberpunk"] {
    --bg: #0b0c10; --surface: #1f2833; --panel: #2c3540; --card-bg: #1f2833;
    --text: #c5c6c7; --stroke: #66fcf1; --shadow-color: #1a1825;
    --accent: #ff007f; --accent-text: #0b0c10;
    --muted: #858688; --success: #00ffcc; --failure: #ff3333;
}
```
Swatch: `bg #0b0c10`, `accent #ff007f`, `card #1f2833`

### `dark-ocean` — Dark Ocean
```css
[data-theme="dark-ocean"] {
    --bg: #030712; --surface: #111827; --panel: #1f2937; --card-bg: #111827;
    --text: #f9fafb; --stroke: #38bdf8; --shadow-color: #0a1a30;
    --accent: #06b6d4; --accent-text: #030712;
    --muted: #6b7280; --success: #10b981; --failure: #ef4444;
}
```
Swatch: `bg #030712`, `accent #06b6d4`, `card #111827`

### `dark-forest` — Floresta Noturna
```css
[data-theme="dark-forest"] {
    --bg: #0b1a10; --surface: #142b1d; --panel: #1d3a28; --card-bg: #142b1d;
    --text: #e3f0e8; --stroke: #4a8a5e; --shadow-color: #0a2018;
    --accent: #4ade80; --accent-text: #0b1a10;
    --muted: #6a9a7a; --success: #22c55e; --failure: #ef4444;
}
```
Swatch: `bg #0b1a10`, `accent #4ade80`, `card #142b1d`

### `dark-amber` — Âmbar Profundo
```css
[data-theme="dark-amber"] {
    --bg: #14100a; --surface: #221a10; --panel: #302618; --card-bg: #221a10;
    --text: #f7efe6; --stroke: #9a7a3a; --shadow-color: #2a1e10;
    --accent: #f59e0b; --accent-text: #14100a;
    --muted: #a08060; --success: #65a30d; --failure: #dc2626;
}
```
Swatch: `bg #14100a`, `accent #f59e0b`, `card #221a10`

### `dark-purple` — Noite de Vampiro
```css
[data-theme="dark-purple"] {
    --bg: #0f051d; --surface: #1a0b2e; --panel: #2b144a; --card-bg: #1a0b2e;
    --text: #f3e8ff; --stroke: #c084fc; --shadow-color: #1a0830;
    --accent: #e9d5ff; --accent-text: #0f051d;
    --muted: #7c3aed; --success: #22c55e; --failure: #ef4444;
}
```
Swatch: `bg #0f051d`, `accent #e9d5ff`, `card #1a0b2e`

### `dark-monochrome` — Monochrome
```css
[data-theme="dark-monochrome"] {
    --bg: #121212; --surface: #1e1e1e; --panel: #2d2d2d; --card-bg: #1e1e1e;
    --text: #ffffff; --stroke: #555555; --shadow-color: #2a2a2a;
    --accent: #888888; --accent-text: #121212;
    --muted: #aaaaaa; --success: #ffffff; --failure: #444444;
}
```
Swatch: `bg #121212`, `accent #888888`, `card #1e1e1e`

### `dark-industrial` — Dark Industrial
```css
[data-theme="dark-industrial"] {
    --bg: #121315; --surface: #1a1b1f; --panel: #27282e; --card-bg: #1a1b1f;
    --text: #f1f2f6; --stroke: #ff9f1c; --shadow-color: #1e2028;
    --accent: #ff9f1c; --accent-text: #121315;
    --muted: #8e929e; --success: #10b981; --failure: #ff4d4d;
}
```
Swatch: `bg #121315`, `accent #ff9f1c`, `card #1a1b1f`

### `nord` — Nordic Ice
```css
[data-theme="nord"] {
    --bg: #2e3440; --surface: #3b4252; --panel: #434c5e; --card-bg: #3b4252;
    --text: #d8dee9; --stroke: #6a8a9a; --shadow-color: #2a3045;
    --accent: #88c0d0; --accent-text: #2e3440;
    --muted: #a5b1c9; --success: #a3be8c; --failure: #bf616a;
}
```
Swatch: `bg #2e3440`, `accent #88c0d0`, `card #3b4252`

### `dracula` — Dracula Sync
```css
[data-theme="dracula"] {
    --bg: #1e1f29; --surface: #282a36; --panel: #343746; --card-bg: #282a36;
    --text: #f8f8f2; --stroke: #bd93f9; --shadow-color: #282040;
    --accent: #ff79c6; --accent-text: #1e1f29;
    --muted: #a4b9ef; --success: #50fa7b; --failure: #ff5555;
}
```
Swatch: `bg #1e1f29`, `accent #ff79c6`, `card #282a36`

### `github-dark` — GitHub Premium
```css
[data-theme="github-dark"] {
    --bg: #070a0e; --surface: #0d1117; --panel: #161b22; --card-bg: #0d1117;
    --text: #f0f6fc; --stroke: #4a7590; --shadow-color: #0a1220;
    --accent: #58a6ff; --accent-text: #070a0e;
    --muted: #8b949e; --success: #34d058; --failure: #f85149;
}
```
Swatch: `bg #070a0e`, `accent #58a6ff`, `card #0d1117`

### `catppuccin` — Catppuccin Mocha
```css
[data-theme="catppuccin"] {
    --bg: #11111b; --surface: #1e1e2e; --panel: #313244; --card-bg: #1e1e2e;
    --text: #cdd6f4; --stroke: #cba6f7; --shadow-color: #1e1e30;
    --accent: #f5c2e7; --accent-text: #11111b;
    --muted: #a6adc8; --success: #a6e3a1; --failure: #f38ba8;
}
```
Swatch: `bg #11111b`, `accent #cba6f7`, `card #1e1e2e`

### `outerwilds-dark` — Fogueira Cósmica
```css
[data-theme="outerwilds-dark"] {
    --bg: #050914; --surface: #0e1626; --panel: #17233a; --card-bg: #111b2e;
    --text: #f6f0e2; --stroke: #e67e22; --shadow-color: #02050c;
    --accent: #f39c12; --accent-text: #050914;
    --muted: #5c6b83; --success: #2ecc71; --failure: #e74c3c;
    --select-arrow: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f6f0e2' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
}
```
Swatch: `bg #050914`, `accent #f39c12`, `card #111b2e`
