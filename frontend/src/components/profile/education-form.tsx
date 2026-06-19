// src/components/profile/education-form.tsx

"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { errorToast } from "@/hooks/use-toast";

interface EducationFormProps {
  onSubmit: (education: {
    degree: string;
    institute: string;
    cgpa?: number;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
}

export function EducationForm({
  onSubmit,
}: EducationFormProps) {
  const [degree, setDegree] =
    useState("");

  const [institute, setInstitute] =
    useState("");

  const [cgpa, setCgpa] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submitEducation = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      if (!degree.trim()) {
        throw new Error(
          "Degree is required",
        );
      }

      if (!institute.trim()) {
        throw new Error(
          "Institute is required",
        );
      }

      setLoading(true);

      await onSubmit({
        degree:
          degree.trim(),

        institute:
          institute.trim(),

        cgpa:
          cgpa.trim() === ""
            ? undefined
            : Number(cgpa),

        startDate:
          startDate || undefined,

        endDate:
          endDate || undefined,
      });

      setDegree("");
      setInstitute("");
      setCgpa("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to save education",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitEducation}
      className="space-y-4"
    >
      <Input
        value={degree}
        placeholder="Degree (e.g. B.Tech CSE)"
        onChange={(e) =>
          setDegree(
            e.target.value,
          )
        }
      />

      <Input
        value={institute}
        placeholder="Institute (e.g. MANIT Bhopal)"
        onChange={(e) =>
          setInstitute(
            e.target.value,
          )
        }
      />

      <Input
        type="number"
        step="0.01"
        value={cgpa}
        placeholder="CGPA"
        onChange={(e) =>
          setCgpa(
            e.target.value,
          )
        }
      />

      <Input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(
            e.target.value,
          )
        }
      />

      <Input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(
            e.target.value,
          )
        }
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Saving..."
          : "Save Education"}
      </Button>
    </form>
  );
}