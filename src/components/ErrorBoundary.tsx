'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full">
                    <AlertTriangle className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  حدث خطأ ما | Something Went Wrong
                </h2>
                <p className="text-muted-foreground">
                  نعتذر عن الإزعاج. حدث خطأ غير متوقع.
                  <br />
                  We apologize for the inconvenience. An unexpected error occurred.
                </p>
              </div>

              {this.state.error && (
                <details className="text-left bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium mb-2">
                    تفاصيل تقنية | Technical Details
                  </summary>
                  <code className="text-xs text-red-600 break-all">
                    {this.state.error.toString()}
                  </code>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  إعادة تحميل | Reload
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  العودة للرئيسية | Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
