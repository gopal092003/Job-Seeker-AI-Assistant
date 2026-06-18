// src/app/api/resumes/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

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
    const { id: resumeId } =
      await params;

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
      data: resume,
      error: resumeError,
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
      .eq(
        "resume_id",
        resumeId,
      )
      .eq("user_id", user.id)
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

    return NextResponse.json({
      download_url:
        resume.resume_url,

      metadata: {
        resume_id:
          resume.resume_id,

        job_link:
          resume.job_link,

        created_at:
          resume.created_at,
      },
    });
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