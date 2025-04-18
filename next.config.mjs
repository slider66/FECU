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
  experimental: {
    serverComponentsExternalPackages: [],
    largePageDataBytes: 128 * 1000 * 1000, // 128MB
  },
}

export default nextConfig
