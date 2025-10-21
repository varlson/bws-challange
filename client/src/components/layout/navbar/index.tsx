import { Container } from "@mui/material";
import React from "react";
import { useAuth } from "../../../hooks/useAuth";

function Navbar() {
  const { login, logout, user } = useAuth();
  const loginLogoutHandle = () => {
    if (user) {
      logout();
    } else {
      login("Suleimane Dcure");
    }
  };
  return (
    <Container maxWidth={false} className="bg-red-500 h-[60px]">
      <div onClick={loginLogoutHandle}>
        {user ? <p>Logout</p> : <p>Login</p>}
      </div>
    </Container>
  );
}

export default Navbar;
