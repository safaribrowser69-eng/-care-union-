'use client'
import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <h2 className="font-display text-xl font-bold text-navy-800 mb-2">Something Went Wrong</h2>
        <p className="text-slate-400 text-sm mb-6">We had trouble loading this page. Your donation may still have processed — check your email for confirmation.</p>
        <button onClick={reset} className="btn-primary py-2.5 px-6 text-sm mx-auto"><RefreshCw className="w-4 h-4" /> Try Again</button>
      </div>
    </div>
  )
}
