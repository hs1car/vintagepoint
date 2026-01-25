'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Admin Error</h1>
          <p className="text-sm text-muted-foreground">
            An error occurred in the admin panel. Please try again or return to login.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="gap-2"
            variant="default"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="gap-2"
          >
            <Link href="/admin/login">
              <LogIn className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-6 p-4 bg-muted rounded-lg text-left">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-muted-foreground mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
