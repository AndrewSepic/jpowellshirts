import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-api.printify.com',
		pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;
