// import { LanguageProvider } from "@/context/LanguageContext";
// import ThemeProvider from "@/context/ThemeContext";
// import "./globals.css";
// import "./responsive.css";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import AuthProvider from "@/components/AuthProvider/AuthProvider";

// export const metadata = {
//   title: "Soouqna Shopping Platform",
//   description: "Soouqna App",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           <ThemeProvider>
//             <LanguageProvider>
//               <Header />
//               {children}
//               <Footer />
//             </LanguageProvider>
//           </ThemeProvider>
//         </AuthProvider>
//         <script
//           src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&v=beta&callback=initMap`}
//           async
//           defer
//         ></script>
//       </body>
//     </html>
//   );
// }

// // Define initMap function globally if needed by the Google Maps API loader
// // This can be an empty function for now if you don't have a specific init logic
// // window.initMap = function() {
// //   console.log("Google Maps API loaded.");
// // };

import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import ThemeProvider from "@/context/ThemeContext";
import "./globals.css";
import "./responsive.css";
import dynamic from "next/dynamic";
import Script from "next/script";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Header from "@/components/Header";
// const Header = dynamic(() => import("@/components/Header"), {
//   ssr: false,
// });
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});
const PWARegister = dynamic(() => import("@/components/PWARegister"), {
  ssr: false,
});
const WhatsAppChat = dynamic(() => import("../components/WhatsappChat"), {
  ssr: false,
});

export const metadata = {
  title: "Soouqna Shopping Platform",
  description: "Soouqna App - Your ultimate shopping platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <Header />
              {children}
              <WhatsAppChat />
              <Footer />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
        <PWARegister />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&v=beta&callback=initMap`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
