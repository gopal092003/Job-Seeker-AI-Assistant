// src/components/settings/delete-account-dialog.tsx

"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  successToast,
  errorToast,
} from "@/hooks/use-toast";

interface DeleteAccountDialogProps {
  open?: boolean;

  onOpenChange?: (
    open: boolean,
  ) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [
    internalOpen,
    setInternalOpen,
  ] = useState(false);

  const [
    confirmationText,
    setConfirmationText,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const isControlled =
    open !== undefined;

  const dialogOpen =
    isControlled
      ? open
      : internalOpen;

  const setDialogOpen = (
    value: boolean,
  ) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  const closeDialog = () => {
    setConfirmationText("");

    setDialogOpen(false);
  };

  const confirmDelete =
    async () => {
      try {
        if (
          confirmationText !==
          "DELETE"
        ) {
          throw new Error(
            'Type "DELETE" to confirm account deletion',
          );
        }

        setLoading(true);

        const response =
          await fetch(
            "/api/account/delete",
            {
              method: "DELETE",
            },
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ??
              "Failed to delete account",
          );
        }

        successToast(
          "Account deleted successfully",
        );

        window.location.href =
          "/login";
      } catch (error) {
        errorToast(
          error instanceof Error
            ? error.message
            : "Failed to delete account",
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={
        setDialogOpen
      }
    >
      <DialogTrigger asChild>
        <Button
          variant="destructive"
        >
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Delete Account
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be
              undone. All profile
              data, projects,
              internships,
              education,
              achievements, and
              handles will be
              permanently removed.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Type{" "}
              <span className="font-bold">
                DELETE
              </span>{" "}
              to confirm
            </p>

            <Input
              value={
                confirmationText
              }
              placeholder="DELETE"
              onChange={(e) =>
                setConfirmationText(
                  e.target.value,
                )
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={
                closeDialog
              }
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={
                confirmDelete
              }
              disabled={loading}
            >
              {loading
                ? "Deleting..."
                : "Delete Account"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}