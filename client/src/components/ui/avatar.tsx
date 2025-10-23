// import React from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { Avatar as Avt, Fade, Menu, Typography } from "@mui/material";
// import { amber } from "@mui/material/colors";
// import MenuItem from "@mui/material/MenuItem";

// function Avatar() {
//   const { user, logout } = useAuth();
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogOut = () => {
//     setAnchorEl(null);
//     logout();
//   };

//   if (!user) return null;

//   return user?.profile_picture ? (
//     <Avt alt={user.first_name} src={user.profile_picture} />
//   ) : (
//     <div>
//       <div
//         onClick={handleClick}
//         id="fade-button"
//         className=" cursor-pointer bg-primary rounded px-2 py-1 flex items-center gap-x-2"
//       >
//         {/* <Typography color="secondary">{user.first_name}</Typography> */}
//         <Avt
//           aria-controls={open ? "fade-menu" : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? "true" : undefined}
//           sx={{ bgcolor: amber[500] }}
//         >
//           {user.first_name.at(0)?.toUpperCase()}
//           {user.last_name.at(0)?.toUpperCase()}
//         </Avt>
//       </div>
//       <Menu
//         id="fade-menu"
//         slotProps={{
//           list: {
//             "aria-labelledby": "fade-button",
//           },
//         }}
//         slots={{ transition: Fade }}
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//       >
//         <MenuItem onClick={handleClose}>Profile</MenuItem>
//         <MenuItem onClick={handleClose}>My account</MenuItem>
//         <MenuItem onClick={handleLogOut}>Logout</MenuItem>
//       </Menu>
//     </div>
//   );
// }

// export default Avatar;

import React from "react";
import {
  Avatar as MuiAvatar,
  Fade,
  Menu,
  Typography,
  Box,
  Divider,
  ListItemIcon,
  MenuItem,
} from "@mui/material";
import { amber, deepOrange } from "@mui/material/colors";
import { Logout, Person, AccountCircle, Settings } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import type { MeResponse } from "../../services/users/users.models";

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
    handleClose();
    logout();
  };

  // Função para gerar as iniciais do usuário
  const getInitials = (user: MeResponse): string => {
    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || "";
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  // Função para gerar cor baseada no ID do usuário (para consistência)
  const getAvatarColor = (user: MeResponse) => {
    const colors = [amber[500], deepOrange[500], deepOrange[300], amber[300]];
    const colorIndex = user.id ? parseInt(user.id, 16) % colors.length : 0;
    return colors[colorIndex];
  };

  if (!user) return null;

  const userFullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <Box>
      <MuiAvatar
        onClick={handleClick}
        sx={{
          bgcolor: user.profile_picture ? undefined : getAvatarColor(user),
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 2,
          },
        }}
        alt={userFullName}
        src={user.profile_picture}
        aria-controls={open ? "avatar-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {!user.profile_picture && getInitials(user)}
      </MuiAvatar>

      <Menu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slots={{
          transition: Fade,
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: 200,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header com informações do usuário */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {userFullName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.email}
          </Typography>
          {user.company && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.company}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Itens do menu */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Minha Conta
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configurações
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Avatar;
