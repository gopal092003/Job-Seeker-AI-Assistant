// src/components/profile/achievement-card.tsx

"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import type { Achievement } from "@/types/profile";

interface AchievementCardProps {
  achievement: Achievement;

  onDelete?: (
    achievementId: string,
  ) => void;
}

export function AchievementCard({
  achievement,
  onDelete,
}: AchievementCardProps) {
  const proof =
    achievement.proof ?? "";

  const isImage =
    /\.(jpg|jpeg|png|webp|gif)$/i.test(
      proof,
    );

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold">
            Achievement
          </h3>

          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                onDelete(
                  achievement.id,
                )
              }
            >
              Delete
            </Button>
          )}
        </div>

        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {achievement.description ??
            ""}
        </p>

        {proof && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Proof
            </p>

            {isImage ? (
              <a
                href={proof}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={proof}
                  alt="Achievement proof"
                  className="
                    max-h-64
                    w-full
                    rounded-md
                    border
                    object-contain
                  "
                />
              </a>
            ) : (
              <Button
                onClick={() =>
                  window.open(
                    proof,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                View Document
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}