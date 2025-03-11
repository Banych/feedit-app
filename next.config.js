/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'lh3.googleusercontent.com',
      'hgbvbm8t5j.ufs.sh',
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
