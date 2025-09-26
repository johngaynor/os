"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type Person = {
  id: string;
  userId: string;
  name: string;
  origin?: string;
  relationshipType: string;
  relationshipStrength: number;
  occupation?: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
};

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/persons");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch persons");
      }

      const data = await response.json();
      setPersons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching persons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchPersons();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          Please sign in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user.firstName || "User"}!
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your personal network.
        </p>
      </div>

      {/* Persons Overview */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Your Network</h3>
          <Button
            onClick={fetchPersons}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <p className="text-destructive font-medium">Error: {error}</p>
            <Button
              onClick={fetchPersons}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {persons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No people in your network yet. Start building your
                  connections!
                </p>
                <Button asChild>
                  <a href="/persons">Add Your First Person</a>
                </Button>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-lg">{persons.length}</h4>
                    <p className="text-sm text-muted-foreground">
                      Total People
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-lg">
                      {Math.round(
                        (persons.reduce(
                          (sum, p) => sum + p.relationshipStrength,
                          0
                        ) /
                          persons.length) *
                          10
                      ) / 10}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Avg. Relationship Strength
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-lg">
                      {new Set(persons.map((p) => p.relationshipType)).size}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Relationship Types
                    </p>
                  </div>
                </div>

                {/* Recent People */}
                <div>
                  <h4 className="font-semibold mb-3">Recent Connections</h4>
                  <div className="space-y-3">
                    {persons.slice(0, 5).map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                      >
                        <div>
                          <h5 className="font-medium">{person.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {person.relationshipType} • Strength:{" "}
                            {person.relationshipStrength}/5
                          </p>
                          {person.occupation && (
                            <p className="text-xs text-muted-foreground">
                              {person.occupation}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(person.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {persons.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" asChild>
                        <a href="/persons">View All {persons.length} People</a>
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="/persons">Manage Network</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/api-example">Test API</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
