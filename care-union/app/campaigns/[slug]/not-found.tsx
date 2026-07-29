import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
export default function CampaignNotFound() {
  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 flex items-center justify-center px-5 py-20">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-3">Campaign Not Found</h1>
        <p className="text-slate-500 text-base mb-10 leading-relaxed">This campaign doesn't exist or may have been closed. Browse our active campaigns instead.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/campaigns" className="inline-flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-navy hover:-translate-y-0.5"><Search className="w-4 h-4" /> Browse Campaigns</Link>
          <Link href="/" className="inline-flex items-center gap-2 border-2 border-navy-200 text-navy-700 hover:bg-navy-50 font-semibold px-6 py-3 rounded-xl transition-all"><ArrowLeft className="w-4 h-4" /> Go Home</Link>
        </div>
      </div>
    </div>
  )
}
