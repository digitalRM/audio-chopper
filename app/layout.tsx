import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audio Chopper - Split and Download Audio Clips",
  description:
    "A simple tool to split audio files into multiple clips. Upload an audio file, choose split points, and download individual clips.",
  keywords: [
    "audio",
    "split",
    "chopper",
    "audio editor",
    "audio clips",
    "download audio",
  ],
  authors: [{ name: "Ruslan Mukhamedvaleev", url: "https://www.ruslan.in" }],
  openGraph: {
    title: "Audio Chopper - Split and Download Audio Clips",
    description:
      "A simple tool to split audio files into multiple clips. Upload an audio file, choose split points, and download individual clips.",
    url: "https://audio-chopper.vercel.app",
    siteName: "Audio Chopper",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
