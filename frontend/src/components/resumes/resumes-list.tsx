// src/components/resumes/resumes-list.tsx

"use client";

import { ResumeCard } from "@/components/resumes/resume-card";

interface Resume {
  resume_id: string;

  job_link: string;

  created_at: string;

  resume_url?: string;
}

interface ResumesListProps {
  resumes: Resume[];

  onDownload?: (
    resumeId: string,
  ) => void;
}

export function ResumesList({
  resumes,
  onDownload,
}: ResumesListProps) {
  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No resumes found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map(
        (resume) => (
          <ResumeCard
            key={
              resume.resume_id
            }
            resume={resume}
            onDownload={
              onDownload
            }
          />
        ),
      )}
    </div>
  );
}