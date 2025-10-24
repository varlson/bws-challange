export const getRoleLabel = (role: number) => {
  const roles = {
    0: { label: "Admin", color: "#a161eb" },
    1: { label: "Gerente", color: "#feb602" },
    2: { label: "Usuário", color: "#757575" },
  };
  return (
    roles[role as keyof typeof roles] || {
      label: "Desconhecido",
      color: "#757575",
    }
  );
};

export const getInitials = (username: string) => {
  return username
    .split(".")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
