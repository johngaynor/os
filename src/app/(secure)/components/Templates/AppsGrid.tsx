"use client";
import React from "react";
import { Input, Badge } from "@/components/ui";
import Link from "next/link";
import { Star } from "lucide-react";

const apps = [
  {
    id: 1,
    name: "People",
    description: "Manage your friends, contacts, etc.",
    link: "/social/people",
    favorite: 0,
  },
  {
    id: 2,
    name: "Connect",
    description: "Personal CRM to manage relationships.",
    link: "/social/connect",
    favorite: 0,
  },
];

const AppsGrid: React.FC<{ filter: string }> = ({ filter }) => {
  const [search, setSearch] = React.useState("");

  const filteredApps = apps
    ?.filter((app) => {
      const matchesFilter = app.link?.includes(filter);
      const matchesSearch =
        search === "" || app.name?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    ?.sort((a, b) => {
      // First, sort by favorite status (favorites first)
      if (a.favorite !== b.favorite) {
        return b.favorite - a.favorite; // 1 (favorite) comes before 0 (not favorite)
      }
      // Then sort alphabetically by name
      return a.name?.localeCompare(b.name || "") || 0;
    });

  return (
    <div className="w-full mb-20">
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {filteredApps.length === 0 ? (
        <p className="text-muted-foreground italic p4-8">
          No apps match your search. Please adjust your criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {filteredApps?.map((app) => (
            <div key={app.id} className="relative">
              <button
                className="absolute top-4 left-4 z-10 p-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // toggleAppFavorite(user.id, app.id);
                  alert("This feature is coming up!");
                }}
              >
                <Star
                  className={`h-5 w-5 ${
                    app.favorite === 1
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </button>

              {/* App tile - clickable for navigation */}
              <Link href={app.link}>
                <div className="flex flex-col h-[200px] w-full text-left whitespace-normal break-words border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md px-3 py-2 text-sm cursor-pointer transition-all items-center justify-center">
                  <h2 className="text-2xl font-bold text-center">{app.name}</h2>
                  <p className="text-muted-foreground text-center py-2">
                    {app.description}
                  </p>
                  {/* Tags section based on URL path segments */}
                  <div className="flex w-5/6 flex-wrap gap-1 justify-center">
                    {app.link
                      .split("/")
                      .filter((segment) => segment !== "")
                      .slice(0, -1) // Remove the last segment
                      .map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppsGrid;
