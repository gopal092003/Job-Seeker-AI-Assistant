// src/components/profile/projects-section.tsx

"use client";

import { useState } from "react";

import { useProjects } from "@/hooks/use-projects";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ProjectCard } from "@/components/profile/project-card";

import { ProjectForm } from "@/components/profile/project-form";

export function ProjectsSection() {
  const {
    projects,
    loading,

    createProject,
    deleteProject,
  } = useProjects();

  const [open, setOpen] =
    useState(false);

  const handleCreateProject =
    async (project: {
      title: string;
      links: string[];
      description: string;
      skills: string[];
    }) => {
      await createProject(
        project,
      );

      setOpen(false);
    };

  const removeProject =
    async (
      projectId: string,
    ) => {
      await deleteProject(
        projectId,
      );
    };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Projects
        </h2>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              Add Project
            </Button>
          </DialogTrigger>

          <DialogContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Add Project
              </h3>

              <ProjectForm
                onSubmit={
                  handleCreateProject
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
              Loading projects...
            </p>
          ) : projects.length ===
            0 ? (
            <p className="text-sm text-muted-foreground">
              No projects added yet.
            </p>
          ) : (
            projects.map(
              (
                project,
              ) => (
                <ProjectCard
                  key={
                    project.id
                  }
                  project={
                    project
                  }
                  onDelete={
                    removeProject
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