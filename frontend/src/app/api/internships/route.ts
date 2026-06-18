// src/app/api/internships/route.ts

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { internshipSchema } from "@/lib/validators/internship";

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
      .select("intern")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const internshipIds =
      profile?.intern ?? [];

    if (internshipIds.length === 0) {
      return NextResponse.json([]);
    }

    const {
      data: internships,
      error: internshipsError,
    } = await supabase
      .from("internships")
      .select("*")
      .in(
        "internship",
        internshipIds,
      );

    if (internshipsError) {
      throw internshipsError;
    }

    return NextResponse.json(
      internships,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch internships",
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

    const validated =
      internshipSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          message:
            validated.error.issues[0]
              ?.message,
        },
        {
          status: 400,
        },
      );
    }

    const {
      company_name,
      role,
      internship_links,
      description,
    } = validated.data;

    const {
      data: internship,
      error: internshipError,
    } = await supabase
      .from("internships")
      .insert({
        user_id: user.id,

        company:
          company_name,

        designation:
          role,

        links:
          internship_links,

        description,
      })
      .select()
      .single();

    if (internshipError) {
      throw internshipError;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("intern")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const currentInternships =
      profile?.intern ?? [];

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        intern: [
          ...currentInternships,
          internship.internship,
        ],
      })
      .eq("user_id", user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        success: true,
        internship,
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
            : "Failed to create internship",
      },
      {
        status: 500,
      },
    );
  }
}