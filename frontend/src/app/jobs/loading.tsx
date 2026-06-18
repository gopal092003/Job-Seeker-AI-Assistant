// src/app/jobs/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto space-y-4 p-6">
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border p-4"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full max-w-[600px]" />

                <Skeleton className="h-4 w-40" />
              </div>

              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-24" />

                <Skeleton className="h-6 w-28" />
              </div>
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}