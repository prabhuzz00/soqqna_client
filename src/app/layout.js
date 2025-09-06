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

// Critical CSS as a string (extract from your actual critical styles)
const criticalCSS = `
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333;
  }
  
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        
        {/* Preload CSS files for browsers that support it */}
        <link 
          rel="preload" 
          href="/globals.css" 
          as="style" 
        />
        <link 
          rel="preload" 
          href="/responsive.css" 
          as="style" 
        />
        
        {/* Fallback for browsers that don't support JavaScript */}
        <noscript>
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