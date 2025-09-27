"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePersonStore } from "@/store/personStore";
import PageTemplate from "../../../../components/Templates/PageTemplate";
import EditPerson from "../../components/PersonForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchPersons, persons, deletePerson, loading, error } =
    usePersonStore();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!persons && !error) {
      fetchPersons();
    }
  }, [persons, error, fetchPersons]);

  const personId = params.id as string;
  const person = persons?.find((p) => p.id === personId) || null;

  const handleDelete = async () => {
    if (person && confirm(`Are you sure you want to delete ${person.name}?`)) {
      const result = await deletePerson(person.id);
      if (result) {
        router.push("/social/persons");
      }
    }
  };

  // Show loading skeleton while fetching or if person not found and still loading
  if (loading || (!person && !persons)) {
    return (
      <PageTemplate title="Person" showTitleMobile>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-full max-w-md" />
          </div>
        </div>
      </PageTemplate>
    );
  }

  // Show error if there's an error fetching
  if (error) {
    return (
      <PageTemplate title="Person" showTitleMobile>
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
      </PageTemplate>
    );
  }

  // Show not found if persons are loaded but person doesn't exist
  if (!person) {
    return (
      <PageTemplate title="Person Not Found" showTitleMobile>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            The person you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/social/persons")}>
            Back to People
          </Button>
        </div>
      </PageTemplate>
    );
  }

  if (editMode) {
    return (
      <PageTemplate title={`Edit ${person.name}`} showTitleMobile>
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
          <EditPerson person={person} onSuccess={() => setEditMode(false)} />
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title={person.name} showTitleMobile>
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={() => setEditMode(true)}>Edit</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/social/persons")}
          >
            Back to People
          </Button>
        </div>

        {/* Person Details */}
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Basic Information</h3>
            <div className="grid gap-2">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{person.name}</span>
              </div>
              {person.occupation && (
                <div>
                  <span className="text-muted-foreground">Occupation:</span>
                  <span className="ml-2">{person.occupation}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Relationship</h3>
            <div className="grid gap-2">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{person.relationshipType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Strength:</span>
                <span className="ml-2">{person.relationshipStrength}/5</span>
              </div>
              {person.origin && (
                <div>
                  <span className="text-muted-foreground">How we met:</span>
                  <span className="ml-2">{person.origin}</span>
                </div>
              )}
            </div>
          </div>

          {person.context && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Notes</h3>
              <p className="text-muted-foreground">{person.context}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-2">Timeline</h3>
            <div className="grid gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Added:</span>
                <span className="ml-2">
                  {new Date(person.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Last updated:</span>
                <span className="ml-2">
                  {new Date(person.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
