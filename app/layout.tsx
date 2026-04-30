import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";

import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#151515",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://cricarena-sage.vercel.app"),
  title: {
    default: "CricArena — Fantasy Cricket Built for Winners",
    template: "%s | CricArena",
  },
  description:
    "Build your dream squad, challenge friends in private lobbies, and climb the global leaderboard across every IPL fixture — all in real time.",
  openGraph: {
    title: "CricArena — Fantasy Cricket Built for Winners",
    description:
      "Build your dream squad, challenge friends in private lobbies, and climb the global leaderboard.",
    url: "/",
    siteName: "CricArena",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CricArena Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CricArena — Fantasy Cricket Built for Winners",
    description: "Build your dream squad and climb the global leaderboard.",
    images: ["/opengraph-image.png"],
    creator: "@Avichal_08",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-[oklch(0.09_0.007_38)] text-white selection:bg-orange-500/30 selection:text-orange-100"
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}