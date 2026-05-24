const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['lucide-react'] = path.resolve(__dirname, 'node_modules/lucide-react/dist/cjs/lucide-react.js');
    return config;
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/uploads/**' }
    ]
  }
};

module.exports = nextConfig;