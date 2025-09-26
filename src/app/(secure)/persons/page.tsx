"use client";

import { useState } from "react";
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

export default function PersonsExample() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message?: string; error?: string; data?: Person } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    relationshipType: "",
    relationshipStrength: 1,
    occupation: "",
    context: "",
  });

  const fetchPersons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/persons");
      const data = await res.json();

      if (res.ok) {
        setPersons(data);
        setResponse({
          success: true,
          message: `Fetched ${data.length} persons`,
        });
      } else {
        setResponse({ success: false, error: data.error });
      }
    } catch {
      setResponse({ success: false, error: "Failed to fetch persons" });
    } finally {
      setLoading(false);
    }
  };

  const createPerson = async () => {
    if (!formData.name || !formData.relationshipType) {
      setResponse({
        success: false,
        error: "Name and relationship type are required",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse({
          success: true,
          message: "Person created successfully",
          data,
        });
        setFormData({
          name: "",
          origin: "",
          relationshipType: "",
          relationshipStrength: 1,
          occupation: "",
          context: "",
        });
        fetchPersons(); // Refresh the list
      } else {
        setResponse({ success: false, error: data.error });
      }
    } catch {
      setResponse({ success: false, error: "Failed to create person" });
    } finally {
      setLoading(false);
    }
  };

  const deletePerson = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/persons/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setResponse({ success: true, message: "Person deleted successfully" });
        fetchPersons(); // Refresh the list
      } else {
        setResponse({ success: false, error: data.error });
      }
    } catch {
      setResponse({ success: false, error: "Failed to delete person" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Person Management</h1>

      {/* Create Person Form */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Person</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name (required)"
            className="border rounded px-3 py-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Origin"
            className="border rounded px-3 py-2"
            value={formData.origin}
            onChange={(e) =>
              setFormData({ ...formData, origin: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Relationship type (required)"
            className="border rounded px-3 py-2"
            value={formData.relationshipType}
            onChange={(e) =>
              setFormData({ ...formData, relationshipType: e.target.value })
            }
          />
          <select
            className="border rounded px-3 py-2"
            value={formData.relationshipStrength}
            onChange={(e) =>
              setFormData({
                ...formData,
                relationshipStrength: parseInt(e.target.value),
              })
            }
          >
            <option value={1}>1 - Weak</option>
            <option value={2}>2 - Light</option>
            <option value={3}>3 - Moderate</option>
            <option value={4}>4 - Strong</option>
            <option value={5}>5 - Very Strong</option>
          </select>
          <input
            type="text"
            placeholder="Occupation"
            className="border rounded px-3 py-2"
            value={formData.occupation}
            onChange={(e) =>
              setFormData({ ...formData, occupation: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Context/Notes"
            className="border rounded px-3 py-2"
            value={formData.context}
            onChange={(e) =>
              setFormData({ ...formData, context: e.target.value })
            }
          />
        </div>
        <Button onClick={createPerson} disabled={loading} className="mt-4">
          Create Person
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <Button onClick={fetchPersons} disabled={loading}>
          Fetch All Persons
        </Button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      {/* Response Display */}
      {response && !loading && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            response.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <p>
            {response.success ? "✅ " : "❌ "}
            {response.message || response.error}
          </p>
          {response.data && (
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Persons List */}
      {persons.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Your Persons ({persons.length})
          </h2>
          <div className="grid gap-4">
            {persons.map((person) => (
              <div key={person.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{person.name}</h3>
                    <p className="text-gray-600">
                      Type: {person.relationshipType}
                    </p>
                    <p className="text-gray-600">
                      Strength: {person.relationshipStrength}/5
                    </p>
                    {person.origin && (
                      <p className="text-gray-600">Origin: {person.origin}</p>
                    )}
                    {person.occupation && (
                      <p className="text-gray-600">
                        Occupation: {person.occupation}
                      </p>
                    )}
                    {person.context && (
                      <p className="text-gray-600">Context: {person.context}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      Created: {new Date(person.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePerson(person.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
