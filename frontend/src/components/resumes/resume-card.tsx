// src/components/resumes/resume-card.tsx

"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Resume {
  resume_id: string;

  job_link: string;

  created_at: string;

  resume_url?: string;
}

interface ResumeCardProps {
  resume: Resume;

  onDownload?: (
    resumeId: string,
  ) => void;
}

export function ResumeCard({
  resume,
  onDownload,
}: ResumeCardProps) {
  const createdDate =
    new Date(
      resume.created_at,
    ).toLocaleDateString();

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">
              Resume ID
            </p>

            <p className="break-all text-sm text-muted-foreground">
              {
                resume.resume_id
              }
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">
              Job Link
            </p>

            <a
              href={
                resume.job_link
              }
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-primary underline"
            >
              {resume.job_link}
            </a>
          </div>

          <div>
            <p className="text-sm font-medium">
              Created
            </p>

            <p className="text-sm text-muted-foreground">
              {createdDate}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() =>
              onDownload?.(
                resume.resume_id,
              )
            }
          >
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}