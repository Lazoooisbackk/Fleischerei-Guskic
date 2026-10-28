import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    rollupOptions: { input: { main: resolve(__dirname, 'index.html'), impressum: resolve(__dirname, 'impressum.html'), datenschutz: resolve(__dirname, 'datenschutz.html'), notfound: resolve(__dirname, '404.html') } },
  },
  server: { port: 5174 },
});
