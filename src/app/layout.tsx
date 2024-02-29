import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CheckAuth from "@/components/CheckAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn Quran Vocabulary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CheckAuth />
        {children}
      </body>
    </html>
  );
}
