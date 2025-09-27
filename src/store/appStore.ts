import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Global app state types
type AppState = {
  // Global UI state
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  notifications: string[];

  // Global actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  addNotification: (message: string) => void;
  removeNotification: (index: number) => void;
  clearNotifications: () => void;
};

export const useAppStore = create<AppState>()(
  devtools(
    (set, _get) => ({
      // Initial state
      sidebarOpen: false,
      theme: "system" as const,
      notifications: [],

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      addNotification: (message) =>
        set((state) => ({
          notifications: [...state.notifications, message],
        })),
      removeNotification: (index) =>
        set((state) => ({
          notifications: state.notifications.filter((_, i) => i !== index),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "app-store", // name for devtools
    }
  )
);

// Selector hooks for convenience
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);
export const useNotifications = () =>
  useAppStore((state) => state.notifications);
