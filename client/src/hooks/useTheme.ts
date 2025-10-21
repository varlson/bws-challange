import { useContext } from "react";
import { ThemeContext } from "../context/AppContexts";

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeContext deve ser usado dentro de ThemeContextProvider"
    );
  }
  return context;
};
