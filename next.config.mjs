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
  webpack: (config, { isServer }) => {
    // Øg memory limit for webpack
    config.performance = {
      ...config.performance,
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }

    // Optimér for produktionsbyggeprocessen
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: "commons",
              chunks: "all",
              minChunks: 2,
            },
          },
        },
      }
    }

    return config
  },
}

export default nextConfig
