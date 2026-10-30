import type { Metadata, Viewport } from "next";

import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";

import { site } from "@/data/site";

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
  openGraph: {
    title: `${site.fullName} — Creative Developer`,
    description: site.metaDescription,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — Creative Developer`,
    description: site.metaDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#090909",
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
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
