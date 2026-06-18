// src/components/profile/keyword-form.tsx

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { keywordSchema } from "@/lib/validators/keyword";

import {
  errorToast,
} from "@/hooks/use-toast";

interface KeywordFormProps {
  onSubmit: (keyword: string) => Promise<void>;
}

export function KeywordForm({
  onSubmit,
}: KeywordFormProps) {
  const [keyword, setKeyword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submitKeyword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      const validated =
        keywordSchema.safeParse({
          keyword,
        });

      if (!validated.success) {
        throw new Error(
          validated.error.issues[0]?.message ??
            "Invalid keyword",
        );
      }

      setLoading(true);

      await onSubmit(
        validated.data.keyword,
      );

      setKeyword("");
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to add keyword",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitKeyword}
      className="flex gap-2"
    >
      <Input
        value={keyword}
        placeholder="e.g. AI Engineer"
        onChange={(e) =>
          setKeyword(e.target.value)
        }
      />

      <Button
        type="submit"
        disabled={
          loading || !keyword.trim()
        }
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}