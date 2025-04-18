/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vlbxawqjdnxjlbiryohb.supabase.co",
      },
    ],
  },
  // Fjernet alle eksperimentelle funktioner
  output: "standalone",
}

export default nextConfig
