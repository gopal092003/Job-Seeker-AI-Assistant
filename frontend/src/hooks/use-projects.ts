// src/hooks/use-projects.ts

"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

import {
  successToast,
  errorToast,
} from "@/hooks/use-toast";

import type { Project } from "@/types/profile";

export function useProjects() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchProjects =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setProjects([]);
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("projects")
          .eq(
            "user_id",
            user.id,
          )
          .single();

        if (profileError) {
          throw profileError;
        }

        const projectIds =
          profile?.projects ?? [];

        if (
          projectIds.length === 0
        ) {
          setProjects([]);
          return;
        }

        const {
          data,
          error:
            projectsError,
        } = await supabase
          .from("projects")
          .select("*")
          .in(
            "project",
            projectIds,
          );

        if (projectsError) {
          throw projectsError;
        }

        const mappedProjects: Project[] =
          (data ?? []).map(
            (project) => ({
              id:
                project.project,

              title:
                project.title,

              links:
                project.links ??
                [],

              description:
                project.description,

              skills:
                project.skills ??
                [],

              createdAt:
                project.created_at,

              updatedAt:
                project.updated_at,
            }),
          );

        setProjects(
          mappedProjects,
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load projects";

        setError(message);

        errorToast(message);
      } finally {
        setLoading(false);
      }
    }, []);

  const createProject =
    useCallback(
      async (
        project: Omit<
          Project,
          | "id"
          | "createdAt"
          | "updatedAt"
        >,
      ) => {
        try {
          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) {
            throw new Error(
              "User not authenticated",
            );
          }

          const projectId =
            crypto.randomUUID();

          const {
            error:
              insertError,
          } = await supabase
            .from("projects")
            .insert({
              project:
                projectId,

              title:
                project.title,

              links:
                project.links,

              description:
                project.description,

              skills:
                project.skills,
            });

          if (insertError) {
            throw insertError;
          }

          const {
            data: profile,
            error:
              profileError,
          } = await supabase
            .from("profiles")
            .select("projects")
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (profileError) {
            throw profileError;
          }

          const {
            error:
              updateError,
          } = await supabase
            .from("profiles")
            .update({
              projects: [
                ...(profile?.projects ??
                  []),
                projectId,
              ],
            })
            .eq(
              "user_id",
              user.id,
            );

          if (updateError) {
            throw updateError;
          }

          successToast(
            "Project created successfully",
          );

          await fetchProjects();
        } catch (err) {
          errorToast(
            err instanceof Error
              ? err.message
              : "Failed to create project",
          );
        }
      },
      [fetchProjects],
    );

  const deleteProject =
    useCallback(
      async (
        projectId: string,
      ) => {
        try {
          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) {
            throw new Error(
              "User not authenticated",
            );
          }

          const {
            error:
              deleteError,
          } = await supabase
            .from("projects")
            .delete()
            .eq(
              "project",
              projectId,
            );

          if (deleteError) {
            throw deleteError;
          }

          const {
            data: profile,
            error:
              profileError,
          } = await supabase
            .from("profiles")
            .select("projects")
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (profileError) {
            throw profileError;
          }

          const {
            error:
              updateError,
          } = await supabase
            .from("profiles")
            .update({
              projects: (
                profile?.projects ??
                []
              ).filter(
                (
                  id: string,
                ) =>
                  id !==
                  projectId,
              ),
            })
            .eq(
              "user_id",
              user.id,
            );

          if (updateError) {
            throw updateError;
          }

          setProjects(
            (current) =>
              current.filter(
                (
                  project,
                ) =>
                  project.id !==
                  projectId,
              ),
          );

          successToast(
            "Project deleted successfully",
          );
        } catch (err) {
          errorToast(
            err instanceof Error
              ? err.message
              : "Failed to delete project",
          );
        }
      },
      [],
    );

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,

    fetchProjects,
    createProject,
    deleteProject,
  };
}
