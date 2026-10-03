import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[RouteErrorBoundary] lazy route failed:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <section className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
          <h2 className="text-xl font-semibold">页面加载失败</h2>
          <p className="mt-2 text-sm leading-6">
            路由模块未能正常加载，详情请查看控制台。请稍后刷新重试。
          </p>
          <pre className="mt-4 max-h-40 overflow-auto rounded-xl border border-rose-200 bg-white/70 p-3 text-xs leading-5 text-rose-800">
            {this.state.error.message}
          </pre>
        </section>
      )
    }
    return this.props.children
  }
}
