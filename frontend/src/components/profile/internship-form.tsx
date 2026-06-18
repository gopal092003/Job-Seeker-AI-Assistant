// src/components/profile/internship-form.tsx

"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { errorToast } from "@/hooks/use-toast";

interface InternshipFormProps {
  onSubmit: (internship: {
    companyName: string;
    role: string;
    description: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
}

export function InternshipForm({
  onSubmit,
}: InternshipFormProps) {
  const [companyName, setCompanyName] =
    useState("");

  const [role, setRole] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submitInternship = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      if (
        !companyName.trim()
      ) {
        throw new Error(
          "Company name is required",
        );
      }

      if (!role.trim()) {
        throw new Error(
          "Role is required",
        );
      }

      setLoading(true);

      await onSubmit({
        companyName:
          companyName.trim(),

        role: role.trim(),

        description:
          description.trim(),

        startDate:
          startDate || undefined,

        endDate:
          endDate || undefined,
      });

      setCompanyName("");
      setRole("");
      setStartDate("");
      setEndDate("");
      setDescription("");
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to save internship",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitInternship}
      className="space-y-4"
    >
      <Input
        value={companyName}
        placeholder="Company Name"
        onChange={(e) =>
          setCompanyName(
            e.target.value,
          )
        }
      />

      <Input
        value={role}
        placeholder="Role / Designation"
        onChange={(e) =>
          setRole(
            e.target.value,
          )
        }
      />

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <Textarea
        value={description}
        placeholder="Describe your responsibilities, achievements, technologies used, and impact..."
        onChange={(e) =>
          setDescription(
            e.target.value,
          )
        }
        rows={6}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Saving..."
          : "Save Internship"}
      </Button>
    </form>
  );
}