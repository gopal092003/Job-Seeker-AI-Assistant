// src/components/profile/internships-section.tsx

"use client";

import { useState } from "react";

import { useInternships } from "@/hooks/use-internships";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import { InternshipCard } from "@/components/profile/internship-card";

import { InternshipForm } from "@/components/profile/internship-form";

export function InternshipsSection() {
  const {
    internships,
    loading,

    fetchInternships,
    createInternship,
    deleteInternship,
  } = useInternships();

  const [open, setOpen] =
    useState(false);

  const loadInternships =
    async () => {
      await fetchInternships();
    };

  const handleCreateInternship =
    async (internship: {
      companyName: string;
      role: string;
      description: string;
      startDate?: string;
      endDate?: string;
    }) => {
      await createInternship(
        internship,
      );

      setOpen(false);

      await loadInternships();
    };

  const removeInternship =
    async (
      internshipId: string,
    ) => {
      await deleteInternship(
        internshipId,
      );
    };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Internships
        </h2>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              Add Internship
            </Button>
          </DialogTrigger>

          <DialogContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Add Internship
              </h3>

              <InternshipForm
                onSubmit={
                  handleCreateInternship
                }
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="max-h-[500px]">
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading internships...
            </p>
          ) : internships.length ===
            0 ? (
            <p className="text-sm text-muted-foreground">
              No internships added yet.
            </p>
          ) : (
            internships.map(
              (
                internship,
              ) => (
                <InternshipCard
                  key={
                    internship.id
                  }
                  internship={
                    internship
                  }
                  onDelete={
                    removeInternship
                  }
                />
              ),
            )
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
