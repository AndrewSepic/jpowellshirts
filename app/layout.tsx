import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Oleo_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/providers/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const oleoScript = Oleo_Script({
  variable: "--font-oleo-script",
  subsets: ["latin"],
  weight: "700",
});

export const metadata: Metadata = {
  title: "JPowell Shirts - Jerome Powell T-Shirts for fans of ann Independent Federal Reserve",
  description: "Premium Jerome Powell themed t-shirts for Federal Reserve enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${oleoScript.variable} antialiased flex flex-col min-h-screen`}
      >
        <CartProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
