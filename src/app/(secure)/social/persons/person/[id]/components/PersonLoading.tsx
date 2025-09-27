"use client";

import React from "react";
import { Page } from "../../../../../components/Pages";
import { Skeleton } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";

export default function PersonLoading() {
  return (
    <Page title="Person" showTitleMobile>
      <div className="w-full mb-20">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="flex flex-col md:flex-row justify-between grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              {/* Header skeleton */}
              <div className="mb-6 flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>

              {/* Grid fields skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>

              {/* Full-width fields skeleton */}
              <div className="py-4 space-y-4">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full max-w-md" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-full max-w-lg" />
                </div>
              </div>
            </div>

            <div>
              {/* Graph placeholder skeleton */}
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
