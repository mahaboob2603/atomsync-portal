import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AtomQuest | Goal Setting & Tracking Portal",
  description: "In-house goal setting, tracking, and performance management portal built for AtomQuest Hackathon 1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
