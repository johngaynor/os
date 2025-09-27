import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Types
export type Person = {
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

type PersonState = {
  // State
  persons: Person[] | null;
  loading: boolean;
  error: string | null;
  selectedPerson: Person | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  selectPerson: (person: Person | null) => void;
  clearState: () => void;

  // Async Actions
  fetchPersons: () => Promise<void>;
  createPerson: (
    personData: Omit<Person, "id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<Person | null>;
  updatePerson: (
    id: string,
    updates: Partial<Person>
  ) => Promise<Person | null>;
  deletePerson: (id: string) => Promise<boolean>;
};

export const usePersonStore = create<PersonState>()(
  devtools(
    (set, get) => ({
      // Initial state
      persons: null,
      loading: false,
      error: null,
      selectedPerson: null,

      // Sync actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      clearError: () => set({ error: null }),
      selectPerson: (selectedPerson) => set({ selectedPerson }),
      clearState: () =>
        set({
          persons: null,
          loading: false,
          error: null,
          selectedPerson: null,
        }),

      // Async actions
      fetchPersons: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/persons");

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch persons");
          }

          const persons = await response.json();
          set({ persons: persons || [], loading: false, error: null });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            loading: false,
          });
        }
      },

      createPerson: async (personData) => {
        set({ loading: true, error: null });
        try {
          console.log("starting to create person", personData);
          const response = await fetch("/api/persons", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(personData),
          });

          console.log(response);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create person");
          }

          const newPerson = await response.json();
          set((state) => ({
            persons: [newPerson, ...(state.persons || [])],
            loading: false,
            error: null,
          }));
          return newPerson;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            loading: false,
          });
          return null;
        }
      },

      updatePerson: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/persons/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update person");
          }

          const updatedPerson = await response.json();
          set((state) => ({
            persons: (state.persons || []).map((person) =>
              person.id === updatedPerson.id ? updatedPerson : person
            ),
            selectedPerson:
              state.selectedPerson?.id === updatedPerson.id
                ? updatedPerson
                : state.selectedPerson,
            loading: false,
            error: null,
          }));
          return updatedPerson;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            loading: false,
          });
          return null;
        }
      },

      deletePerson: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/persons/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete person");
          }

          set((state) => ({
            persons: (state.persons || []).filter((person) => person.id !== id),
            selectedPerson:
              state.selectedPerson?.id === id ? null : state.selectedPerson,
            loading: false,
            error: null,
          }));
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            loading: false,
          });
          return false;
        }
      },
    }),
    {
      name: "person-store", // name for devtools
    }
  )
);

// Selector hooks for convenience
export const usePersons = () => usePersonStore((state) => state.persons || []);
export const usePersonLoading = () => usePersonStore((state) => state.loading);
export const usePersonError = () => usePersonStore((state) => state.error);
export const useSelectedPerson = () =>
  usePersonStore((state) => state.selectedPerson);
