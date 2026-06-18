// src/hooks/use-internships.ts

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

import type { Internship } from "@/types/profile";

export function useInternships() {
  const [internships, setInternships] =
    useState<Internship[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchInternships =
    useCallback(async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setInternships([]);
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("intern")
          .eq(
            "user_id",
            user.id,
          )
          .single();

        if (profileError) {
          throw profileError;
        }

        const internshipIds =
          profile?.intern ?? [];

        if (
          internshipIds.length === 0
        ) {
          setInternships([]);
          return;
        }

        const {
          data,
          error,
        } = await supabase
          .from("internships")
          .select(`
            *,
            companies (
              name
            )
          `)
          .in(
            "internship",
            internshipIds,
          );

        if (error) {
          throw error;
        }

        const mappedInternships: Internship[] =
          (data ?? []).map(
            (internship) => ({
              id:
                internship.internship,

              companyName:
                internship
                  .companies
                  ?.name ?? "",

              role:
                internship.designation,

              description:
                internship.description,

              startDate:
                internship.start_date,

              endDate:
                internship.end_date,

              createdAt:
                internship.created_at,

              updatedAt:
                internship.updated_at,
            }),
          );

        setInternships(
          mappedInternships,
        );
      } catch (error) {
        errorToast(
          error instanceof Error
            ? error.message
            : "Failed to load internships",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const createInternship =
    useCallback(
      async (
        internship: Omit<
          Internship,
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

          let companyId: string;

          const {
            data:
              existingCompany,
          } = await supabase
            .from("companies")
            .select(
              "company",
            )
            .eq(
              "name",
              internship.companyName,
            )
            .maybeSingle();

          if (
            existingCompany
          ) {
            companyId =
              existingCompany.company;
          } else {
            companyId =
              crypto.randomUUID();

            const {
              error:
                companyError,
            } =
              await supabase
                .from(
                  "companies",
                )
                .insert({
                  company:
                    companyId,
                  name: internship.companyName,
                });

            if (
              companyError
            ) {
              throw companyError;
            }
          }

          const internshipId =
            crypto.randomUUID();

          const {
            error:
              internshipError,
          } = await supabase
            .from(
              "internships",
            )
            .insert({
              internship:
                internshipId,

              company:
                companyId,

              designation:
                internship.role,

              description:
                internship.description,

              start_date:
                internship.startDate,

              end_date:
                internship.endDate,
            });

          if (
            internshipError
          ) {
            throw internshipError;
          }

          const {
            data: profile,
            error:
              profileFetchError,
          } = await supabase
            .from("profiles")
            .select("intern")
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (
            profileFetchError
          ) {
            throw profileFetchError;
          }

          const {
            error:
              profileUpdateError,
          } = await supabase
            .from("profiles")
            .update({
              intern: [
                ...(profile?.intern ??
                  []),
                internshipId,
              ],
            })
            .eq(
              "user_id",
              user.id,
            );

          if (
            profileUpdateError
          ) {
            throw profileUpdateError;
          }

          successToast(
            "Internship added successfully",
          );

          await fetchInternships();
        } catch (error) {
          errorToast(
            error instanceof Error
              ? error.message
              : "Failed to create internship",
          );
        }
      },
      [fetchInternships],
    );

  const deleteInternship =
    useCallback(
      async (
        internshipId: string,
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
              internshipDeleteError,
          } = await supabase
            .from(
              "internships",
            )
            .delete()
            .eq(
              "internship",
              internshipId,
            );

          if (
            internshipDeleteError
          ) {
            throw internshipDeleteError;
          }

          const {
            data: profile,
            error:
              profileFetchError,
          } = await supabase
            .from("profiles")
            .select("intern")
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (
            profileFetchError
          ) {
            throw profileFetchError;
          }

          const {
            error:
              profileUpdateError,
          } = await supabase
            .from("profiles")
            .update({
              intern: (
                profile?.intern ??
                []
              ).filter(
                (
                  id: string,
                ) =>
                  id !==
                  internshipId,
              ),
            })
            .eq(
              "user_id",
              user.id,
            );

          if (
            profileUpdateError
          ) {
            throw profileUpdateError;
          }

          setInternships(
            (current) =>
              current.filter(
                (
                  internship,
                ) =>
                  internship.id !==
                  internshipId,
              ),
          );

          successToast(
            "Internship deleted successfully",
          );
        } catch (error) {
          errorToast(
            error instanceof Error
              ? error.message
              : "Failed to delete internship",
          );
        }
      },
      [],
    );

  useEffect(() => {
    void fetchInternships();
  }, [fetchInternships]);

  return {
    internships,
    loading,

    fetchInternships,
    createInternship,
    deleteInternship,
  };
}
