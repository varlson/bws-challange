import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { Home, BuildCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Blog() {
  const navigate = useNavigate();

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
          <BuildCircle
            sx={{
              fontSize: 64,
              color: "warning.main",
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: "text.secondary",
            }}
          >
            Esta página ainda está em construção!
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

export default Blog;
