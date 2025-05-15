import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server:{
    port: 3000,
    origin: "http://localhost:3000",
    host:true,
    strictPort: true,
    },
  plugins: [
    react(),
  ],
  test:{
    environment:'jsdom',
    globals:true,
    setupFiles: './src/tests/setupTests.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@hocs': path.resolve(__dirname, './src/hocs'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@routes': path.resolve(__dirname, './src/routes')
    }
  }

})
