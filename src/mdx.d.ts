declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { KnowledgePointMeta } from './types/content'

  const MDXComponent: ComponentType<Record<string, never>>
  export const frontmatter: KnowledgePointMeta

  export default MDXComponent
}

declare module '*.css'

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}
