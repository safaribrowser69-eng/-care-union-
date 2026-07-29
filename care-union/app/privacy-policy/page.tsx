import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy', description: 'Privacy Policy for Care Union Foundation.' }

export default function Page() {
  const sections = [
    { title: '1. Information We Collect', content: ['Personal identification: name, email, phone, and PAN number (for 80G receipts).', 'Address details: city, state, and pincode (optional).', 'Payment information: processed securely by Razorpay. We never store card details.', 'Usage data: browser type, IP address, and pages visited.', 'Communications sent through our contact form.'] },
{ title: '2. How We Use Your Information', content: ['To process your donation and send you a receipt.', 'To issue 80G tax-exemption certificates once certified.', 'To send impact reports and updates (you can unsubscribe anytime).', 'To maintain your donor dashboard and donation history.', 'To respond to queries and provide support.', 'To comply with legal obligations.'] },
{ title: '3. Payment Security', content: ['All payments are processed by Razorpay, a PCI-DSS Level 1 compliant gateway.', 'We do not store your card or banking credentials.', 'All payment data is encrypted using 256-bit SSL.'] },
{ title: '4. Data Sharing', content: ['We do not sell, trade, or rent your personal information.', 'We may share anonymised aggregate data for reporting purposes.', 'We share data with service providers (Razorpay, Supabase, email) solely to operate the platform.', 'We may disclose data if required by law.'] },
{ title: '5. Data Retention', content: ['Donation records are retained for 7 years for legal compliance.', 'Account data is retained until you request deletion.', 'Contact submissions are retained for 1 year.'] },
{ title: '6. Your Rights', content: ['Access: request a copy of the data we hold about you.', 'Correction: request correction of inaccurate data.', 'Deletion: request deletion, subject to legal obligations.', 'Unsubscribe from marketing emails anytime.', 'Email careunion.info@gmail.com to exercise these rights.'] },
{ title: '7. Cookies', content: ['We use essential cookies to keep you logged in and remember your cart.', 'We may use analytics cookies to understand site usage.', 'You can disable cookies in your browser settings.'] },
{ title: '8. Contact Us', content: ['Questions about this policy: careunion.info@gmail.com or WhatsApp +91 8789477448.'] }
  ]
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
          <div className="bg-gradient-navy px-10 py-10">
            <p className="text-xs font-bold tracking-widest uppercase text-green-400 mb-2">Legal</p>
            <h1 className="font-display text-3xl font-bold text-white">Privacy Policy</h1>
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
