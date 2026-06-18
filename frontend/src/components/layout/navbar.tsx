// src/components/layout/navbar.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase/client";

import type { Profile } from "@/types/profile";

interface NavbarProps {
  user: Profile | null;
}

export function Navbar({
  user,
}: NavbarProps) {
  const router = useRouter();

  const handleLogout =
    async () => {
      await supabase.auth.signOut();

      router.push("/login");
      router.refresh();
    };

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <nav className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/profile"
            className="text-lg font-bold"
          >
            Job Agent
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/profile"
              className="text-sm font-medium hover:underline"
            >
              Profile
            </Link>

            <Link
              href="/jobs"
              className="text-sm font-medium hover:underline"
            >
              Jobs
            </Link>

            <Link
              href="/resumes"
              className="text-sm font-medium hover:underline"
            >
              Resumes
            </Link>

            <Link
              href="/settings"
              className="text-sm font-medium hover:underline"
            >
              Settings
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-muted-foreground md:block">
              {user.user_name}
            </span>
          )}

          <Button
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}