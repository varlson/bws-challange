import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/navbar";

export default function PrivateRoutes() {
  const { user } = useAuth();
  return user ? (
    <div>
      <Navbar />
      <Outlet />
      <p>footer</p>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}
