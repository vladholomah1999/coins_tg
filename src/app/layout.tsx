import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telegram Mining App",
  description: "Mine coins in Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}