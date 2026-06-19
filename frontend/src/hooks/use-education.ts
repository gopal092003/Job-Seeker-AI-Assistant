// src/hooks/use-education.ts

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

import type { Education } from "@/types/profile";

export function useEducation() {
  const [education, setEducation] =
    useState<Education[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchEducation =
    useCallback(async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setEducation([]);
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("education")
          .eq(
            "user_id",
            user.id,
          )
          .single();

        if (profileError) {
          throw profileError;
        }

        const educationIds =
          profile?.education ?? [];

        if (
          educationIds.length === 0
        ) {
          setEducation([]);
          return;
        }

        const {
          data: educationRows,
          error: educationError,
        } = await supabase
          .from("education")
          .select("*")
          .in(
            "education",
            educationIds,
          );

        if (educationError) {
          throw educationError;
        }

        const degreeIds = [
          ...new Set(
            (educationRows ?? [])
              .map(
                (item) =>
                  item.degree,
              )
              .filter(Boolean),
          ),
        ];

        const instituteIds = [
          ...new Set(
            (educationRows ?? [])
              .map(
                (item) =>
                  item.institute,
              )
              .filter(Boolean),
          ),
        ];

        const {
          data: degreesData,
          error: degreesError,
        } =
          degreeIds.length > 0
            ? await supabase
                .from("degrees")
                .select(
                  "degree,name",
                )
                .in(
                  "degree",
                  degreeIds,
                )
            : {
                data: [],
                error: null,
              };

        if (degreesError) {
          throw degreesError;
        }

        const {
          data: institutesData,
          error:
            institutesError,
        } =
          instituteIds.length > 0
            ? await supabase
                .from(
                  "institutes",
                )
                .select(
                  "institute,name",
                )
                .in(
                  "institute",
                  instituteIds,
                )
            : {
                data: [],
                error: null,
              };

        if (
          institutesError
        ) {
          throw institutesError;
        }

        const degreeMap =
          new Map(
            (
              degreesData ??
              []
            ).map(
              (
                degree: any,
              ) => [
                degree.degree,
                degree.name,
              ],
            ),
          );

        const instituteMap =
          new Map(
            (
              institutesData ??
              []
            ).map(
              (
                institute: any,
              ) => [
                institute.institute,
                institute.name,
              ],
            ),
          );

        const mappedEducation: Education[] =
          (
            educationRows ??
            []
          ).map(
            (item: any) => ({
              id:
                item.education,

              degree:
                item.degree,

              institute:
                item.institute,

              degreeName:
                degreeMap.get(
                  item.degree,
                ) ??
                "Unknown Degree",

              instituteName:
                instituteMap.get(
                  item.institute,
                ) ??
                "Unknown Institute",

              cgpa:
                item.cgpa !==
                  null &&
                item.cgpa !==
                  undefined
                  ? Number(
                      item.cgpa,
                    )
                  : null,

              startDate:
                item.start_date,

              endDate:
                item.end_date,

              createdAt:
                item.created_at,

              updatedAt:
                item.updated_at,
            }),
          );

        setEducation(
          mappedEducation,
        );
      } catch (error) {
        console.error(
          "fetchEducation error:",
          error,
        );

        errorToast(
          "Unable to load education.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const getOrCreateDegree =
    useCallback(
      async (
        degreeName: string,
      ) => {
        const {
          data: existing,
        } = await supabase
          .from("degrees")
          .select("degree")
          .eq(
            "name",
            degreeName.trim(),
          )
          .maybeSingle();

        if (existing) {
          return existing.degree;
        }

        const degreeId =
          crypto.randomUUID();

        const { error } =
          await supabase
            .from("degrees")
            .insert({
              degree:
                degreeId,
              name: degreeName.trim(),
            });

        if (error) {
          throw error;
        }

        return degreeId;
      },
      [],
    );

  const getOrCreateInstitute =
    useCallback(
      async (
        instituteName: string,
      ) => {
        const {
          data: existing,
        } = await supabase
          .from("institutes")
          .select(
            "institute",
          )
          .eq(
            "name",
            instituteName.trim(),
          )
          .maybeSingle();

        if (existing) {
          return existing.institute;
        }

        const instituteId =
          crypto.randomUUID();

        const { error } =
          await supabase
            .from("institutes")
            .insert({
              institute:
                instituteId,
              name:
                instituteName.trim(),
            });

        if (error) {
          throw error;
        }

        return instituteId;
      },
      [],
    );

  type CreateEducationInput =
    {
      degree: string;
      institute: string;
      cgpa?:
        | number
        | null;
      startDate?:
        | string
        | null;
      endDate?:
        | string
        | null;
    };

  const createEducation =
    useCallback(
      async (
        record: CreateEducationInput,
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

          const degreeId =
            await getOrCreateDegree(
              record.degree,
            );

          const instituteId =
            await getOrCreateInstitute(
              record.institute,
            );

          const educationId =
            crypto.randomUUID();

          const {
            error: insertError,
          } = await supabase
            .from("education")
            .insert({
              education:
                educationId,
              degree:
                degreeId,
              institute:
                instituteId,
              cgpa:
                record.cgpa,
              start_date:
                record.startDate,
              end_date:
                record.endDate,
            });

          if (insertError) {
            throw insertError;
          }

          const {
            data: profile,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select("education")
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (profileError) {
            throw profileError;
          }

          const {
            error: updateError,
          } = await supabase
            .from("profiles")
            .update({
              education: [
                ...new Set([
                  ...(profile?.education ??
                    []),
                  educationId,
                ]),
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
            "Education added successfully",
          );

          await fetchEducation();
        } catch (
          error: any
        ) {
          console.error(
            error,
          );

          errorToast(
            error?.message ??
              "Unable to save education.",
          );
        }
      },
      [
        fetchEducation,
        getOrCreateDegree,
        getOrCreateInstitute,
      ],
    );

  const deleteEducation =
    useCallback(
      async (
        educationId: string,
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
            error: deleteError,
          } = await supabase
            .from("education")
            .delete()
            .eq(
              "education",
              educationId,
            );

          if (deleteError) {
            throw deleteError;
          }

          const {
            data: profile,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select("education")
            .eq(
              "user_id",
              user.id,
            )
            .single();

          if (profileError) {
            throw profileError;
          }

          const {
            error: updateError,
          } = await supabase
            .from("profiles")
            .update({
              education: (
                profile?.education ??
                []
              ).filter(
                (
                  id: string,
                ) =>
                  id !==
                  educationId,
              ),
            })
            .eq(
              "user_id",
              user.id,
            );

          if (updateError) {
            throw updateError;
          }

          setEducation(
            (
              current,
            ) =>
              current.filter(
                (
                  item,
                ) =>
                  item.id !==
                  educationId,
              ),
          );

          successToast(
            "Education deleted successfully",
          );
        } catch (error) {
          console.error(
            "deleteEducation error:",
            error,
          );

          errorToast(
            "Unable to delete education.",
          );
        }
      },
      [],
    );

  useEffect(() => {
    void fetchEducation();
  }, [fetchEducation]);

  return {
    education,
    loading,

    fetchEducation,
    createEducation,
    deleteEducation,
  };
}