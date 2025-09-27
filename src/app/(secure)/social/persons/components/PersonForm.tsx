"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePersonStore, Person } from "@/store/personStore";

const personSchema = z.object({
  name: z.string().min(2, "Name is required"),
  origin: z.string().optional().or(z.literal("")),
  relationshipType: z.string().min(2, "Relationship type is required"),
  relationshipStrength: z.number().min(1).max(5),
  occupation: z.string().optional().or(z.literal("")),
  context: z.string().optional().or(z.literal("")),
});

type PersonFormValues = z.infer<typeof personSchema>;

type PersonFormProps = {
  person?: Person;
  onSuccess?: () => void;
};

export default function PersonForm({ person, onSuccess }: PersonFormProps) {
  const { createPerson, updatePerson, loading, error } = usePersonStore();
  const isEditing = !!person;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: person?.name || "",
      origin: person?.origin || "",
      relationshipType: person?.relationshipType || "",
      relationshipStrength: person?.relationshipStrength || 3,
      occupation: person?.occupation || "",
      context: person?.context || "",
    },
  });

  React.useEffect(() => {
    if (person) {
      reset({
        name: person.name || "",
        origin: person.origin || "",
        relationshipType: person.relationshipType || "",
        relationshipStrength: person.relationshipStrength || 3,
        occupation: person.occupation || "",
        context: person.context || "",
      });
    }
  }, [person, reset]);

  const onSubmit = async (values: PersonFormValues) => {
    let result;

    if (isEditing && person) {
      result = await updatePerson(person.id, values);
    } else {
      result = await createPerson(values);
    }

    if (result && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Error: {error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg mx-auto"
      >
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <Input {...register("name")} disabled={loading} />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Origin (How you met)</label>
          <Input
            {...register("origin")}
            disabled={loading}
            placeholder="e.g., Coffee shop, LinkedIn, Conference"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Relationship Type *</label>
          <Input
            {...register("relationshipType")}
            disabled={loading}
            placeholder="e.g., Friend, Professional, Acquaintance"
          />
          {errors.relationshipType && (
            <p className="text-destructive text-sm mt-1">
              {errors.relationshipType.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Relationship Strength (1-5) *
          </label>
          <Input
            type="number"
            min={1}
            max={5}
            {...register("relationshipStrength", {
              valueAsNumber: true,
              required: "Relationship strength is required",
            })}
            disabled={loading}
          />
          {errors.relationshipStrength && (
            <p className="text-destructive text-sm mt-1">
              {errors.relationshipStrength.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Occupation</label>
          <Input
            {...register("occupation")}
            disabled={loading}
            placeholder="e.g., Software Engineer, Teacher"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Notes/Context</label>
          <Input
            {...register("context")}
            disabled={loading}
            placeholder="Additional notes about this person"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Person"
            : "Create Person"}
        </Button>
      </form>
    </div>
  );
}
