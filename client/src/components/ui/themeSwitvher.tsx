import { IconButton, Box } from "@mui/material";
import { Brightness2, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "../../hooks/useTheme";

export default function ThemeSwitcher() {
  const { toggleTheme, mode } = useThemeContext();

  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <Box sx={{}}>
      <IconButton
        onClick={handleToggleTheme}
        color="primary"
        size="large"
        sx={{
          bgcolor: "action.selected",
          "&:hover": {
            bgcolor: "action.hover",
          },
          p: 2,
        }}
      >
        {mode == "dark" ? <Brightness7 /> : <Brightness2 />}
      </IconButton>
    </Box>
  );
}
