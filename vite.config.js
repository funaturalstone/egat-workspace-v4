import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// index.html = landing page, app.html = workspace served as /app (Vercel cleanUrls in production).
// app.js awaits the login gate at module top level, which needs an ES2022 target.
const cleanUrls = {
  name: 'clean-urls',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/app' || req.url.startsWith('/app?')) req.url = '/app.html' + req.url.slice(4);
      next();
    });
  },
};
const previewCleanUrls = { ...cleanUrls, name: 'clean-urls-preview', configureServer: undefined, configurePreviewServer: cleanUrls.configureServer };

export default defineConfig({
  plugins: [cleanUrls, previewCleanUrls],
  build: {
    target: 'es2022',
    rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), app: resolve(import.meta.dirname, 'app.html') } },
  },
});
