declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { KnowledgeFrontmatter } from './types/content'

  const MDXComponent: ComponentType<Record<string, never>>
  export const frontmatter: KnowledgeFrontmatter

  export default MDXComponent
}
