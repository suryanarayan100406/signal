import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "ConvoSim - Convolution and Correlation Calculator",
  description:
    "Interactive discrete-time convolution and correlation visualizer with step-by-step DSP animation."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-900 text-slate-100 antialiased`}>{children}</body>
    </html>
  );
}
