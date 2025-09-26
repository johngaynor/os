import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "./components/Navbar";
import { ThemeProvider } from "./components/Theme";
import PullToRefresh from "./components/PullToRefresh";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OS",
  description: "Internal Operating System.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/icon-filled-dark-180x180.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <PullToRefresh />
            <Toaster richColors theme="system" />
            <div className="relative mx-auto">
              <NavbarWrapper>{children}</NavbarWrapper>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
