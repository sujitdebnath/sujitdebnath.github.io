import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to https://<username>.github.io/<repo>/, set base to '/<repo>/'.
// If deploying to https://<username>.github.io/ (a user/organization page), keep base as '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
