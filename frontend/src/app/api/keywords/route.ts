// src/app/api/keywords/route.ts

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { keywordSchema } from "@/lib/validators/keyword";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("keywords")
        .eq("user_id", user.id)
        .single();

    if (profileError) {
      throw profileError;
    }

    const keywordIds =
      profile?.keywords ?? [];

    if (keywordIds.length === 0) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("keywords")
      .select("*")
      .in("keyword", keywordIds);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch keywords",
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
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body =
      await request.json();

    const validated =
      keywordSchema.safeParse(body);

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

    const keywordName =
      validated.data.keyword.trim();

    const { data: existingKeyword } =
      await supabase
        .from("keywords")
        .select("*")
        .eq("name", keywordName)
        .maybeSingle();

    let keywordId: string;

    if (existingKeyword) {
      keywordId =
        existingKeyword.keyword;

      await supabase
        .from("keywords")
        .update({
          user_ids: Array.from(
            new Set([
              ...(existingKeyword.user_ids ??
                []),
              user.id,
            ]),
          ),
        })
        .eq(
          "keyword",
          existingKeyword.keyword,
        );
    } else {
      const { data, error } =
        await supabase
          .from("keywords")
          .insert({
            name: keywordName,
            user_ids: [user.id],
          })
          .select()
          .single();

      if (error) {
        throw error;
      }

      keywordId = data.keyword;
    }

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("keywords")
        .eq("user_id", user.id)
        .single();

    const currentKeywords =
      profile?.keywords ?? [];

    await supabase
      .from("profiles")
      .update({
        keywords: Array.from(
          new Set([
            ...currentKeywords,
            keywordId,
          ]),
        ),
      })
      .eq("user_id", user.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create keyword",
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
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { keywordId } =
      await request.json();

    if (!keywordId) {
      return NextResponse.json(
        {
          message:
            "keywordId is required",
        },
        {
          status: 400,
        },
      );
    }

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("keywords")
        .eq("user_id", user.id)
        .single();

    await supabase
      .from("profiles")
      .update({
        keywords: (
          profile?.keywords ?? []
        ).filter(
          (id: string) =>
            id !== keywordId,
        ),
      })
      .eq("user_id", user.id);

    const { data: keyword } =
      await supabase
        .from("keywords")
        .select("*")
        .eq("keyword", keywordId)
        .single();

    if (keyword) {
      const remainingUsers = (
        keyword.user_ids ?? []
      ).filter(
        (id: string) =>
          id !== user.id,
      );

      if (
        remainingUsers.length === 0
      ) {
        await supabase
          .from("keywords")
          .delete()
          .eq(
            "keyword",
            keywordId,
          );
      } else {
        await supabase
          .from("keywords")
          .update({
            user_ids:
              remainingUsers,
          })
          .eq(
            "keyword",
            keywordId,
          );
      }
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
            : "Failed to delete keyword",
      },
      {
        status: 500,
      },
    );
  }
}