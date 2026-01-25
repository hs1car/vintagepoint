/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Dev Indicators Configuration
  devIndicators: {
    position: 'bottom-left',
  },
  
  // External packages for server components
  serverExternalPackages: ['bcryptjs'],
  
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons', 
      'lucide-react', 
      'framer-motion',
      'recharts',
      'zod'
    ],
  },

  // Turbopack configuration (empty to silence warning)
  turbopack: {},

  // Image Optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'videos.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'wa.me',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    unoptimized: false,
  },

  // Security & Caching Headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },

  // Redirects for security
  async redirects() {
    return [
      {
        source: '/.env',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/.git/:path*',
        destination: '/404',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
