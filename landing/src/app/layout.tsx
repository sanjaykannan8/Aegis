import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SoundEffects } from "@/components/ui/sound";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AEGIS: Passive threat detection for IT and OT",
  description:
    "AEGIS watches IT and OT networks passively, carries metadata across a one-way link and detects attacks in real time with explainable AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <SoundEffects>{children}</SoundEffects>
      </body>
    </html>
  );
}
