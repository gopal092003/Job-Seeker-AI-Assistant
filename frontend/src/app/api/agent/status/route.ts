// src/app/api/agent/status/route.ts

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

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
      .select(
        `
          agent_status,
          keywords,
          last_run_at,
          next_run_at
        `,
      )
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json({
      agent_status:
        profile?.agent_status ??
        false,

      keyword_count:
        profile?.keywords
          ?.length ?? 0,

      last_run_at:
        profile?.last_run_at ??
        null,

      next_run_at:
        profile?.next_run_at ??
        null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve agent status",
      },
      {
        status: 500,
      },
    );
  }
}