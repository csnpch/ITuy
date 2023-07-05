/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  register: true,
  scope: '/',
});

const nextConfig = {
  output: 'standalone',
}

const withTM = require('next-transpile-modules')(['react-countup', 'countup.js']);

module.exports = {...withPWA({
  reactStrictMode: false,
  swcMinify: true,
}), ...withTM({}), ...nextConfig};
