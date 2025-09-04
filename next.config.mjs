// import withPWA from "next-pwa";

// const nextConfig = {
//   images: {
//     remotePatterns: [
//       { hostname: "serviceapi.spicezgold.com" },
//       { protocol: "https", hostname: "res.cloudinary.com" },
//     ],
//   },
//   reactStrictMode: true,
//   poweredByHeader: false,
// };

// export default withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/api\.soouqna\.com\/.*(category|logo).*$/i,
//       handler: "NetworkFirst",
//       options: {
//         cacheName: "api-header-cache",
//         expiration: {
//           maxEntries: 10,
//           maxAgeSeconds: 24 * 60 * 60,
//         },
//       },
//     },
//     {
//       urlPattern: /^https:\/\/res\.cloudinary\.com\/.*$/i,
//       handler: "StaleWhileRevalidate",
//       options: {
//         cacheName: "cloudinary-images",
//         expiration: {
//           maxEntries: 30,
//           maxAgeSeconds: 7 * 24 * 60 * 60,
//         },
//       },
//     },
//   ],
//   sw: "sw.js",
// })(nextConfig);

import withPWA from "next-pwa";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "serviceapi.spicezgold.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" }, // Facebook profile images
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google profile images
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.soouqna\.com\/.*(category|logo).*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-header-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "cloudinary-images",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
  ],
  sw: "sw.js",
})(nextConfig);
