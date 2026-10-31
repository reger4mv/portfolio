import type { Metadata, Viewport } from "next";

import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/azeret-mono/index.css";
import "./globals.css";

import { asset, site, siteUrl, withBase } from "@/data/site";
import { BackdropLens } from "@/components/system/BackdropLens";

export const metadata: Metadata = {
  title: `${site.fullName} — Creative Developer`,
  description: site.metaDescription,
  applicationName: site.fullName,
  authors: [{ name: site.fullName }],
  keywords: [
    "Agastya Verma",
    "creative developer",
    "Nepal",
    "frontend developer",
    "Three.js",
    "interactive web",
    "portfolio",
  ],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: withBase("/favicon-32.png"), sizes: "32x32", type: "image/png" },
      { url: withBase("/apple-icon.png"), sizes: "180x180", type: "image/png" },
    ],
    apple: [{ url: withBase("/apple-icon.png"), sizes: "180x180" }],
  },
  openGraph: {
    title: `${site.fullName} — Creative Developer`,
    description: site.metaDescription,
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: site.fullName,
    images: [
      {
        url: asset("/og.png"),
        width: 1200,
        height: 630,
        alt: `${site.fullName} — creative developer, Nepal`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — Creative Developer`,
    description: site.metaDescription,
    images: [asset("/og.png")],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e8e1d3",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <BackdropLens />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
