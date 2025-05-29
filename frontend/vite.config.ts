import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, '../backend/public'), // Output to backend/public
    emptyOutDir: true, // Clears previous build files
  },
  plugins: [
    react(),
    tailwindcss()],
});
