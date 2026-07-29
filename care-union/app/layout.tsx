import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TopBar } from '@/components/layout/TopBar'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const viewport: Viewport = { themeColor: '#1B3A6B', width: 'device-width', initialScale: 1, maximumScale: 5 }

export const metadata: Metadata = {
  title: { default: 'Care Union Foundation | Together We Transform Lives', template: '%s | Care Union Foundation' },
  description: 'Care Union Foundation is a transparent NGO dedicated to ending hunger, supporting education, and providing healthcare to underprivileged communities across India. Donate from ₹30.',
  keywords: ['donate india','ngo india','care union','hunger relief india','feed the poor','animal welfare','women hygiene','plant trees india','transparent ngo','80g donation'],
  metadataBase: new URL('https://careunion.in'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', locale: 'en_IN', url: 'https://careunion.in', siteName: 'Care Union Foundation',
    title: 'Care Union Foundation | Together We Transform Lives',
    description: 'Donate from ₹30 and transform lives across India. 100% transparent.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Care Union Foundation' }],
  },
  twitter: { card: 'summary_large_image', title: 'Care Union Foundation', description: 'Donate from ₹30 and transform lives across India.', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  icons: { icon: [{ url: '/favicon.ico', sizes: '32x32' }, { url: '/logo.png', sizes: '192x192', type: 'image/png' }], apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }] },
  manifest: '/manifest.json',
  category: 'charity',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-white text-navy-900 antialiased">
        <Providers>
          <TopBar />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { fontFamily: 'var(--font-inter)', fontSize: '0.875rem', borderRadius: '12px', padding: '12px 16px' }, success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } }, error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } } }} />
      </body>
    </html>
  )
}
