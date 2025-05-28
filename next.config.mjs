// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       { hostname: "serviceapi.spicezgold.com" },
//       { protocol: "https", hostname: "res.cloudinary.com" },
//     ],
//   },
// };

// export default nextConfig;

import withPWA from "next-pwa";

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "serviceapi.spicezgold.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  sw: "sw.js",
})(nextConfig);
