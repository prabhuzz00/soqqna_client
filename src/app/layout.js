import { LanguageProvider } from "@/context/LanguageContext";
import ThemeProvider from "@/context/ThemeContext";
import "./globals.css";
import "./responsive.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

export const metadata = {
  title: "Ecommerce App Next Js",
  description: "Ecommerce App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <Header />
              {children}
              <Footer />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
