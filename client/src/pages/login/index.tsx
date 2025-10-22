import React, { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Visibility, VisibilityOff } from "@mui/icons-material";
import { authenticate } from "../../services/auth/login";
import axios from "axios";
import LoginCodeConfirmation from "../../components/ui/loginCodeConfirmation";
import useForms from "../../hooks/useForms";
import FeedBackSnackBar from "../../components/ui/errorHandler";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    loginModalConfim,
    credential,
    handleCredentialChange,
    erroeMessage,
    handleErrorMessageChange,
    snackBarControl,
  } = useForms();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // loginModalConfim.handleClickOpen();
    const response = await authenticate(credential);
    console.log("response ", response);
    setIsLoading(false);
    if (response.success) {
      loginModalConfim.handleClickOpen();
    } else {
      handleErrorMessageChange(response.error);
      snackBarControl.openSnackBarHandle();
    }
  };

  const { login } = useAuth();
  const navigate = useNavigate();

  const loginHandle = () => {
    login("Suleimane Ducure");
    // navigate("/", { replace: true });
  };
  return (
    <div className="relative bg-[url('/login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(86,46,172,0.6),rgba(148,136,8,0.413))]"></div>
      <Paper
        elevation={4}
        sx={{ borderRadius: 3 }}
        className="grid bg-primary-200 grid-cols-2 gap-x-5 w-[60%]  py-10 px-5 rounded-lg z-10"
      >
        <div className="">
          <img src="/login2.jpg" alt="" />
        </div>

        <div>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              width: "100%",
              height: "100%",
              bgcolor: "background.paper",
            }}
            className="flex flex-col justify-center"
          >
            <Link
              variant="h5"
              align="center"
              sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
            >
              Entrar na conta
            </Link>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Campo de Email */}
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                error={!!erroeMessage}
                fullWidth
                required
                value={credential.email}
                onChange={handleCredentialChange}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Campo de Senha */}
              <TextField
                label="Senha"
                variant="outlined"
                name="password"
                fullWidth
                required
                error={!!erroeMessage}
                type={showPassword ? "text" : "password"}
                value={credential.password}
                onChange={handleCredentialChange}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Botão */}
              <Button
                loading={isLoading}
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Entrar
              </Button>
            </Box>

            {/* Link extra */}
            <Link
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "text.secondary" }}
            >
              Esqueceu sua senha?
            </Link>
            <Link
              href="/register"
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "text.primary" }}
            >
              Não tem uma conta? Cadastre-se
            </Link>
          </Paper>
        </div>
      </Paper>
      <LoginCodeConfirmation email={credential.email} {...loginModalConfim} />
      <FeedBackSnackBar
        handleClose={snackBarControl.closeSnackBarHandle}
        severity="error"
        open={snackBarControl.openSnack}
        message={erroeMessage}
      />
    </div>
  );
}

export default Login;
