# The Restless Pale Character Sheet Formatter

A small web tool that helps new players fill in their character application and copies it as a
Discord-formatted message.

Live site: https://restlesspale.github.io/character-sheet-formatter/

## Development

Requires Node 18.18 or newer (Node 22 is used in CI, see `.nvmrc`).

```bash
npm install
npm run dev      # dev server with hot reload
npm run check    # type-check (svelte-check)
npm run lint     # ESLint
npm run format   # Prettier
npm test         # unit tests (Vitest)
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Built with [Svelte 5](https://svelte.dev), TypeScript and [Vite](https://vite.dev).

## Project layout

| Path                      | What lives there                                                  |
| ------------------------- | ----------------------------------------------------------------- |
| `src/lib/fields.ts`       | Every form field (title, limits, messages) and the section layout |
| `src/lib/options.ts`      | Dropdown options (nationalities, sexualities, roles, ...)         |
| `src/lib/validation.ts`   | Pure validation helpers                                           |
| `src/lib/sheet.ts`        | Builds the text that gets copied                                  |
| `src/lib/storage.ts`      | Saves the form in `localStorage` (and migrates the old format)    |
| `src/lib/state.svelte.ts` | Reactive form state                                               |
| `src/components/`         | UI components                                                     |
| `tests/`                  | Vitest tests, including parity checks against the original logic  |

To add or change a question, edit `src/lib/fields.ts` (and `src/lib/sheet.ts` if it appears in the
copied sheet).

## Deployment

Pushing to `main` builds and deploys the site to GitHub Pages through
`.github/workflows/deploy.yml`. Pull requests run `.github/workflows/ci.yml` (format, lint,
type-check, tests, build) without deploying. See [CONTRIBUTING.md](CONTRIBUTING.md).
