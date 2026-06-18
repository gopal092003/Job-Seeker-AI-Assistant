// src/components/profile/keyword-card.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Keyword } from "@/types/profile";

interface KeywordCardProps {
  keyword: Keyword;
  onDelete: (keywordId: string) => void;
}

export function KeywordCard({
  keyword,
  onDelete,
}: KeywordCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Badge>
            {keyword.value}
          </Badge>

          <span className="text-xs text-muted-foreground">
            {keyword.userCount} user
            {keyword.userCount !== 1 ? "s" : ""}
          </span>
        </div>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(keyword.id)}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}