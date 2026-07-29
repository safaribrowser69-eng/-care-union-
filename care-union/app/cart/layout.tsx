import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Donation Cart', description: 'Review your donation items before checkout.', robots: { index: false, follow: false } }
export default function CartLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
