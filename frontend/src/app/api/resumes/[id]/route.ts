// src/app/api/resumes/[id]/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const {
      id: jobLink,
    } = await params;

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
      data: resume,
      error: resumeError,
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
      )
      .eq(
        "job_link",
        decodeURIComponent(
          jobLink,
        ),
      )
      .single();

    if (resumeError) {
      throw resumeError;
    }

    if (!resume) {
      return NextResponse.json(
        {
          message:
            "Resume not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      resume,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch resume",
      },
      {
        status: 500,
      },
    );
  }
}