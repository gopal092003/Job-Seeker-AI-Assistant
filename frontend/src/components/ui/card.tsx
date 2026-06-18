// src/components/ui/card.tsx

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn(
        "p-6 pt-0",
        className,
      )}
      {...props}
    />
  );
}