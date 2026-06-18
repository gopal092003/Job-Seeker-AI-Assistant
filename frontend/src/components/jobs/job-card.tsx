// src/components/jobs/job-card.tsx

"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Job } from "@/types/jobs";

interface JobCardProps {
  job: Job;

  onSelect?: (
    jobId: string,
  ) => void;

  onOpen?: (
    url: string,
  ) => void;
}

export function JobCard({
  job,
  onSelect,
  onOpen,
}: JobCardProps) {
  const postedDate =
    new Date(
      job.posted_at,
    ).toLocaleDateString();

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <a
              href={job.job_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-all text-sm font-medium text-primary underline"
              onClick={() =>
                onOpen?.(
                  job.job_link,
                )
              }
            >
              {job.job_link}
            </a>

            <p className="text-sm text-muted-foreground">
              Posted:{" "}
              {postedDate}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge>
              {job.is_selected
                ? "Selected"
                : "Not Selected"}
            </Badge>

            <Badge>
              {job.contact_found
                ? "Contact Found"
                : "No Contact"}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            variant={
              job.is_selected
                ? "secondary"
                : "default"
            }
            onClick={() =>
              onSelect?.(
                job.job_uuid,
              )
            }
          >
            {job.is_selected
              ? "Selected"
              : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}