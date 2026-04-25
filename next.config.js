const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  compress: true,
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',  value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://browser.sentry-cdn.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://o*.ingest.sentry.io https://sheets.googleapis.com https://vitals.vercel-analytics.com",
              "frame-src https://js.stripe.com",
              "worker-src blob:",
            ].join('; '),
          },
        ],
      },
      {
        source: '/(_next/static|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp)(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/shop',      destination: '/products', permanent: true },
      { source: '/jewellery', destination: '/products', permanent: true },
      { source: '/jewelry',   destination: '/products', permanent: true },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const sentryWebpackPluginOptions = {
  org:     process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent:  true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
};

module.exports = withBundleAnalyzer(
  withSentryConfig(nextConfig, sentryWebpackPluginOptions)
);
