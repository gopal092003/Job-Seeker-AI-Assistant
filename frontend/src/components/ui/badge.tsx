// src/components/ui/badge.tsx

import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "destructive";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-primary text-primary-foreground",

  secondary:
    "bg-secondary text-secondary-foreground",

  outline:
    "border border-input text-foreground",

  success:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

  destructive:
    "bg-destructive text-destructive-foreground",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}