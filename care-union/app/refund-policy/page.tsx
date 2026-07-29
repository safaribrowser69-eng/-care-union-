import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Refund Policy', description: 'Refund Policy for Care Union Foundation.' }

export default function Page() {
  const sections = [
    { title: '1. General Policy', content: ['Donations are voluntary contributions and are generally non-refundable.', 'Once funds are deployed in the field, refunds cannot be issued.'] },
{ title: '2. Eligible Refund Situations', content: ['Duplicate payment due to technical error — full refund.', 'Payment failure with deduction but no confirmed donation — full refund within 7 business days.', 'Technical error causing incorrect amount charged — difference refunded.', 'Unauthorised transaction — contact us immediately.'] },
{ title: '3. Non-Eligible Situations', content: ['Change of mind after a successful donation.', 'Donations already deployed for beneficiaries.', 'Requests made more than 30 days after the donation.'] },
{ title: '4. Refund Process', content: ["Email careunion.info@gmail.com with subject 'Refund Request'.", 'Include your name, email, amount, date, and reason.', 'We acknowledge within 2 business days.', 'Approved refunds credited within 7-10 business days via original payment method.'] },
{ title: '5. Contact for Refunds', content: ['Email: careunion.info@gmail.com', 'WhatsApp: +91 87894 77448', 'Response time: within 2 business days'] }
  ]
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
          <div className="bg-gradient-navy px-10 py-10">
            <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-2">Legal</p>
            <h1 className="font-display text-3xl font-bold text-white">Refund Policy</h1>
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
