/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Ignore during build if eslint is not installed
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Strict typing checked via tsc
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
