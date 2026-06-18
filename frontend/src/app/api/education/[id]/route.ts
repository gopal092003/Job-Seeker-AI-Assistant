// src/app/api/education/[id]/route.ts

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
    const { id: educationId } =
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
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("education")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const {
      error: deleteError,
    } = await supabase
      .from("education")
      .delete()
      .eq(
        "education_id",
        educationId,
      )
      .eq("user_id", user.id);

    if (deleteError) {
      throw deleteError;
    }

    const currentEducation =
      profile?.education ?? [];

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        education:
          currentEducation.filter(
            (
              id: string,
            ) =>
              id !== educationId,
          ),
      })
      .eq("user_id", user.id);

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