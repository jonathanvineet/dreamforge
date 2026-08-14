/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000', '192.168.21.141', '192.168.21.179'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
