"use client";

import { useState } from "react";
import { LangContext, type Lang } from "./index";
import en from "@/messages/en.json";
import ne from "@/messages/ne.json";

const messages = { en, ne };

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang, t: messages[lang] }}>
      <div data-lang={lang}>{children}</div>
    </LangContext.Provider>
  );
}
