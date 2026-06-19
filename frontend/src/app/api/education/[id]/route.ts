// src/app/api/education/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id: educationId } =
      await params;

    const supabase =
      await createClient();

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
      .select("education")
      .eq(
        "user_id",
        user.id,
      )
      .single();

    if (profileError) {
      throw profileError;
    }

    const currentEducation =
      (profile?.education ??
        []) as string[];

    if (
      !currentEducation.includes(
        educationId,
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Education record not found",
        },
        {
          status: 404,
        },
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
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        education:
          currentEducation.filter(
            (id) =>
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

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete education",
      },
      {
        status: 500,
      },
    );
  }
}