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

    return NextResponse.json(
      profile?.handles ?? {},
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
      platform,
      url,
    } = body;

    if (!platform?.trim()) {
      return NextResponse.json(
        {
          message:
            "Platform is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!url?.trim()) {
      return NextResponse.json(
        {
          message:
            "URL is required",
        },
        {
          status: 400,
        },
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          message:
            "URL must be valid",
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

    const currentHandles =
      (profile?.handles as Record<
        string,
        string
      >) ?? {};

    const updatedHandles = {
      ...currentHandles,
      [platform.trim()]:
        url.trim(),
    };

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        handles:
          updatedHandles,
      })
      .eq(
        "user_id",
        user.id,
      );

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        success: true,
        handle: {
          platform:
            platform.trim(),
          url: url.trim(),
        },
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

    const {
      platform,
    } = await request.json();

    if (!platform) {
      return NextResponse.json(
        {
          message:
            "Platform is required",
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

    const currentHandles =
      (profile?.handles as Record<
        string,
        string
      >) ?? {};

    const updatedHandles = {
      ...currentHandles,
    };

    delete updatedHandles[
      platform
    ];

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        handles:
          updatedHandles,
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
            : "Failed to delete handle",
      },
      {
        status: 500,
      },
    );
  }
}