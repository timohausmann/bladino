import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isPresenceRailOpen: boolean;
  setPresenceRailOpen: (open: boolean) => void;
  togglePresenceRail: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      isPresenceRailOpen: true,
      setPresenceRailOpen: (open) => set({ isPresenceRailOpen: open }),
      togglePresenceRail: () =>
        set({ isPresenceRailOpen: !get().isPresenceRailOpen }),
    }),
    { name: "bladino.ui" },
  ),
);
