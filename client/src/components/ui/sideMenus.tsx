// import { Link } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";

type SideMenuProps = {
  label: string;
  icon: React.ReactNode;
  linkto: string;
};
function SideMenu({ icon, label, linkto }: SideMenuProps) {
  return (
    <Link
      to={linkto}
      className=" justify-center w-[45px] h-[45px] rounded-full text-secondary hover:bg-primary hover:text-off-white-50  transition-all duration-300 hover:scale-105  text-4xl flex flex-col items-center mb-4"
    >
      {icon}
    </Link>
  );
}

export default SideMenu;
