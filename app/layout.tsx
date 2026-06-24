import type { Metadata } from "next";
import { Inter, Zilla_Slab, Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n/LangProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-zilla-slab",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-devanagari",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif-devanagari",
});

export const metadata: Metadata = {
  title: "Dr. Lila — Consultant Psychiatrist",
  description:
    "Compassionate, specialist psychiatric care in Kathmandu. Book an appointment with Dr. Lila online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[
        inter.variable,
        zillaSlab.variable,
        notoSansDevanagari.variable,
        notoSerifDevanagari.variable,
      ].join(" ")}
    >
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
