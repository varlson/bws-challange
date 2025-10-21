import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/navbar";
import SideMenu from "../components/ui/sideMenus";
import { Box } from "@mui/material";
import { Home } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

export default function PrivateRoutes() {
  const { user } = useAuth();
  console.log("PrivateRoutes user:", user);
  return user ? (
    <div>
      <Navbar />
      <Box
        sx={{ bgcolor: "background.paper" }}
        className="fixed flex flex-col items-center  top-0 bottom-0  h-screen pt-[80px] px-2 w-[100px] "
      >
        <SideMenu label="aa" icon={<Home fontSize="inherit" />} linkto="/" />
        <SideMenu
          label="aa"
          icon={<PersonIcon fontSize="inherit" />}
          linkto="/"
        />
        <SideMenu
          label="aa"
          icon={<SettingsIcon fontSize="inherit" />}
          linkto="/"
        />
      </Box>
      <div className="ml-[100px] pt-[75px] p-4">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}
