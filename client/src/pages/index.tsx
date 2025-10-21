import React from "react";
import { AuthProvider } from "../context/AuthProvider";
import { RouterProvider } from "react-router-dom";
import router from "../router";
import { ThemeContextProvider } from "../context/ThemeProvider";

function Main() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default Main;
