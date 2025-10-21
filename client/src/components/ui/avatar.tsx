import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Avatar as Avt, Fade, Menu } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
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

  return user?.avatarUrl ? (
    <Avt alt="Travis Howard" src={user.avatarUrl} />
  ) : (
    <div>
      <Avt
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ bgcolor: deepOrange[500] }}
      >
        {user.name.at(0)?.toLowerCase()}
      </Avt>
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
