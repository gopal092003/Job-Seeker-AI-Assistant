// src/components/profile/handle-form.tsx

"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { errorToast } from "@/hooks/use-toast";

interface HandleFormProps {
  onSubmit: (handle: {
    platform: string;
    url: string;
  }) => Promise<void>;
}

export function HandleForm({
  onSubmit,
}: HandleFormProps) {
  const [handleName, setHandleName] =
    useState("");

  const [handleLink, setHandleLink] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submitHandle = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      if (!handleName.trim()) {
        throw new Error(
          "Handle name is required",
        );
      }

      if (!handleLink.trim()) {
        throw new Error(
          "Handle link is required",
        );
      }

      try {
        new URL(handleLink);
      } catch {
        throw new Error(
          "Handle link must be a valid URL",
        );
      }

      setLoading(true);

      await onSubmit({
        platform:
          handleName.trim(),
        url: handleLink.trim(),
      });

      setHandleName("");
      setHandleLink("");
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to save handle",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandle}
      className="space-y-4"
    >
      <Input
        value={handleName}
        placeholder="Handle Name (GitHub, LinkedIn, LeetCode...)"
        onChange={(e) =>
          setHandleName(
            e.target.value,
          )
        }
      />

      <Input
        type="url"
        value={handleLink}
        placeholder="https://..."
        onChange={(e) =>
          setHandleLink(
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
          : "Save Handle"}
      </Button>
    </form>
  );
}