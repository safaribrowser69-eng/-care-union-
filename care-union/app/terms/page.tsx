import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms & Conditions', description: 'Terms & Conditions for Care Union Foundation.' }

export default function Page() {
  const sections = [
    { title: '1. About Care Union Foundation', content: ["Care Union Foundation is a charitable organisation dedicated to hunger relief, education, animal welfare, environmental care, and women's health.", 'Our website enables donors to contribute to campaigns and track impact.'] },
{ title: '2. Donations', content: ['All donations are voluntary. Minimum donation is Rs.30.', 'Donations are non-transferable and cannot be exchanged for cash or goods.', 'We reserve the right to reallocate donations to similar causes if needed.', '80G receipts will be issued once certification is obtained.'] },
{ title: '3. Payment Processing', content: ['All payments are processed by Razorpay; their Terms of Service also apply.', 'We do not store card or banking credentials.', '100% of your donation reaches the cause — fees are borne by us.'] },
{ title: '4. Prohibited Uses', content: ['No unlawful use of the website.', 'No unauthorised access attempts.', 'No false information or fraudulent donations.', 'No automated bots or scrapers.'] },
{ title: '5. Intellectual Property', content: ['All content including logo, text, and design belongs to Care Union Foundation.', 'No reproduction without written permission.'] },
{ title: '6. Governing Law', content: ['These Terms are governed by the laws of India.', 'Disputes are subject to the exclusive jurisdiction of Indian courts.'] },
{ title: '7. Contact', content: ['Questions: careunion.info@gmail.com'] }
  ]
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
          <div className="bg-gradient-navy px-10 py-10">
            <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-2">Legal</p>
            <h1 className="font-display text-3xl font-bold text-white">Terms & Conditions</h1>
            <p className="text-white/50 text-sm mt-2">Last updated: July 1, 2025</p>
          </div>
          <div className="px-10 py-10 text-sm leading-relaxed">
            {sections.map(section => (
              <div key={section.title} className="mb-8">
                <h2 className="font-display font-bold text-navy-800 text-lg mb-3">{section.title}</h2>
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600"><span className="text-navy-400 mt-0.5 flex-shrink-0">›</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-6 mt-6 flex gap-4 flex-wrap">
              <Link href="/privacy-policy" className="text-navy-700 hover:underline text-sm font-medium">Privacy Policy</Link>
              <Link href="/terms" className="text-navy-700 hover:underline text-sm font-medium">Terms &amp; Conditions</Link>
              <Link href="/refund-policy" className="text-navy-700 hover:underline text-sm font-medium">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
