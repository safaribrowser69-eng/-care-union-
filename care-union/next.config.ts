import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {protocol:'https',hostname:'images.unsplash.com'},
      {protocol:'https',hostname:'images.pexels.com'},
      {protocol:'https',hostname:'cdn.pixabay.com'},
      {protocol:'https',hostname:'plus.unsplash.com'},
      {protocol:'https',hostname:'*.supabase.co'},
    ],
    formats:['image/avif','image/webp'],
    deviceSizes:[640,750,828,1080,1200,1920],
    minimumCacheTTL:3600,
  },
  experimental:{optimizePackageImports:['lucide-react','framer-motion']},
  async headers() {
    return [{
      source:'/(.*)',
      headers:[
        {key:'X-Content-Type-Options',value:'nosniff'},
        {key:'X-Frame-Options',value:'DENY'},
        {key:'X-XSS-Protection',value:'1; mode=block'},
        {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
        {key:'Permissions-Policy',value:'camera=(),microphone=(),geolocation=()'},
      ],
    },{
      source:'/_next/static/(.*)',
      headers:[{key:'Cache-Control',value:'public,max-age=31536000,immutable'}],
    }]
  },
  async redirects() {
    return [
      {source:'/donate',destination:'/campaigns',permanent:true},
      {source:'/give',destination:'/campaigns',permanent:true},
    ]
  },
  compiler:{removeConsole:process.env.NODE_ENV==='production'?{exclude:['error','warn']}:false},
  poweredByHeader:false,
}
export default nextConfig
