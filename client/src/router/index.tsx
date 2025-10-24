import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";
import Register from "../pages/register";
import NotFound from "../pages/notFound";
import PublicRoutes from "./publicRoutes";
import PrivateRoutes from "./privateRoutes";
import AccountConfirmation from "../pages/accountConfirmation";
import UserCards from "../pages/users";
import PasswordRecovery from "../pages/password-recovery";
import PasswordReset from "../pages/password-recovery/reset-password";
import Blog from "../pages/blog";
import Account from "../pages/account";

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/verify-email", element: <AccountConfirmation /> },
      { path: "/password-recovery", element: <PasswordRecovery /> },
      { path: "/reset-password", element: <PasswordReset /> },
      { path: "/blog", element: <Blog /> },
    ],
  },
  {
    element: <PrivateRoutes />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/users", element: <UserCards /> },
      { path: "/my-account", element: <Account /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
