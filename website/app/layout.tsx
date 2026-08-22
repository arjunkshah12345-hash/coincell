import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haloscan — Pediatric X-ray Decision Support",
  description:
    "Research-grade AI that distinguishes button batteries from coins on pediatric chest X-rays. Built for the Congressional App Challenge.",
  openGraph: {
    title: "Haloscan",
    description: "AI decision support for button battery vs. coin ingestion on pediatric X-rays.",
    type: "website",
    url: "https://haloscan.ideatr.dev",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
