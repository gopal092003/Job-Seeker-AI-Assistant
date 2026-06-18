// src/app/api/resumes/route.ts

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw authError;
    }

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
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
      .select(
        `
          resume_id,
          job_link,
          created_at,
          resume_url
        `,
      )
      .eq("user_id", user.id)
      .order(
        "created_at",
        {
          ascending: false,
        },
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