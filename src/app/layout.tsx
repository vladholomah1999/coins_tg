import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Coin Mining App",
  description: "Mine and earn NOT coins",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}