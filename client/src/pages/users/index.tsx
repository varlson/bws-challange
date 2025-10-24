import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Switch,
  IconButton,
  Chip,
  Box,
  Grid,
  FormControlLabel,
  Tooltip,
  Container,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { mockUsers } from "../../constants/data";
import { formatDate, getInitials, getRoleLabel } from "./helper";

type ListusersResponse = {
  id: string;
  username: string;
  email: string;
  company: string;
  role: number;
  phone: string | null;
  profile_picture: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
};

export default function UserCards() {
  const [users, setUsers] = useState<ListusersResponse[]>(mockUsers);

  const handleToggleActive = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, is_active: !user.is_active } : user
      )
    );
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 600, color: "text.primary" }}
      >
        Gerenciamento de Usuários
      </Typography>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] px-2 gap-x-5 gap-y-4">
        {users.map((user) => {
          const roleInfo = getRoleLabel(user.role);

          return (
            <Grid key={user.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                  opacity: user.is_active ? 1 : 0.7,
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={user.profile_picture || undefined}
                      sx={{
                        width: 56,
                        height: 56,
                        mr: 2,
                        bgcolor: "primary.main",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(user.username)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, lineHeight: 1.2 }}
                      >
                        @{user.username}
                      </Typography>
                      <Chip
                        label={roleInfo.label}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: roleInfo.color,
                          color: "white",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-all" }}
                      >
                        {user.email}
                      </Typography>
                      {user.is_email_verified && (
                        <Tooltip title="Email verificado">
                          <CheckCircleIcon
                            sx={{ fontSize: 16, color: "success.main" }}
                          />
                        </Tooltip>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {user.company}
                      </Typography>
                    </Box>

                    {user.phone && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PhoneIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {user.phone}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Criado em: {formatDate(user.created_at)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Atualizado: {formatDate(user.updated_at)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.is_active}
                        onChange={() => handleToggleActive(user.id)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.is_active ? "Ativo" : "Inativo"}
                      </Typography>
                    }
                  />

                  <Tooltip title="Excluir usuário">
                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      color="error"
                      size="small"
                      sx={{
                        "&:hover": {
                          bgcolor: "error.light",
                          color: "error.contrastText",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </div>
    </Container>
  );
}
