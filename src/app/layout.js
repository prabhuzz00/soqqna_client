import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import ThemeProvider from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Header from "@/components/Header";
import { CurrencyProvider } from "@/context/CurrencyContext";
import DirectionWrapper from "@/components/DirectionWrapper";
import ScriptLoader from "./ScriptLoader";
import "./globals.css";
import "./responsive.css";

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

// Critical CSS extracted from your main CSS file
const criticalCSS = `
  * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #3e3e3e;
    overflow-x: hidden;
    background-color: #f9fafb;
    margin: 0;
    line-height: 1.6;
  }
  
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
  }
  
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  .container {
    width: 95%;
    margin: auto;
  }
  
  .btn-org {
    background: #f7921c !important;
    color: #fff !important;
    font-weight: 600 !important;
    font-size: 16px;
    padding: 7px 20px !important;
    border: 1px solid transparent !important;
  }
  
  ::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #f7921c;
  }
  ::-webkit-scrollbar-track {
    background: #fff;
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />

        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

        {/* Load Google Fonts asynchronously with font-display: swap */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
          media="print"
        />

        {/* Preload the font stylesheet */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          as="style"
        />

        {/* Load CSS files directly */}
        <link rel="stylesheet" href="/globals.css" />
        <link rel="stylesheet" href="/responsive.css" />

        {/* Client-side script to handle font loading */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const fontLink = document.querySelector('link[href*="Montserrat"]');
                if (fontLink) {
                  fontLink.onload = function() {
                    this.media = 'all';
                  };
                }
              })();
            `,
          }}
        />

        {/* Fallback for browsers without JavaScript */}
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          />
          <link rel="stylesheet" href="/globals.css" />
          <link rel="stylesheet" href="/responsive.css" />
        </noscript>
      </head>
      <body>
        <AuthProvider>
          <CurrencyProvider>
            <ThemeProvider>
              <LanguageProvider>
                <DirectionWrapper />
                <Header />
                {children}
                <WhatsAppChat />
                <Footer />
              </LanguageProvider>
            </ThemeProvider>
          </CurrencyProvider>
        </AuthProvider>
        <PWARegister />
        <ScriptLoader />
      </body>
    </html>
  );
}
