import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/ui/theme-provider";

import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "../lib/utils";
import Loading from "./admin/dashboard/loading";
import { Suspense } from "react";
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Home Renovation Systems",
  description: "Your home renovation experts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-y-auto",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            <main className="min-h-screen w-full max-w-full flex flex-col">
              <ColorSchemeScript defaultColorScheme="auto" />
              <MantineProvider defaultColorScheme="auto">
                <ModalsProvider>{children}</ModalsProvider>
              </MantineProvider>
            </main>
          </Suspense>
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
