// src/components/profile/project-card.tsx

"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { Project } from "@/types/profile";

interface ProjectCardProps {
  project: Project;
  onDelete: (
    projectId: string,
  ) => void;
}

export function ProjectCard({
  project,
  onDelete,
}: ProjectCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">
              {project.title}
            </h3>
          </div>

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              onDelete(
                project.id,
              )
            }
          >
            Delete
          </Button>
        </div>

        {project.description && (
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {
              project.description
            }
          </p>
        )}

        {project.skills.length >
          0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Skills
            </p>

            <div className="flex flex-wrap gap-2">
              {project.skills.map(
                (
                  skill,
                ) => (
                  <span
                    key={
                      skill
                    }
                    className="rounded-md border px-2 py-1 text-xs"
                  >
                    {skill}
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {project.links.length >
          0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Links
            </p>

            <div className="flex flex-col gap-1">
              {project.links.map(
                (
                  link,
                  index,
                ) => (
                  <a
                    key={`${project.id}-${index}`}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm text-primary underline"
                  >
                    {link}
                  </a>
                ),
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
