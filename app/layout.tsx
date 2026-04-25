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
  metadataBase: new URL("https://lntouch.vercel.app"), // change avec ton vrai domaine

  title: {
    default: "Ln Touch | Coiffure & Beauté",
    template: "%s | Ln Touch",
  },

  description:
    "Ln Touch, salon de coiffure professionnel spécialisé dans les coiffures modernes, soins capillaires et mise en beauté. Sublimez votre style avec élégance.",

  keywords: [
    "Ln Touch",
    "coiffure",
    "salon de coiffure",
    "coiffure femme",
    "coiffure homme",
    "tresses",
    "braids",
    "soin capillaire",
    "beauty salon",
    "coiffure moderne",
  ],

  authors: [{ name: "Ln Touch" }],
  creator: "Ln Touch",
  publisher: "Ln Touch",

  openGraph: {
    title: "Ln Touch | Coiffure & Beauté",
    description:
      "Découvrez Ln Touch, votre salon de coiffure moderne pour un style unique et élégant.",
    url: "https://lntouch.vercel.app",
    siteName: "Ln Touch",
    images: [
      {
        url: "/og-image.png", // ton image OG (important)
        width: 1200,
        height: 630,
        alt: "Ln Touch coiffure",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ln Touch | Coiffure & Beauté",
    description:
      "Coiffure moderne, élégance et style chez Ln Touch.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  category: "beauty",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              name: "Ln Touch",
              description: "Salon de coiffure professionnel",
              url: "https://lntouch.vercel.app",
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}
