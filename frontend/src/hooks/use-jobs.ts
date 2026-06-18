// src/hooks/use-jobs.ts

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Job,
  JobFilters,
} from "@/types/jobs";

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

  const [filters, setFilters] =
    useState<JobFilters>(
      {},
    );

  const fetchJobs =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/jobs",
          );

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

  const applyFilters =
    useCallback(
      (
        nextFilters: JobFilters,
      ) => {
        setFilters(
          nextFilters,
        );
      },
      [],
    );

  const filteredJobs =
    useMemo(() => {
      return jobs.filter(
        (job) => {
          if (
            filters.search
          ) {
            const query =
              filters.search.toLowerCase();

            const matchesSearch =
              job.description
                .toLowerCase()
                .includes(
                  query,
                ) ||
              job.job_link
                .toLowerCase()
                .includes(
                  query,
                );

            if (
              !matchesSearch
            ) {
              return false;
            }
          }

          if (
            filters.contact_found !==
              undefined &&
            job.contact_found !==
              filters.contact_found
          ) {
            return false;
          }

          if (
            filters.is_selected !==
              undefined &&
            job.is_selected !==
              filters.is_selected
          ) {
            return false;
          }

          if (
            filters.posted_after
          ) {
            const postedDate =
              new Date(
                job.posted_at,
              );

            const afterDate =
              new Date(
                filters.posted_after,
              );

            if (
              postedDate <
              afterDate
            ) {
              return false;
            }
          }

          if (
            filters.posted_before
          ) {
            const postedDate =
              new Date(
                job.posted_at,
              );

            const beforeDate =
              new Date(
                filters.posted_before,
              );

            if (
              postedDate >
              beforeDate
            ) {
              return false;
            }
          }

          return true;
        },
      );
    }, [jobs, filters]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  return {
    jobs:
      filteredJobs,

    loading,
    error,
    filters,

    fetchJobs,
    refreshJobs,
    applyFilters,
  };
}