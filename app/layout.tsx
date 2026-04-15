import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/print.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "每日宏觀資訊綜合早報",
  description: "Daily Macro Market Briefing - 自動化生成的全球宏觀市場日報",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#eef2f7] text-[#1e293b] text-[11.5px] leading-relaxed font-sans">
        {children}
      </body>
    </html>
  );
}
