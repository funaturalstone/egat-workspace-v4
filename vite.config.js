import { defineConfig } from 'vite';

// app.js awaits the login gate at module top level, which needs an ES2022 target
export default defineConfig({ build: { target: 'es2022' } });
