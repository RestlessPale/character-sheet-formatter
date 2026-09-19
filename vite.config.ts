import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// The site is served from https://<org>.github.io/character-sheet-formatter/
export default defineConfig(({ mode }) => ({
  base: '/character-sheet-formatter/',
  plugins: [svelte()],
  // Under Vitest, resolve Svelte to its browser build so components can mount.
  resolve: mode === 'test' ? { conditions: ['browser'] } : undefined,
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
}));
