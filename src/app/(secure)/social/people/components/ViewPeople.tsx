"use client";

import React from "react";
import { Button } from "@/components/ui";
import { Person } from "@/store/personStore";

interface ViewPeopleProps {
  persons: Person[];
  loading: boolean;
  error: string | null;
}

const ViewPeople: React.FC<ViewPeopleProps> = ({ persons, loading, error }) => {
  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-destructive font-medium">Error: {error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (persons.length === 0) {
    return (
      <div className="text-center py-8 w-full">
        <p className="text-muted-foreground mb-4">
          No people in your network yet. Start building your connections!
        </p>
        <Button asChild>
          <a href="/social/people/add">Add Your First Person</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Your Network ({persons.length} people)
        </h2>
        <Button asChild>
          <a href="/social/people/add">Add Person</a>
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
                  <a href={`/social/people/${person.id}`}>View</a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/social/people/${person.id}/edit`}>Edit</a>
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
  );
};

export default ViewPeople;
