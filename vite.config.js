import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: '/' para desarrollo local. Si se despliega en GitHub Pages se puede
// sobreescribir con: VITE_BASE=/nombre-del-repo/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
});
