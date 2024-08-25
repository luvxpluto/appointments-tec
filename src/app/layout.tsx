import "@/styles/globals.css"
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Horas de consulta Tecnológico de Costa Rica"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <nav className="fixed top-0 left-0 w-full z-50">
            <NavBar />
          </nav>
          <div className="pt-14">
            <Separator className="fixed"/>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
