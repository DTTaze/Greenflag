const { z } = require("zod");
const { TASK_DIFFICULTY, TASK_VISIBILITY, TASK_SUBMIT_STATUS } = require("../constants/taskStatus");

/**
 * @typedef {z.infer<typeof createTaskDto>} CreateTaskDto
 * @typedef {z.infer<typeof updateTaskDto>} UpdateTaskDto
 * @typedef {z.infer<typeof submitTaskDto>} SubmitTaskDto
 * @typedef {z.infer<typeof decisionTaskSubmitDto>} DecisionTaskSubmitDto
 * @typedef {z.infer<typeof changeTaskStatusDto>} ChangeTaskStatusDto
 */

const createTaskDto = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  coins: z.coerce.number().min(0, "Coins must be non-negative"),
  difficulty: z.enum(Object.values(TASK_DIFFICULTY), {
    errorMap: () => ({ message: "Difficulty must be easy, medium, hard, or event" }),
  }),
  total: z.coerce.number().min(0, "Total must be non-negative").optional(),
});

const updateTaskDto = createTaskDto.partial().extend({
  status: z
    .enum(Object.values(TASK_VISIBILITY), {
      errorMap: () => ({ message: "Status must be public or private" }),
    })
    .optional(),
});

const submitTaskDto = z.object({
  description: z.string().optional(),
});

const decisionTaskSubmitDto = z.object({
  decision: z.enum(Object.values(TASK_SUBMIT_STATUS), {
    errorMap: () => ({ message: "Decision must be pending, approved, or rejected" }),
  }),
});

const changeTaskStatusDto = z.object({
  status: z.enum(Object.values(TASK_VISIBILITY), {
    errorMap: () => ({ message: "Status must be public or private" }),
  }),
});

module.exports = {
  createTaskDto,
  updateTaskDto,
  submitTaskDto,
  decisionTaskSubmitDto,
  changeTaskStatusDto,
};
