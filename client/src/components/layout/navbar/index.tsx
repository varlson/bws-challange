import { Badge, Container } from "@mui/material";
import React from "react";
import Logo from "../../ui/logo";
import Avatar from "../../ui/avatar";
import { MailLockOutlined } from "@mui/icons-material";

function Navbar() {
  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: "background.paper" }}
      className=" fixed md:z-50 z-10  shadow-xl h-[70px]"
    >
      <div className="h-full flex justify-between items-center w-full mx:px-16 bg">
        <Logo />
        <div className="flex gap-x-4 md:gap-x-10 items-center">
          <Badge badgeContent={4} color="secondary">
            <MailLockOutlined color="action" />
          </Badge>
          <Avatar />
        </div>
      </div>
    </Container>
  );
}

export default Navbar;
