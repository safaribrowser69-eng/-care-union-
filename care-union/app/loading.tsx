export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-navy-700 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}
