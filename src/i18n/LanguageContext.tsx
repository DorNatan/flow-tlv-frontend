import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang, type T } from "./translations";
import { translateData } from "./dataDict";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: T;
  dir: "ltr" | "rtl";
  dt: (s: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "flow-tlv-lang";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "he") return stored;
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const dir = lang === "he" ? "rtl" : "ltr";

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", dir);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState((prev) => (prev === "en" ? "he" : "en"));

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, toggleLang, t: translations[lang] as T, dir, dt: (s) => translateData(s, lang) }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useT(): T {
  return useLanguage().t;
}
