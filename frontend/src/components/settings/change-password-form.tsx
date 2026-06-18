// src/components/settings/change-password-form.tsx

"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  successToast,
  errorToast,
} from "@/hooks/use-toast";

import { supabase } from "@/lib/supabase/client";

export function ChangePasswordForm() {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const validatePasswords =
    () => {
      if (!currentPassword.trim()) {
        throw new Error(
          "Current password is required",
        );
      }

      if (
        newPassword.length < 8
      ) {
        throw new Error(
          "New password must be at least 8 characters",
        );
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        throw new Error(
          "Passwords do not match",
        );
      }

      if (
        currentPassword ===
        newPassword
      ) {
        throw new Error(
          "New password must be different from current password",
        );
      }

      return true;
    };

  const submitPasswordChange =
    async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      try {
        validatePasswords();

        setLoading(true);

        const {
          error,
        } = await supabase.auth.updateUser(
          {
            password:
              newPassword,
          },
        );

        if (error) {
          throw error;
        }

        successToast(
          "Password updated successfully",
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        errorToast(
          error instanceof Error
            ? error.message
            : "Failed to update password",
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <form
      onSubmit={
        submitPasswordChange
      }
      className="space-y-4"
    >
      <Input
        type="password"
        value={
          currentPassword
        }
        placeholder="Current Password"
        onChange={(e) =>
          setCurrentPassword(
            e.target.value,
          )
        }
      />

      <Input
        type="password"
        value={newPassword}
        placeholder="New Password"
        onChange={(e) =>
          setNewPassword(
            e.target.value,
          )
        }
      />

      <Input
        type="password"
        value={
          confirmPassword
        }
        placeholder="Confirm New Password"
        onChange={(e) =>
          setConfirmPassword(
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
          : "Change Password"}
      </Button>
    </form>
  );
}