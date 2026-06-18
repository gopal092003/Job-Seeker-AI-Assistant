// tests/api/agent.test.ts

import { NextRequest } from "next/server";

import { GET as getStatus } from "@/app/api/agent/status/route";
import { POST as startAgent } from "@/app/api/agent/start/route";
import { POST as stopAgent } from "@/app/api/agent/stop/route";

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
  "/api/agent",
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
      "start agent",
      async () => {
        mockSupabase.from.mockReturnValue(
          {
            select:
              jest.fn().mockReturnValue(
                {
                  eq:
                    jest.fn().mockReturnValue(
                      {
                        single:
                          jest.fn().mockResolvedValue(
                            {
                              data: {
                                keywords:
                                  [
                                    "frontend",
                                  ],
                              },
                              error:
                                null,
                            },
                          ),
                      },
                    ),
                },
              ),

            update:
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
            "http://localhost/api/agent/start",
            {
              method:
                "POST",
            },
          );

        const response =
          await startAgent(
            request,
          );

        expect(
          response.status,
        ).toBe(200);
      },
    );

    it(
      "stop agent",
      async () => {
        mockSupabase.from.mockReturnValue(
          {
            update:
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
            "http://localhost/api/agent/stop",
            {
              method:
                "POST",
            },
          );

        const response =
          await stopAgent(
            request,
          );

        expect(
          response.status,
        ).toBe(200);
      },
    );

    it(
      "prevent start with no keywords",
      async () => {
        mockSupabase.from.mockReturnValue(
          {
            select:
              jest.fn().mockReturnValue(
                {
                  eq:
                    jest.fn().mockReturnValue(
                      {
                        single:
                          jest.fn().mockResolvedValue(
                            {
                              data: {
                                keywords:
                                  [],
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
            "http://localhost/api/agent/start",
            {
              method:
                "POST",
            },
          );

        const response =
          await startAgent(
            request,
          );

        expect(
          response.status,
        ).toBeGreaterThanOrEqual(
          400,
        );
      },
    );

    it(
      "status endpoint",
      async () => {
        mockSupabase.from.mockReturnValue(
          {
            select:
              jest.fn().mockReturnValue(
                {
                  eq:
                    jest.fn().mockReturnValue(
                      {
                        single:
                          jest.fn().mockResolvedValue(
                            {
                              data: {
                                agent_status:
                                  true,

                                keywords:
                                  [
                                    "frontend",
                                    "react",
                                  ],

                                last_run_at:
                                  "2026-06-17T08:00:00Z",

                                next_run_at:
                                  "2026-06-17T09:00:00Z",
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

        const response =
          await getStatus();

        const data =
          await response.json();

        expect(
          response.status,
        ).toBe(200);

        expect(
          data.agent_status,
        ).toBe(true);

        expect(
          data.keyword_count,
        ).toBe(2);

        expect(
          data.last_run_at,
        ).toBe(
          "2026-06-17T08:00:00Z",
        );

        expect(
          data.next_run_at,
        ).toBe(
          "2026-06-17T09:00:00Z",
        );
      },
    );
  },
);