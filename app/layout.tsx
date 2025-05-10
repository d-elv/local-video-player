import { type Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/app/providers/ConvexClientProvider";
import "./globals.css";
import { FileDetailsProvider } from "./contexts/FileDetailsContext";
import { ThemeProviders } from "./providers/ThemeProvider";
import { Toaster } from "@/app/components/ui/shared/toaster";
import { UserSync } from "./components/UserSync";

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
  title: {
    template: "%s | Local Video Player",
    default: "Video Player Dashboard",
  },
  description: "Watch video files stored on your device in your browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <FileDetailsProvider>
            <ThemeProviders>
              <ConvexClientProvider>
                <UserSync />
                {children}
              </ConvexClientProvider>
            </ThemeProviders>
          </FileDetailsProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
