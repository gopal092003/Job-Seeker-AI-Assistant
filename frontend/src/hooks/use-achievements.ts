// src/hooks/use-achievements.ts

"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

import {
  successToast,
  errorToast,
} from "@/hooks/use-toast";

import type { Achievement } from "@/types/profile";

export function useAchievements() {
  const [achievements, setAchievements] =
    useState<Achievement[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchAchievements =
    useCallback(async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setAchievements([]);
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("achievements")
          .eq(
            "user_id",
            user.id,
          )
          .single();

        if (profileError) {
          throw profileError;
        }

        const achievementIds =
          profile?.achievements ??
          [];

        if (
          achievementIds.length ===
          0
        ) {
          setAchievements([]);
          return;
        }

        const {
          data,
          error,
        } = await supabase
          .from("achievements")
          .select("*")
          .in(
            "achievement",
            achievementIds,
          );

        if (error) {
          throw error;
        }

        const mappedAchievements: Achievement[] =
          (data ?? []).map(
            (
              achievement,
            ) => ({
              id:
                achievement.achievement,

              description:
                achievement.description,

              proof:
                achievement.proof,

              date:
                achievement.date,

              createdAt:
                achievement.created_at,

              updatedAt:
                achievement.updated_at,
            }),
          );

        setAchievements(
          mappedAchievements,
        );
      } catch (error) {
        console.error(
          "fetchAchievements error:",
          error,
        );

        errorToast(
          "Unable to load achievements.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const createAchievement =
    useCallback(
      async (
        achievement: {
          description: string;
          file: File;
          date?: string;
        },
      ) => {
        try {
          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) {
            throw new Error(
              "User not authenticated",
            );
          }

          const achievementId =
            crypto.randomUUID();

          const extension =
            achievement.file.name
              .split(".")
              .pop();

          const filePath =
            `${user.id}/${achievementId}.${extension}`;

          const {
            error: uploadError,
          } =
            await supabase.storage
              .from(
                "achievement-proofs",
              )
              .upload(
                filePath,
                achievement.file,
              );

          if (uploadError) {
            throw uploadError;
          }

          const {
            data:
              publicUrlData,
          } =
            supabase.storage
              .from(
                "achievement-proofs",
              )
              .getPublicUrl(
                filePath,
              );

          const proofUrl =
            publicUrlData.publicUrl;

          const {
            error: insertError,
          } = await supabase
            .from(
              "achievements",
            )
            .insert({
              achievement:
                achievementId,

              description:
                achievement.description,

              proof: proofUrl,

              date:
                achievement.date ??
                null,
            });

          if (insertError) {
            throw insertError;
          }

          const {
            data: profile,
            error:
              profileError,
          } = await supabase
            .from("profiles")
            .select(
              "achievements",
            )
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (profileError) {
            throw profileError;
          }

          const {
            error:
              updateError,
          } = await supabase
            .from("profiles")
            .update({
              achievements: [
                ...(profile?.achievements ??
                  []),
                achievementId,
              ],
            })
            .eq(
              "user_id",
              user.id,
            );

          if (updateError) {
            throw updateError;
          }

          successToast(
            "Achievement added successfully",
          );

          await fetchAchievements();
        } catch (error) {
          console.error(
            "createAchievement error:",
            error,
          );

          errorToast(
            "Unable to save achievement.",
          );
        }
      },
      [fetchAchievements],
    );

  const deleteAchievement =
    useCallback(
      async (
        achievementId: string,
      ) => {
        try {
          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) {
            throw new Error(
              "User not authenticated",
            );
          }

          const {
            data:
              achievement,
            error:
              achievementError,
          } = await supabase
            .from(
              "achievements",
            )
            .select(
              "proof",
            )
            .eq(
              "achievement",
              achievementId,
            )
            .single();

          if (
            achievementError
          ) {
            throw achievementError;
          }

          if (
            achievement?.proof
          ) {
            try {
              const url =
                new URL(
                  achievement.proof,
                );

              const path =
                url.pathname.split(
                  "/achievement-proofs/",
                )[1];

              if (path) {
                await supabase.storage
                  .from(
                    "achievement-proofs",
                  )
                  .remove([
                    path,
                  ]);
              }
            } catch {
              // ignore storage cleanup failures
            }
          }

          const {
            error: deleteError,
          } = await supabase
            .from(
              "achievements",
            )
            .delete()
            .eq(
              "achievement",
              achievementId,
            );

          if (deleteError) {
            throw deleteError;
          }

          const {
            data: profile,
            error:
              profileError,
          } = await supabase
            .from("profiles")
            .select(
              "achievements",
            )
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (profileError) {
            throw profileError;
          }

          const {
            error:
              updateError,
          } = await supabase
            .from("profiles")
            .update({
              achievements: (
                profile?.achievements ??
                []
              ).filter(
                (
                  id: string,
                ) =>
                  id !==
                  achievementId,
              ),
            })
            .eq(
              "user_id",
              user.id,
            );

          if (updateError) {
            throw updateError;
          }

          setAchievements(
            (
              current,
            ) =>
              current.filter(
                (
                  achievement,
                ) =>
                  achievement.id !==
                  achievementId,
              ),
          );

          successToast(
            "Achievement deleted successfully",
          );
        } catch (error) {
          console.error(
            "deleteAchievement error:",
            error,
          );

          errorToast(
            "Unable to delete achievement.",
          );
        }
      },
      [],
    );

  useEffect(() => {
    void fetchAchievements();
  }, [fetchAchievements]);

  return {
    achievements,
    loading,

    fetchAchievements,
    createAchievement,
    deleteAchievement,
  };
}