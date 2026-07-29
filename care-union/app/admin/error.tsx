'use client'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Admin panel error:', error) }, [error])
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
        <h2 className="font-display text-xl font-bold text-navy-900 mb-2">Page Error</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">An error occurred while loading this admin page.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={reset} className="inline-flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"><RefreshCw className="w-3.5 h-3.5" /> Retry</button>
          <a href="/admin" className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-navy-300 text-navy-700 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"><Home className="w-3.5 h-3.5" /> Dashboard</a>
        </div>
      </div>
    </div>
  )
}
