'use client'
import { useEffect } from 'react'
import Link from 'next/link'
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Global error:', error) }, [error])
  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 flex items-center justify-center px-5 py-20">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-3">Something Went Wrong</h1>
        <p className="text-slate-500 text-base mb-8 leading-relaxed">An unexpected error occurred. Please try again.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={reset} className="btn-primary py-3 px-7">Try Again</button>
          <Link href="/" className="btn-outline py-3 px-7">Go Home</Link>
        </div>
      </div>
    </div>
  )
}
