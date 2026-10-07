import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
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
  plugins: [
    { ...mdxPlugin, enforce: 'pre' },
    react({ include: /\.(mdx|[jt]sx?)$/ }),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
