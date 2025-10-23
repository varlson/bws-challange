import { Alert, Link, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { accountVerification } from "../../services/auth/login";

function AccountConfirmation() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const hasVerified = useRef(false);

  const verifyAccount = async (randomToken: string) => {
    const response = await accountVerification(randomToken);
    if (!response.success) setError(response.error);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyAccount(token);
    }
  }, [token, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Stack sx={{ width: "500px" }} spacing={2}>
        <Alert
          sx={{ justifyContent: "center" }}
          variant="filled"
          severity={error ? "error" : "success"}
        >
          {!error ? " Conta confirmada com sucesso!" : error}
        </Alert>
        <Link className="text-center" href="/login">
          Ir para login
        </Link>
      </Stack>
    </div>
  );
}

export default AccountConfirmation;
