// src/app/api/resumes/route.ts

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError) {
      throw authError;
    }

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: resumes,
      error: resumesError,
    } = await supabase
      .from("resumes")
      .select(`
        job_link,
        intern,
        project_1,
        project_2,
        project_3,
        achievement
      `)
      .eq(
        "user_id",
        user.id,
      );

    if (resumesError) {
      throw resumesError;
    }

    return NextResponse.json(
      resumes ?? [],
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch resumes",
      },
      {
        status: 500,
      },
    );
  }
}