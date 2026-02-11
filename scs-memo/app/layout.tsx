import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCS Memo Bot - Intelligent Assistant",
  description: "Your intelligent helper bot. Fast, responsive, ready to help.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
