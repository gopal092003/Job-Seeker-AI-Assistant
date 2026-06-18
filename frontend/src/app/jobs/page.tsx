// src/app/jobs/page.tsx

"use client";

import { PageShell } from "@/components/layout/page-shell";

import { JobFilters } from "@/components/jobs/job-filters";
import { JobsList } from "@/components/jobs/jobs-list";

import { useJobs } from "@/hooks/use-jobs";

export default function JobsPage() {
  const {
    jobs,
    loading,
    error,

    applyFilters,
  } = useJobs();

  if (loading) {
    return null;
  }

  return (
    <PageShell title="Jobs">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-destructive p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        <JobFilters
          onApply={
            applyFilters
          }
        />

        <JobsList jobs={jobs} />
      </div>
    </PageShell>
  );
}