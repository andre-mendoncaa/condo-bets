import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/condo-bets", // <- Deve estar aqui, no nível raiz
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
