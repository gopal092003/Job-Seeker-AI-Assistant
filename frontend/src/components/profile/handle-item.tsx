// src/components/profile/handle-item.tsx

"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { Handle } from "@/types/profile";

interface HandleItemProps {
  handle: Handle;

  onDelete?: (
    platform: string,
  ) => void;
}

export function HandleItem({
  handle,
  onDelete,
}: HandleItemProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            {handle.platform}
          </p>

          <a
            href={handle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-all text-sm text-primary underline"
          >
            {handle.url}
          </a>
        </div>

        {onDelete && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              onDelete(
                handle.platform,
              )
            }
          >
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
}