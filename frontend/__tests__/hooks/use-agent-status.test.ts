// tests/hooks/use-agent-status.test.ts

import {
    act,
    renderHook,
    waitFor,
  } from "@testing-library/react";
  
  import { useAgentStatus } from "@/hooks/use-agent-status";
  
  import {
    errorToast,
    successToast,
  } from "@/hooks/use-toast";
  
  jest.mock(
    "@/hooks/use-toast",
    () => ({
      errorToast:
        jest.fn(),
      successToast:
        jest.fn(),
    }),
  );
  
  describe(
    "useAgentStatus",
    () => {
      beforeEach(() => {
        jest.clearAllMocks();
  
        global.fetch =
          jest.fn();
  
        jest.useFakeTimers();
      });
  
      afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
      });
  
      it(
        "loads status",
        async () => {
          (
            fetch as jest.Mock
          ).mockResolvedValue({
            ok: true,
            json:
              async () => ({
                agent_status:
                  true,
  
                keyword_count:
                  2,
  
                last_run_at:
                  "2026-06-17T08:00:00Z",
  
                next_run_at:
                  "2026-06-17T09:00:00Z",
              }),
          });
  
          const {
            result,
          } = renderHook(
            () =>
              useAgentStatus(),
          );
  
          await waitFor(
            () => {
              expect(
                result.current
                  .agentStatus,
              ).toBe(true);
            },
          );
  
          expect(
            result.current
              .lastRun,
          ).toBe(
            "2026-06-17T08:00:00Z",
          );
  
          expect(
            result.current
              .nextRun,
          ).toBe(
            "2026-06-17T09:00:00Z",
          );
        },
      );
  
      it(
        "polls correctly",
        async () => {
          (
            fetch as jest.Mock
          ).mockResolvedValue({
            ok: true,
            json:
              async () => ({
                agent_status:
                  false,
                keyword_count:
                  0,
                last_run_at:
                  null,
                next_run_at:
                  null,
              }),
          });
  
          renderHook(
            () =>
              useAgentStatus(),
          );
  
          expect(
            fetch,
          ).toHaveBeenCalledTimes(
            1,
          );
  
          await act(
            async () => {
              jest.advanceTimersByTime(
                30000,
              );
            },
          );
  
          expect(
            fetch,
          ).toHaveBeenCalledTimes(
            2,
          );
        },
      );
  
      it(
        "start action",
        async () => {
          (
            fetch as jest.Mock
          )
            .mockResolvedValueOnce(
              {
                ok: true,
                json:
                  async () => ({
                    agent_status:
                      false,
                    keyword_count:
                      0,
                  }),
              },
            )
            .mockResolvedValueOnce(
              {
                ok: true,
                json:
                  async () => ({
                    success:
                      true,
                  }),
              },
            )
            .mockResolvedValueOnce(
              {
                ok: true,
                json:
                  async () => ({
                    agent_status:
                      true,
                    keyword_count:
                      1,
                    last_run_at:
                      null,
                    next_run_at:
                      null,
                  }),
              },
            );
  
          const {
            result,
          } = renderHook(
            () =>
              useAgentStatus(),
          );
  
          await act(
            async () => {
              await result.current.startAgent();
            },
          );
  
          expect(
            successToast,
          ).toHaveBeenCalled();
  
          expect(
            fetch,
          ).toHaveBeenCalledWith(
            "/api/agent/start",
            {
              method:
                "POST",
            },
          );
        },
      );
  
      it(
        "stop action",
        async () => {
          (
            fetch as jest.Mock
          )
            .mockResolvedValueOnce(
              {
                ok: true,
                json:
                  async () => ({
                    agent_status:
                      true,
                  }),
              },
            )
            .mockResolvedValueOnce(
              {
                ok: true,
                json:
                  async () => ({
                    success:
                      true,
                  }),
              },
            )
            .mockResolvedValueOnce(
              {
                ok: true,
                json:
                  async () => ({
                    agent_status:
                      false,
                  }),
              },
            );
  
          const {
            result,
          } = renderHook(
            () =>
              useAgentStatus(),
          );
  
          await act(
            async () => {
              await result.current.stopAgent();
            },
          );
  
          expect(
            successToast,
          ).toHaveBeenCalled();
  
          expect(
            fetch,
          ).toHaveBeenCalledWith(
            "/api/agent/stop",
            {
              method:
                "POST",
            },
          );
        },
      );
  
      it(
        "error handling",
        async () => {
          (
            fetch as jest.Mock
          ).mockRejectedValue(
            new Error(
              "Network Error",
            ),
          );
  
          const {
            result,
          } = renderHook(
            () =>
              useAgentStatus(),
          );
  
          await waitFor(
            () => {
              expect(
                result.current
                  .error,
              ).toBe(
                "Network Error",
              );
            },
          );
  
          expect(
            errorToast,
          ).toHaveBeenCalledWith(
            "Network Error",
          );
        },
      );
    },
  );