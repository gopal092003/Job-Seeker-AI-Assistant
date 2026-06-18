// tests/components/delete-account-dialog.test.tsx

import {
    fireEvent,
    render,
    screen,
  } from "@testing-library/react";
  
  import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";
  
  describe(
    "DeleteAccountDialog",
    () => {
      const mockConfirmDelete =
        jest.fn();
  
      beforeEach(() => {
        jest.clearAllMocks();
      });
  
      it(
        "requires DELETE text",
        () => {
          render(
            <DeleteAccountDialog
              onConfirm={
                mockConfirmDelete
              }
            />,
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /delete account/i,
              },
            ),
          );
  
          const input =
            screen.getByPlaceholderText(
              /type delete/i,
            );
  
          fireEvent.change(
            input,
            {
              target: {
                value:
                  "delete",
              },
            },
          );
  
          const confirmButton =
            screen.getByRole(
              "button",
              {
                name:
                  /confirm delete/i,
              },
            );
  
          expect(
            confirmButton,
          ).toBeDisabled();
        },
      );
  
      it(
        "opens dialog",
        () => {
          render(
            <DeleteAccountDialog
              onConfirm={
                mockConfirmDelete
              }
            />,
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /delete account/i,
              },
            ),
          );
  
          expect(
            screen.getByText(
              /this action cannot be undone/i,
            ),
          ).toBeInTheDocument();
        },
      );
  
      it(
        "confirms delete",
        () => {
          render(
            <DeleteAccountDialog
              onConfirm={
                mockConfirmDelete
              }
            />,
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /delete account/i,
              },
            ),
          );
  
          fireEvent.change(
            screen.getByPlaceholderText(
              /type delete/i,
            ),
            {
              target: {
                value:
                  "DELETE",
              },
            },
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /confirm delete/i,
              },
            ),
          );
  
          expect(
            mockConfirmDelete,
          ).toHaveBeenCalledTimes(
            1,
          );
        },
      );
  
      it(
        "cancels delete",
        () => {
          render(
            <DeleteAccountDialog
              onConfirm={
                mockConfirmDelete
              }
            />,
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /delete account/i,
              },
            ),
          );
  
          fireEvent.click(
            screen.getByRole(
              "button",
              {
                name:
                  /cancel/i,
              },
            ),
          );
  
          expect(
            screen.queryByText(
              /this action cannot be undone/i,
            ),
          ).not.toBeInTheDocument();
  
          expect(
            mockConfirmDelete,
          ).not.toHaveBeenCalled();
        },
      );
    },
  );