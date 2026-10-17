import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: './',
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('Tres') && tag !== 'TresCanvas' } } }), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
