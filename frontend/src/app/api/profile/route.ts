// src/app/api/profile/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@/lib/supabase/server";

import { profileSchema } from "@/lib/validators/profile";

export async function GET() {
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

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq(
        "user_id",
        user.id,
      )
      .single();

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json({
      profile,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load profile",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
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
      profileSchema.safeParse(
        body,
      );

    if (!validated.success) {
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
      name,
      email,
    } = validated.data;

    const {
      data: profile,
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        name,
        email,
      })
      .eq(
        "user_id",
        user.id,
      )
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update profile",
      },
      {
        status: 500,
      },
    );
  }
}