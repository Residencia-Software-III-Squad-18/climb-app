import { useContext } from "react";

import { AuthContext, type AuthContextProps } from "./provider";

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }

  return context;
}

export { AuthProvider } from "./provider";
