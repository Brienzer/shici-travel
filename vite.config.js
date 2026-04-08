import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isGithubActions && repoName ? `/${repoName}/` : './',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
