import React from "react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to={"/"} className="  flex items-center cursor-pointer">
      <img className="w-[120px]  object-cover" src="/AuthNix.png" alt="" />
    </Link>
  );
}

export default Logo;
