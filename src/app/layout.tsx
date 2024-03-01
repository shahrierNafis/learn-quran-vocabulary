import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CheckAuth from "@/components/CheckAuth";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { cn } from "@/utils/cn";

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
      <body className={cn(inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CheckAuth />
          {children}
          <ModeToggle className="float-right m-2" />
        </ThemeProvider>
      </body>
    </html>
  );
}
