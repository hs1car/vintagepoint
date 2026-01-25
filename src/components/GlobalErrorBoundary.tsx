'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Global Error Boundary
 * Catches all React errors and prevents white screen
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to error reporting service
    console.error('Global Error Boundary caught:', error, errorInfo)
    
    // In production, send to error tracking (Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      // Example: Sentry.captureException(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
          <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  حدث خطأ غير متوقع
                </h1>
                <p className="text-gray-400">
                  Something Went Wrong
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full p-4 bg-red-950/30 rounded-lg border border-red-900/30">
                  <p className="text-xs text-red-300 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-3 w-full">
                <Button
                  onClick={() => this.setState({ hasError: false })}
                  className="flex-1 bg-gold-600 hover:bg-gold-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة المحاولة
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  الرئيسية
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Error ID: {Date.now().toString(36)}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
