/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  swcMinify: false, // Disable SWC minifier
};

export default nextConfig;