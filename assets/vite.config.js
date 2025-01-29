import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'ProductCard',
      fileName: 'product-card',
      formats: ['es']
    },
    outDir: resolve(__dirname, 'public'),
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  publicDir: resolve(__dirname, 'static'),
});