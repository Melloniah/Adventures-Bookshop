// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '8000',
//         pathname: '/static/images/**',   // ✅ Lock it down to just images
//       },
//       {
//         protocol: 'https',
//         hostname: 'your-api-domain.com',
//         pathname: '/static/images/**',
//       }
//     ],
//   },
//   env: {
//     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
//     NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254724047489',
//   },
//   experimental: {
//     serverComponentsExternalPackages: [],
//   },
// }

// export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization for your backend images
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/images/**',
      },
      // Production - Your API domain
      {
        protocol: 'https',
        hostname: 'api.adventuresbookshop.org',
        pathname: '/static/images/**',
      },
      // Temporary DigitalOcean URLs (during setup)
      {
        protocol: 'https',
        hostname: '*.ondigitalocean.app',
        pathname: '/static/images/**',
      }
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254724047489',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,

  // Experimental features
  experimental: {
    serverComponentsExternalPackages: [],
  },

  // Trailing slash handling
  trailingSlash: false,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects (www to non-www or vice versa)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.adventuresbookshop.org',
          },
        ],
        destination: 'https://adventuresbookshop.org/:path*',
        permanent: true,
      },
    ];
  },
}

export default nextConfig