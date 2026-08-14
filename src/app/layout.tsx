import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DreamForge — Custom 3D Printing & Design Studio",
  description: "DreamForge provides premium custom 3D printing, prototyping, resin figures, and high-precision CAD modeling services.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
