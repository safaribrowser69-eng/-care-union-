'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function ImpactBanner() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    toast.success('Subscribed! You will receive our monthly impact reports.')
    setEmail('')
  }

  return (
    <>
      <section className="bg-forest-500 py-16 px-5 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto">Every rupee counts. Join thousands of donors creating real change across India today.</p>
          <Link href="/campaigns" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-forest-700 font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-xl">
            Start Donating <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-navy-900 py-14 px-5 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-8 h-8 text-green-400 mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold text-white mb-2">Get Our Monthly Impact Reports</h3>
          <p className="text-white/50 text-sm mb-6">See exactly how donations are transforming lives across India — delivered to your inbox.</p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold"><CheckCircle className="w-5 h-5" /> You're subscribed!</div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-green-400 text-sm" />
              <button type="submit" className="bg-forest-500 hover:bg-forest-600 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm whitespace-nowrap">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
