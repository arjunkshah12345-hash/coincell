import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "haloscan — the double halo, decoded",
  description:
    "Open-source AI that distinguishes button batteries from coins on pediatric X-rays. Built for the Congressional App Challenge — closing the diagnostic gap after Reese's Law.",
  openGraph: {
    title: "haloscan",
    description: "The double halo, decoded. AI decision support after Reese's Law (P.L. 117-171).",
    type: "website",
    url: "https://haloscan.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
