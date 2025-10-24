import React, { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Link,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Mail } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import FeedBackSnackBar from "../../components/ui/errorHandler";
import Modal from "../../components/ui/modal";

import useHooks from "../../hooks/useHooks";
import { requestPasswordRecovery } from "../../services/auth/login";
import { useNavigate } from "react-router-dom";

function PasswordRecovery() {
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);
  const { snackBar, modalControl, errorHandlerController, loadingController } =
    useHooks();

  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadingController.starLoadingHandle();
    const response = await requestPasswordRecovery(email);

    if (response.success) {
      modalControl("open");
      setSuccessFeedback(response.data.detail);
    } else {
      snackBar.snackBarController("open");
      errorHandlerController.errorSetter(response.error);
    }

    loadingController.stopLoadingHandle();
  };

  return (
    <div className="relative bg-[url('/login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(86,46,172,0.6),rgba(148,136,8,0.4))]" />

      <Paper
        elevation={6}
        sx={{ borderRadius: 3 }}
        className="grid bg-primary-200 md:grid-cols-2 gap-x-5 lg:w-[60%] md:w-[80%] w-[90%] py-10 px-5 rounded-lg z-10"
      >
        <div className="hidden md:block">
          <img
            src="/login2.jpg"
            alt="Recuperar senha"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
          className="flex flex-col justify-center"
        >
          <Link
            variant="h5"
            align="center"
            sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
          >
            Recuperar senha
          </Link>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="E-mail"
              variant="outlined"
              name="email"
              type="email"
              error={!!errorHandlerController.error}
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

            <LoadingButton
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
              Enviar código
            </LoadingButton>
          </Box>
        </Paper>
      </Paper>

      <Modal
        title="Recuperação da senha"
        confirmLabel="Ok"
        state={!!successFeedback}
        stateControl={modalControl}
        oncloseAction={() => {
          navigate("/login", { replace: true });
        }}
      >
        <Alert severity="success">{successFeedback}</Alert>
      </Modal>

      <FeedBackSnackBar
        handleClose={() => snackBar.snackBarController("open")}
        severity="error"
        open={snackBar.snackbarState}
        message={errorHandlerController.error ?? ""}
      />
    </div>
  );
}

export default PasswordRecovery;
