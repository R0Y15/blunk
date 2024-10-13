/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "decisive-trout-680.convex.cloud"
            }
        ]
    }
};

export default nextConfig;
