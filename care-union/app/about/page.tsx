import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Target, Eye, Users, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Care Union Foundation — our mission, vision, values, and commitment to transparent charitable giving across India.',
}

const VALUES = [
  { icon: ShieldCheck, title: 'Radical Transparency', desc: 'Every rupee is tracked and reported. We publish monthly impact reports with photos and data.' },
  { icon: Heart, title: 'Compassion First', desc: 'We treat every beneficiary with dignity and respect, not as a statistic.' },
  { icon: Users, title: 'Community Driven', desc: 'We work with local volunteers who understand the needs of their communities.' },
  { icon: Target, title: '100% Impact', desc: 'Zero overhead deduction — every donation goes directly to the cause.' },
  { icon: Eye, title: 'Full Accountability', desc: 'Donors can request detailed breakdowns of exactly how funds were used.' },
  { icon: Sparkles, title: 'Sustainable Change', desc: 'We focus on long-term solutions, not just short-term relief.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-navy py-24 px-5 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-3">Our Story</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">About Care Union Foundation</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-8">A grassroots movement dedicated to fighting hunger, protecting animals, healing the planet, and restoring dignity — one act of compassion at a time.</p>
          <Link href="/campaigns" className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-green">Support Our Mission <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>

      <div className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-forest-600 mb-3">Our Mission</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-5">Together We Transform Lives</h2>
            <p className="text-slate-600 text-base leading-relaxed mb-4">Care Union Foundation was born from a simple belief: that every person, animal, and community deserves dignity, nourishment, and hope. We work across five key areas — hunger relief, birthday celebrations for underprivileged children, animal welfare, environmental restoration, and women's health.</p>
            <p className="text-slate-600 text-base leading-relaxed mb-8">What sets us apart is our unwavering commitment to transparency. We don't just ask for donations — we show you exactly where every rupee goes, with photos, videos, and detailed monthly reports.</p>
            <div className="grid grid-cols-2 gap-4">
              {[{n:'1,847+',l:'Total Donors'},{n:'12,400+',l:'Meals Served'},{n:'48',l:'Drives Conducted'},{n:'12',l:'Cities Reached'}].map(s => (
                <div key={s.l} className="bg-slate-50 rounded-2xl p-4 text-center">
                  <div className="font-display font-bold text-navy-800 text-2xl">{s.n}</div>
                  <div className="text-slate-400 text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card-hover">
            <Image src="https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&q=85" alt="Care Union volunteers" fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="py-20 px-5 md:px-10 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-forest-600 mb-2">What Drives Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-navy-700" /></div>
                  <h3 className="font-display font-bold text-navy-800 text-lg mb-2">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="py-20 px-5 md:px-10 bg-forest-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5">Join Our Mission Today</h2>
          <p className="text-white/80 text-base mb-8">Every donation, no matter the size, creates ripples of positive change. Be part of our story.</p>
          <Link href="/campaigns" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-forest-700 font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-xl">Start Donating <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  )
}
