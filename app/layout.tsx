import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display, Oleo_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/providers/CartContext";
import { ContactModalProvider } from "@/providers/ContactModalContext";
import ContactModal from "@/components/ContactModal";

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
  title: "JPowell Shirts - Jerome Powell Apparel for fans of an Independent Federal Reserve",
  description: "Premium Jerome Powell themed t-shirts for Federal Reserve enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${oleoScript.variable} antialiased flex flex-col min-h-screen`}
      >
        <CartProvider>
          <ContactModalProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ContactModal />
          </ContactModalProvider>
        </CartProvider>
      </body>
    </html>
  );
}
