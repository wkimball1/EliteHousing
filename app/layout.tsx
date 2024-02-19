import { GeistSans } from "geist/font/sans";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Inter as FontSans } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/ui/theme-provider"
 
import { cn } from "../lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Elite Housing",
  description: "Your home renovation experts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en" className={GeistSans.className}>
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
        <main className="relative min-h-screen flex flex-col">
          {/* <NavBar/> */}
          {children}
        </main>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
