"use client";

import { useState } from "react";

import { useHandles } from "@/hooks/use-handles";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { HandleItem } from "@/components/profile/handle-item";
import { HandleForm } from "@/components/profile/handle-form";

export function HandlesSection() {
  const {
    handles,
    loading,

    createHandle,
    deleteHandle,
  } = useHandles();

  const [open, setOpen] =
    useState(false);

  const handleCreateHandle =
    async (handle: {
      platform: string;
      url: string;
    }) => {
      await createHandle(handle);

      setOpen(false);
    };

  const removeHandle =
    async (
      platform: string,
    ) => {
      await deleteHandle(
        platform,
      );
    };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Handles
        </h2>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              Add Handle
            </Button>
          </DialogTrigger>

          <DialogContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Add Handle
              </h3>

              <HandleForm
                onSubmit={
                  handleCreateHandle
                }
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="max-h-[500px]">
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading handles...
            </p>
          ) : handles.length ===
            0 ? (
            <p className="text-sm text-muted-foreground">
              No handles added yet.
            </p>
          ) : (
            handles.map(
              (handle) => (
                <HandleItem
                  key={
                    handle.platform
                  }
                  handle={handle}
                  onDelete={
                    removeHandle
                  }
                />
              ),
            )
          )}
        </div>
      </ScrollArea>
    </section>
  );
}