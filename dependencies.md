# Pooh Kitchen Dependencies

This document lists the project dependencies and host-system requirements for running, testing, and building Pooh's Honey Kitchen.

## Project Stack

- Application type: React single-page game with Vite
- Language: TypeScript
- UI runtime: React 19
- Styling: Tailwind CSS 4
- Build tool: Vite 7
- Test runner: Vitest
- Package manager declared by project: pnpm 10.4.1
- Node module format: ES modules

## Required Tooling

- Node.js 20 or newer
- npm, included with Node.js
- pnpm 10.4.1 or compatible pnpm 10.x
- Git, recommended for cloning and version control
- A modern browser, such as Chrome, Edge, Firefox, or Safari

## Package Manager

The project declares this package manager in `package.json`:

```text
pnpm@10.4.1
```

Recommended setup:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install
```

If pnpm is unavailable, npm can install and run the project, but pnpm is preferred because the repository includes `pnpm-lock.yaml` and patched dependency metadata.

## Runtime Dependencies

These packages are listed under `dependencies` in `package.json`.

| Package | Version | Purpose |
|---|---:|---|
| `@hookform/resolvers` | `^5.2.2` | Form validation resolver helpers |
| `@radix-ui/react-accordion` | `^1.2.12` | Accordion UI primitive |
| `@radix-ui/react-alert-dialog` | `^1.1.15` | Alert dialog UI primitive |
| `@radix-ui/react-aspect-ratio` | `^1.1.7` | Aspect ratio UI primitive |
| `@radix-ui/react-avatar` | `^1.1.10` | Avatar UI primitive |
| `@radix-ui/react-checkbox` | `^1.3.3` | Checkbox UI primitive |
| `@radix-ui/react-collapsible` | `^1.1.12` | Collapsible UI primitive |
| `@radix-ui/react-context-menu` | `^2.2.16` | Context menu UI primitive |
| `@radix-ui/react-dialog` | `^1.1.15` | Dialog UI primitive |
| `@radix-ui/react-dropdown-menu` | `^2.1.16` | Dropdown menu UI primitive |
| `@radix-ui/react-hover-card` | `^1.1.15` | Hover card UI primitive |
| `@radix-ui/react-label` | `^2.1.7` | Label UI primitive |
| `@radix-ui/react-menubar` | `^1.1.16` | Menubar UI primitive |
| `@radix-ui/react-navigation-menu` | `^1.2.14` | Navigation menu UI primitive |
| `@radix-ui/react-popover` | `^1.1.15` | Popover UI primitive |
| `@radix-ui/react-progress` | `^1.1.7` | Progress UI primitive |
| `@radix-ui/react-radio-group` | `^1.3.8` | Radio group UI primitive |
| `@radix-ui/react-scroll-area` | `^1.2.10` | Scroll area UI primitive |
| `@radix-ui/react-select` | `^2.2.6` | Select UI primitive |
| `@radix-ui/react-separator` | `^1.1.7` | Separator UI primitive |
| `@radix-ui/react-slider` | `^1.3.6` | Slider UI primitive |
| `@radix-ui/react-slot` | `^1.2.3` | Slot composition primitive |
| `@radix-ui/react-switch` | `^1.2.6` | Switch UI primitive |
| `@radix-ui/react-tabs` | `^1.1.13` | Tabs UI primitive |
| `@radix-ui/react-toggle` | `^1.1.10` | Toggle UI primitive |
| `@radix-ui/react-toggle-group` | `^1.1.11` | Toggle group UI primitive |
| `@radix-ui/react-tooltip` | `^1.2.8` | Tooltip UI primitive |
| `axios` | `^1.12.0` | HTTP client |
| `class-variance-authority` | `^0.7.1` | Class variant helper |
| `clsx` | `^2.1.1` | Conditional class name helper |
| `cmdk` | `^1.1.1` | Command menu component |
| `embla-carousel-react` | `^8.6.0` | Carousel component |
| `express` | `^4.21.2` | Production server wrapper |
| `framer-motion` | `^12.23.22` | Animation library |
| `input-otp` | `^1.4.2` | OTP input component |
| `lucide-react` | `^0.453.0` | Icon set |
| `nanoid` | `^5.1.5` | ID generation |
| `next-themes` | `^0.4.6` | Theme helper |
| `react` | `^19.2.1` | UI framework |
| `react-day-picker` | `^9.11.1` | Date picker component |
| `react-dom` | `^19.2.1` | React DOM renderer |
| `react-hook-form` | `^7.64.0` | Form state management |
| `react-resizable-panels` | `^3.0.6` | Resizable panels |
| `recharts` | `^2.15.2` | Charting library |
| `sonner` | `^2.0.7` | Toast notifications |
| `streamdown` | `^1.4.0` | Markdown or streaming text renderer |
| `tailwind-merge` | `^3.3.1` | Tailwind class merge helper |
| `tailwindcss-animate` | `^1.0.7` | Tailwind animation utilities |
| `vaul` | `^1.1.2` | Drawer component |
| `wouter` | `^3.3.5` | Lightweight router |
| `zod` | `^4.1.12` | Schema validation |

## Development Dependencies

These packages are listed under `devDependencies` in `package.json`.

| Package | Version | Purpose |
|---|---:|---|
| `@builder.io/vite-plugin-jsx-loc` | `^0.1.1` | JSX source location Vite plugin |
| `@tailwindcss/typography` | `^0.5.15` | Tailwind typography plugin |
| `@tailwindcss/vite` | `^4.1.3` | Tailwind Vite integration |
| `@types/express` | `4.17.21` | Express TypeScript types |
| `@types/google.maps` | `^3.58.1` | Google Maps TypeScript types |
| `@types/node` | `^24.7.0` | Node.js TypeScript types |
| `@types/react` | `^19.2.1` | React TypeScript types |
| `@types/react-dom` | `^19.2.1` | React DOM TypeScript types |
| `@vitejs/plugin-react` | `^5.0.4` | React support for Vite |
| `add` | `^2.0.6` | Package helper dependency |
| `autoprefixer` | `^10.4.20` | CSS vendor prefixing |
| `esbuild` | `^0.25.0` | Server bundling and build transform |
| `pnpm` | `^10.15.1` | Package manager dependency entry |
| `postcss` | `^8.4.47` | CSS processing |
| `prettier` | `^3.6.2` | Code formatter |
| `tailwindcss` | `^4.1.14` | Utility CSS framework |
| `tsx` | `^4.19.1` | TypeScript execution helper |
| `tw-animate-css` | `^1.4.0` | Animation CSS utilities |
| `typescript` | `5.6.3` | TypeScript compiler |
| `vite` | `^7.1.7` | Development server and build tool |
| `vite-plugin-manus-runtime` | `^0.0.57` | Manus runtime integration |
| `vitest` | `^2.1.4` | Unit test runner |

## pnpm Patch and Override Metadata

The project includes pnpm-specific metadata:

```text
patchedDependencies:
  wouter@3.7.1 -> patches/wouter@3.7.1.patch

overrides:
  tailwindcss>nanoid -> 3.3.7
```

Use pnpm when possible so these settings are applied consistently.

## Ubuntu Requirements

Minimum recommended Ubuntu setup:

- Ubuntu 22.04 LTS or newer
- Node.js 20 or newer
- npm
- corepack
- pnpm 10.4.1
- git
- curl or wget
- build-essential, recommended fallback for packages that may compile native helpers
- A browser, such as Google Chrome, Chromium, or Firefox

Install system requirements:

```bash
sudo apt update
sudo apt install -y curl git build-essential ca-certificates
```

Install Node.js 20 using NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

Enable pnpm through corepack:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm --version
```

Install and run the project:

```bash
cd /path/to/pooh-kitchen
pnpm install
pnpm dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:3000/
```

Build and test on Ubuntu:

```bash
pnpm build
pnpm check
./node_modules/.bin/vitest run
```

## Windows Requirements

Minimum recommended Windows setup:

- Windows 10 or Windows 11
- PowerShell 7 or Windows PowerShell
- Node.js 20 or newer for Windows x64
- npm
- corepack
- pnpm 10.4.1
- Git for Windows
- A browser, such as Microsoft Edge, Chrome, or Firefox
- Optional: Windows Terminal for cleaner shell handling

Install requirements:

- Install Node.js 20 LTS from `https://nodejs.org/`
- Install Git for Windows from `https://git-scm.com/download/win`
- Restart PowerShell after installation so `node`, `npm`, and `git` are on `PATH`

Verify tools in PowerShell:

```powershell
node --version
npm --version
git --version
```

Enable pnpm through corepack:

```powershell
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm --version
```

Install and run the project:

```powershell
cd C:\path\to\pooh-kitchen
pnpm install
pnpm dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:3000/
```

Build and test on Windows:

```powershell
pnpm build
pnpm check
.\node_modules\.bin\vitest run
```

## Common Commands

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the Vite development server |
| `pnpm build` | Build static client assets and bundle the server wrapper |
| `pnpm start` | Start the production server from `dist/index.js` |
| `pnpm preview` | Preview the Vite build locally |
| `pnpm check` | Run TypeScript type checking |
| `pnpm format` | Format project files with Prettier |
| `./node_modules/.bin/vitest run` | Run unit tests on Ubuntu or macOS |
| `.\node_modules\.bin\vitest run` | Run unit tests on Windows PowerShell |

## Notes

- The browser game runs primarily as a Vite React app from `client/`.
- The production `build` script also bundles `server/index.ts` with esbuild.
- GitHub Pages can host the static Vite output from `dist/public`, but it cannot run the Express server.
- If port `3000` is occupied, Vite may choose another available port.
- If global `pnpm` is not available, use `corepack` or the project-local binary after installation.
