// src/components/profile/keywords-section.tsx

"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { KeywordCard } from "@/components/profile/keyword-card";
import { KeywordForm } from "@/components/profile/keyword-form";

import { useKeywords } from "@/hooks/use-keywords";

export function KeywordsSection() {
  const {
    keywords,
    loading,
    createKeyword,
    deleteKeyword,
  } = useKeywords();

  const [open, setOpen] =
    useState(false);

  const addKeyword = async (
    keyword: string,
  ) => {
    await createKeyword(keyword);
    setOpen(false);
  };

  const removeKeyword = async (
    keywordId: string,
  ) => {
    await deleteKeyword(keywordId);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Keywords
        </h2>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              +
            </Button>
          </DialogTrigger>

          <DialogContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Add Keyword
              </h3>

              <KeywordForm
                onSubmit={addKeyword}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="max-h-[400px]">
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading keywords...
            </p>
          ) : keywords.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No keywords added yet.
            </p>
          ) : (
            keywords.map((keyword) => (
              <KeywordCard
                key={keyword.id}
                keyword={keyword}
                onDelete={
                  removeKeyword
                }
              />
            ))
          )}
        </div>
      </ScrollArea>
    </section>
  );
}