// tests/api/projects.test.ts

import {
    GET,
    POST,
  } from "@/app/api/projects/route";
  
  import { DELETE } from "@/app/api/projects/[id]/route";
  
  import { NextRequest } from "next/server";
  
  import { createClient } from "@/lib/supabase/server";
  
  jest.mock(
    "@/lib/supabase/server",
  );
  
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
  
    from: jest.fn(),
  };
  
  describe(
    "/api/projects",
    () => {
      beforeEach(() => {
        jest.clearAllMocks();
  
        (
          createClient as jest.Mock
        ).mockResolvedValue(
          mockSupabase,
        );
  
        mockSupabase.auth.getUser.mockResolvedValue(
          {
            data: {
              user: {
                id: "user-1",
              },
            },
            error: null,
          },
        );
      });
  
      it(
        "GET projects",
        async () => {
          mockSupabase.from.mockReturnValue(
            {
              select:
                jest.fn().mockReturnValue(
                  {
                    eq:
                      jest.fn().mockResolvedValue(
                        {
                          data: [
                            {
                              project:
                                "project-1",
                              description:
                                "Test Project",
                            },
                          ],
                          error:
                            null,
                        },
                      ),
                  },
                ),
            },
          );
  
          const response =
            await GET();
  
          const data =
            await response.json();
  
          expect(
            response.status,
          ).toBe(200);
  
          expect(
            data,
          ).toBeDefined();
        },
      );
  
      it(
        "POST project",
        async () => {
          mockSupabase.from.mockReturnValue(
            {
              insert:
                jest.fn().mockReturnValue(
                  {
                    select:
                      jest.fn().mockReturnValue(
                        {
                          single:
                            jest.fn().mockResolvedValue(
                              {
                                data: {
                                  project:
                                    "project-1",
                                },
                                error:
                                  null,
                              },
                            ),
                        },
                      ),
                  },
                ),
            },
          );
  
          const request =
            new NextRequest(
              "http://localhost/api/projects",
              {
                method:
                  "POST",
                body: JSON.stringify(
                  {
                    project_links:
                      [
                        "https://github.com/example/project",
                      ],
  
                    description:
                      "Job automation platform",
                  },
                ),
              },
            );
  
          const response =
            await POST(
              request,
            );
  
          expect(
            response.status,
          ).toBe(200);
        },
      );
  
      it(
        "DELETE project",
        async () => {
          mockSupabase.from.mockReturnValue(
            {
              delete:
                jest.fn().mockReturnValue(
                  {
                    eq:
                      jest.fn().mockResolvedValue(
                        {
                          error:
                            null,
                        },
                      ),
                  },
                ),
            },
          );
  
          const request =
            new NextRequest(
              "http://localhost/api/projects/project-1",
              {
                method:
                  "DELETE",
              },
            );
  
          const response =
            await DELETE(
              request,
              {
                params:
                  Promise.resolve(
                    {
                      id: "project-1",
                    },
                  ),
              },
            );
  
          expect(
            response.status,
          ).toBe(200);
        },
      );
    },
  );