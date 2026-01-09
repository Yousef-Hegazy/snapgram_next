import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import Loader from "@/components/ui/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snapgram",
  description: "Share your moments with the world. Snapgram is a modern social media platform where you can create, share, and discover amazing photos and stories. Connect with friends, explore trending content, and build your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
          <Suspense fallback={<Loader />}>
            {children}
          </Suspense>
        </ClientProviders>
      </body>
    </html>
  );
}
