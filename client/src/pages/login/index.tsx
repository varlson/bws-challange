import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const loginHandle = () => {
    login("Suleimane Ducure");
    navigate("/", { replace: true });
  };
  return (
    <div className="p-10">
      <p>Login page</p>
      <Button variant="contained" onClick={loginHandle}>
        Enter
      </Button>
    </div>
  );
}

export default Login;
