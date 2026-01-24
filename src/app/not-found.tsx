import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | الصفحة غير موجودة - Vintage Point',
  description: 'The page you are looking for could not be found. | الصفحة التي تبحث عنها غير موجودة - فينتج بوينت',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-black/30">
      <div className="text-center px-4">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gold-600 to-gold-400 text-black font-bold text-5xl mx-auto">
          VP
        </div>
        <h1 className="mb-4 text-3xl font-bold text-gold-400">
          404 - الصفحة غير موجودة
        </h1>
        <p className="mb-2 text-xl text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير موجودة
        </p>
        <p className="mb-8 text-muted-foreground text-sm">
          Sorry, the page you are looking for could not be found.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3 text-base font-semibold text-black hover:bg-gold-600 transition-colors"
          >
            العودة للرئيسية | Back to Home
          </a>
          <a
            href="/#cars"
            className="inline-flex items-center justify-center rounded-full border-2 border-gold-500/50 px-8 py-3 text-base font-semibold text-gold-500 hover:bg-gold-500/10 transition-colors"
          >
            تصفح السيارات | Browse Cars
          </a>
        </div>
      </div>
    </div>
  )
}
