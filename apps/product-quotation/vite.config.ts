/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/product-quotation',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
      onwarn: (warning, warn) => {
        if (warning.code === 'UNRESOLVED_IMPORT') {
          if (warning.source?.includes('@rc-component/util')) {
            return;
          }
        }
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    include: [
      '@ant-design/icons',
      'antd',
      'react',
      'react-dom',
      'react-router-dom',
      'jspdf',
      'html2canvas',
    ],
  },
  resolve: {
    alias: {},
  },
}));
