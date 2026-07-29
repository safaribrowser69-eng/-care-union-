'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Instagram, Send, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setSent(true); toast.success('Message sent! We will reply within 24 hours.'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }
      else toast.error(data.message || 'Failed to send message.')
    } catch { toast.error('Failed to send message.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-navy py-16 px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-2">Get in Touch</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/60 text-base">Have a question, partnership idea, or want to volunteer? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div><h2 className="font-display text-2xl font-bold text-navy-900 mb-3">Let's Connect</h2><p className="text-slate-500 text-sm leading-relaxed">Whether you have a question about donating, want to volunteer, or represent a company interested in CSR partnership, reach out anytime.</p></div>
            {[
              { icon: Mail, label: 'Email', value: 'careunion.info@gmail.com', href: 'mailto:careunion.info@gmail.com' },
              { icon: Phone, label: 'WhatsApp', value: '+91 87894 77448', href: 'https://wa.me/918789477448' },
              { icon: Instagram, label: 'Instagram', value: '@care.union', href: 'https://instagram.com/care.union' },
              { icon: MapPin, label: 'Reach', value: 'Serving communities across India', href: undefined },
            ].map(c => {
              const Icon = c.icon
              const content = (<div className="flex items-center gap-4"><div className="w-11 h-11 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-navy-700" /></div><div><div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">{c.label}</div><div className="text-navy-800 font-medium text-sm">{c.value}</div></div></div>)
              return c.href ? (<a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-70 transition-opacity">{content}</a>) : (<div key={c.label}>{content}</div>)
            })}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
              <div className="bg-navy-900 px-8 py-6"><h3 className="font-display font-bold text-white text-lg">Send Us a Message</h3></div>
              {sent ? (
                <div className="p-8 text-center py-16">
                  <CheckCircle className="w-14 h-14 text-forest-500 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-navy-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-400 text-sm mb-6">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-outline py-2.5 px-6 text-sm">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="input-label">Full Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="Your name" /></div>
                    <div><label className="input-label">Email *</label><input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input" placeholder="you@example.com" /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="input-label">Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="+91 XXXXX XXXXX" /></div>
                    <div><label className="input-label">Subject *</label><input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input" placeholder="How can we help?" /></div>
                  </div>
                  <div><label className="input-label">Message *</label><textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input resize-none" placeholder="Tell us more..." /></div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">{loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>) : (<><Send className="w-4 h-4" /> Send Message</>)}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
