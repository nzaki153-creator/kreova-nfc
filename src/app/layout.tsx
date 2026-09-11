import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Kreova — NFC Digital Identity Card",
  description: "Digital identity card untuk mahasiswa Indonesia, ditap lewat NFC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} bg-kreova-bg font-sans text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
