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
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&v=beta&callback=initMap`}
        async
        defer
      ></script>
      </body>
    </html>
  );
}

// Define initMap function globally if needed by the Google Maps API loader
// This can be an empty function for now if you don't have a specific init logic
// window.initMap = function() {
//   console.log("Google Maps API loaded.");
// };
