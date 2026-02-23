import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/superzavr-dress/",
  plugins: [react()],
  server: {
    host: true,
  },
})