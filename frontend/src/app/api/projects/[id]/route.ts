// src/app/api/projects/[id]/route.ts

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

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const { id: projectId } =
      await params;

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

    const currentProjects =
      profile?.projects ??
      [];

    if (
      !currentProjects.includes(
        projectId,
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Project not found",
        },
        {
          status: 404,
        },
      );
    }

    const {
      error: deleteError,
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
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        projects:
          currentProjects.filter(
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

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete project",
      },
      {
        status: 500,
      },
    );
  }
}