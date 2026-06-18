// src/app/settings/page.tsx

"use client";

import { useRouter } from "next/navigation";

import { ChangeEmailForm } from "@/components/settings/change-email-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";

import { Button } from "@/components/ui/button";

import { PageShell } from "@/components/layout/page-shell";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <Button
            variant="outline"
            onClick={() =>
              router.back()
            }
          >
            Back
          </Button>
        </div>

        <section className="space-y-4 rounded-lg border p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Change Email
            </h2>

            <p className="text-sm text-muted-foreground">
              Update your account
              email address.
            </p>
          </div>

          <ChangeEmailForm />
        </section>

        <section className="space-y-4 rounded-lg border p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Change Password
            </h2>

            <p className="text-sm text-muted-foreground">
              Update your account
              password.
            </p>
          </div>

          <ChangePasswordForm />
        </section>

        <section className="space-y-4 rounded-lg border border-destructive p-6">
          <div>
            <h2 className="text-xl font-semibold text-destructive">
              Danger Zone
            </h2>

            <p className="text-sm text-muted-foreground">
              Permanently delete
              your account and all
              associated data.
            </p>
          </div>

          <DeleteAccountDialog />
        </section>
      </div>
    </PageShell>
  );
}