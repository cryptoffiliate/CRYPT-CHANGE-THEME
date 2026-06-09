import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Ticker } from "@/components/Ticker";

export const metadata: Metadata = {
  title: {
    default: "Cryptoffiliate — AI-Powered Crypto Intelligence",
    template: "%s | Cryptoffiliate",
  },
  description:
    "Live fee data, AI-powered exchange recommendations, and unbiased crypto reviews. The only platform with a real AI advisor built in.",
  metadataBase: new URL("https://cryptoffiliate.com"),
  openGraph: {
    siteName: "Cryptoffiliate",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Ticker />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
