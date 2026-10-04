import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ToolbarMode = {
  Docked: "docked",
  Popup: "popup",
} as const;
export type ToolbarMode = (typeof ToolbarMode)[keyof typeof ToolbarMode];

interface ToolbarModeStore {
  mode: ToolbarMode;
  setMode: (mode: ToolbarMode) => void;
}

/**
 * How the template toolbar menus are shown. Persisted per browser (no user
 * backend exists yet). `skipHydration` keeps the first client render equal to
 * the server render; call `useToolbarModeStore.persist.rehydrate()` on mount.
 */
export const useToolbarModeStore = create<ToolbarModeStore>()(
  persist(
    (set) => ({
      mode: ToolbarMode.Docked,
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "tomato:toolbar-mode",
      partialize: (state) => ({ mode: state.mode }),
      skipHydration: true,
    },
  ),
);
