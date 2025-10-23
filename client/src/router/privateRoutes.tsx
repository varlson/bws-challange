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
  return user ? (
    <div>
      <Navbar />
      <Box
        sx={{ bgcolor: "background.paper" }}
        className="fixed flex md:flex-col z-50 md:z-0 justify-around md:justify-start items-center  md:top-0 bottom-0 h-20 md:h-screen md:pt-20 px-2 w-full md:w-[100px] "
      >
        <SideMenu label="aa" icon={<Home fontSize="inherit" />} linkto="/" />
        <SideMenu
          label="aa"
          icon={<PersonIcon fontSize="inherit" />}
          linkto="/users"
        />
        <SideMenu
          label="aa"
          icon={<SettingsIcon fontSize="inherit" />}
          linkto="/my-account"
        />
      </Box>
      <div className="md:ml-[100px] pt-[75px] p-4">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}
