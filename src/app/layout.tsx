import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import CheckAuth from "@/components/CheckAuth";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/app-sidebar";

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
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CheckAuth />
          {/* <NavigationBar /> */}
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className="absolute md:m-4 md:hidden">
              <SidebarTrigger />
            </div>

            <main className="w-full">{children}</main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
