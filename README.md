# Dreamforge
A website for DREAMFORGE our own 3d printing brand
A small, modern React + TypeScript starter built with Vite, Tailwind CSS, and a collection
of reusable components and hooks. Includes a testing setup with Vitest and a variety of
UI primitives under `src/components/ui/` for rapid prototyping.

## Quick overview

- **Framework:** React + TypeScript
- **Bundler / Dev server:** Vite
- **Styling:** Tailwind CSS
- **Testing:** Vitest
- **Package manager:** Bun (repository contains `bun.lockb`) — npm/yarn/pnpm also supported

## Features

- Component library in `src/components/ui/` (buttons, dialogs, forms, etc.)
- Pages under `src/pages/` with routing-ready structure
- Utility hooks in `src/hooks/`
- Example tests in `src/test/` using Vitest

## Requirements

- Node.js (LTS) or Bun
- A package manager (`bun`, `npm`, or `pnpm`)

## Getting started

Install dependencies (pick one):

```bash
# using Bun
bun install

# using npm
npm install

# using pnpm
pnpm install
```

Run the dev server:

```bash
# Bun
bun run dev

# npm / pnpm
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run tests:

```bash
npm run test
```

## Project structure (important parts)

- `src/` — application source
	- `components/` — UI components and primitives
	- `hooks/` — reusable React hooks
	- `pages/` — page-level components
	- `assets/` — static assets

## Contributing

If you plan to contribute:

1. Fork the repo and create a feature branch.
2. Run the app and add or adjust tests for your changes.
3. Open a pull request with a clear description of your change.

## Where to look next

- UI primitives: `src/components/ui/`
- App entry: `src/main.tsx`
- Example tests: `src/test/`

## License

This repository does not currently include a license file. Add a `LICENSE` file at the
project root if you want to specify licensing.

---

If you'd like, I can also:

- add a short development checklist to the README
- extract and list exact npm scripts from `package.json`
- add a `LICENSE` file (MIT, Apache-2.0, etc.)

Tell me which of those you'd like next.
