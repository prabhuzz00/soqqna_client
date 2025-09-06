// next.config.js
import withPWA from "next-pwa";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "serviceapi.spicezgold.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" }, // Facebook profile images
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google profile images
    ],
    // Add image optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60, // 60 seconds
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  // Enable compression
  compress: true,
  // Optimize font loading
  optimizeFonts: true,
  // Add experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Add headers for caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Add PWA customization
  mode: 'production',
  buildExcludes: [/middleware-manifest\.json$/],
  // Enhanced runtime caching
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.soouqna\.com\/.*(category|logo).*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-header-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "cloudinary-images",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff2)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
  // Additional PWA settings
  sw: "sw.js",
  // Precache manifest for better performance
  dynamicStartUrl: false,
  reloadOnOnline: false,
  // Offline support
  offlineGoogleAnalytics: false,
})(nextConfig);