// @ts-check
/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config.js')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
// You can remove the following 2 lines when integrating our example.
const { loadCustomBuildParams } = require('./next-utils.config')
const { esmExternals = false, tsconfigPath } =
  loadCustomBuildParams()
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    esmExternals, // https://nextjs.org/blog/next-11-1#es-modules-support
  },
  env: {
      COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
      COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
      COGNITO_ISSUER: process.env.COGNITO_ISSUER,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      TWILIO_CHAT_ACCOUNT: process.env.TWILIO_CHAT_ACCOUNT,
      TWILIO_CHAT_FLOW: process.env.TWILIO_CHAT_FLOW,
      TWILIO_CHAT_STATUS_LINK: process.env.TWILIO_CHAT_STATUS_LINK,
      S3_BUCKET_URL: process.env.S3_BUCKET_URL
  },
  i18n,
  typescript: {
    tsconfigPath,
  },
  headers: [    {

    "source": "/api/(.*)",

    "headers": [

      { "key": "Access-Control-Allow-Credentials", "value": "true" },

      { "key": "Access-Control-Allow-Origin", "value": "*" },

      { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },

      { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }

    ]

  }]
  ,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on 'fs' module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  }
  ,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'info', 'warn'] }: false
  }
}

module.exports = withBundleAnalyzer(nextConfig);
