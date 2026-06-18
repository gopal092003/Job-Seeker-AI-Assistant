"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { Internship } from "@/types/profile";

interface InternshipCardProps {
  internship: Internship;

  onDelete: (
    internshipId: string,
  ) => void;
}

export function InternshipCard({
  internship,
  onDelete,
}: InternshipCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">
              {internship.companyName ??
                internship.company}
            </h3>

            <p className="text-sm text-muted-foreground">
              {internship.designation}
            </p>
          </div>

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              onDelete(
                internship.id,
              )
            }
          >
            Delete
          </Button>
        </div>

        {internship.description && (
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {internship.description}
          </p>
        )}

        {(internship.startDate ||
          internship.endDate) && (
          <div className="text-xs text-muted-foreground">
            {internship.startDate ??
              "N/A"}{" "}
            -{" "}
            {internship.endDate ??
              "Present"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}