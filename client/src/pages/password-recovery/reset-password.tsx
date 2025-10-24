import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Alert,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  Lock,
  CheckCircle,
  Cancel,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useSearchParams } from "react-router-dom";
import useHooks from "../../hooks/useHooks";
import { resetPassword } from "../../services/auth/login";
import FeedBackSnackBar from "../../components/ui/errorHandler";

function PasswordReset() {
  const { loadingController, errorHandlerController, snackBar } = useHooks();
  const [params] = useSearchParams();
  const token = params.get("token");
  const uid = params.get("uid");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasNumber: false,
  });

  const passwordsMatch = password === confirmPassword && confirmPassword !== "";
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const canSubmit = passwordsMatch && isPasswordValid && password !== "";
  const hasTokenAndUid = uid && token;

  useEffect(() => {
    setPasswordCriteria({
      minLength: password.length >= 8,
      hasNumber: /[0-9]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    loadingController.starLoadingHandle();
    e.preventDefault();
    if (!hasTokenAndUid) {
      errorHandlerController.errorSetter(
        "Link de verificação inválida. Tente novamente mais tarde!"
      );
      snackBar.snackBarController("open");
    }

    if (canSubmit && hasTokenAndUid) {
      const response = await resetPassword(password, uid, token);

      console.log(response);

      if (!response.success) {
        errorHandlerController.errorSetter(response.error);
        snackBar.snackBarController("open");
      } else {
        setSuccessMessage(response.data.detail);
        setConfirmPassword("");
        setPassword("");
      }
    }

    loadingController.stopLoadingHandle();
  };

  const handleBlur = (field: "password" | "confirmPassword") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getPasswordStrength = () => {
    const criteriaMet = Object.values(passwordCriteria).filter(Boolean).length;
    return (criteriaMet / 5) * 100;
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 40) return "error";
    if (strength < 80) return "warning";
    return "success";
  };

  const PasswordCriteriaItem = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.8rem" }}
    >
      {met ? (
        <CheckCircle sx={{ color: "success.main", fontSize: 16 }} />
      ) : (
        <Cancel sx={{ color: "error.main", fontSize: 16 }} />
      )}
      <Typography
        variant="body2"
        color={met ? "success.main" : "text.secondary"}
      >
        {text}
      </Typography>
    </Box>
  );

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Redefinir Senha
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Campo de Senha */}
        <TextField
          label="Nova Senha"
          variant="outlined"
          autoComplete="new-password"
          type={showPassword ? "text" : "password"}
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur("password")}
          margin="normal"
          error={touched.password && !isPasswordValid}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              ),
            },
          }}
        />

        {password && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={getPasswordStrength()}
              color={getPasswordStrengthColor()}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Força da senha: {getPasswordStrength().toFixed(0)}%
            </Typography>
          </Box>
        )}

        {password && (
          <Box sx={{ mb: 2, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
            <PasswordCriteriaItem
              met={passwordCriteria.minLength}
              text="Mínimo 8 caracteres"
            />
            <PasswordCriteriaItem
              met={passwordCriteria.hasNumber}
              text="Pelo menos um número"
            />
          </Box>
        )}

        <TextField
          label="Confirmar Senha"
          autoComplete="new-password"
          variant="outlined"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          margin="normal"
          error={touched.confirmPassword && !passwordsMatch}
          helperText={
            touched.confirmPassword &&
            !passwordsMatch &&
            "As senhas não coincidem"
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              ),
            },
          }}
        />

        {confirmPassword && (
          <Alert
            severity={passwordsMatch ? "success" : "error"}
            sx={{ mt: 1 }}
            icon={passwordsMatch ? <CheckCircle /> : <Cancel />}
          >
            {passwordsMatch ? "Senhas coincidem" : "Senhas não coincidem"}
          </Alert>
        )}

        <LoadingButton
          loading={loadingController.isLoading}
          type="submit"
          variant="contained"
          fullWidth
          disabled={!canSubmit}
          sx={{
            mt: 3,
            py: 1.2,
            borderRadius: 2,
            fontWeight: "bold",
          }}
        >
          Redefinir Senha
        </LoadingButton>
      </Box>
      <FeedBackSnackBar
        handleClose={() => snackBar.snackBarController("close")}
        severity="error"
        open={snackBar.snackbarState}
        message={errorHandlerController.error ?? ""}
      />

      {successMessage && (
        <Alert variant="filled" severity="success">
          {successMessage}
        </Alert>
      )}
    </Paper>
  );
}

export default PasswordReset;
