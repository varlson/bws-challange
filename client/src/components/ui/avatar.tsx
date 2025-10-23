import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Avatar as Avt, Fade, Menu, Typography } from "@mui/material";
import { amber } from "@mui/material/colors";
import MenuItem from "@mui/material/MenuItem";

function Avatar() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    setAnchorEl(null);
    logout();
  };

  if (!user) return null;

  return user?.profile_picture ? (
    <Avt alt={user.first_name} src={user.profile_picture} />
  ) : (
    <div>
      <div
        onClick={handleClick}
        id="fade-button"
        className=" cursor-pointer bg-primary rounded px-2 py-1 flex items-center gap-x-3"
      >
        <Typography color="secondary">{user.username}</Typography>
        <Avt
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ bgcolor: amber[500] }}
        >
          {user.first_name.at(0)?.toUpperCase()}
          {user.last_name.at(0)?.toUpperCase()}
        </Avt>
      </div>
      <Menu
        id="fade-menu"
        slotProps={{
          list: {
            "aria-labelledby": "fade-button",
          },
        }}
        slots={{ transition: Fade }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default Avatar;
