"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const DirectionWrapper = () => {
  const { locale } = useLanguage();

  useEffect(() => {
    // Set language and direction attributes on <html> tag
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  return null; // This component only performs a side effect
};

export default DirectionWrapper;
