"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePersonStore } from "@/store/personStore";
import { Page, Error } from "../../../../components/Pages";
import EditPerson from "../../components/PersonForm";
import { Button, H3 } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { FieldValue } from "../../../../components/Forms/FieldValue";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import PersonLoading from "./components/PersonLoading";

export default function Person() {
  const params = useParams();
  const router = useRouter();
  const { persons, deletePerson, loading, error } = usePersonStore();
  const [editMode, setEditMode] = useState(false);

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
  if (loading || (!person && !persons)) return <PersonLoading />;
  if (error) return <Error error={error} />;

  // Show not found if persons are loaded but person doesn't exist
  if (!person) {
    return (
      <Page title="Person Not Found" showTitleMobile>
        <div className="w-full mb-20">
          <Card className="w-full rounded-sm p-0">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                The person you&apos;re looking for doesn&apos;t exist.
              </p>
              <Button onClick={() => router.push("/social/persons")}>
                Back to List
              </Button>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  if (editMode) {
    return (
      <Page title={`Edit ${person.name}`} showTitleMobile>
        <EditPerson
          person={person}
          onSuccess={() => setEditMode(false)}
          onCancel={() => setEditMode(false)}
        />
      </Page>
    );
  }

  return (
    <Page title={person.name} showTitleMobile>
      <div className="w-full mb-20">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="flex flex-col md:flex-row justify-between grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <div className="mb-6 flex justify-between items-center">
                <H3>{person.name}</H3>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/social/persons")}
                  >
                    <ArrowLeft className="font-extrabold" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(true)}
                    className="ml-2"
                  >
                    <Edit className="font-extrabold" />
                  </Button>
                  <Button
                    className="ml-2"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="font-extrabold" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Occupation</p>
                  <p className="font-semibold line-clamp-1">
                    {person.occupation || "--"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Relationship Type</p>
                  <p className="font-semibold line-clamp-1">
                    {person.relationshipType}
                  </p>
                </div>
                <FieldValue
                  title="Relationship Strength"
                  value={`${person.relationshipStrength}/5`}
                />
                <FieldValue
                  title="Added"
                  value={new Date(person.createdAt).toLocaleDateString()}
                />
              </div>

              {/* How we met - Full width */}
              {person.origin && (
                <div className="py-4">
                  <FieldValue
                    title="Origin Story"
                    value={person.origin}
                    className="w-full"
                  />
                </div>
              )}

              {/* Notes - Full width */}
              {person.context && (
                <div className="py-4">
                  <FieldValue
                    title="Notes"
                    value={person.context}
                    className="w-full"
                  />
                </div>
              )}
            </div>
            <div>
              {/* Placeholder for graph */}
              <Card className="h-64 flex items-center justify-center bg-muted/50">
                <p className="text-muted-foreground">Graph placeholder</p>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
