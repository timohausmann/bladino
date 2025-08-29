import { mockUsers } from "@/mocks";
import { User } from "@/types";
import { create } from "zustand";

// Dummy user data
const dummyUser: User = mockUsers[0];

interface UserState {
  // Current user data
  currentUser: User | null;

  // Actions
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: dummyUser,

  // Actions
  setCurrentUser: (user: User) => set({ currentUser: user }),

  updateCurrentUser: (updates: Partial<User>) => {
    const currentUser = get().currentUser;
    if (currentUser) {
      set({ currentUser: { ...currentUser, ...updates } });
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
}));
