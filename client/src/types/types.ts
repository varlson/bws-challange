import type { PaletteMode } from "@mui/material";
import type { MeResponse } from "../services/users/users.models";

// Tipo de usuário
export interface User {
  first_name: string;
  last_name: string;
  username: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: MeResponse | null;
  loadLogedUser: () => Promise<void>;
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
