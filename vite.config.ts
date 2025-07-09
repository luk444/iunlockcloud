import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Simple configuration without complex proxy
  },
  // Ensure proper handling of Firebase Auth URLs
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
