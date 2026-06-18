// tests/components/keyword-form.test.tsx

import {
    fireEvent,
    render,
    screen,
    waitFor,
  } from "@testing-library/react";
  
  import { KeywordForm } from "@/components/profile/keyword-form";
  
  const mockSubmit =
    jest.fn();
  
  describe(
    "KeywordForm",
    () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
  
      it(
        "renders form",
        () => {
          render(
            <KeywordForm
              onSubmit={
                mockSubmit
              }
            />,
          );
  
          expect(
            screen.getByPlaceholderText(
              /keyword/i,
            ),
          ).toBeInTheDocument();
  
          expect(
            screen.getByRole(
              "button",
              {
                name:
                  /add/i,
              },
            ),
          ).toBeInTheDocument();
        },
      );
  
      it(
        "validates keyword",
        async () => {
          render(
            <KeywordForm
              onSubmit={
                mockSubmit
              }
            />,
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /add/i,
              },
            ),
          );
  
          await waitFor(
            () => {
              expect(
                mockSubmit,
              ).not.toHaveBeenCalled();
            },
          );
        },
      );
  
      it(
        "submits keyword",
        async () => {
          mockSubmit.mockResolvedValue(
            undefined,
          );
  
          render(
            <KeywordForm
              onSubmit={
                mockSubmit
              }
            />,
          );
  
          fireEvent.change(
            screen.getByPlaceholderText(
              /keyword/i,
            ),
            {
              target: {
                value:
                  "frontend",
              },
            },
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /add/i,
              },
            ),
          );
  
          await waitFor(
            () => {
              expect(
                mockSubmit,
              ).toHaveBeenCalledWith(
                "frontend",
              );
            },
          );
        },
      );
  
      it(
        "handles api error",
        async () => {
          mockSubmit.mockRejectedValue(
            new Error(
              "API Error",
            ),
          );
  
          render(
            <KeywordForm
              onSubmit={
                mockSubmit
              }
            />,
          );
  
          fireEvent.change(
            screen.getByPlaceholderText(
              /keyword/i,
            ),
            {
              target: {
                value:
                  "backend",
              },
            },
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /add/i,
              },
            ),
          );
  
          await waitFor(
            () => {
              expect(
                mockSubmit,
              ).toHaveBeenCalled();
            },
          );
        },
      );
    },
  );