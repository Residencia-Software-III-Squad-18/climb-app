import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RbacState {
  permissoes: string[];
  nomeCargo: string | null;
  setRbac: (nomeCargo: string, permissoes: string[]) => void;
  clearRbac: () => void;
}

export const useRbacStore = create<RbacState>()(
  persist(
    (set) => ({
      permissoes: [],
      nomeCargo: null,
      setRbac: (nomeCargo, permissoes) => set({ nomeCargo, permissoes }),
      clearRbac: () => set({ permissoes: [], nomeCargo: null }),
    }),
    { name: "rbac-storage" }
  )
);
