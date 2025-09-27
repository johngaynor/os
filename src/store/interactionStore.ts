import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";

// Types
export type Interaction = {
  id: string;
  personId: string;
  latitude?: number | null;
  longitude?: number | null;
  placeName?: string | null;
  interactionTime?: string | null; // ISO string format
  notes?: any; // JSON data
  createdAt: string;
  updatedAt: string;
  person?: {
    id: string;
    name: string;
  };
};

type InteractionState = {
  // State
  interactions: Interaction[] | null;
  loading: boolean;
  error: string | null;
  selectedInteraction: Interaction | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  selectInteraction: (interaction: Interaction | null) => void;
  clearState: () => void;

  // Async Actions
  fetchInteractions: (personId?: string) => Promise<void>;
  createInteraction: (
    interactionData: Omit<
      Interaction,
      "id" | "createdAt" | "updatedAt" | "person"
    >
  ) => Promise<Interaction | null>;
  updateInteraction: (
    id: string,
    updates: Partial<
      Omit<Interaction, "id" | "createdAt" | "updatedAt" | "person">
    >
  ) => Promise<Interaction | null>;
  deleteInteraction: (id: string) => Promise<boolean>;
};

export const useInteractionStore = create<InteractionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      interactions: null,
      loading: false,
      error: null,
      selectedInteraction: null,

      // Sync actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      clearError: () => set({ error: null }),
      selectInteraction: (selectedInteraction) => set({ selectedInteraction }),
      clearState: () =>
        set({
          interactions: null,
          loading: false,
          error: null,
          selectedInteraction: null,
        }),

      // Async actions
      fetchInteractions: async (personId) => {
        set({ loading: true, error: null });
        try {
          const url = personId
            ? `/api/interactions?personId=${personId}`
            : "/api/interactions";
          const response = await fetch(url);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch interactions");
          }

          const interactions = await response.json();
          set({
            interactions: interactions || [],
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            loading: false,
          });
        }
      },

      createInteraction: async (interactionData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/interactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(interactionData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create interaction");
          }

          const newInteraction = await response.json();
          set((state) => ({
            interactions: [newInteraction, ...(state.interactions || [])],
            loading: false,
            error: null,
          }));
          toast.success("Interaction created successfully!");
          return newInteraction;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            loading: false,
          });
          return null;
        }
      },

      updateInteraction: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/interactions/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update interaction");
          }

          const updatedInteraction = await response.json();
          set((state) => ({
            interactions: (state.interactions || []).map((interaction) =>
              interaction.id === updatedInteraction.id
                ? updatedInteraction
                : interaction
            ),
            selectedInteraction:
              state.selectedInteraction?.id === updatedInteraction.id
                ? updatedInteraction
                : state.selectedInteraction,
            loading: false,
            error: null,
          }));
          toast.success("Interaction updated successfully!");
          return updatedInteraction;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            loading: false,
          });
          return null;
        }
      },

      deleteInteraction: async (id) => {
        set({ loading: true, error: null });
        try {
          // Get the interaction before deleting for the toast message
          const state = get();
          const interactionToDelete = state.interactions?.find(
            (interaction) => interaction.id === id
          );

          const response = await fetch(`/api/interactions/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete interaction");
          }

          set((state) => ({
            interactions: (state.interactions || []).filter(
              (interaction) => interaction.id !== id
            ),
            selectedInteraction:
              state.selectedInteraction?.id === id
                ? null
                : state.selectedInteraction,
            loading: false,
            error: null,
          }));

          toast.success("Interaction deleted successfully!");
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
      name: "interaction-store", // name for devtools
    }
  )
);

// Selector hooks for convenience
export const useInteractions = () =>
  useInteractionStore((state) => state.interactions || []);
export const useInteractionLoading = () =>
  useInteractionStore((state) => state.loading);
export const useInteractionError = () =>
  useInteractionStore((state) => state.error);
export const useSelectedInteraction = () =>
  useInteractionStore((state) => state.selectedInteraction);
