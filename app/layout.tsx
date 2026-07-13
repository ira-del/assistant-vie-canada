import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/components/ui/ToastProvider";
import GoogleAnalyticsLoader from "@/components/analytics/GoogleAnalyticsLoader";
import CookieConsentBanner from "@/components/analytics/CookieConsentBanner";
import EventFromQuery from "@/components/analytics/EventFromQuery";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITRE = "Assistant Vie Canada";
const DESCRIPTION = "Simule ton avenir financier, obtiens des conseils personnalisés par IA, et découvre les aides auxquelles tu as droit au Canada.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://assistant-vie-canada.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITRE,
    template: `%s — ${TITRE}`,
  },
  description: DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: TITRE,
    description: DESCRIPTION,
    siteName: TITRE,
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITRE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <EventFromQuery />
        </Suspense>
        <GoogleAnalyticsLoader />
        <ToastProvider>
          {children}
          <Footer />
        </ToastProvider>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
