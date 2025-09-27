import React from "react";
import { Page } from "../../../components/Pages";
import { Skeleton } from "@/components/ui";

export default function PersonListLoading() {
  return (
    <Page title="People" showTitleMobile>
      <div className="w-full">
        <div className="space-y-4 w-full">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-full max-w-md" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
