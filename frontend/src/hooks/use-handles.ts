// src/hooks/use-handles.ts

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

import type { Handle } from "@/types/profile";

export function useHandles() {
  const [handles, setHandles] =
    useState<Handle[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchHandles =
    useCallback(async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setHandles([]);
          return;
        }

        const {
          data: profile,
          error,
        } = await supabase
          .from("profiles")
          .select("handles")
          .eq("user_id", user.id)
          .single();

        if (error) {
          throw error;
        }

        const handlesObject =
          (profile?.handles as Record<
            string,
            string
          >) ?? {};

        const mappedHandles: Handle[] =
          Object.entries(
            handlesObject,
          ).map(
            ([platform, url]) => ({
              platform,
              url,
            }),
          );

        setHandles(
          mappedHandles,
        );
      } catch (error) {
        console.error(
          "fetchHandles error:",
          error,
        );

        errorToast(
          "Unable to load handles.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const createHandle =
    useCallback(
      async (
        handle: Handle,
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
            data: profile,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select("handles")
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (profileError) {
            throw profileError;
          }

          const currentHandles =
            (profile?.handles as Record<
              string,
              string
            >) ?? {};

          const updatedHandles = {
            ...currentHandles,
            [handle.platform]:
              handle.url,
          };

          const {
            error: updateError,
          } = await supabase
            .from("profiles")
            .update({
              handles:
                updatedHandles,
            })
            .eq(
              "user_id",
              user.id,
            );

          if (updateError) {
            throw updateError;
          }

          successToast(
            "Handle added successfully",
          );

          await fetchHandles();
        } catch (error) {
          console.error(
            "createHandle error:",
            error,
          );

          errorToast(
            "Unable to save handle.",
          );
        }
      },
      [fetchHandles],
    );

  const deleteHandle =
    useCallback(
      async (
        platform: string,
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
            data: profile,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select("handles")
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (profileError) {
            throw profileError;
          }

          const updatedHandles =
            {
              ...((profile?.handles as Record<
                string,
                string
              >) ?? {}),
            };

          delete updatedHandles[
            platform
          ];

          const {
            error: updateError,
          } = await supabase
            .from("profiles")
            .update({
              handles:
                updatedHandles,
            })
            .eq(
              "user_id",
              user.id,
            );

          if (updateError) {
            throw updateError;
          }

          setHandles(
            (current) =>
              current.filter(
                (
                  handle,
                ) =>
                  handle.platform !==
                  platform,
              ),
          );

          successToast(
            "Handle removed successfully",
          );
        } catch (error) {
          console.error(
            "deleteHandle error:",
            error,
          );

          errorToast(
            "Unable to remove handle.",
          );
        }
      },
      [],
    );

  useEffect(() => {
    void fetchHandles();
  }, [fetchHandles]);

  return {
    handles,
    loading,

    fetchHandles,
    createHandle,
    deleteHandle,
  };
}