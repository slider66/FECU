import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL(
                "https://hqauvgxnshukhxjvzikv.supabase.co/storage/v1/object/public/wedding-photos/*"
            ),
        ],
    },
};

export default nextConfig;
