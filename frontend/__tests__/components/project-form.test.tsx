// tests/components/project-form.test.tsx

import {
    fireEvent,
    render,
    screen,
    waitFor,
  } from "@testing-library/react";
  
  import { ProjectForm } from "@/components/profile/project-form";
  
  const mockSubmit =
    jest.fn();
  
  describe(
    "ProjectForm",
    () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
  
      it(
        "renders project form",
        () => {
          render(
            <ProjectForm
              onSubmit={
                mockSubmit
              }
            />,
          );
  
          expect(
            screen.getByRole(
              "textbox",
            ),
          ).toBeInTheDocument();
  
          expect(
            screen.getByRole(
              "button",
              {
                name:
                  /add project/i,
              },
            ),
          ).toBeInTheDocument();
        },
      );
  
      it(
        "validates description",
        async () => {
          render(
            <ProjectForm
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
                  /add project/i,
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
        "creates project",
        async () => {
          mockSubmit.mockResolvedValue(
            undefined,
          );
  
          render(
            <ProjectForm
              onSubmit={
                mockSubmit
              }
            />,
          );
  
          fireEvent.change(
            screen.getByPlaceholderText(
              /description/i,
            ),
            {
              target: {
                value:
                  "Built a full-stack job automation platform.",
              },
            },
          );
  
          fireEvent.change(
            screen.getByPlaceholderText(
              /project links/i,
            ),
            {
              target: {
                value:
                  "https://github.com/example/project",
              },
            },
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /add project/i,
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
  
      it(
        "handles failure",
        async () => {
          mockSubmit.mockRejectedValue(
            new Error(
              "Failed to create project",
            ),
          );
  
          render(
            <ProjectForm
              onSubmit={
                mockSubmit
              }
            />,
          );
  
          fireEvent.change(
            screen.getByPlaceholderText(
              /description/i,
            ),
            {
              target: {
                value:
                  "Portfolio website",
              },
            },
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /add project/i,
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