import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOMA",
  description:
    "A calm workspace for tasks, notes, deadlines and academic life.",
  applicationName: "NOMA",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#FCEDD6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}