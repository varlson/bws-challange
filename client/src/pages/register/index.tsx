import React, { useEffect, useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
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
import type { CreateUserRequest } from "../../services/users/users.models";
import { listCompanies } from "../../services/company/company.services";
import type { CompanyResponse } from "../../services/company/company.model";
import { CreateUser } from "../../services/users/users.services";
import FeedBackSnackBar from "../../components/ui/errorHandler";
import useForms from "../../hooks/useForms";
import CodeConfirmation from "../../components/ui/loginCodeConfirmation";

function Register() {
  const [user, setUser] = useState<CreateUserRequest>({
    company_id: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    phone: "",
    profile_picture: "",
    username: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(true);
  const [createAccountLoading, setCreateAccountLoading] =
    useState<boolean>(false);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);

  const {
    snackBarControl,
    erroeMessage,
    handleErrorMessageChange,
    loginModalConfim,
  } = useForms();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await listCompanies();
      if (response.success) {
        setCompanies(response.data);
      }
    };
    fetchCompanies();
  }, []);

  const setUserHandle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAccountLoading(true);
    const resp = await CreateUser(user);
    console.log({ resp });

    if (!resp.success) {
      handleErrorMessageChange(resp.error);
      snackBarControl.openSnackBarHandle();
    } else {
      loginModalConfim.handleClickOpen();
    }

    setCreateAccountLoading(false);
  };

  // const navigate = useNavigate();
  // const loginHandle = () => {
  //   navigate("/", { replace: true });
  // };

  return (
    <div className="relative bg-[url('/login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(86,46,172,0.6),rgba(148,136,8,0.413))]"></div>
      <Paper
        elevation={4}
        sx={{ borderRadius: 3 }}
        className="flex bg-primary-200  gap-x-5 w-[75%]  py-10 px-5 rounded-lg z-10"
      >
        <div className="bg-red-300 w-[35%] h-full">
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
              <div className="flex gap-x-3">
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

              <div className="flex gap-x-3">
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
                {companies.length > 0 && (
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

              <div className="flex gap-x-3">
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              {/* Botão */}
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
        handleClose={snackBarControl.closeSnackBarHandle}
        severity="error"
        open={snackBarControl.openSnack}
        message={erroeMessage}
      />
      <CodeConfirmation
        goTo="/login"
        email={user.email}
        {...loginModalConfim}
        isAccoutConfirmation={true}
      />
    </div>
  );
}

export default Register;
