import type { PaletteMode } from "@mui/material";

// Tipo de usuário
export interface User {
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
}

export interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}
