import type { CurrentUserQuery } from "@/graphql";
import { create } from "zustand";

export type CurrentUser = CurrentUserQuery["currentUser"];

interface UserState {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser) => void;
  updateCurrentUser: (updates: Partial<CurrentUser>) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user: CurrentUser) => set({ currentUser: user }),

  updateCurrentUser: (updates: Partial<CurrentUser>) => {
    const currentUser = get().currentUser;
    if (currentUser) {
      set({ currentUser: { ...currentUser, ...updates } });
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
}));
