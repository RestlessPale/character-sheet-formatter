# Contributing

## Workflow

1. Branch off `main` and make your changes (`npm run dev` for a live-reloading dev server).
2. Before pushing run `npm run format`, `npm run lint`, `npm run check` and `npm test`.
3. Open a pull request. The **CI** workflow runs the same checks plus a production build.
4. Merging to `main` triggers the **Deploy to GitHub Pages** workflow, which publishes `dist/`.
   Never push build output to a `gh-pages` branch by hand.

## GitHub Pages setup (once per repository)

In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Pages and Actions are free for public repositories. The site is served from
`/character-sheet-formatter/`, which is configured through `base` in `vite.config.ts` and must match
the repository name.
