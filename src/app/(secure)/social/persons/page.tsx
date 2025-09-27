"use client";

import React, { useEffect } from "react";
import { usePersonStore } from "@/store/personStore";
import { Error, Page } from "../../components/Pages";
import { Skeleton, Button } from "@/components/ui";

export default function Persons() {
  const { fetchPersons, persons, loading, error } = usePersonStore();

  useEffect(() => {
    if (!persons && !error) {
      fetchPersons();
    }
  }, [persons, error, fetchPersons]);

  if (loading) {
    return (
      <Page title="People" showTitleMobile>
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
      </Page>
    );
  }

  if (error) return <Error error={error} />;

  if (!persons || persons.length === 0) {
    return (
      <div className="text-center py-8 w-full">
        <p className="text-muted-foreground mb-4">
          No people in your network yet. Start building your connections!
        </p>
        <Button asChild>
          <a href="/social/persons/new">Add Your First Person</a>
        </Button>
      </div>
    );
  }

  return (
    <Page title="People" showTitleMobile>
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Your Network ({persons.length} people)
          </h2>
          <Button asChild>
            <a href="/social/persons/new">Add Person</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {persons.map((person) => (
            <div
              key={person.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{person.name}</h3>
                  <p className="text-muted-foreground">
                    {person.relationshipType} • Strength:{" "}
                    {person.relationshipStrength}/5
                  </p>
                  {person.occupation && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {person.occupation}
                    </p>
                  )}
                  {person.origin && (
                    <p className="text-sm text-muted-foreground">
                      Met via: {person.origin}
                    </p>
                  )}
                  {person.context && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {person.context}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/social/persons/person/${person.id}`}>View</a>
                  </Button>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Added: {new Date(person.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
