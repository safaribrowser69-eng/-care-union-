'use client'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Share2, Download, Heart, ArrowRight, Instagram } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

let launchConfetti: (() => void) | null = null
if (typeof window !== 'undefined') {
  import('canvas-confetti').then(mod => {
    const confetti = mod.default
    launchConfetti = () => {
      const end = Date.now() + 3000
      const colors = ['#1B3A6B', '#2E7D32', '#C8960C']
      const frame = () => {
        if (Date.now() > end) return
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
        requestAnimationFrame(frame)
      }
      frame()
    }
  }).catch(() => {})
}

function ThankYouContent() {
  const params = useSearchParams()
  const receipt = params.get('receipt')
  const name = params.get('name') || 'Friend'
  const amount = parseFloat(params.get('amount') || '0')

  useEffect(() => { const t = setTimeout(() => launchConfetti?.(), 400); return () => clearTimeout(t) }, [])

  const shareText = `I just donated ${formatCurrency(amount)} to Care Union Foundation! Together we transform lives. Join me at careunion.in`
  const handleShare = async () => {
    try { await navigator.share({ title: 'I donated to Care Union!', text: shareText, url: 'https://careunion.in' }) }
    catch { await navigator.clipboard.writeText(shareText) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-forest-800 flex items-center justify-center px-5 py-14">
      <div className="max-w-lg w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, stiffness: 200 }} className="w-24 h-24 bg-forest-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-green">
          <CheckCircle className="w-14 h-14 text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Thank You, {name.split(' ')[0]}! 🎉</h1>
          <p className="text-white/65 text-base leading-relaxed mb-2">Your donation of <span className="font-bold text-green-400">{formatCurrency(amount)}</span> has been received successfully.</p>
          <p className="text-white/50 text-sm mb-8">A confirmation and receipt has been sent to your email.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative w-12 h-12"><Image src="/logo.png" alt="Care Union" fill className="object-contain" /></div>
            <div className="text-left"><div className="font-display font-bold text-navy-700 text-sm">CARE UNION</div><div className="text-xs text-slate-400">Foundation</div></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Receipt No.</span><span className="font-bold text-navy-800 font-mono">{receipt || 'Processing…'}</span></div>
            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Amount Paid</span><span className="font-bold text-forest-600 text-base">{formatCurrency(amount)}</span></div>
            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Status</span><span className="font-bold text-forest-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Confirmed</span></div>
            <div className="flex justify-between py-2"><span className="text-slate-500">80G Receipt</span><span className="text-amber-600 font-medium text-xs">Will be sent when certified</span></div>
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 leading-relaxed">🙏 Your generosity is creating real change. We will send you photos and an impact report showing exactly how your donation was used.</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold py-3.5 rounded-xl text-sm transition-all"><Share2 className="w-4 h-4" /> Share Your Story</button>
          <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-green"><Download className="w-4 h-4" /> View Receipt</Link>
        </motion.div>
        <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} href="https://instagram.com/care.union" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors mb-8"><Instagram className="w-4 h-4" /> Tag us @care.union on Instagram</motion.a>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/campaigns" className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors"><Heart className="w-4 h-4 fill-current text-red-400" /> Donate Again</Link>
          <span className="text-white/20">·</span>
          <Link href="/" className="flex items-center gap-1 text-white/60 hover:text-white text-sm transition-colors">Back to Home <ArrowRight className="w-3.5 h-3.5" /></Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-900 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}>
      <ThankYouContent />
    </Suspense>
  )
}
