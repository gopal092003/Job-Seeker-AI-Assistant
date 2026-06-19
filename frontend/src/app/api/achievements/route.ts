// src/app/api/achievements/route.ts

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { achievementSchema } from "@/lib/validators/achievement";

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
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("achievements")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const achievementIds =
      profile?.achievements ?? [];

    if (achievementIds.length === 0) {
      return NextResponse.json([]);
    }

    const {
      data: achievements,
      error: achievementsError,
    } = await supabase
      .from("achievements")
      .select("*")
      .in(
        "achievement",
        achievementIds,
      );

    if (achievementsError) {
      throw achievementsError;
    }

    return NextResponse.json(
      achievements,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch achievements",
      },
      {
        status: 500,
      },
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

    const body =
      await request.json();

    const validated =
      achievementSchema.safeParse(
        body,
      );

    if (
      !validated.success
    ) {
      return NextResponse.json(
        {
          message:
            validated.error
              .issues[0]
              ?.message,
        },
        {
          status: 400,
        },
      );
    }

    const {
      description,
      proof,
      date,
    } = validated.data;

    const {
      data: achievement,
      error:
        achievementError,
    } = await supabase
      .from(
        "achievements",
      )
      .insert({
        description,

        proof:
          proof || null,

        date:
          date || null,
      })
      .select()
      .single();

    if (
      achievementError
    ) {
      throw achievementError;
    }

    const {
      data: profile,
      error:
        profileError,
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

    const {
      error:
        updateError,
    } = await supabase
      .from("profiles")
      .update({
        achievements:
          [
            ...currentAchievements,
            achievement.achievement,
          ],
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
        achievement,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof
          Error
            ? error.message
            : "Failed to create achievement",
      },
      {
        status: 500,
      },
    );
  }
}