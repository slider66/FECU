/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vlbxawqjdnxjlbiryohb.supabase.co",
      },
    ],
  },
  swcMinify: true,
}

export default nextConfig
