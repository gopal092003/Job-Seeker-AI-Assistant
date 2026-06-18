// src/app/api/jobs/route.ts

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
      data: jobs,
      error: jobsError,
    } = await supabase
      .from("jobs")
      .select(
        `
          job_uuid,
          job_link,
          posted_at,
          description,
          contact_found,
          is_selected
        `,
      )
      .eq("user_id", user.id)
      .order(
        "posted_at",
        {
          ascending: false,
        },
      );

    if (jobsError) {
      throw jobsError;
    }

    return NextResponse.json(
      jobs ?? [],
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch jobs",
      },
      {
        status: 500,
      },
    );
  }
}