// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { createClient } from "@/lib/supabase/server";

import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Agent",
  description:
    "AI-powered job tracking and resume management platform.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps) {
  const supabase =
    await createClient();

  await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={
          inter.className
        }
      >
        {children}

        <ToastProvider />
      </body>
    </html>
  );
}