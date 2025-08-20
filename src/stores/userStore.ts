import { User } from "@/types";
import { create } from "zustand";

// Dummy user data
const dummyUser: User = {
  id: "current-user-123",
  avatar: "https://i.pravatar.cc/150?img=2", // Using existing mock image
  name: "Jane Smith",
  handle: "janesmith",
  bio: "Frontend developer passionate about creating beautiful user experiences. Love React, TypeScript, and clean code.",
  joinDate: new Date("2023-01-15"),
  email: "jane.smith@example.com",
};

interface UserState {
  // Current user data
  currentUser: User | null;

  // Actions
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  currentUser: dummyUser, // Start with dummy user for development

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
