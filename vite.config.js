import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'server/dist'), // Chemin où les fichiers de production seront générés
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // Rediriger les requêtes /api vers le serveur backend
    },
  },
});
