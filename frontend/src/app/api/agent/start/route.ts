// src/app/api/agent/start/route.ts

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST() {
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

    const { data: profile, error } =
      await supabase
        .from("profiles")
        .select(
          "keywords, agent_status",
        )
        .eq("user_id", user.id)
        .single();

    if (error) {
      throw error;
    }

    const keywordCount =
      profile?.keywords?.length ?? 0;

    if (keywordCount === 0) {
      return NextResponse.json(
        {
          message:
            "Add at least one keyword before starting the agent",
        },
        {
          status: 400,
        },
      );
    }

    await supabase
      .from("profiles")
      .update({
        agent_status: true,
      })
      .eq("user_id", user.id);

    return NextResponse.json({
      success: true,
      agent_status: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to start agent",
      },
      {
        status: 500,
      },
    );
  }
}