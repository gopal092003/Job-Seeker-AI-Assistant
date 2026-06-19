// src/hooks/use-jobs.ts

"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { Job } from "@/types/jobs";

import {
  errorToast,
} from "@/hooks/use-toast";

export function useJobs() {
  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const fetchJobs =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch("/api/jobs");

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Failed to fetch jobs",
          );
        }

        setJobs(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch jobs";

        setError(message);
        errorToast(message);
      } finally {
        setLoading(false);
      }
    }, []);

  const refreshJobs =
    useCallback(async () => {
      await fetchJobs();
    }, [fetchJobs]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    refreshJobs,
  };
}