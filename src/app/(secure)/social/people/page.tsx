"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { usePersonStore, Person } from "@/store/personStore";
import PageTemplate from "../../components/Templates/PageTemplate";
import ViewPeople from "./components/ViewPeople";
import { Skeleton } from "@/components/ui";

export default function Page() {
  const { user, isLoaded } = useUser();
  const { fetchPersons, persons, loading, error } = usePersonStore();

  useEffect(() => {
    if (isLoaded && user) {
      fetchPersons();
    }
  }, [isLoaded, user, fetchPersons]);

  if (loading) {
    return (
      <PageTemplate title="People" showTitleMobile>
        <div className="space-y-4 w-full">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid gap-4">
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
                    <Skeleton className="h-8 w-12" />
                  </div>
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="People" showTitleMobile>
      <ViewPeople persons={persons} loading={loading} error={error} />
    </PageTemplate>
  );
}
