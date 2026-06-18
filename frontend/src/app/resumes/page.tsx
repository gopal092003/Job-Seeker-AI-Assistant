// src/app/resumes/page.tsx

"use client";

import { useEffect, useState } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { ResumesList } from "@/components/resumes/resumes-list";

interface Resume {
  resume_id: string;

  job_link: string;

  created_at: string;

  resume_url?: string;
}

export default function ResumesPage() {
  const [resumes, setResumes] =
    useState<Resume[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    const loadResumes =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const response =
            await fetch(
              "/api/resumes",
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ??
                "Failed to load resumes",
            );
          }

          setResumes(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load resumes",
          );
        } finally {
          setLoading(false);
        }
      };

    void loadResumes();
  }, []);

  const handleDownload =
    async (
      resumeId: string,
    ) => {
      try {
        const response =
          await fetch(
            `/api/resumes/${resumeId}`,
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Failed to fetch resume",
          );
        }

        window.open(
          data.download_url,
          "_blank",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to download resume",
        );
      }
    };

  if (loading) {
    return null;
  }

  return (
    <PageShell title="Resumes">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-destructive p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        <ResumesList
          resumes={resumes}
          onDownload={
            handleDownload
          }
        />
      </div>
    </PageShell>
  );
}