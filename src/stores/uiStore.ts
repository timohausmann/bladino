import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isPresenceRailOpen: boolean;
  setPresenceRailOpen: (open: boolean) => void;
  togglePresenceRail: () => void;
  isNavRailExpanded: boolean;
  setNavRailExpanded: (expanded: boolean) => void;
  toggleNavRail: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      isPresenceRailOpen: true,
      setPresenceRailOpen: (open) => set({ isPresenceRailOpen: open }),
      togglePresenceRail: () =>
        set({ isPresenceRailOpen: !get().isPresenceRailOpen }),
      isNavRailExpanded: true,
      setNavRailExpanded: (expanded) => set({ isNavRailExpanded: expanded }),
      toggleNavRail: () =>
        set({ isNavRailExpanded: !get().isNavRailExpanded }),
    }),
    { name: "bladino.ui" },
  ),
);
