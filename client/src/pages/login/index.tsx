import React, { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
} from "@mui/material";
import { Lock, Mail, Visibility, VisibilityOff } from "@mui/icons-material";
import LoginCodeConfirmation from "../../components/ui/loginCodeConfirmation";
import FeedBackSnackBar from "../../components/ui/errorHandler";
import { useLogin } from "../../hooks/useLogin";
import Modal from "../../components/ui/modal";
import useHooks from "../../hooks/useHooks";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    modalControl,
    modalState,
    errorHandlerController,
    loadingController,
    resetCredential,
    handleCredentialChange,
    credential,
    loginModalConfim,
    snackBarControll,
  } = useHooks();

  const { login } = useLogin();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadingController.starLoadingHandle();
    const response = await login(credential);
    console.log(response);
    if (response.success) {
      loginModalConfim.handleClickOpen();
    } else {
      modalControl(
        response.error.startsWith("Você não tem permissão") ? "open" : "close"
      );
      errorHandlerController.errorSetter(response.error);
      snackBarControll.openSnackBarHandle();
    }

    loadingController.stopLoadingHandle();
  };

  return (
    <div className="relative bg-[url('/login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(86,46,172,0.6),rgba(148,136,8,0.413))]"></div>
      <Paper
        elevation={4}
        sx={{ borderRadius: 3 }}
        className="grid bg-primary-200 md:grid-cols-2 gap-x-5 lg:w-[60%] md:[80%] w-full  py-10 px-5 rounded-lg z-10"
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
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                error={!!errorHandlerController.error}
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

              <TextField
                label="Senha"
                variant="outlined"
                name="password"
                fullWidth
                required
                error={!!errorHandlerController.error}
                type={showPassword ? "text" : "password"}
                value={credential.password}
                onChange={handleCredentialChange}
                margin="normal"
                autoComplete="new-password"
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

              <Button
                loading={loadingController.isLoading}
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

            <Link
              href="/password-recovery"
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
      <LoginCodeConfirmation
        goTo="/"
        email={credential.email}
        {...loginModalConfim}
      />
      <Modal
        children={
          <Alert severity="error">
            {errorHandlerController.error + " Tenta novamente mais tarde."}
          </Alert>
        }
        state={modalState}
        stateControl={modalControl}
        title="Conta bloqueada temporariamente"
        confirmLabel="Ok"
        oncloseAction={resetCredential}
      />
      <FeedBackSnackBar
        handleClose={snackBarControll.closeSnackBarHandle}
        severity="error"
        open={snackBarControll.openSnack}
        message={errorHandlerController.error ?? ""}
      />
    </div>
  );
}

export default Login;
