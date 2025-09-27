"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { usePersonStore, Person } from "@/store/personStore";
import { FieldInput } from "../../../components/Forms/FieldInput";

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
  onCancel?: () => void;
};

export default function PersonForm({
  person,
  onSuccess,
  onCancel,
}: PersonFormProps) {
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
    <div className="space-y-4 w-full">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Error: {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <FieldInput
            label="Name"
            name="name"
            register={register("name")}
            error={errors.name}
            required
            disabled={loading}
            placeholder="Enter person's name"
          />

          <FieldInput
            label="Origin"
            tooltip="Where or how did you meet this person?"
            name="origin"
            register={register("origin")}
            disabled={loading}
            placeholder="e.g., Coffee shop, LinkedIn, Conference"
          />

          <FieldInput
            label="Relationship Type"
            tooltip="How would you classify this person?"
            name="relationshipType"
            register={register("relationshipType")}
            error={errors.relationshipType}
            required
            disabled={loading}
            placeholder="e.g., Friend, Professional, Acquaintance"
          />

          <FieldInput
            label="Relationship Strength (1-5)"
            name="relationshipStrength"
            tooltip="1 - Just met, 5 - Close friend"
            register={register("relationshipStrength", {
              valueAsNumber: true,
              required: "Relationship strength is required",
            })}
            error={errors.relationshipStrength}
            type="number"
            min={1}
            max={5}
            required
            disabled={loading}
          />

          <FieldInput
            label="Occupation"
            name="occupation"
            register={register("occupation")}
            disabled={loading}
            placeholder="e.g., Software Engineer, Teacher"
          />

          <FieldInput
            label="Notes/Context"
            name="context"
            register={register("context")}
            disabled={loading}
            placeholder="Additional notes about this person"
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
              type="button"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isEditing ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
