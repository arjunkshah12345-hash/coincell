import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "coincell — ai for the diagnostic gap after reese's law",
  description:
    "Open-source decision support that distinguishes button batteries from coins on pediatric X-rays. Congressional App Challenge 2026.",
  openGraph: {
    title: "CoinCell",
    description: "AI for the diagnostic gap Congress left after Reese's Law (P.L. 117-171)",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==='dark'||(!localStorage.theme&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
