/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
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
    // Enable if using server components with client components
    serverComponentsExternalPackages: []
  }
}

export default nextConfig