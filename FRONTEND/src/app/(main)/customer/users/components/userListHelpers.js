export const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "success";
    case "completed":
      return "primary";
    case "inactive":
      return "error";
    default:
      return "default";
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case "active":
      return "In Progress";
    case "completed":
      return "Completed";
    case "inactive":
      return "Inactive";
    default:
      return status;
  }
};
