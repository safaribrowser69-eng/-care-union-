import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/dashboard/', '/api/', '/thank-you'] }],
    sitemap: 'https://careunion.in/sitemap.xml',
    host: 'https://careunion.in',
  }
}
