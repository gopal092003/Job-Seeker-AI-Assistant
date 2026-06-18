"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { Education } from "@/types/profile";

interface EducationCardProps {
  education: Education;

  onDelete?: (
    educationId: string,
  ) => void;
}

export function EducationCard({
  education,
  onDelete,
}: EducationCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold">
              {education.degreeName ??
                "Unknown Degree"}
            </h3>

            <p className="text-sm text-muted-foreground">
              {education.instituteName ??
                "Unknown Institute"}
            </p>
          </div>

          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                onDelete(
                  education.id,
                )
              }
            >
              Delete
            </Button>
          )}
        </div>

        <div>
          <p className="text-sm font-medium">
            CGPA
          </p>

          <p className="text-sm text-muted-foreground">
            {education.cgpa ??
              "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">
            Start Date
          </p>

          <p className="text-sm text-muted-foreground">
            {education.startDate ??
              "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">
            End Date
          </p>

          <p className="text-sm text-muted-foreground">
            {education.endDate ??
              "Present"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}