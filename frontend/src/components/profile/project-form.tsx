// src/components/profile/project-form.tsx

"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { errorToast } from "@/hooks/use-toast";

interface ProjectFormProps {
  onSubmit: (project: {
    title: string;
    links: string[];
    description: string;
    skills: string[];
  }) => Promise<void>;
}

export function ProjectForm({
  onSubmit,
}: ProjectFormProps) {
  const [title, setTitle] =
    useState("");

  const [projectLinks, setProjectLinks] =
    useState("");

  const [skills, setSkills] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submitProject = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      if (!title.trim()) {
        throw new Error(
          "Project title is required",
        );
      }

      const links =
        projectLinks
          .split("\n")
          .map((link) =>
            link.trim(),
          )
          .filter(Boolean);

      const projectSkills =
        skills
          .split(",")
          .map((skill) =>
            skill.trim(),
          )
          .filter(Boolean);

      setLoading(true);

      await onSubmit({
        title:
          title.trim(),

        links,

        description:
          description.trim(),

        skills:
          projectSkills,
      });

      resetForm();
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to save project",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setProjectLinks("");
    setSkills("");
    setDescription("");
  };

  return (
    <form
      onSubmit={submitProject}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Project Title
        </label>

        <Input
          value={title}
          placeholder="AI Resume Optimizer"
          onChange={(e) =>
            setTitle(
              e.target.value,
            )
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Skills
        </label>

        <Input
          value={skills}
          placeholder="Next.js, TypeScript, Supabase, PostgreSQL"
          onChange={(e) =>
            setSkills(
              e.target.value,
            )
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Project Links
        </label>

        <Textarea
          value={projectLinks}
          placeholder={`https://github.com/user/project\nhttps://project-demo.vercel.app`}
          onChange={(e) =>
            setProjectLinks(
              e.target.value,
            )
          }
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Description
        </label>

        <Textarea
          value={description}
          placeholder="Describe the project, architecture, technologies, challenges solved, and impact..."
          onChange={(e) =>
            setDescription(
              e.target.value,
            )
          }
          rows={6}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={loading}
        >
          Reset
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Project"}
        </Button>
      </div>
    </form>
  );
}