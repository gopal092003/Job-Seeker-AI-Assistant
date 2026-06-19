// src/app/api/education/route.ts

import { randomUUID } from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@/lib/supabase/server";
import { educationSchema } from "@/lib/validators/education";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
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

    if (profileError) throw profileError;

    const educationIds =
      profile?.education ?? [];

    if (educationIds.length === 0) {
      return NextResponse.json([]);
    }

    const {
      data: education,
      error: educationError,
    } = await supabase
      .from("education")
      .select("*")
      .in(
        "education",
        educationIds,
      );

    if (educationError)
      throw educationError;

    return NextResponse.json(
      education,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch education",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body =
      await request.json();

    const validated =
      educationSchema.safeParse(
        body,
      );

    if (!validated.success) {
      return NextResponse.json(
        {
          message:
            validated.error.issues[0]
              ?.message ??
            "Invalid education data",
        },
        { status: 400 },
      );
    }

    const {
      degree,
      institute,
      cgpa,
      startDate,
      endDate,
    } = validated.data;

    const educationId =
      randomUUID();

    const {
      data: education,
      error: educationError,
    } = await supabase
      .from("education")
      .insert({
        education:
          educationId,

        degree,
        institute,

        cgpa:
          cgpa ?? null,

        start_date:
          startDate ?? null,

        end_date:
          endDate ?? null,
      })
      .select()
      .single();

    if (educationError)
      throw educationError;

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("education")
      .eq("user_id", user.id)
      .single();

    if (profileError)
      throw profileError;

    const currentEducation =
      profile?.education ?? [];

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        education: [
          ...currentEducation,
          education.education,
        ],
      })
      .eq("user_id", user.id);

    if (updateError)
      throw updateError;

    return NextResponse.json(
      {
        success: true,
        education,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create education",
      },
      { status: 500 },
    );
  }
}