import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DreamForge - Custom 3D Printing & Design",
  description: "DreamForge provides premium custom 3D printing, prototyping, and high-precision modeling services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
