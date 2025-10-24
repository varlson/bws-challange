import React from "react";
import {
  Box,
  Container,
  // Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Toolbar,
  Grid,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { projects, recentActivities, stats } from "../../constants/data";
import { getPriorityColor, getStatusColor } from "./helper";

function Dashboard() {
  return (
    <div className="">
      <Toolbar />

      <Container className="w-ful " maxWidth={false}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <div className="w-full md:w-auto" key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: stat.color,
                        color: "white",
                        p: 1,
                        borderRadius: 2,
                        display: "flex",
                        mr: 2,
                      }}
                    >
                      {<stat.icon />}
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </div>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Projetos Ativos
              </Typography>
              <Grid container spacing={2}>
                {projects.map((project) => (
                  <Grid key={project.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {project.name}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                              <Chip
                                label={project.status}
                                size="small"
                                color={getStatusColor(project.status)}
                              />
                              <Chip
                                label={project.priority}
                                size="small"
                                color={getPriorityColor(project.priority)}
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Progresso
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {project.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={project.progress}
                            sx={{ height: 8, borderRadius: 5 }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <AvatarGroup max={4}>
                            {project.team.map((member, idx) => (
                              <Avatar
                                key={idx}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: "0.875rem",
                                }}
                              >
                                {member}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                          <Typography variant="body2" color="text.secondary">
                            Prazo: {project.deadline}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Atividades Recentes
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {activity.user.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{activity.user}</strong> {activity.action}{" "}
                          <strong>{activity.task}</strong>
                        </Typography>
                      }
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Dashboard;
