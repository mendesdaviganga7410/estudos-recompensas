import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        panel: resolve(__dirname, 'panel.html'),
        study: resolve(__dirname, 'study.html'),
        comunidade: resolve(__dirname, 'comunidade.html')
      }
    }
  }
});
