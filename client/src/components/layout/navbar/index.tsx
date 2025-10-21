import { Container } from "@mui/material";
import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import Logo from "../../ui/logo";
import Avatar from "../../ui/avatar";

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
    <Container
      maxWidth={false}
      sx={{ bgcolor: "background.paper" }}
      className="flex fixed z-50 justify-between items-center hadow-xl h-[70px]"
    >
      <Logo />
      {/* <div onClick={loginLogoutHandle}> */}
      <Avatar />
      {/* </div> */}
    </Container>
  );
}

export default Navbar;
