export const filterTasksByDifficulty = (
  tasksList: any[],
  difficulty: string,
) => {
  if (difficulty === "all") return tasksList;
  return tasksList.filter((task) => task.difficulty === difficulty);
};

export const getTaskCategory = (
  title: string = "",
  description: string = "",
): string => {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/cây|trồng|rừng|hoa|xanh|vườn/)) return "planting";
  if (text.match(/rác|nhựa|chai|lon|túi|nilon|gom|giấy|phế liệu|pin|sắt/))
    return "recycling";
  if (text.match(/điện|nước|tắt|năng lượng|tiết kiệm/)) return "saving";
  return "other";
};
