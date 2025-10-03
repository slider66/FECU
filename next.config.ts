import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "hqauvgxnshukhxjvzikv.supabase.co",
                pathname: "/storage/v1/object/public/wedding-photos/**",
            },
        ],
    },
};

export default nextConfig;
