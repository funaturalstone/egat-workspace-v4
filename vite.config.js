import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// index.html = landing page, app.html = workspace.
// app.js awaits the login gate at module top level, which needs an ES2022 target.
export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), app: resolve(import.meta.dirname, 'app.html') } },
  },
});
