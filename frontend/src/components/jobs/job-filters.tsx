// src/components/jobs/job-filters.tsx

"use client";

import { useState } from "react";

import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

import type { JobFlags } from "@/types/jobs";

interface JobFiltersProps {
  onApply: (
    filters: JobFlags,
  ) => void;
}

export function JobFilters({
  onApply,
}: JobFiltersProps) {
  const [
    selectedOnly,
    setSelectedOnly,
  ] = useState(false);

  const [
    contactOnly,
    setContactOnly,
  ] = useState(false);

  const applyFilters =
    () => {
      onApply({
        selected:
          selectedOnly
            ? true
            : undefined,

        ...(contactOnly && {
          mail: true,
          number: true,
        }),
      });
    };

  const resetFilters =
    () => {
      setSelectedOnly(false);

      setContactOnly(false);

      onApply({});
    };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border p-4">
      <Toggle
        pressed={selectedOnly}
        onClick={() =>
          setSelectedOnly(
            (prev) => !prev,
          )
        }
      >
        Selected Only
      </Toggle>

      <Toggle
        pressed={contactOnly}
        onClick={() =>
          setContactOnly(
            (prev) => !prev,
          )
        }
      >
        Contact Found
      </Toggle>

      <div className="ml-auto flex gap-2">
        <Button
          variant="outline"
          onClick={
            resetFilters
          }
        >
          Reset
        </Button>

        <Button
          onClick={
            applyFilters
          }
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}