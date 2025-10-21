import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";
import Register from "../pages/register";
import Account from "../pages/account";
import NotFound from "../pages/notFound";
import PublicRoutes from "./publicRoutes";
import PrivateRoutes from "./privateRoutes";

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <PrivateRoutes />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/profile", element: <Account /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
