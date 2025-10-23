import React from "react";
import { AuthProvider } from "../context/AuthProvider";
import { RouterProvider } from "react-router-dom";
import router from "../router";
import { ThemeContextProvider } from "../context/ThemeProvider";
import ThemeSwitcher from "../components/ui/themeSwitvher";

function Main() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <div className="fixed bottom-4 left-2 h-12 w-12 rounded-full">
        <ThemeSwitcher />
      </div>
    </ThemeContextProvider>
  );
}

export default Main;
