"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale) {
      setLocale(storedLocale);
    } else {
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith("ar")) {
        setLocale("ar");
        localStorage.setItem("locale", "ar");
      } else {
        setLocale("en");
        localStorage.setItem("locale", "en");
      }
    }
  }, []);

  const changeLanguage = (lang) => {
    setLocale(lang);
    localStorage.setItem("locale", lang);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
