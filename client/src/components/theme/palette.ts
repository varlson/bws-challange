// theme/palette.ts
import {} from "@mui/material";
import type { PaletteMode } from "@mui/material/styles";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#a161eb",
            light: "#c28df7",
            dark: "#552583",
            contrastText: "#faf6fe",
          },
          secondary: {
            main: "#feb602",
            light: "#ffd71c",
            dark: "#974b09",
            contrastText: "#fffdea",
          },
          background: {
            default: "#F0F6FF",
            paper: "#ffffff",
          },
          text: {
            primary: "#212121",
            secondary: "#757575",
          },
          divider: "#e0e0e0",
        }
      : {
          primary: {
            main: "#b987f7",
            light: "#cda7fb",
            dark: "#7d4ec4",
            contrastText: "#1c1a22",
          },
          secondary: {
            main: "#ffc941",
            light: "#ffdc73",
            dark: "#b67e00",
            contrastText: "#1c1a22",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          text: {
            primary: "#fafafa",
            secondary: "#bdbdbd",
          },
          divider: "#333333",
        }),
  },
});
