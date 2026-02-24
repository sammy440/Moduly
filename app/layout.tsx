import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Moduly | Project Architecture Visualizer",
  description: "High-end interactive architecture & dependency visualization for modern developers.",
  icons: {
    icon: "/meta-icon.png",
  },
  openGraph: {
    title: "Moduly | Project Architecture Visualizer",
    description: "High-end interactive architecture & dependency visualization for modern developers.",
    url: "https://moduly-zeta.vercel.app",
    siteName: "Moduly",
    images: [
      {
        url: "/webpage.png",
        width: 1200,
        height: 630,
        alt: "Moduly Project Architecture Visualizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moduly | Project Architecture Visualizer",
    description: "High-end interactive architecture & dependency visualization for modern developers.",
    images: ["/webpage.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${instrument.variable} antialiased selection:bg-primary/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
