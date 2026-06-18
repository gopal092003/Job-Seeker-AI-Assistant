// src/app/api/auth/route.ts

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    const user = session?.user ?? null;

    return NextResponse.json({
      authenticated:
        Boolean(user),

      session,

      user: user
        ? {
            id: user.id,
            email:
              user.email,

            created_at:
              user.created_at,

            last_sign_in_at:
              user.last_sign_in_at,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,

        session: null,

        user: null,

        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve session",
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
    const supabase = await createClient();

    const body =
      await request.json();

    const action =
      body?.action;

    switch (action) {
      case "refresh-session": {
        const {
          data: { session },
          error,
        } =
          await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,

          authenticated:
            Boolean(
              session?.user,
            ),

          session,

          user:
            session?.user ??
            null,
        });
      }

      case "logout": {
        const { error } =
          await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
        });
      }

      default:
        return NextResponse.json(
          {
            message:
              "Invalid auth action",
          },
          {
            status: 400,
          },
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Auth helper failed",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE() {
  try {
    const supabase =
      await createClient();

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,

      authenticated: false,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to sign out",
      },
      {
        status: 500,
      },
    );
  }
}