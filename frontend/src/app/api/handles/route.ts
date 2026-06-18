// src/app/api/handles/route.ts

import { NextRequest, NextResponse } from "next/server";

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
      .select("handles")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const handleIds =
      profile?.handles ?? [];

    if (handleIds.length === 0) {
      return NextResponse.json([]);
    }

    const {
      data: handles,
      error: handlesError,
    } = await supabase
      .from("handles")
      .select("*")
      .in("handle_id", handleIds);

    if (handlesError) {
      throw handlesError;
    }

    return NextResponse.json(
      handles,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch handles",
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

    const body =
      await request.json();

    const {
      handle_name,
      handle_link,
    } = body;

    if (!handle_name?.trim()) {
      return NextResponse.json(
        {
          message:
            "Handle name is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!handle_link?.trim()) {
      return NextResponse.json(
        {
          message:
            "Handle link is required",
        },
        {
          status: 400,
        },
      );
    }

    try {
      new URL(handle_link);
    } catch {
      return NextResponse.json(
        {
          message:
            "Handle link must be a valid URL",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: handle,
      error: handleError,
    } = await supabase
      .from("handles")
      .insert({
        user_id: user.id,

        platform:
          handle_name,

        url: handle_link,
      })
      .select()
      .single();

    if (handleError) {
      throw handleError;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("handles")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const currentHandles =
      profile?.handles ?? [];

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        handles: [
          ...currentHandles,
          handle.handle_id,
        ],
      })
      .eq("user_id", user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        success: true,
        handle,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create handle",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: NextRequest,
) {
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

    const { handle_id } =
      await request.json();

    if (!handle_id) {
      return NextResponse.json(
        {
          message:
            "Handle ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("handles")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const {
      error: deleteError,
    } = await supabase
      .from("handles")
      .delete()
      .eq(
        "handle_id",
        handle_id,
      )
      .eq("user_id", user.id);

    if (deleteError) {
      throw deleteError;
    }

    const currentHandles =
      profile?.handles ?? [];

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        handles:
          currentHandles.filter(
            (
              id: string,
            ) => id !== handle_id,
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
            : "Failed to delete handle",
      },
      {
        status: 500,
      },
    );
  }
}