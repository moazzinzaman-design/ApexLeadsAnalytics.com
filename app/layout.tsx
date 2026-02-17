import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apex Leads Analytics - Find Trusted Trade Professionals",
  description: "Connect with verified handywomen, cleaners, electricians, and trade professionals in your area. Get instant quotes and book trusted pros for your home projects.",
  keywords: "handywoman, cleaner, electrician, tradesperson, local services, home improvement, find a pro",
  authors: [{ name: "Apex Leads Analytics" }],
  openGraph: {
    title: "Apex Leads Analytics - Find Trusted Trade Professionals",
    description: "Connect with verified professionals in your area",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Cosmic Background */}
        <div className="cosmic-bg">
          {/* Animated orbs */}
          <div className="floating-orb orb-1" />
          <div className="floating-orb orb-2" />
          <div className="floating-orb orb-3" />
          {/* Star field */}
          <div className="star-field" />
          {/* Grid pattern */}
          <div className="tech-grid" />
        </div>
        
        <div className="min-h-screen relative">
          <Navigation />
          <main className="relative z-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

