// tests/api/keywords.test.ts

import {
    GET,
    POST,
    DELETE,
  } from "@/app/api/keywords/route";
  
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
    "/api/keywords",
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
        "GET keywords",
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
                              keyword:
                                "frontend",
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
        "POST keyword",
        async () => {
          mockSupabase.from.mockReturnValue(
            {
              insert:
                jest.fn().mockResolvedValue(
                  {
                    data: [
                      {
                        keyword:
                          "frontend",
                      },
                    ],
                    error:
                      null,
                  },
                ),
            },
          );
  
          const request =
            new NextRequest(
              "http://localhost/api/keywords",
              {
                method:
                  "POST",
                body: JSON.stringify(
                  {
                    keyword:
                      "frontend",
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
        "DELETE keyword",
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
              "http://localhost/api/keywords?id=frontend",
              {
                method:
                  "DELETE",
              },
            );
  
          const response =
            await DELETE(
              request,
            );
  
          expect(
            response.status,
          ).toBe(200);
        },
      );
  
      it(
        "duplicate keyword handling",
        async () => {
          mockSupabase.from.mockReturnValue(
            {
              insert:
                jest.fn().mockResolvedValue(
                  {
                    data:
                      null,
  
                    error:
                      new Error(
                        "duplicate key value violates unique constraint",
                      ),
                  },
                ),
            },
          );
  
          const request =
            new NextRequest(
              "http://localhost/api/keywords",
              {
                method:
                  "POST",
                body: JSON.stringify(
                  {
                    keyword:
                      "frontend",
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
          ).toBeGreaterThanOrEqual(
            400,
          );
        },
      );
    },
  );