// src/hooks/use-profile.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const mappedProfile: Profile = {
        id: data.user_id,

        name: data.name,
        email: data.email,

        educationIds: data.education ?? [],
        keywordIds: data.keywords ?? [],
        projectIds: data.projects ?? [],
        internshipIds: data.intern ?? [],
        achievementIds: data.achievements ?? [],

        handles: data.handles ?? [],

        agentStatus: data.agent_status ?? false,
      };

      setProfile(mappedProfile);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,

    fetchProfile,
    refreshProfile,
  };
}