import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EquaFit — Student Wellness",
  description: "Adaptive fitness & wellness for students.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /** Omit maximumScale so pinch-zoom & browser font scaling are unrestricted (WCAG 1.4.4 / 1.4.10). */
  themeColor: "#D84315",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased font-sans">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
