"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button, Badge } from "@/components/ui";
import { Calendar, ArrowUp, ArrowDown, Plus, X } from "lucide-react";
import { Error, Page } from "../../components/Pages";
import { useInteractionStore } from "@/store/interactionStore";
import { usePersonStore } from "@/store/personStore";

export default function Connect() {
  const { interactions, loading, error } = useInteractionStore();
  const { persons } = usePersonStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for search name
  const [searchName, setSearchName] = useState("");

  // Local state for interactions
  const [interactionSearch, setInteractionSearch] = useState("");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");

  // Get selected person from URL query parameters
  const selectedPersonId = searchParams.get("person_id") || null;
  const updateSelectedPerson = (personId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (personId) {
      params.set("person_id", personId);
    } else {
      params.delete("person_id");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Group persons alphabetically by first letter
  const groupedPersons = useMemo(() => {
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const groups: Record<string, typeof persons> = {};

    if (!persons) {
      // Initialize empty groups for all letters
      allLetters.forEach((letter) => {
        groups[letter] = [];
      });
      return groups;
    }

    const filtered = persons.filter((person) =>
      person.name.toLowerCase().includes(searchName.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));

    if (searchName.trim() === "") {
      // No search term: show all letters A-Z
      allLetters.forEach((letter) => {
        groups[letter] = [];
      });

      sorted.forEach((person) => {
        const firstLetter = person.name.charAt(0).toUpperCase();
        if (groups[firstLetter]) {
          groups[firstLetter].push(person);
        }
      });
    } else {
      // Search term exists: only show letters that have matching results
      sorted.forEach((person) => {
        const firstLetter = person.name.charAt(0).toUpperCase();
        if (!groups[firstLetter]) {
          groups[firstLetter] = [];
        }
        groups[firstLetter].push(person);
      });
    }

    return groups;
  }, [persons, searchName]);

  const alphabetSections =
    searchName.trim() === ""
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
      : Object.keys(groupedPersons).sort();

  if (loading || !interactions) return <div>Loading...</div>;
  if (error) return <Error error={error} />;

  return (
    <Page title="Connect" showTitleMobile>
      <div className="lg:flex w-full">
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="h-full flex flex-col p-6 px-0">
            {/* Contact Navigation */}
            <div>
              {/* Search Input */}
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search people..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              {/* Alphabetical Contact List */}
              <nav className="space-y-2 max-h-[50vh] overflow-y-scroll">
                {alphabetSections.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-3">
                    No people found
                  </p>
                ) : (
                  alphabetSections.map((letter) => (
                    <div key={letter} className="space-y-1">
                      {/* Letter Header */}
                      <div className="px-3 py-1 text-xs font-bold border-b">
                        {letter}
                      </div>

                      {/* People in this letter group */}
                      {groupedPersons[letter]?.map((person) => {
                        const isSelected = selectedPersonId === person.id;
                        return (
                          <button
                            key={person.id}
                            onClick={() => updateSelectedPerson(person.id)}
                            className={`group flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                              isSelected
                                ? "font-bold text-foreground bg-muted"
                                : "font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span>{person.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-6">
          <div className="w-full">
            {/* Search and Controls */}
            <div className="space-y-2 w-full mb-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                {/* Search Input */}
                <div className="w-full sm:flex-1">
                  <Input
                    type="text"
                    placeholder="Search interactions..."
                    value={interactionSearch}
                    onChange={(e) => setInteractionSearch(e.target.value)}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex flex-row gap-2 items-center sm:flex-shrink-0">
                  {/* Date Sort Button */}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setDateSort(dateSort === "asc" ? "desc" : "asc")
                    }
                    className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
                  >
                    <Calendar className="h-4 w-4" />
                    {dateSort === "desc" ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </Button>

                  {/* New Interaction Button */}
                  <Button
                    onClick={() => router.push("/social/connect/new")}
                    className="flex items-center gap-2 flex-1 sm:flex-none"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Interaction</span>
                  </Button>
                </div>
              </div>

              {/* Filter Badges */}
              <div className="flex items-center gap-2 flex-wrap min-h-[24px]">
                {selectedPersonId || interactionSearch ? (
                  <>
                    {selectedPersonId && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        person <span className="italic font-normal">=</span> &quot;
                        {selectedPersonId}&quot;
                        <button
                          onClick={() => updateSelectedPerson(null)}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {interactionSearch && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        name, location, notes{" "}
                        <span className="italic font-normal">contains</span> &quot;
                        {interactionSearch}&quot;
                        <button
                          onClick={() => setInteractionSearch("")}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground italic text-sm">
                    No filters have been applied
                  </span>
                )}
              </div>
            </div>

            {/* Interactions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interactions
                .filter((interaction) =>
                  selectedPersonId
                    ? interaction.personId === selectedPersonId
                    : true
                )
                .filter(
                  (interaction) =>
                    interaction.title
                      ?.toLowerCase()
                      .includes(interactionSearch.toLowerCase()) ||
                    interaction.placeName
                      ?.toLowerCase()
                      .includes(interactionSearch.toLowerCase()) ||
                    (typeof interaction.notes === "string"
                      ? interaction.notes
                          .toLowerCase()
                          .includes(interactionSearch.toLowerCase())
                      : JSON.stringify(interaction.notes)
                          .toLowerCase()
                          .includes(interactionSearch.toLowerCase()))
                )
                .sort((a, b) => {
                  const dateA = new Date(a.interactionTime || a.createdAt);
                  const dateB = new Date(b.interactionTime || b.createdAt);
                  return dateSort === "desc"
                    ? dateB.getTime() - dateA.getTime()
                    : dateA.getTime() - dateB.getTime();
                })
                .map((interaction) => (
                  <div
                    key={interaction.id}
                    className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-2">
                      {/* Title */}
                      <h3 className="font-semibold text-lg text-foreground">
                        {interaction.title}
                      </h3>

                      {/* Person name (only show when viewing all interactions) */}
                      {!selectedPersonId && (
                        <h4 className="font-medium text-muted-foreground">
                          {interaction.person?.name}
                        </h4>
                      )}

                      {/* Date */}
                      <p className="text-sm text-muted-foreground">
                        {interaction.interactionTime
                          ? new Date(
                              interaction.interactionTime
                            ).toLocaleDateString()
                          : new Date(
                              interaction.createdAt
                            ).toLocaleDateString()}
                      </p>

                      {/* Place */}
                      {interaction.placeName && (
                        <h4 className="font-medium">{interaction.placeName}</h4>
                      )}

                      {/* Notes preview */}
                      {interaction.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {typeof interaction.notes === "string"
                            ? interaction.notes
                            : JSON.stringify(interaction.notes, null, 2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* No interactions message */}
            {interactions.filter((interaction) =>
              selectedPersonId
                ? interaction.personId === selectedPersonId
                : true
            ).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {selectedPersonId
                    ? `No interactions yet with ${
                        persons?.find((p) => p.id === selectedPersonId)?.name
                      }`
                    : "No interactions found"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
