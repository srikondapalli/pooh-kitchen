# Pooh's Honey Kitchen

A 2D, top-down Overcooked-style cooking game built with React 19 + TypeScript + Vite + Tailwind 4. Cook orders for Pooh's Hundred Acre kitchen across three difficulty tiers, manage chopping/cooking/washing pipelines, and chase the high score.

- Arrow keys move
- `D` picks up or places items
- `W` chops or washes
- `Esc` pauses

The game logic lives in `client/src/lib/gameEngine.ts` (a single reducer), rendered to a `<canvas>` by `client/src/components/GameCanvas.tsx`. Static map, recipes, and ingredient stats live in `client/src/lib/gameConstants.ts`. There is no backend; everything runs in the browser.

---

## How to play

### Stations
- **Crate (`📦`)** - holds one fixed ingredient. Press `D` to pick it up. If you're holding a plate, raw-edible ingredients (honey, berry) get added to the plate directly.
- **Chopping board (`🔪`)** - press `D` to place a raw ingredient that needs chopping. Press `W` to chop. Press `D` while holding a plate to transfer the chopped ingredient onto the plate.
- **Stove (`🔥`)** - press `D` to place a raw ingredient that needs cooking. It cooks automatically. Press `D` while holding a plate to transfer the cooked ingredient onto the plate. Watch the progress bar: blue -> orange -> green (eat-window) -> yellow (about to burn) -> red (burned).
- **Plate stack (`🍽️`)** - press `D` with empty hands to grab a clean plate. Press `D` while holding an ingredient to immediately plate it. There is a second plate stack right next to the serve window for fast pickups.
- **Sink (`🚰`)** - press `W` with empty hands when a dirty plate is queued to auto-wash. Plates trickle back into the dirty queue a few seconds after each serve.
- **Serve window (`🪟`)** - press `D` with a finished plate. Matched orders pay points (with tip bonus and combo multiplier); unmatched serves lose points but the plate is refunded as dirty.
- **Trash (`🗑️`)** - press `D` to discard a held item. Plates are refunded as dirty, never destroyed.

### Crate layout (stable, 9 crates, one ingredient each)

Each crate position always exposes the same ingredient. The list never changes during a run.

| Crate | Position | Ingredient |
|-------|----------|------------|
| 0 | row 10, col 1 | 🍯 honey |
| 1 | row 10, col 5 | 🍞 bread |
| 2 | row 10, col 9 | 🥬 lettuce |
| 3 | row 10, col 13 | 🍅 tomato |
| 4 | row 12, col 1 | 🥩 meat |
| 5 | row 12, col 7 | 🥕 carrot |
| 6 | row 12, col 10 | 🫐 blueberry |
| 7 | row 12, col 13 | 🍉 watermelon |
| 8 | row 12, col 18 | 🍓 strawberry |

### Recipes

| Dish | Ingredients | Points | Time |
|------|-------------|--------|------|
| Honey Toast 🍯🍞 | cooked bread, raw honey | 50 | 35 s |
| Salad 🥗 | chopped lettuce, chopped tomato | 60 | 30 s |
| Honey Burger 🍔 | cooked bread, cooked meat, chopped lettuce | 120 | 50 s |
| Berry Bowl 🫐🍯 | raw blueberry, raw honey | 40 | 25 s |
| Carrot Soup 🥣 | chopped+cooked carrot, chopped tomato | 80 | 40 s |
| Fruit Cake 🎂 (final challenge) | chopped watermelon, raw blueberry, chopped strawberry | 150 | 55 s |

Carrots must be **chopped first, then cooked**: the engine tracks a composite `chopped_cooked` state. The stove refuses raw carrots and tells you to chop them first.

### Canonical flow (Honey Toast)

```
D at bread crate (row 10, col 5)  -> hold raw bread
D at any stove                    -> bread starts cooking
                                     wait until the progress bar turns green
D at plate stack (row 9 col 16
   or row 2 col 17)               -> hold empty plate
D at the stove                    -> cooked bread is added to the plate
D at honey crate (row 10, col 1)  -> raw honey is added to the plate
D at serve window (row 1, col 16) -> Honey Toast delivered
```

### Controls

- Arrow keys = move
- `D` = pick up / place / serve / trash / add to plate (context-sensitive)
- `W` = chop or wash (start an action at chopping board or sink)
- `Esc` = pause

### Difficulty

| Mode | Game length | Max concurrent orders | Spawn interval | Starting plates |
|------|-------------|-----------------------|----------------|-----------------|
| Easy | 3:30 | 3 | 14 s | 6 |
| Medium | 2:30 | 4 | 10 s | 4 |
| Hard | 2:00 | 5 | 7 s | 3 |

Hard mode soft-locks are prevented: trashed plates and wrong serves both come back through the dirty-plate queue, so plate supply cannot leak.

---

## Run from the terminal

### Prerequisites
- Node.js >= 20 (Vite 7 requirement)
- `npm` (ships with Node) or `pnpm`/`yarn` if preferred. The repo is set up for `pnpm` but `npm` works equally well.

### 1. Install dependencies
```bash
# from the repo root
npm install
# or, if you prefer the configured package manager:
pnpm install
```

### 2. Start the dev server (hot reload)
```bash
npm run dev
```
Vite prints the URL on startup:
```
  VITE v7.1.9  ready in 540 ms
  > Local:   http://localhost:3000/
  > Network: http://<your-lan-ip>:3000/
```
Open the printed URL in any modern browser. If port `3000` is taken, Vite automatically falls through to `3001`, `3002`, etc.

To bind a specific port:
```bash
npm run dev -- --port 5173
```

To stop the dev server: press `Ctrl+C` in the terminal that is running it (or `kill <PID>` if it was backgrounded).

### 3. Run the unit tests
```bash
npx vitest run
# or watch mode:
npx vitest
```

### 4. Type-check without emitting
```bash
npm run check          # alias for `tsc --noEmit`
```

### 5. Production build
```bash
npm run build          # outputs static assets to dist/public + server bundle to dist/
npm run preview        # serves the production build locally for verification
```
`npm run preview` boots Vite's static preview server on (typically) `http://localhost:4173/`.

### 6. Run the bundled production server (optional)
The repo also ships a tiny Express server (`server/index.ts`) that serves the built `dist/public/` folder, useful for a single-host deploy.
```bash
npm run build
NODE_ENV=production node dist/index.js   # equivalent to: npm start
# Server runs on http://localhost:3000/ (override with PORT=8080 ...)
```

---

## Host the source on Git

### 1. One-time local setup
The repo already has a `.gitignore` (covers `node_modules/`, `dist/`, logs). Initialize git if it's not already:
```bash
cd /Users/sriharshak/Downloads/pooh-kitchen   # or wherever the repo lives
git init -b main
git add .
git commit -m "Initial commit: Pooh's Honey Kitchen"
```

### 2. Create the remote repository

Pick one provider. All three workflows are equivalent for this project.

**GitHub via the `gh` CLI** (fastest, creates the remote and pushes in one step):
```bash
# install once: brew install gh && gh auth login
gh repo create pooh-kitchen --public --source=. --remote=origin --push
```

**GitHub via the web UI**:
1. Go to https://github.com/new
2. Name the repo `pooh-kitchen`, leave "Initialize with README" unchecked
3. Click "Create repository"
4. Copy the SSH or HTTPS URL it shows you, then run:
   ```bash
   git remote add origin git@github.com:<your-username>/pooh-kitchen.git
   git push -u origin main
   ```

**GitLab / Bitbucket**: same flow, replace the host in the remote URL:
```bash
git remote add origin git@gitlab.com:<you>/pooh-kitchen.git
git push -u origin main
```

### 3. Daily workflow
```bash
git status                          # see what changed
git add <files>                     # stage
git commit -m "Describe the change" # commit
git push                            # publish to the remote
```

For larger changes use a branch:
```bash
git checkout -b feature/new-recipe
# ... edits, tests ...
git push -u origin feature/new-recipe
# open a Pull Request on GitHub/GitLab
```

### 4. Host the playable build on GitHub Pages (free, optional)

Because this is a 100% static frontend, the production build can go straight to GitHub Pages.

1. Add a base path to `vite.config.ts` so asset URLs work under `/<repo-name>/`:
   ```ts
   // vite.config.ts
   export default defineConfig({
     base: "/pooh-kitchen/",
     // ... existing plugins
   });
   ```
2. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   permissions:
     contents: read
     pages: write
     id-token: write
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: "20" }
         - run: npm ci
         - run: npx vite build
         - uses: actions/upload-pages-artifact@v3
           with: { path: dist/public }
         - uses: actions/deploy-pages@v4
   ```
3. In the GitHub repo Settings -> Pages, set "Source" to "GitHub Actions".
4. Push to `main`. The site will be available at `https://<your-username>.github.io/pooh-kitchen/`.

### 5. Alternative hosts (zero-config)
The contents of `dist/public/` are a plain static bundle. Drop them on any static host:
- **Vercel**: `vercel --prod` from the repo root.
- **Netlify**: `netlify deploy --build --dir=dist/public --prod`.
- **Cloudflare Pages**: connect the repo, set build command `npx vite build` and output directory `dist/public`.

---

## Stack Overview
- Client-only routing powered by React + Wouter.
- Design tokens live entirely in `client/src/index.css`—keep that file intact.

## File Structure

```
client/
  public/       ← Small configuration files ONLY (favicon.ico, robots.txt). DO NOT put images/media here.
  src/
    pages/      ← Page-level components
    components/ ← Reusable UI & shadcn/ui
    contexts/   ← React contexts
    hooks/      ← Custom React hooks
    lib/        ← Utility helpers
    App.tsx     ← Routes & top-level layout
    main.tsx    ← React entry point
    index.css   ← global style
server/         ← Placeholder for imported template compatibility
shared/         ← Placeholder for imported template compatibility
  const.ts      ← Shared constants
```

### ⚠️ Handling Images & Media

**DO NOT** store images, videos, or large assets in `client/public/` or `client/src/assets/`. Local media files will cause deployment timeouts.

**Required workflow:**
1. Upload assets using the CLI: `manus-upload-file --webdev path/to/image.png`
2. Use the returned storage path directly in your code: `<img src="/manus-storage/image_a1b2c3d4.png" />`
3. Store the original local file in `/home/ubuntu/webdev-static-assets/` (outside the project directory)

Only small configuration files like `favicon.ico`, `robots.txt`, and `manifest.json` belong in `client/public/`.

Files in `client/public` are available at the root of your site—reference them with absolute paths (`/robots.txt`, etc.) from HTML templates, JSX, or meta tags.

---

## 🎯 Development Workflow

1. **Choose a design style** before you write any frontend code according to Design Guide (color, font, shadow, art style). Tell user what you chose. Remember to edit `client/src/index.css` for global theming and add needed font using google font cdn in `client/index.html`.
2. **Compose pages** in `client/src/pages/`. Keep sections modular so they can be reused across routes.
3. **Share primitives** via `client/src/components/`—extend shadcn/ui when needed instead of duplicating markup.
4. **Keep styling consistent** by relying on existing Tailwind tokens (spacing, colors, typography).
5. **Fetch external data** with `useEffect` if the site needs dynamic content from public APIs.
---

## 🎨 Frontend Development Guidelines

**UI & Styling:**
- Prefer shadcn/ui components for interactions to keep a modern, consistent look; import from `@/components/ui/*` (e.g., `button`, `card`, `dialog`).
- Compose Tailwind utilities with component variants for layout and states; avoid excessive custom CSS. Use built-in `variant`, `size`, etc. where available.
- Preserve design tokens: keep the `@layer base` rules in `client/src/index.css`. Utilities like `border-border` and `font-sans` depend on them.
- Consistent design language: use spacing, radius, shadows, and typography via tokens. Extract shared UI into `components/` for reuse instead of copy‑paste.
- Accessibility and responsiveness: keep visible focus rings and ensure keyboard reachability; design mobile‑first with thoughtful breakpoints.
- Theming: Choose dark/light theme to start with for ThemeProvider according to your design style (dark or light bg), then manage colors pallette with CSS variables in `client/src/index.css` instead of hard‑coding to keep global consistency.
- Micro‑interactions and empty states: add motion, empty states, and icons tastefully to improve quality without distracting from content.
- Navigation: For internal tools/admin panels, use persistent sidebar. For public-facing apps, design navigation based on content structure (top nav, side nav, or contextual)—ensure clear escape routes from all pages.
- Placeholder UI elements: When adding structural placeholders (nav items, CTAs) for not-yet-implemented features, show toast on click ("Feature coming soon"). Inform user which elements are placeholders when presenting work.

**React Best Practices:**
- Never call setState/navigation in render phase → wrap in `useEffect`

**Customized Defaults:**
This template customizes some Tailwind/shadcn defaults for simplified usage:
- `.container` is customized to auto-center and add responsive padding (see `index.css`). Use directly without `mx-auto`/`px-*`. For custom widths, use `max-w-*` with `mx-auto px-4`.
- `.flex` is customized to have `min-width:0` and `min-height:0` by default
- `button` variant `outline` uses transparent background (not `bg-background`). Add bg color class manually if needed.

---

## 🎨 Design Guide

When generating frontend UI, avoid generic patterns that lack visual distinction:
- Avoid generic full-page centered layouts—prefer asymmetric/sidebar/grid structures for landing pages and dashboards
- When user provides vague requirements, make creative design decisions (choose specific color palette, typography, layout approach)
- Prioritize visual diversity: combine different design systems (e.g., one color scheme + different typography + another layout principle)
- For landing pages: prefer asymmetric layouts, specific color values (not just "blue"), and textured backgrounds over flat colors
- For dashboards: use defined spacing systems, soft shadows over borders, and accent colors for hierarchy

---

## Animation Guide

Bake motion taste in from the first line of code. Snappy, physically intuitive interactions are not a polish pass — they are part of the initial build.
- Decide whether to animate at all: keyboard-initiated actions (command palettes, shortcuts) must be instant — never animate them. High-frequency interactions (hover, list nav) should be minimal. Reserve richer motion for occasional events (modals, drawers, toasts) and rare delight moments (onboarding).
- Keep UI animations under 300ms. A 180ms dropdown feels significantly better than a 400ms one. Typical ranges: button press 100–160ms, tooltips 125–200ms, dropdowns 150–250ms, modals/drawers 200–500ms.
- Use strong custom easings, not the weak CSS defaults. Default to a snappy ease-out for entering/exiting UI: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);`. For moving/morphing use `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);`. NEVER use `ease-in` for UI animations — it feels sluggish.
- Buttons must feel responsive: add `transform: scale(0.97)` on `:active` with a ~160ms ease-out transition so the UI confirms it heard the user.
- Never animate from `scale(0)` — nothing in the real world appears from nothing. Start from `scale(0.95)` combined with `opacity: 0`.
- Origin-aware popovers/dropdowns: scale in from the trigger point (e.g. `transform-origin: var(--radix-popover-content-transform-origin)`). Modals are the exception and stay centered.
- Prefer CSS transitions over @keyframes for dynamic UI state. Transitions can be interrupted and reversed smoothly mid-flight; keyframes restart from zero and feel broken when interrupted.
- Only animate `transform` and `opacity` for motion — they run on the GPU and skip layout/paint. Avoid animating `width`, `height`, `padding`, `margin`, `top/left` unless absolutely necessary.
- Stagger grouped entrances by 30–80ms per item to create a cascading reveal instead of a wall of motion.
- Asymmetric timing for deliberate actions: hold-to-confirm should be slow and linear on press (e.g. 2s linear), but release/cancel should snap back fast (~200ms ease-out).
- Respect `prefers-reduced-motion`: gate non-essential motion behind `@media (prefers-reduced-motion: no-preference)`.

---

## Pre-built Components

Before implementing UI features, check if these components already exist:

Maps:
- `client/src/components/Map.tsx` - Google Maps integration with proxy authentication. Provides MapView component with onMapReady callback for initializing Google Maps services (Places, Geocoder, Directions, Drawing, etc.). All map functionality works directly in the browser.

When implementing features that match these categories, MUST evaluate the component first to decide whether to use or customize it.

---

## 🗺️ Maps Integration

**CRITICAL: The Manus proxy provides FULL access to ALL Google Maps features** - including advanced drawing, heatmaps, Street View, all layers, Places API, etc. Do NOT ask users for Google Map API keys - authentication is automatic.

**Implementation:**
- Frontend: Import MapView from `client/src/components/Map.tsx` and initialize ANY Google Maps service (geocoding, directions, places, drawing, visualization, geometry, etc.) in the onMapReady callback. ALL Google Maps JavaScript API features work directly in the browser.

NEVER use external map libraries or request API keys from users - the Manus proxy handles everything automatically with no feature limitations.

---

## ✅ Launch Checklist
- [ ] UI layout and navigation structure correct, all image src valid.
- [ ] Success + error paths verified in the browser

---

## Core File References

`package.json`
```tsx
{
  "name": "pooh-kitchen",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "preview": "vite preview --host",
    "check": "tsc --noEmit",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "axios": "^1.12.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "embla-carousel-react": "^8.6.0",
    "express": "^4.21.2",
    "framer-motion": "^12.23.22",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.453.0",
    "nanoid": "^5.1.5",
    "next-themes": "^0.4.6",
    "react": "^19.2.1",
    "react-day-picker": "^9.11.1",
    "react-dom": "^19.2.1",
    "react-hook-form": "^7.64.0",
    "react-resizable-panels": "^3.0.6",
    "recharts": "^2.15.2",
    "sonner": "^2.0.7",
    "streamdown": "^1.4.0",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.2",
    "wouter": "^3.3.5",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@builder.io/vite-plugin-jsx-loc": "^0.1.1",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.1.3",
    "@types/express": "4.17.21",
    "@types/google.maps": "^3.58.1",
    "@types/node": "^24.7.0",
    "@types/react": "^19.2.1",
    "@types/react-dom": "^19.2.1",
    "@vitejs/plugin-react": "^5.0.4",
    "add": "^2.0.6",
    "autoprefixer": "^10.4.20",
    "esbuild": "^0.25.0",
    "pnpm": "^10.15.1",
    "postcss": "^8.4.47",
    "prettier": "^3.6.2",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.19.1",
    "tw-animate-css": "^1.4.0",
    "typescript": "5.6.3",
    "vite": "^7.1.7",
    "vite-plugin-manus-runtime": "^0.0.57",
    "vitest": "^2.1.4"
  },
  "packageManager": "pnpm@10.4.1+sha512.c753b6c3ad7afa13af388fa6d808035a008e30ea9993f58c6663e2bc5ff21679aa834db094987129aa4d488b86df57f7b634981b2f827cdcacc698cc0cfb88af",
  "pnpm": {
    "patchedDependencies": {
      "wouter@3.7.1": "patches/wouter@3.7.1.patch"
    },
    "overrides": {
      "tailwindcss>nanoid": "3.3.7"
    }
  }
}
```

`client/src/App.tsx`
```tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
```

`client/src/pages/Home.tsx`
```tsx
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Streamdown } from 'streamdown';

/**
 * All content in this page are only for example, replace with your own feature implementation
 * When building pages, remember your instructions in Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  // If theme is switchable in App.tsx, we can implement theme toggling like this:
  // const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* Example: lucide-react for icons */}
        <Loader2 className="animate-spin" />
        Example Page
        {/* Example: Streamdown for markdown rendering */}
        <Streamdown>Any **markdown** content</Streamdown>
        <Button variant="default">Example Button</Button>
      </main>
    </div>
  );
}
```

`client/src/index.css`
```tsx
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

:root {
  --primary: var(--color-blue-700);
  --primary-foreground: var(--color-blue-50);
  --sidebar-primary: var(--color-blue-600);
  --sidebar-primary-foreground: var(--color-blue-50);
  --chart-1: var(--color-blue-300);
  --chart-2: var(--color-blue-500);
  --chart-3: var(--color-blue-600);
  --chart-4: var(--color-blue-700);
  --chart-5: var(--color-blue-800);
  --radius: 0.65rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.235 0.015 65);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.235 0.015 65);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.235 0.015 65);
  --secondary: oklch(0.98 0.001 286.375);
  --secondary-foreground: oklch(0.4 0.015 65);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.141 0.005 285.823);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.623 0.214 259.815);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.235 0.015 65);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.141 0.005 285.823);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.623 0.214 259.815);
}

.dark {
  --primary: var(--color-blue-700);
  --primary-foreground: var(--color-blue-50);
  --sidebar-primary: var(--color-blue-500);
  --sidebar-primary-foreground: var(--color-blue-50);
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.85 0.005 65);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.85 0.005 65);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.85 0.005 65);
  --secondary: oklch(0.24 0.006 286.033);
  --secondary-foreground: oklch(0.7 0.005 65);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground:  oklch(0.92 0.005 65);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.488 0.243 264.376);
  --chart-1: var(--color-blue-300);
  --chart-2: var(--color-blue-500);
  --chart-3: var(--color-blue-600);
  --chart-4: var(--color-blue-700);
  --chart-5: var(--color-blue-800);
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.85 0.005 65);
  --sidebar-accent: oklch(0.274 0.006 286.033);
  --sidebar-accent-foreground:  oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.488 0.243 264.376);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  button:not(:disabled),
  [role="button"]:not([aria-disabled="true"]),
  [type="button"]:not(:disabled),
  [type="submit"]:not(:disabled),
  [type="reset"]:not(:disabled),
  a[href],
  select:not(:disabled),
  input[type="checkbox"]:not(:disabled),
  input[type="radio"]:not(:disabled) {
    @apply cursor-pointer;
  }
}

@layer components {
  /**
   * Custom container utility that centers content and adds responsive padding.
   *
   * This overrides Tailwind's default container behavior to:
   * - Auto-center content (mx-auto)
   * - Add responsive horizontal padding
   * - Set max-width for large screens
   *
   * Usage: <div className="container">...</div>
   *
   * For custom widths, use max-w-* utilities directly:
   * <div className="max-w-6xl mx-auto px-4">...</div>
   */
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem; /* 16px - mobile padding */
    padding-right: 1rem;
  }

  .flex {
    min-height: 0;
    min-width: 0;
  }

  @media (min-width: 640px) {
    .container {
      padding-left: 1.5rem; /* 24px - tablet padding */
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .container {
      padding-left: 2rem; /* 32px - desktop padding */
      padding-right: 2rem;
      max-width: 1280px; /* Standard content width */
    }
  }
}
```

`client/index.html`
```tsx
<!doctype html>
<html lang="en">

  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>{{project_title}}</title>    
    <!-- THIS IS THE START OF A COMMENT BLOCK, BLOCK TO BE DELETED: Google Fonts here, example:
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    THIS IS THE END OF A COMMENT BLOCK, BLOCK TO BE DELETED -->
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    <script
      defer
      src="%VITE_ANALYTICS_ENDPOINT%/umami"
      data-website-id="%VITE_ANALYTICS_WEBSITE_ID%"></script>
  </body>

</html>
```

`server/index.ts`
```tsx
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
```
---

## Common Pitfalls

### Infinite loading loops from unstable references
**Anti-pattern:** Creating new objects/arrays in render that are used as query inputs
```tsx
// ❌ Bad: New Date() creates new reference every render → infinite queries
const { data } = trpc.items.getByDate.useQuery({
  date: new Date(), // ← New object every render!
});

// ❌ Bad: Array/object literals in query input
const { data } = trpc.items.getByIds.useQuery({
  ids: [1, 2, 3], // ← New array reference every render!
});
```

**Correct approach:** Stabilize references with useState/useMemo
```tsx
// ✅ Good: Initialize once with useState
const [date] = useState(() => new Date());
const { data } = trpc.items.getByDate.useQuery({ date });

// ✅ Good: Memoize complex inputs
const ids = useMemo(() => [1, 2, 3], []);
const { data } = trpc.items.getByIds.useQuery({ ids });
```

**Why this happens:** TRPC queries trigger when input references change. Objects/arrays created in render have new references each time, causing infinite re-fetches.

### Navigation dead-ends in subpages
**Problem:** Creating nested routes without escape routes—no header nav, no sidebar, no back button.

**Root cause:** Implementing individual pages before establishing global layout structure.

**Solution:** Define layout wrapper in App.tsx first, then build pages inside it. For admin tools use DashboardLayout; for detail pages add back button with `router.back()`.

### Invisible text from theme/color mismatches

**Root cause:** Semantic colors (`bg-background`, `text-foreground`) are CSS variables that resolve based on ThemeProvider's active theme. Mismatches cause invisible text.

**Two critical rules:**

1. **Match theme to CSS variables:** If `defaultTheme="dark"` in App.tsx, ensure `.dark {}` in index.css has dark background + light foreground values
2. **Always pair bg with text:** When using `bg-{semantic}`, MUST also use `text-{semantic}-foreground` (not automatic - text inherits from parent otherwise)

**Quick reference:**
```tsx
// ✅ Theme + CSS alignment
<ThemeProvider defaultTheme="dark">  {/* Must match .dark in index.css */}
  <div className="bg-background text-foreground">...</div>
</ThemeProvider>

// ✅ Required class pairs
<div className="bg-popover text-popover-foreground">...</div>
<div className="bg-card text-card-foreground">...</div>
<div className="bg-accent text-accent-foreground">...</div>
```

### Nested anchor tags in Link components
**Problem:** Wrapping `<a>` tags inside another `<a>` or wouter's `<Link>` creates nested anchors and runtime errors.

**Solution:** Pass children directly to Link—it already renders an `<a>` internally.
```tsx
// ❌ Bad: <Link><a>...</a></Link> or <a><a>...</a></a>
// ✅ Good: <Link>...</Link> or just <a>...</a>
```
### Empty `Select.Item` values

**Rule:** Every `<Select.Item>` must have a non-empty `value` prop—never `""`, `undefined`, or omitted.

**Rule:** Use sonner for toasts; do not add react-toastify or @radix-ui/react-toast

**Rule:** If you put placeholder components for App.tsx routes, you MUST replace them with actual components after your implementation.
