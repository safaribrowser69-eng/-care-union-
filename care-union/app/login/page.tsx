'use client'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useUserStore } from '@/store/userStore'
import { OTPInput } from '@/components/ui/OTPInput'
import { maskEmail } from '@/lib/utils'

type Step = 'email' | 'otp' | 'success'
const TRUST_ITEMS = ['🍱 Track every donation you have made', '📊 See monthly impact reports', '🧾 Download 80G receipts', '💬 Stay updated on campaigns']

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const forceAdmin = searchParams.get('role') === 'admin'
  const { setUser, setAdmin } = useUserStore()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(forceAdmin)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => { if (resendCooldown <= 0) return; const t = setInterval(() => setResendCooldown(c => c - 1), 1000); return () => clearInterval(t) }, [resendCooldown])

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim().toLowerCase(), isAdmin }) })
      const data = await res.json()
      if (data.success) { setStep('otp'); setOtp(''); setResendCooldown(60); toast.success('OTP sent to your email!') }
      else toast.error(data.message || 'Failed to send OTP.')
    } catch { toast.error('Something went wrong.') } finally { setLoading(false) }
  }

  const verifyOtp = async (code: string) => {
    if (code.length !== 6 || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim().toLowerCase(), token: code, isAdmin }) })
      const data = await res.json()
      if (data.success) {
        if (data.isAdmin) { setAdmin(true); setUser(data.user); toast.success('Welcome back, Admin!'); router.push('/admin') }
        else { setUser(data.user); setStep('success'); setTimeout(() => router.push(redirectTo), 1600) }
      } else { toast.error(data.message || 'Invalid or expired OTP.'); setOtp('') }
    } catch { toast.error('Verification failed.'); setOtp('') } finally { setLoading(false) }
  }

  useEffect(() => { if (otp.length === 6 && step === 'otp') verifyOtp(otp) }, [otp])

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=85" alt="Care Union volunteers" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/92 to-navy-900/55" />
        <div className="absolute inset-0 flex flex-col justify-center px-14">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="relative w-14 h-14 bg-white rounded-2xl p-1.5 shadow-navy"><Image src="/logo.png" alt="Care Union" fill className="object-contain" /></div>
            <div><div className="font-display text-xl font-bold text-white leading-none">CARE <span className="text-green-400">UNION</span></div><div className="text-[0.6rem] tracking-[2px] uppercase text-white/40 mt-0.5 font-semibold">Foundation</div></div>
          </Link>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">Together We<br /><span className="text-green-400">Transform Lives</span></h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm mb-10">Log in to track your donations, download receipts, and see the real impact your generosity creates.</p>
          <div className="space-y-3">{TRUST_ITEMS.map(item => (<div key={item} className="flex items-center gap-3 text-white/70 text-sm"><CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /><span>{item}</span></div>))}</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-14 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-8">
            <div className="relative w-10 h-10"><Image src="/logo.png" alt="Care Union" fill className="object-contain" /></div>
            <div className="font-display font-bold text-navy-700 text-lg">CARE <span className="text-forest-500">UNION</span></div>
          </Link>

          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
                <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-8">
                  <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center mb-6"><Mail className="w-6 h-6 text-navy-700" /></div>
                  <h1 className="font-display text-2xl font-bold text-navy-900 mb-1">Welcome Back</h1>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">Enter your email and we'll send you a one-time code. No password needed.</p>
                  <form onSubmit={sendOtp} className="space-y-5">
                    <div><label className="input-label">Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus className="input" /></div>
                    <label className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-navy-200 transition-colors" htmlFor="admin-toggle">
                      <input id="admin-toggle" type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} className="w-4 h-4 accent-navy-700 flex-shrink-0" />
                      <div><div className="text-sm font-semibold text-navy-800 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-navy-600" /> Admin Login</div><div className="text-xs text-slate-400 mt-0.5">Check this only if you have admin access</div></div>
                    </label>
                    <button type="submit" disabled={loading || !email} className="btn-primary w-full py-3.5">{loading ? (<span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP…</span>) : (<>Send One-Time Code <ArrowRight className="w-4 h-4" /></>)}</button>
                  </form>
                  <p className="text-center text-xs text-slate-400 mt-6">No password. No spam. Unsubscribe anytime.</p>
                  <div className="border-t border-slate-100 mt-6 pt-5 text-center"><p className="text-xs text-slate-400">New here? <Link href="/campaigns" className="text-navy-700 font-semibold hover:underline">Browse our campaigns</Link> — no account needed to donate.</p></div>
                </div>
              </motion.div>
            )}
            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
                <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-8">
                  <div className="w-12 h-12 bg-forest-50 rounded-2xl flex items-center justify-center mb-6"><span className="text-2xl">✉️</span></div>
                  <h1 className="font-display text-2xl font-bold text-navy-900 mb-1">Check Your Email</h1>
                  <p className="text-slate-500 text-sm mb-1 leading-relaxed">We sent a 6-digit code to</p>
                  <p className="font-semibold text-navy-700 text-sm mb-8">{maskEmail(email)}</p>
                  <div className="mb-6">
                    <label className="input-label text-center block mb-4">Enter your one-time code</label>
                    <OTPInput value={otp} onChange={setOtp} disabled={loading} />
                    <p className="text-center text-xs text-slate-400 mt-3">Valid for 10 minutes · Auto-submits when complete</p>
                  </div>
                  {loading && (<div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-4"><span className="w-4 h-4 border-2 border-slate-200 border-t-navy-600 rounded-full animate-spin" />Verifying…</div>)}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                    <button onClick={() => { setStep('email'); setOtp('') }} className="text-xs text-slate-400 hover:text-navy-700 transition-colors">← Change email</button>
                    <button onClick={() => sendOtp()} disabled={loading || resendCooldown > 0} className="flex items-center gap-1.5 text-xs text-navy-700 hover:text-navy-900 font-semibold transition-colors disabled:opacity-40"><RefreshCw className="w-3 h-3" />{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</button>
                  </div>
                </div>
              </motion.div>
            )}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, type: 'spring', damping: 16 }}>
                <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14, delay: 0.1 }} className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-9 h-9 text-forest-500" /></motion.div>
                  <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">You're In! 🎉</h2>
                  <p className="text-slate-500 text-sm">Redirecting to your dashboard…</p>
                  <div className="mt-5 flex justify-center"><div className="w-5 h-5 border-2 border-slate-200 border-t-forest-500 rounded-full animate-spin" /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-slate-200 border-t-navy-700 rounded-full animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
