/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false
      }
    ];
  }
};

module.exports = nextConfig;
