import type { PaletteMode } from "@mui/material";

// Tipo de usuário
export interface User {
  name: string;
  usermame: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, name: string) => void;
  logout: () => void;
}

export interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

export type Credentials = {
  email: string;
  password: string;
};
