import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations/index";

export function useTranslation() {
  const { locale } = useLanguage();

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[locale];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return value || key;
  };

  return { t };
}
