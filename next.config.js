/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['telegram.org'],
  },
  async rewrites() {
    return [
      {
        source: '/api/telegram/webhook/:path*',
        destination: '/api/telegram/webhook/:path*',
      },
    ]
  },
}

module.exports = nextConfig