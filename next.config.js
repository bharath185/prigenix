/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
