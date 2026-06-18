// tests/hooks/use-profile.test.ts

import {
    renderHook,
    waitFor,
    act,
  } from "@testing-library/react";
  
  import { useProfile } from "@/hooks/use-profile";
  
  describe(
    "useProfile",
    () => {
      beforeEach(() => {
        jest.clearAllMocks();
  
        global.fetch =
          jest.fn();
      });
  
      it(
        "fetch profile",
        async () => {
          (
            fetch as jest.Mock
          ).mockResolvedValue({
            ok: true,
  
            json:
              async () => ({
                profile: {
                  id: "user-1",
  
                  name:
                    "John Doe",
  
                  email:
                    "john@example.com",
  
                  agentStatus:
                    false,
                },
              }),
          });
  
          const {
            result,
          } = renderHook(
            () =>
              useProfile(),
          );
  
          await waitFor(
            () => {
              expect(
                result.current
                  .profile,
              ).toBeDefined();
            },
          );
  
          expect(
            fetch,
          ).toHaveBeenCalledWith(
            "/api/profile",
          );
  
          expect(
            result.current
              .profile?.name,
          ).toBe(
            "John Doe",
          );
        },
      );
  
      it(
        "refresh profile",
        async () => {
          (
            fetch as jest.Mock
          ).mockResolvedValue({
            ok: true,
  
            json:
              async () => ({
                profile: {
                  id: "user-1",
  
                  name:
                    "Updated User",
  
                  email:
                    "updated@example.com",
                },
              }),
          });
  
          const {
            result,
          } = renderHook(
            () =>
              useProfile(),
          );
  
          await waitFor(
            () => {
              expect(
                result.current
                  .profile,
              ).toBeDefined();
            },
          );
  
          await act(
            async () => {
              await result.current.refreshProfile();
            },
          );
  
          expect(
            fetch,
          ).toHaveBeenCalledTimes(
            2,
          );
  
          expect(
            result.current
              .profile?.name,
          ).toBe(
            "Updated User",
          );
        },
      );
  
      it(
        "handle loading",
        async () => {
          let resolveFetch:
            | ((
                value: unknown,
              ) => void)
            | undefined;
  
          (
            fetch as jest.Mock
          ).mockImplementation(
            () =>
              new Promise(
                (
                  resolve,
                ) => {
                  resolveFetch =
                    resolve;
                },
              ),
          );
  
          const {
            result,
          } = renderHook(
            () =>
              useProfile(),
          );
  
          expect(
            result.current
              .loading,
          ).toBe(true);
  
          await act(
            async () => {
              resolveFetch?.({
                ok: true,
  
                json:
                  async () => ({
                    profile:
                      null,
                  }),
              });
            },
          );
        },
      );
  
      it(
        "handle error",
        async () => {
          (
            fetch as jest.Mock
          ).mockRejectedValue(
            new Error(
              "Failed to load profile",
            ),
          );
  
          const {
            result,
          } = renderHook(
            () =>
              useProfile(),
          );
  
          await waitFor(
            () => {
              expect(
                result.current
                  .error,
              ).toBe(
                "Failed to load profile",
              );
            },
          );
  
          expect(
            result.current
              .profile,
          ).toBeNull();
        },
      );
    },
  );