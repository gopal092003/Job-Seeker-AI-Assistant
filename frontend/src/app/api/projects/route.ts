// src/app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validators/project";

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

    const { data: profile, error } =
      await supabase
        .from("profiles")
        .select("projects")
        .eq("user_id", user.id)
        .single();

    if (error) {
      throw error;
    }

    const projectIds =
      profile?.projects ?? [];

    if (projectIds.length === 0) {
      return NextResponse.json([]);
    }

    const {
      data: projects,
      error: projectsError,
    } = await supabase
      .from("projects")
      .select("*")
      .in("project", projectIds);

    if (projectsError) {
      throw projectsError;
    }

    return NextResponse.json(
      projects,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch projects",
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
      projectSchema.safeParse(body);

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
      title = "Untitled Project",
      skills = [],
      project_links,
      description,
    } = body;

    const {
      data: project,
      error: projectError,
    } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        title,
        links: project_links,
        description,
        skills,
      })
      .select()
      .single();

    if (projectError) {
      throw projectError;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("projects")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const currentProjects =
      profile?.projects ?? [];

    const {
      error: updateError,
    } = await supabase
      .from("profiles")
      .update({
        projects: [
          ...currentProjects,
          project.project,
        ],
      })
      .eq("user_id", user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        success: true,
        project,
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
            : "Failed to create project",
      },
      {
        status: 500,
      },
    );
  }
}