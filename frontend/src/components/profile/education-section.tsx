"use client";

import { useState } from "react";

import { useEducation } from "@/hooks/use-education";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { EducationCard } from "@/components/profile/education-card";
import { EducationForm } from "@/components/profile/education-form";

export function EducationSection() {
  const {
    education,
    loading,

    createEducation,
    deleteEducation,
  } = useEducation();

  const [open, setOpen] =
    useState(false);

  const handleCreateEducation =
    async (record: {
      degree: string;
      institute: string;
      cgpa?: number;
      startDate?: string;
      endDate?: string;
    }) => {
      try {
        await createEducation(
          record,
        );

        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

  const removeEducation =
    async (
      educationId: string,
    ) => {
      await deleteEducation(
        educationId,
      );
    };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Education
        </h2>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              Add Education
            </Button>
          </DialogTrigger>

          <DialogContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Add Education
              </h3>

              <EducationForm
                onSubmit={
                  handleCreateEducation
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
              Loading education...
            </p>
          ) : education.length ===
            0 ? (
            <p className="text-sm text-muted-foreground">
              No education records added yet.
            </p>
          ) : (
            education.map(
              (record) => (
                <EducationCard
                  key={
                    record.id
                  }
                  education={
                    record
                  }
                  onDelete={
                    removeEducation
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