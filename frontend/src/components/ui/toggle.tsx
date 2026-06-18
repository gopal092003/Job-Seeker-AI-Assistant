// src/components/ui/toggle.tsx

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
}

export const Toggle = React.forwardRef<
  HTMLButtonElement,
  ToggleProps
>(
  (
    {
      className,
      pressed = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          pressed
            ? "bg-primary text-primary-foreground"
            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);

Toggle.displayName = "Toggle";