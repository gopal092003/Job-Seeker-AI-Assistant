// src/components/profile/profile-header.tsx

"use client";

import { useRouter } from "next/navigation";

import { AgentButton } from "@/components/profile/agent-button";
import { Button } from "@/components/ui/button";

import type { Profile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({
  profile,
}: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex flex-col gap-4 rounded-lg border p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          {profile.name}
        </h1>

        <p className="text-muted-foreground">
          {profile.email}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <AgentButton />

        <Button
          variant="outline"
          onClick={() =>
            router.push("/settings")
          }
        >
          Settings
        </Button>
      </div>
    </header>
  );
}