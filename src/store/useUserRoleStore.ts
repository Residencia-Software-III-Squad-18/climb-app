import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserRoleState {
  role: string | null;
  setRole: (role: string | null | undefined) => void;
  clearRole: () => void;
}

export const useUserRoleStore = create<UserRoleState>()(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role: role ?? null }),
      clearRole: () => set({ role: null }),
    }),
    {
      name: "user-role-storage",
    }
  )
);
