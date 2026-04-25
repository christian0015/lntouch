import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   allowedDevOrigins: ['172.23.96.1'],
   typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'votre-domaine-externe.com',
        port: '',
        pathname: '/**', // Autorise tous les chemins sur ce domaine
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Autorise les sous-domaines
      },
    ],
  },
};

export default nextConfig;
