import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  type PaletteMode,
} from "@mui/material";
import { useMemo, useState, type ReactNode } from "react";
import { ThemeContext } from "./AppContexts";
import { getDesignTokens } from "../components/theme/palette";

interface ThemeContextProviderProps {
  children: ReactNode;
}
export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem("themeMode");
    return (saved as PaletteMode) || "light";
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
