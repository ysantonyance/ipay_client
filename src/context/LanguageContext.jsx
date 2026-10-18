import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations.js";

let currentLanguage = "en";

// For text built outside a hook (module-level helpers, messages stored in state): translate("text").
export function translate(text, vars) {
  let out = translations[currentLanguage]?.[text] || text;
  if (vars) out = out.replace(/\{(\w+)\}/g, (match, key) => (vars[key] ?? match));
  return out;
}

const LanguageContext = createContext(null);

export const languages = [
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
  { code: "ua", label: "Українська", short: "UA", flag: "🇺🇦" },
  { code: "ru", label: "Русский", short: "RU", flag: "🇷🇺" },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("ipay-language");
      return ["en", "ua", "ru"].includes(saved) ? saved : "en";
    } catch { return "en"; }
  });
  useEffect(() => {
    document.documentElement.lang = language === "ua" ? "uk" : language;
  }, [language]);
  const changeLanguage = useCallback((code) => {
    if (!["en", "ua", "ru"].includes(code)) return;
    setLanguage(code);
    try { localStorage.setItem("ipay-language", code); } catch { /* storage may be unavailable */ }
    document.documentElement.lang = code === "ua" ? "uk" : code;
  }, []);
  // t("Some text") looks the text up; t("Items ({n}):", { n: 3 }) also fills {name} placeholders.
  currentLanguage = language;
  const t = useCallback((text, vars) => {
    let out = translations[language]?.[text] || text;
    if (vars) out = out.replace(/\{(\w+)\}/g, (match, key) => (vars[key] ?? match));
    return out;
  }, [language]);
  // BCP-47 locale for dates and numbers, so they follow the app language rather than the browser's.
  const locale = { en: "en-US", ua: "uk-UA", ru: "ru-RU" }[language];
  const value = useMemo(() => ({ language, locale, changeLanguage, t }), [language, locale, changeLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
