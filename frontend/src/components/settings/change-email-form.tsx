// src/components/settings/change-email-form.tsx

"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  successToast,
  errorToast,
} from "@/hooks/use-toast";

import { supabase } from "@/lib/supabase/client";

export function ChangeEmailForm() {
  const [newEmail, setNewEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const validateEmail = (
    email: string,
  ) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim(),
    );
  };

  const submitEmailChange =
    async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      try {
        if (
          !validateEmail(
            newEmail,
          )
        ) {
          throw new Error(
            "Please enter a valid email address",
          );
        }

        setLoading(true);

        const {
          error,
        } = await supabase.auth.updateUser(
          {
            email:
              newEmail.trim(),
          },
        );

        if (error) {
          throw error;
        }

        successToast(
          "Verification email sent to your new address",
        );

        setNewEmail("");
      } catch (error) {
        errorToast(
          error instanceof Error
            ? error.message
            : "Failed to change email",
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <form
      onSubmit={
        submitEmailChange
      }
      className="space-y-4"
    >
      <Input
        type="email"
        value={newEmail}
        placeholder="New Email Address"
        onChange={(e) =>
          setNewEmail(
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
          ? "Updating..."
          : "Change Email"}
      </Button>
    </form>
  );
}