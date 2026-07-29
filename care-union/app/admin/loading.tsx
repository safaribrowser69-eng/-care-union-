export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="bg-white rounded-2xl h-28 border border-slate-100 animate-pulse" />))}</div>
      <div className="bg-white rounded-2xl h-64 border border-slate-100 animate-pulse" />
    </div>
  )
}
