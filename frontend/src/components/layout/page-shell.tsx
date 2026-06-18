// src/components/layout/page-shell.tsx

"use client";

import { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";

import { useProfile } from "@/hooks/use-profile";

interface PageShellProps {
  children: ReactNode;
  title?: string;
}

export function PageShell({
  children,
  title,
}: PageShellProps) {
  const {
    profile,
  } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={profile}
      />

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {title && (
            <header>
              <h1 className="text-3xl font-bold tracking-tight">
                {title}
              </h1>
            </header>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}