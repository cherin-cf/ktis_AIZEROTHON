/** @type {import('next').NextConfig} */
const nextConfig = {
  // Phone / LAN preview: allow Next dev assets from local network IPs
  allowedDevOrigins: [
    "192.168.0.31",
    "192.168.0.31:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
