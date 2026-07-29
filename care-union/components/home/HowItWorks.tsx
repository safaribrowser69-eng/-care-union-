import { Search, CreditCard, Heart, BarChart3 } from 'lucide-react'

const STEPS = [
  { icon: Search, title: 'Choose a Cause', desc: 'Browse campaigns for hunger relief, birthdays, animal welfare, nature, and health.' },
  { icon: CreditCard, title: 'Donate Securely', desc: 'Pay via UPI, card, or net banking through our secure Razorpay gateway.' },
  { icon: Heart, title: 'We Deliver Impact', desc: 'Our team conducts the drive and documents everything with photos and videos.' },
  { icon: BarChart3, title: 'See Your Impact', desc: 'Receive a detailed report showing exactly how your donation was used.' },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-20 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-forest-600 mb-2">Simple & Transparent</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900">How It Works</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="text-center relative">
                {i < STEPS.length - 1 && <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-slate-100" />}
                <div className="relative w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-navy-700" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-forest-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-display font-bold text-navy-800 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
