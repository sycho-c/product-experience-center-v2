import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: '/product-experience-center-v2/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: false,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 200,
    },
  },
});
