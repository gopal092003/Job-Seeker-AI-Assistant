"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { errorToast } from "@/hooks/use-toast";

interface AchievementFormProps {
  onSubmit: (achievement: {
    description: string;
    file: File;
  }) => Promise<void>;
}

export function AchievementForm({
  onSubmit,
}: AchievementFormProps) {
  const [description, setDescription] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const submitAchievement = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      const trimmedDescription =
        description.trim();

      if (!trimmedDescription) {
        throw new Error(
          "Achievement description is required",
        );
      }

      if (!file) {
        throw new Error(
          "Please upload proof",
        );
      }

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (
        !allowedTypes.includes(
          file.type,
        )
      ) {
        throw new Error(
          "Unsupported file type",
        );
      }

      setLoading(true);

      await onSubmit({
        description:
          trimmedDescription,
        file,
      });

      setDescription("");
      setFile(null);
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to save achievement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={
        submitAchievement
      }
      className="space-y-4"
    >
      <Textarea
        value={description}
        placeholder="Describe your achievement..."
        rows={5}
        onChange={(e) =>
          setDescription(
            e.target.value,
          )
        }
      />

      <Input
        type="file"
        accept="
          .png,
          .jpg,
          .jpeg,
          .webp,
          .pdf,
          .doc,
          .docx
        "
        onChange={(e) =>
          setFile(
            e.target.files?.[0] ??
              null,
          )
        }
      />

      {file && (
        <p className="text-sm text-muted-foreground">
          Selected: {file.name}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Uploading..."
          : "Save Achievement"}
      </Button>
    </form>
  );
}