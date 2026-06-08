const db = require("../models/index.js");
const taskSubmitRepo = require("../repositories/taskSubmitRepository.js");

const getTaskSubmitByUserId = async (user_id) => {
  const taskSubmits = await taskSubmitRepo.findAll(
    {
      include: [
        {
          model: db.TaskUser,
          as: "task_user",
          where: {
            user_id: user_id,
          },
          include: [
            {
              model: db.Task,
              as: "tasks",
            },
          ],
        },
        {
          model: db.Image,
          as: "images",
          where: {
            reference_type: "taskSubmit",
          },
        },
      ],
    },
    { raw: true, nest: true },
  );

  const formattedSubmits = taskSubmits.map((submit) => ({
    id: submit.id,
    task_user: {
      progress_count: submit.task_user.progress_count,
      assigned_at: submit.task_user.assigned_at,
      task: {
        id: submit.task_user.tasks.id,
        title: submit.task_user.tasks.title,
        description: submit.task_user.tasks.description,
        coins: submit.task_user.tasks.coins,
        difficulty: submit.task_user.tasks.difficulty,
      },
      user: {
        id: submit.task_user.user_id,
      },
    },
    images: Array.isArray(submit.images)
      ? submit.images.map((image) => image.url)
      : submit.images?.url
        ? [submit.images.url]
        : [],
  }));
  return formattedSubmits;
};

const getTaskSubmitByCustomerId = async (customer_id) => {
  const taskSubmits = await taskSubmitRepo.findAll(
    {
      include: [
        {
          model: db.TaskUser,
          as: "task_user",
          include: [
            {
              model: db.Task,
              as: "tasks",
              where: {
                creator_id: customer_id,
              },
            },
          ],
        },
        {
          model: db.Image,
          as: "images",
          where: {
            reference_type: "taskSubmit",
          },
        },
      ],
    },
    { raw: true, nest: true },
  );

  const formattedSubmits = taskSubmits.map((submit) => ({
    id: submit.id,
    task_user: {
      progress_count: submit.task_user.progress_count,
      assigned_at: submit.task_user.assigned_at,
      task: {
        id: submit.task_user.tasks.id,
        title: submit.task_user.tasks.title,
        description: submit.task_user.tasks.description,
        coins: submit.task_user.tasks.coins,
        difficulty: submit.task_user.tasks.difficulty,
      },
      user: {
        id: submit.task_user.user_id,
      },
    },
    images: Array.isArray(submit.images)
      ? submit.images.map((image) => image.url)
      : submit.images?.url
        ? [submit.images.url]
        : [],
  }));
  return formattedSubmits;
};

module.exports = {
  getTaskSubmitByUserId,
  getTaskSubmitByCustomerId,
};
