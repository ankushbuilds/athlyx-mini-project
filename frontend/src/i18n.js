import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "./locales/en/common.json";
import commonHi from "./locales/hi/common.json";
import publicEn from "./locales/en/public.json";
import publicHi from "./locales/hi/public.json";
import authEn from "./locales/en/auth.json";
import authHi from "./locales/hi/auth.json";

const LANGUAGE_STORAGE_KEY = "athlyx-language";
const supportedLanguages = ["en", "hi"];

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return supportedLanguages.includes(savedLanguage) ? savedLanguage : "en";
  } catch (error) {
    console.error("Unable to read saved language preference:", error);
    return "en";
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn,
        public: publicEn,
        auth: authEn
      },
      hi: {
        common: commonHi,
        public: publicHi,
        auth: authHi
      }
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "public", "auth"],
    interpolation: {
      escapeValue: false
    },
    returnEmptyString: false,
    react: {
      useSuspense: false
    }
  });

i18n.on("languageChanged", (language) => {
  const supportedLanguage = supportedLanguages.includes(language)
    ? language
    : "en";

  if (typeof document !== "undefined") {
    document.documentElement.lang = supportedLanguage;
  }

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLanguage);
    }
  } catch (error) {
    console.error("Unable to save language preference:", error);
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
}

export default i18n;
