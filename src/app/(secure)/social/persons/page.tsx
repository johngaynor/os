"use client";

import React, { useEffect, useState } from "react";
import { usePersonStore } from "@/store/personStore";
import { Error, Page } from "../../components/Pages";
import { Button, Input, Badge } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpAZ, ArrowDownZA, Grid3X3, List } from "lucide-react";
import PersonListLoading from "./components/PersonListLoading";

const defaultFilters = {
  search: "",
  nameSort: "asc" as string | null,
};

export default function Persons() {
  const { fetchPersons, persons, loading, error } = usePersonStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and sort persons based on current filters
  const filteredPersons = (() => {
    let filtered =
      persons?.filter((person) => {
        const matchesSearch =
          !filters.search ||
          person.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          person.relationshipType
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          (person.origin &&
            person.origin.toLowerCase().includes(filters.search.toLowerCase()));

        return matchesSearch;
      }) || [];

    // Apply name sorting
    if (filters.nameSort) {
      filtered = [...filtered].sort((a, b) => {
        return filters.nameSort === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
    }

    return filtered;
  })();

  useEffect(() => {
    if (!persons && !error) {
      fetchPersons();
    }
  }, [persons, error, fetchPersons]);

  if (loading) return <PersonListLoading />;
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
      <div className="w-full p-6">
        <div className="space-y-4 w-full">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* Search Input - Full Width on mobile, flex-1 on larger screens */}
            <div className="w-full sm:flex-1">
              <Input
                type="text"
                placeholder="Search name, type, or origin..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            {/* Buttons Row - side by side, inline with search on larger screens */}
            <div className="flex flex-row gap-2 items-center sm:flex-shrink-0">
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    ...filters,
                    nameSort: filters.nameSort === "asc" ? "desc" : "asc",
                  })
                }
                className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                {filters.nameSort === "desc" ? (
                  <ArrowDownZA className="h-4 w-4" />
                ) : (
                  <ArrowUpAZ className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                {viewMode === "grid" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid3X3 className="h-4 w-4" />
                )}
              </Button>
              <Button asChild className="flex-1 sm:flex-none">
                <a href="/social/persons/new" className="text-center">
                  Add Person
                </a>
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPersons.map((person) => (
                <div
                  key={person.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-[#0E0E0E]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {person.name}
                      </h3>
                      <p className="text-muted-foreground line-clamp-1">
                        {person.relationshipType} • Strength:{" "}
                        {person.relationshipStrength}/5
                      </p>
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-1">
                        <span className="font-medium">Occupation:</span>{" "}
                        {person.occupation || "N/a"}
                      </p>
                      <p className="text-sm text-muted-foreground my-3 line-clamp-1">
                        <span className="font-medium">Origin:</span>{" "}
                        {person.origin || "N/a"}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        <span className="font-medium">Context:</span>{" "}
                        {person.context || "N/a"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/social/persons/person/${person.id}`}>View</a>
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="outline" className="text-xs">
                      Interactions: 0
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Prayers: 0
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table className="rounded-lg overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Context</TableHead>
                    <TableHead>Badges</TableHead>
                    <TableHead className="pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersons.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium max-w-[150px] truncate pl-4">
                        {person.name}
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <div className="text-sm">
                          <div className="truncate">
                            {person.relationshipType}
                          </div>
                          <div className="text-muted-foreground">
                            Strength: {person.relationshipStrength}/5
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm max-w-[150px] truncate">
                        {person.occupation || "N/a"}
                      </TableCell>
                      <TableCell className="text-sm max-w-[150px] truncate">
                        {person.origin || "N/a"}
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {person.context || "N/a"}
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <div className="flex gap-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            Interactions: 0
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Prayers: 0
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="pr-4">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/social/persons/person/${person.id}`}>
                            View
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
