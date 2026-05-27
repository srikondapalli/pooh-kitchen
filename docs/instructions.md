# Developer Instructions

Setup and development reference for Pooh's Honey Kitchen.

---

## Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Test runner:** Vitest
- **Package manager:** pnpm 10.4.1
- **Module format:** ES modules

The game runs entirely in the browser — there is no backend. Game logic lives in a single reducer at `client/src/lib/gameEngine.ts`, rendered to a `<canvas>` by `client/src/components/GameCanvas.tsx`. Recipes, map layout, and ingredient stats are in `client/src/lib/gameConstants.ts`.

---

## Quick Start

```bash
pnpm install
pnpm dev       # dev server at http://localhost:3000
```

If port 3000 is taken, Vite automatically tries 3001, 3002, etc.

---

## All Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start Vite dev server with hot reload |
| `pnpm build` | Build static assets to `dist/public` + bundle server |
| `pnpm start` | Run the production Express server (`dist/index.js`) |
| `pnpm preview` | Preview the production build locally |
| `pnpm check` | TypeScript type-check without emitting |
| `pnpm format` | Format all files with Prettier |
| `npx vitest run` | Run unit tests once |
| `npx vitest` | Run unit tests in watch mode |

---

## File Structure

```
client/
  public/         Static files served at site root (favicon, robots.txt)
  src/
    pages/        Page-level components
    components/   Reusable UI + shadcn/ui primitives
    contexts/     React contexts
    hooks/        Custom React hooks
    lib/
      gameEngine.ts       All game logic (single reducer)
      gameConstants.ts    Map layout, recipes, ingredients, difficulty config
      gameTypes.ts        TypeScript types for game state
    App.tsx       Routes and top-level layout
    main.tsx      React entry point
    index.css     Global styles and design tokens
server/
  index.ts        Express server for production static serving
shared/
  const.ts        Shared constants
```

---

## Ubuntu Setup

Minimum recommended: Ubuntu 22.04 LTS or newer, Node.js 20+.

```bash
# System tools
sudo apt update
sudo apt install -y curl git build-essential ca-certificates

# Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version

# pnpm via corepack
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm --version

# Install and run
pnpm install
pnpm dev
```

Build and test:

```bash
pnpm build
pnpm check
npx vitest run
```

---

## Windows Setup

Minimum recommended: Windows 10 or 11, PowerShell 7.

1. Install [Node.js 20 LTS](https://nodejs.org/) for Windows x64
2. Install [Git for Windows](https://git-scm.com/download/win)
3. Restart PowerShell so `node`, `npm`, and `git` are on `PATH`

```powershell
# Verify
node --version
npm --version
git --version

# pnpm via corepack
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm --version

# Install and run
pnpm install
pnpm dev
```

Build and test:

```powershell
pnpm build
pnpm check
npx vitest run
```

---

## Production Server (optional)

The repo ships a small Express server (`server/index.ts`) that serves the built `dist/public/` folder. Useful for single-host deploys where you want one process handling both routing and static files.

```bash
pnpm build
NODE_ENV=production node dist/index.js
# Override port: PORT=8080 node dist/index.js
```

GitHub Pages hosts the static build directly and does not use this server.

---

## GitHub Pages Deployment

Deployment is automated via `.github/workflows/deploy.yml`. Every push to `main` triggers a build and deploys to GitHub Pages.

Requirements in the repo settings:
- **Settings → Pages → Build and deployment → Source:** GitHub Actions

The site will be live at `https://srikondapalli.github.io/pooh-kitchen/`.

---

## pnpm Patches and Overrides

The project applies pnpm-specific patches defined in `package.json`:

```json
"pnpm": {
  "patchedDependencies": {
    "wouter@3.7.1": "patches/wouter@3.7.1.patch"
  },
  "overrides": {
    "tailwindcss>nanoid": "3.3.7"
  }
}
```

Use pnpm when possible so these settings are applied consistently. If using npm, the patch will not be applied.
