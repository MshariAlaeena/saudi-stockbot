/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress Chrome DevTools 404 warnings in development
  async rewrites() {
    return [
      {
        source: '/.well-known/appspecific/:path*',
        destination: '/api/devtools-probe',
      },
    ]
  },
  // Additional optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Reduce bundle size
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@radix-ui/react-slot': '@radix-ui/react-slot/dist/index.mjs',
      }
    }
    return config
  },
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  // Images configuration
  images: {
    unoptimized: true,
  },
}

export default nextConfig
