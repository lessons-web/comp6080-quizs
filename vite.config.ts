import { fileURLToPath, URL } from 'node:url'

import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vitest/config'

const mdxPlugin = mdx({
  remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
})

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    { ...mdxPlugin, enforce: 'pre' },
    react({ include: /\.(mdx|[jt]sx?)$/ }),
  ],
  resolve: {
    alias: [
      { find: '@/content', replacement: fileURLToPath(new URL('./content', import.meta.url)) },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
