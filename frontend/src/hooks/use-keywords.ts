// src/hooks/use-keywords.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import { errorToast, successToast } from "@/hooks/use-toast";
import type { Keyword } from "@/types/profile";

export function useKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKeywords = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setKeywords([]);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("keywords")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const keywordIds: string[] = profile?.keywords ?? [];

      if (keywordIds.length === 0) {
        setKeywords([]);
        return;
      }

      const { data, error } = await supabase
        .from("keywords")
        .select("*")
        .in("keyword", keywordIds);

      if (error) {
        throw error;
      }

      const mappedKeywords: Keyword[] = (data ?? []).map((item) => ({
        id: item.keyword,
        value: item.name,
        userCount: item.user_ids?.length ?? 0,
      }));

      setKeywords(mappedKeywords);
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to load keywords",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createKeyword = useCallback(
    async (keyword: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
  
        if (!user) {
          throw new Error("User not authenticated");
        }
  
        const normalizedKeyword = keyword.trim();
  
        let keywordId: string;
  
        const { data: existingKeyword, error: existingError } =
          await supabase
            .from("keywords")
            .select("*")
            .eq("name", normalizedKeyword)
            .maybeSingle();
  
        if (existingError) {
          throw existingError;
        }
  
        if (existingKeyword) {
          keywordId = existingKeyword.keyword;
        } else {
          keywordId = crypto.randomUUID();
  
          const { error: insertError } =
            await supabase
              .from("keywords")
              .insert({
                keyword: keywordId,
                name: normalizedKeyword,
              });
  
          if (insertError) {
            throw insertError;
          }
        }
  
        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("keywords")
          .eq("user_id", user.id)
          .single();
  
        if (profileError) {
          throw profileError;
        }
  
        const currentKeywords =
          profile?.keywords ?? [];
  
        if (
          !currentKeywords.includes(keywordId)
        ) {
          const { error: updateError } =
            await supabase
              .from("profiles")
              .update({
                keywords: [
                  ...currentKeywords,
                  keywordId,
                ],
              })
              .eq("user_id", user.id);
  
          if (updateError) {
            throw updateError;
          }
        }
  
        successToast(
          "Keyword added successfully",
        );
  
        await fetchKeywords();
      } catch (error) {
        console.error("createKeyword error:", error);
      
        errorToast(
          "Unable to add keyword. Please try again.",
        );
      }
    },
    [fetchKeywords],
  );

  const deleteKeyword = useCallback(
    async (keywordId: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
  
        if (!user) {
          throw new Error("User not authenticated");
        }
  
        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("keywords")
          .eq("user_id", user.id)
          .single();
  
        if (profileError) {
          throw profileError;
        }
  
        const updatedKeywords =
          (profile?.keywords ?? []).filter(
            (id: string) => id !== keywordId,
          );
  
        const { error: updateError } =
          await supabase
            .from("profiles")
            .update({
              keywords: updatedKeywords,
            })
            .eq("user_id", user.id);
  
        if (updateError) {
          throw updateError;
        }
  
        setKeywords((current) =>
          current.filter(
            (keyword) =>
              keyword.id !== keywordId,
          ),
        );
  
        successToast(
          "Keyword removed successfully",
        );
      } catch (error) {
        errorToast(
          error instanceof Error
            ? error.message
            : "Failed to delete keyword",
        );
      }
    },
    [],
  );

  useEffect(() => {
    void fetchKeywords();
  }, [fetchKeywords]);

  return {
    keywords,
    loading,

    fetchKeywords,
    createKeyword,
    deleteKeyword,
  };
}