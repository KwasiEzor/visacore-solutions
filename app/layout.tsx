import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
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
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "VisaCore Solutions",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
