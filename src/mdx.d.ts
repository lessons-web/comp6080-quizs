declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { KnowledgePointMeta } from './types/content'

  const MDXComponent: ComponentType<Record<string, never>>
  export const frontmatter: KnowledgePointMeta

  export default MDXComponent
}
