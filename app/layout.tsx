import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FileDetailsProvider } from "./contexts/FileDetailsContext";
import { ThemeProviders } from "./providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Local Video Player",
  description: "Play local videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FileDetailsProvider>
          <ThemeProviders>{children}</ThemeProviders>
        </FileDetailsProvider>
        <Toaster />
      </body>
    </html>
  );
}
