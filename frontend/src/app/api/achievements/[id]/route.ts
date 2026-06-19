// src/app/api/achievements/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

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
    const { id: achievementId } =
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
      .select(
        "achievements",
      )
      .eq(
        "user_id",
        user.id,
      )
      .single();

    if (
      profileError
    ) {
      throw profileError;
    }

    const currentAchievements =
      profile?.achievements ??
      [];

    if (
      !currentAchievements.includes(
        achievementId,
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Achievement not found",
        },
        {
          status: 404,
        },
      );
    }

    const {
      error: deleteError,
    } = await supabase
      .from(
        "achievements",
      )
      .delete()
      .eq(
        "achievement",
        achievementId,
      );

    if (
      deleteError
    ) {
      throw deleteError;
    }

    const {
      error:
        updateError,
    } = await supabase
      .from("profiles")
      .update({
        achievements:
          currentAchievements.filter(
            (
              id: string,
            ) =>
              id !==
              achievementId,
          ),
      })
      .eq(
        "user_id",
        user.id,
      );

    if (
      updateError
    ) {
      throw updateError;
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete achievement",
      },
      {
        status: 500,
      },
    );
  }
}