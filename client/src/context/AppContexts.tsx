import { createContext } from "react";
import type { AuthContextType, ThemeContextType } from "../types/types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loadLogedUser: async () => {},
  logout: () => {},
});

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
