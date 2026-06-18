// src/app/profile/page.tsx

"use client";

import { PageShell } from "@/components/layout/page-shell";

import { ProfileHeader } from "@/components/profile/profile-header";
import { KeywordsSection } from "@/components/profile/keywords-section";
import { ProjectsSection } from "@/components/profile/projects-section";
import { InternshipsSection } from "@/components/profile/internships-section";
import { EducationSection } from "@/components/profile/education-section";
import { AchievementsSection } from "@/components/profile/achievements-section";
import { HandlesSection } from "@/components/profile/handles-section";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useProfile } from "@/hooks/use-profile";

export default function ProfilePage() {
  const {
    profile,
    loading,
    error,
  } = useProfile();

  if (loading) {
    return null;
  }

  return (
    <PageShell title="Profile">
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {!profile ? (
        <p className="text-sm text-muted-foreground">
          Profile not found.
        </p>
      ) : (
        <>
          <ProfileHeader
            profile={profile}
          />

          <KeywordsSection />

          <ScrollArea className="max-h-[600px] rounded-md border p-4">
            <ProjectsSection />
          </ScrollArea>

          <ScrollArea className="max-h-[600px] rounded-md border p-4">
            <InternshipsSection />
          </ScrollArea>

          <ScrollArea className="max-h-[600px] rounded-md border p-4">
            <EducationSection />
          </ScrollArea>

          <ScrollArea className="max-h-[600px] rounded-md border p-4">
            <AchievementsSection />
          </ScrollArea>

          <HandlesSection />
        </>
      )}
    </PageShell>
  );
}