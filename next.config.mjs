const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/**',   // 👈 restricts to static files
      },
      {
        protocol: 'https',
        hostname: 'your-api-domain.com',
        pathname: '/static/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254793488207',
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
