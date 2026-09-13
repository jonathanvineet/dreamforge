import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DreamForge — Custom 3D Printing & Design Studio",
  description: "DreamForge provides premium custom 3D printing, prototyping, resin figures, and high-precision CAD modeling services.",
  icons: {
    icon: "/logo/DreamForge_LOGO.png",
    shortcut: "/logo/DreamForge_LOGO.png",
    apple: "/logo/DreamForge_LOGO.png",
  },
  openGraph: {
    images: ["/logo/DreamForge_LOGO.png"],
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
        <link rel="icon" type="image/png" href="/logo/DreamForge_LOGO.png" />
        <link rel="shortcut icon" type="image/png" href="/logo/DreamForge_LOGO.png" />
        <link rel="apple-touch-icon" href="/logo/DreamForge_LOGO.png" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
