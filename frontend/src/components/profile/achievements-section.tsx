// src/components/profile/achievements-section.tsx

"use client";

import { useState } from "react";

import { useAchievements } from "@/hooks/use-achievements";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AchievementCard } from "@/components/profile/achievement-card";
import { AchievementForm } from "@/components/profile/achievement-form";

export function AchievementsSection() {
  const {
    achievements,
    loading,

    fetchAchievements,
    createAchievement,
    deleteAchievement,
  } = useAchievements();

  const [open, setOpen] =
    useState(false);

  const loadAchievements =
    async () => {
      await fetchAchievements();
    };

  const handleCreateAchievement =
    async (achievement: {
      description: string;
      file: File;
    }) => {
      await createAchievement(
        achievement,
      );
  
      setOpen(false);
    };

  const removeAchievement =
    async (
      achievementId: string,
    ) => {
      await deleteAchievement(
        achievementId,
      );
    };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Achievements
        </h2>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              Add Achievement
            </Button>
          </DialogTrigger>

          <DialogContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Add Achievement
              </h3>

              <AchievementForm
                onSubmit={
                  handleCreateAchievement
                }
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="max-h-[500px]">
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading achievements...
            </p>
          ) : achievements.length ===
            0 ? (
            <p className="text-sm text-muted-foreground">
              No achievements added yet.
            </p>
          ) : (
            achievements.map(
              (
                achievement,
              ) => (
                <AchievementCard
                  key={
                    achievement.id
                  }
                  achievement={
                    achievement
                  }
                  onDelete={
                    removeAchievement
                  }
                />
              ),
            )
          )}
        </div>
      </ScrollArea>
    </section>
  );
}