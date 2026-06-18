// src/app/api/webhooks/agent-cycle/route.ts

import { NextRequest, NextResponse } from "next/server";

import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
) {
  try {
    const secret =
      request.headers.get(
        "x-agent-secret",
      );

    const signature =
      request.headers.get(
        "x-agent-signature",
      );

    const expectedSecret =
      process.env
        .AGENT_WEBHOOK_SECRET;

    const expectedSignature =
      process.env
        .AGENT_WEBHOOK_SIGNATURE;

    if (
      !secret ||
      secret !==
        expectedSecret
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid webhook secret",
        },
        {
          status: 401,
        },
      );
    }

    if (
      !signature ||
      signature !==
        expectedSignature
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid webhook signature",
        },
        {
          status: 401,
        },
      );
    }

    const payload =
      await request.json();

    const {
      cycle_id,
      completed_at,
      processed_users,
      generated_jobs,
      generated_resumes,
    } = payload;

    console.log(
      "[AGENT_CYCLE_COMPLETED]",
      {
        cycle_id,
        completed_at,
        processed_users,
        generated_jobs,
        generated_resumes,
      },
    );

    // Update cached state
    // Future:
    // Redis / KV cache updates
    // Agent metrics aggregation
    // Dashboard counters

    // Trigger revalidation
    revalidatePath(
      "/profile",
    );

    revalidatePath(
      "/jobs",
    );

    revalidatePath(
      "/resumes",
    );

    return NextResponse.json({
      success: true,

      cycle_id,

      completed_at,
    });
  } catch (error) {
    console.error(
      "[AGENT_WEBHOOK_ERROR]",
      error,
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      },
      {
        status: 500,
      },
    );
  }
}