import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    subsets: [
      "latin",
    ],
  });

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: [
      "latin",
    ],
  });

export const metadata:
  Metadata = {
  metadataBase:
    new URL(
      "https://www.pyramidedugang.fr"
    ),

  title:
    "Pyramide du Gang",

  description:
    "Le jeu de soirée multijoueur où le bluff est roi.",

  openGraph: {
    title:
      "Pyramide du Gang",

    description:
      "Le jeu de soirée multijoueur où le bluff est roi.",

    url:
      "https://www.pyramidedugang.fr",

    siteName:
      "Pyramide du Gang",

    locale:
      "fr_FR",

    type:
      "website",

    images: [
      {
        url:
          "/og-image.jpg",

        width:
          1200,

        height:
          630,

        alt:
          "Pyramide du Gang",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Pyramide du Gang",

    description:
      "Le jeu de soirée multijoueur où le bluff est roi.",

    images: [
      "/og-image.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        antialiased
      `}
    >
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}