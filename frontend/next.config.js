/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.coinbase.com",
      },
      {
        protocol: "https",
        hostname: "**.binance.com",
      },
    ],
  },
};

module.exports = nextConfig;
