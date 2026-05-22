import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "PHYSCI2018",
  description: "Our Eternal Memory Hub",
  icons: [
    { rel: "icon", url: "/icon-192.png" },
    { rel: "apple-touch-icon", url: "/icon-192.png" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
