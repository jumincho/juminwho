import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import * as content from './src/data/profile'
import { hangulFont } from './vite-plugins/hangulFont'
import { siteMeta } from './vite-plugins/siteMeta'

// GitHub Pages serves project sites from /<repository>/; everything else uses /.
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS === 'true' && repositoryName ? `/${repositoryName}/` : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    siteMeta(content.site),
    // The source text, not the exports: it also holds the Korean inside translation functions.
    hangulFont({
      name: content.profile.nameKo,
      text: readFileSync(new URL('./src/data/profile.ts', import.meta.url), 'utf8'),
    }),
  ],
  build: {
    target: 'es2022',
  },
})
