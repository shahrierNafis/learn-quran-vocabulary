import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import CheckAuth from "@/components/CheckAuth";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { cn } from "@/utils/cn";
import NavigationBar from "./NavigationBar";

const comfortaa = Comfortaa({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn Quran/Arabic",
  description:
    "Using Cloze Testing And Spaced Repetition To Make Learning Arabic Faster And More Effective",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Learn Quran/Arabic" />
        <meta property="og:image" content="/image.jpg" />
        <meta
          property="og:description"
          content="Using Cloze Testing And Spaced Repetition To Make Learning Arabic Faster And More Effective"
        />
      </head>
      <body className={comfortaa.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CheckAuth />
          <NavigationBar />
          {children}
          <ModeToggle className="float-right m-2" />
        </ThemeProvider>
      </body>
    </html>
  );
}
