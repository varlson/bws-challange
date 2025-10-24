import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { Home, ErrorOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const errorPhrases = [
    "Ops! Página não encontrada",
    "404 - Esta página não existe",
    "Parece que você se perdeu",
    "Conteúdo não encontrado",
  ];

  const randomPhrase =
    errorPhrases[Math.floor(Math.random() * errorPhrases.length)];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <ErrorOutline
            sx={{
              fontSize: 64,
              color: "error.main",
              mb: 2,
            }}
          />

          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "error.main",
              mb: 1,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: "text.secondary",
            }}
          >
            {randomPhrase}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "text.secondary",
            }}
          >
            A página que você procura não pôde ser encontrada.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 2,
            }}
          >
            Página Inicial
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default NotFound;
