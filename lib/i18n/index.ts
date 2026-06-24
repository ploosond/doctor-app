"use client";

import { createContext, useContext } from "react";
import type en from "@/messages/en.json";

export type Lang = "en" | "ne";
export type Messages = typeof en;

export const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Messages;
}>({
  lang: "en",
  setLang: () => {},
  t: {} as Messages,
});

export function useLang() {
  return useContext(LangContext);
}
