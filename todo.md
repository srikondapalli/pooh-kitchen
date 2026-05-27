# GitHub Pages Hosting TODO

The game is browser-capable, but the folder is not fully ready for GitHub Pages hosting yet. Complete these items before publishing.

## Required Fixes

- [ ] Add a GitHub Pages base path in `/Users/sriharshak/Downloads/pooh-kitchen/vite.config.ts`.

If the GitHub repository is named `pooh-kitchen`, use:

```ts
export default defineConfig({
  base: "/pooh-kitchen/",
  plugins,
  // existing config...
});
```

If the GitHub repository is named `YOUR_USERNAME.github.io`, use:

```ts
export default defineConfig({
  base: "/",
  plugins,
  // existing config...
});
```

- [ ] Remove unresolved analytics placeholders from `/Users/sriharshak/Downloads/pooh-kitchen/client/index.html`, unless real build-time environment variables will be provided.

Current placeholder block:

```html
<script
  defer
  src="%VITE_ANALYTICS_ENDPOINT%/umami"
  data-website-id="%VITE_ANALYTICS_WEBSITE_ID%"></script>
```

- [ ] Add a GitHub Actions workflow at `/Users/sriharshak/Downloads/pooh-kitchen/.github/workflows/deploy.yml`.

Recommended workflow:

```yaml
name: Deploy Pooh Kitchen to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.4.1

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## GitHub Settings

- [ ] Push the repository to GitHub.
- [ ] Open the GitHub repository settings.
- [ ] Go to `Pages`.
- [ ] Set `Build and deployment` to `GitHub Actions`.
- [ ] Push to `main` and wait for the deployment workflow to complete.

## Expected Browser URL

If the GitHub repository is:

```text
https://github.com/YOUR_USERNAME/pooh-kitchen
```

then the GitHub Pages URL should be:

```text
https://YOUR_USERNAME.github.io/pooh-kitchen/
```

If the GitHub repository is:

```text
https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io
```

then the GitHub Pages URL should be:

```text
https://YOUR_USERNAME.github.io/
```

## Notes

- GitHub Pages can host the static Vite build from `/Users/sriharshak/Downloads/pooh-kitchen/dist/public`.
- GitHub Pages cannot run the Express server from `/Users/sriharshak/Downloads/pooh-kitchen/server/index.ts`.
- The game should work as a static browser app if it does not depend on server-only APIs.
- Run `pnpm build` locally before pushing if possible.
