import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AlternateEmail,
  Lock,
  Mail,
  Person,
  PhoneAndroid,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import FeedBackSnackBar from "../../components/ui/errorHandler";
import Modal from "../../components/ui/modal";
import useHooks from "../../hooks/useHooks";
import { CreateUser } from "../../services/users/users.services";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [current, setCurrent] = useState<"loading" | "feedback">("loading");
  // const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(true);
  const [createAccountLoading, setCreateAccountLoading] =
    useState<boolean>(false);

  const {
    loadingController,
    user,
    setUserHandle,
    setUser,
    companies,
    loadCompanies,
    modalControl,
    modalState,
    snackBar,
    errorHandlerController,
  } = useHooks();

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const navigate = useNavigate();

  const navigateToLoginPage = () => {
    navigate("/login", { replace: true });
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const modalParams = {
    loading: {
      title: "Por favor aguarde!",
      children: (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ),
      state: loadingController.isLoading,
      stateControl: modalControl,
    },
    feedback: {
      confirmLabel: "Fazer login",
      title:
        "Para continuar, confirme sua conta com código enviado para seu email",
      children: (
        <Alert variant="filled" severity="success">
          Sua conta foi criada com sucesso!
        </Alert>
      ),

      state: modalState,
      stateControl: modalControl,
      oncloseAction: navigateToLoginPage,
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrent("feedback");
    setCreateAccountLoading(true);
    const resp = await CreateUser(user);

    if (!resp.success) {
      errorHandlerController.errorSetter(resp.error);
      snackBar.snackBarController("open");
    } else {
      modalControl("open");
    }

    setCreateAccountLoading(false);
  };

  return (
    <div className="relative bg-[url('/login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(86,46,172,0.6),rgba(148,136,8,0.413))]"></div>
      <Paper
        elevation={4}
        sx={{ borderRadius: 3 }}
        className="flex flex-col lg:flex-row bg-primary-200  gap-x-5 w-full lg:w-[75%]  py-10 px-5 rounded-lg z-10"
      >
        <div className="bg-red-300 w-full lg:w-[35%] h-full">
          <img
            className=" w-full object-cover"
            src="/crateAccount.jpg"
            alt=""
          />
        </div>

        <div className="flex-1">
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
              Cire uma conta
            </Link>

            <Box component="form" onSubmit={handleSubmit}>
              <div className="md:flex gap-x-3">
                <TextField
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  required
                  name="first_name"
                  value={user.first_name}
                  onChange={setUserHandle}
                  margin="normal"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  label="Sobrenome"
                  variant="outlined"
                  fullWidth
                  required
                  name="last_name"
                  value={user.last_name}
                  onChange={setUserHandle}
                  margin="normal"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              <div className="md:flex gap-x-3">
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  name="email"
                  value={user.email}
                  onChange={setUserHandle}
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
                  label="Username"
                  variant="outlined"
                  fullWidth
                  type="text"
                  required
                  name="username"
                  value={user.username}
                  onChange={setUserHandle}
                  margin="normal"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmail color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              <TextField
                label="Celular"
                variant="outlined"
                fullWidth
                type="tel"
                name="phone"
                value={user.phone}
                onChange={setUserHandle}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneAndroid color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <div>
                <InputLabel id="demo-simple-select-label">Empresa</InputLabel>

                {companies && (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Selecione empresa"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        company_id:
                          e.target.value == 0
                            ? undefined
                            : String(e.target.value),
                      });
                    }}
                    className="min-w-[200px]"
                    required
                    defaultValue={0}
                  >
                    <MenuItem selected key={0} value={0}>
                      Selecione
                    </MenuItem>
                    {companies.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </div>

              <div className="md:flex gap-x-3">
                <TextField
                  label="Senha"
                  variant="outlined"
                  fullWidth
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={setUserHandle}
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
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label=" Repita a  senha"
                  variant="outlined"
                  fullWidth
                  required
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={user.password_confirmation}
                  onChange={setUserHandle}
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
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                loading={createAccountLoading}
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Criar conta
              </Button>
            </Box>

            <Link
              href="/login"
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "text.primary" }}
            >
              Já tem uma conta? Entre aqui
            </Link>
          </Paper>
        </div>
      </Paper>
      <FeedBackSnackBar
        handleClose={() => snackBar.snackBarController("open")}
        severity="error"
        open={snackBar.snackbarState}
        message={errorHandlerController.error ?? ""}
      />

      <Modal {...modalParams[current]} />
    </div>
  );
}

export default Register;
