import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/

export default defineConfig({
  resolve: {
    alias: {
      '@' :'/src'
    }
  },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFile:[]
  },
  base: '/',
})
