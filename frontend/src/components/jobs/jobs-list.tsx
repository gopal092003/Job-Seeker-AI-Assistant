// src/components/jobs/jobs-list.tsx

"use client";

import { useMemo, useState } from "react";

import { JobCard } from "@/components/jobs/job-card";

import type { Job } from "@/types/jobs";

interface JobsListProps {
  jobs: Job[];

  onSelect?: (
    jobLink: string,
  ) => void;

  onOpen?: (
    url: string,
  ) => void;

  pageSize?: number;
}

export function JobsList({
  jobs,
  onSelect,
  onOpen,
  pageSize = 10,
}: JobsListProps) {
  const [page, setPage] =
    useState(1);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        jobs.length /
          pageSize,
      ),
    );

  const paginatedJobs =
    useMemo(() => {
      const start =
        (page - 1) *
        pageSize;

      return jobs.slice(
        start,
        start + pageSize,
      );
    }, [
      jobs,
      page,
      pageSize,
    ]);

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No jobs found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {paginatedJobs.map(
          (job) => (
            <JobCard
              key={
                job.job_link
              }
              job={job}
              onSelect={
                onSelect
              }
              onOpen={
                onOpen
              }
            />
          ),
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of{" "}
            {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={
                page === 1
              }
              onClick={() =>
                setPage(
                  (
                    current,
                  ) =>
                    Math.max(
                      1,
                      current -
                        1,
                    ),
                )
              }
              className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                page ===
                totalPages
              }
              onClick={() =>
                setPage(
                  (
                    current,
                  ) =>
                    Math.min(
                      totalPages,
                      current +
                        1,
                    ),
                )
              }
              className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}