import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Footer, Navbar } from "@/components";
import { Toaster } from "@/components/ui/toaster";
import { bricolage, inter } from './fonts';

export const metadata: Metadata = {
  title: "Blunk",
  description: "A next-Gen cross-platform file sharing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body>
        <ConvexClientProvider>
          <Toaster />
          <Navbar />
          {children}
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
