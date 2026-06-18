// src/app/api/agent/stop/route.ts

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

    const { error } = await supabase
      .from("profiles")
      .update({
        agent_status: false,
      })
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      agent_status: false,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to stop agent",
      },
      {
        status: 500,
      },
    );
  }
}