import React, { useState } from "react";
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

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const navigate = useNavigate();
  const loginHandle = () => {
    navigate("/", { replace: true });
  };

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
              <TextField
                label="Nome Completo"
                variant="outlined"
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

              <TextField
                label="Email"
                variant="outlined"
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

              <div className="flex gap-x-3">
                <TextField
                  label="Senha"
                  variant="outlined"
                  fullWidth
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
    </div>
  );
}

export default Register;
