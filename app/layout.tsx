import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { getMetadataBase } from "@/lib/metadata"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: "VisaCore Solutions",
  title: {
    default: "VisaCore Solutions | Immigration & Visa Consulting",
    template: "%s | VisaCore Solutions",
  },
  description:
    "Experts en immigration vers le Canada, les États-Unis et l'Europe. Accompagnement complet pour vos projets d'immigration depuis Lomé, Togo.",
  keywords: [
    "immigration",
    "visa",
    "Canada",
    "États-Unis",
    "Europe",
    "Lomé",
    "Togo",
    "consultation",
    "permis de travail",
    "études à l'étranger",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "VisaCore Solutions",
    url: "/",
    title: "VisaCore Solutions | Immigration & Visa Consulting",
    description:
      "Experts en immigration vers le Canada, les États-Unis et l'Europe. Accompagnement complet pour vos projets d'immigration depuis Lomé, Togo.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "VisaCore Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisaCore Solutions | Immigration & Visa Consulting",
    description:
      "Experts en immigration vers le Canada, les États-Unis et l'Europe. Accompagnement complet pour vos projets d'immigration depuis Lomé, Togo.",
    images: ["/opengraph-image"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
