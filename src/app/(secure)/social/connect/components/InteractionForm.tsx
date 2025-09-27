"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useInteractionStore, Interaction } from "@/store/interactionStore";
import { usePersonStore } from "@/store/personStore";
import { FieldInput } from "../../../components/Forms/FieldInput";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const interactionSchema = z.object({
  title: z.string().min(2, "Title is required"),
  personId: z.string().min(1, "Person is required"),
  placeName: z.string().optional().or(z.literal("")),
  latitude: z.number().optional().or(z.literal("")),
  longitude: z.number().optional().or(z.literal("")),
  interactionTime: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type InteractionFormValues = z.infer<typeof interactionSchema>;

type InteractionFormProps = {
  interaction?: Interaction;
  selectedPersonId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function InteractionForm({
  interaction,
  selectedPersonId,
  onSuccess,
  onCancel,
}: InteractionFormProps) {
  const { createInteraction, updateInteraction, loading, error } = useInteractionStore();
  const { persons } = usePersonStore();
  const isEditing = !!interaction;
  
  // Combobox state
  const [open, setOpen] = React.useState(false);
  const [personValue, setPersonValue] = React.useState(
    interaction?.personId || selectedPersonId || ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InteractionFormValues>({
    resolver: zodResolver(interactionSchema),
    defaultValues: {
      title: interaction?.title || "",
      personId: interaction?.personId || selectedPersonId || "",
      placeName: interaction?.placeName || "",
      latitude: interaction?.latitude || "",
      longitude: interaction?.longitude || "",
      interactionTime: interaction?.interactionTime ? 
        new Date(interaction.interactionTime).toISOString().slice(0, 16) : "",
      notes: typeof interaction?.notes === "string" ? 
        interaction.notes : JSON.stringify(interaction?.notes || "") || "",
    },
  });

  React.useEffect(() => {
    if (interaction) {
      const formData = {
        title: interaction.title || "",
        personId: interaction.personId || "",
        placeName: interaction.placeName || "",
        latitude: interaction.latitude || undefined,
        longitude: interaction.longitude || undefined,
        interactionTime: interaction.interactionTime ? 
          new Date(interaction.interactionTime).toISOString().slice(0, 16) : "",
        notes: typeof interaction.notes === "string" ? 
          interaction.notes : JSON.stringify(interaction.notes || "") || "",
      };
      reset(formData);
      setPersonValue(formData.personId);
    }
  }, [interaction, reset]);

  const onSubmit = async (values: InteractionFormValues) => {
    let result;

    const submissionData = {
      ...values,
      latitude: values.latitude ? Number(values.latitude) : undefined,
      longitude: values.longitude ? Number(values.longitude) : undefined,
      interactionTime: values.interactionTime || undefined,
      notes: values.notes || undefined,
    };

    if (isEditing && interaction) {
      result = await updateInteraction(interaction.id, submissionData);
    } else {
      result = await createInteraction(submissionData);
    }

    if (result && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="w-full rounded-sm">
      <CardContent>
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <FieldInput
              label="Title"
              name="title"
              register={register("title")}
              error={errors.title}
              required
              disabled={loading}
              placeholder="e.g., Coffee meeting, Lunch catch-up"
            />

            <div>
              <div className="flex items-center gap-2 mb-1 min-h-[22px]">
                <label className="block font-medium">
                  Person
                  <span className="text-destructive ml-1">*</span>
                </label>
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent dark:bg-[#0E0E0E]"
                    disabled={loading || !!selectedPersonId}
                  >
                    {personValue
                      ? persons?.find((person) => person.id === personValue)?.name
                      : "Select person..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search person..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No person found.</CommandEmpty>
                      <CommandGroup>
                        {persons?.map((person) => (
                          <CommandItem
                            key={person.id}
                            value={person.name}
                            onSelect={(currentValue) => {
                              // Find the person by name to get their ID
                              const selectedPerson = persons?.find(p => p.name === currentValue);
                              if (selectedPerson) {
                                const newValue = selectedPerson.id === personValue ? "" : selectedPerson.id;
                                setPersonValue(newValue);
                                // Update the form value
                                setValue("personId", newValue);
                              }
                              setOpen(false);
                            }}
                          >
                            {person.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                personValue === person.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <input type="hidden" {...register("personId")} />
              {errors.personId && (
                <p className="text-destructive text-sm mt-1">{errors.personId.message}</p>
              )}
            </div>

            <FieldInput
              label="Location"
              name="placeName"
              register={register("placeName")}
              disabled={loading}
              placeholder="e.g., Central Park, Coffee Shop"
            />

            <FieldInput
              label="Latitude"
              name="latitude"
              register={register("latitude", { valueAsNumber: true })}
              error={errors.latitude}
              type="number"
              disabled={loading}
              placeholder="40.7128"
            />

            <FieldInput
              label="Longitude"
              name="longitude"
              register={register("longitude", { valueAsNumber: true })}
              error={errors.longitude}
              type="number"
              disabled={loading}
              placeholder="-74.0060"
            />

            <div>
              <label className="block font-medium mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                disabled={loading}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                {...register("interactionTime")}
              />
              {errors.interactionTime && (
                <p className="text-destructive text-sm mt-1">{errors.interactionTime.message}</p>
              )}
            </div>

            <FieldInput
              label="Notes"
              name="notes"
              register={register("notes")}
              disabled={loading}
              placeholder="Additional notes about the interaction..."
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
      </CardContent>
    </Card>
  );
}
