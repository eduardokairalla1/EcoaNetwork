# ecoa-frontend

The Ecoa web client.

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload, on port 5173 |
| `npm run build` | Type-checks with `tsc -b`, then builds to `dist/` |
| `npm run preview` | Serves `dist/` as a static host would |
| `npm run lint` | ESLint over the whole project |
| `npm run format` | Prettier over sources and configs |

`npm run dev` does **not** type-check — only `build` does. Keep an eye on the
editor, or run `build` before pushing.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · React Router 8 ·
Motion · Radix (Dialog, Accordion)

## Where things are

- [docs/structure.md](docs/structure.md) — what each folder does, and where a
  new file goes
- [docs/tokens.md](docs/tokens.md) — fonts, colour, spacing, motion

Two entries worth knowing before anything else: `src/routes.ts` is the single
map of every destination the client links to, and `src/styles/tokens.css`
declares every visual value in the product.

## Conventions

- **Three sections per file**, in order: `// --- IMPORTS ---`,
  `// --- GLOBALS ---` (constants and types), `// --- CODE ---` (functions).
- **A docstring on the file and on every function**, one line plus `@param`
  and `@returns`.
- **Comments are one line.** Longer only with a `NOTE:` prefix, and only where
  removing the note would invite a silent bug.
- **80 columns.** Prettier handles the code; ESLint's `max-len` catches the
  strings and comments it cannot break.
- **Types live beside the code**: `Button.tsx` and `Button.t.ts`.
