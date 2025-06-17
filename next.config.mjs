/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove ignore flags for production readiness
  eslint: {
    // Only ignore during builds if absolutely necessary
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // Only ignore build errors if absolutely necessary
    // ignoreBuildErrors: true,
  },
  images: {
    // Keep unoptimized for demo purposes
    unoptimized: true,
  },
  // Add Vercel-specific optimizations
  experimental: {
    // Enable modern bundling for better performance
    esmExternals: true,
  },
  // Optimize for production
  swcMinify: true,
  // Add environment variable configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Add redirects for better UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
