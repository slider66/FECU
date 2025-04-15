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
  experimental: {
    webVitalsAttribution: ["CLS", "LCP"],
  },
  // Konfiguration til at håndtere fonts offline
  // Dette hjælper med at undgå netværksproblemer under bygning
  optimizeFonts: false,
}

export default nextConfig
