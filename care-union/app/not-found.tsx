import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 flex items-center justify-center px-5 py-20">
      <div className="text-center max-w-md">
        <div className="font-display text-9xl font-black text-navy-100 leading-none select-none mb-6">404</div>
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-3">Page Not Found</h1>
        <p className="text-slate-500 text-base mb-10 leading-relaxed">The page you're looking for doesn't exist or may have been moved.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/" className="btn-primary py-3 px-7">Go Home</Link>
          <Link href="/campaigns" className="btn-outline py-3 px-7">Browse Campaigns</Link>
        </div>
      </div>
    </div>
  )
}
