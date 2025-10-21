import { useContext } from "react";
import type { AuthContextType } from "../types/types";
import { AuthContext } from "../context/AppContexts";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
