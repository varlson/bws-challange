export type ColorStatus = "Em Progresso" | "Revisão" | "Concluído";
export type ColorPriority = "Alta" | "Média" | "Baixa";

export const getStatusColor = (status: ColorStatus) => {
  switch (status) {
    case "Em Progresso":
      return "primary";
    case "Revisão":
      return "warning";
    case "Concluído":
      return "success";
    default:
      return "default";
  }
};

export const getPriorityColor = (priority: ColorPriority) => {
  switch (priority) {
    case "Alta":
      return "error";
    case "Média":
      return "warning";
    case "Baixa":
      return "success";
    default:
      return "default";
  }
};
