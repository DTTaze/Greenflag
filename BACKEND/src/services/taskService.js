const db = require("../models/index.js");
const Task = db.Task;
const TaskUser = db.TaskUser;
const User = db.User;
const TaskSubmit = db.TaskSubmit;
const TaskType = db.TaskType;
const Type = db.Type;
const uploadImages = require("./imageService.js").uploadImages;
const coinService = require("./coinService.js");
const { nanoid } = require("nanoid");
const { getCache, setCache, deleteCache } = require("../utils/cache.js");
const { CACHE_KEYS } = require("../constants/cacheKeys.js");
const BadRequestError = require("../errors/BadRequestError.js");
const NotFoundError = require("../errors/NotFoundError.js");
const AppError = require("../errors/AppError.js");

const createTask = async (data, user_id) => {
  try {
    let { title, content, description, coins, difficulty, total } = data;
    coins = Number(coins);
    total = Number(total);
    if (!user_id || !title || !description || coins === undefined) {
      throw new BadRequestError("user_id, title, description, and coins are required");
    }
    if (coins < 0) {
      throw new BadRequestError("Coins must be a positive number");
    }
    if (total < 0) {
      throw new BadRequestError("Total must be a positive number");
    }
    const result = await Task.create({
      public_id: nanoid(),
      title,
      content,
      description,
      coins,
      difficulty,
      total,
      creator_id: user_id,
      status: "public",
    });
    const taskData = result.toJSON();
    await setCache(CACHE_KEYS.MISSION.TASK_BY_ID(taskData.id), taskData);
    await setCache(CACHE_KEYS.MISSION.TASK_BY_PUBLIC_ID(taskData.public_id), taskData.id);
    await deleteCache(CACHE_KEYS.MISSION.ALL_TASKS);
    return taskData;
  } catch (e) {
    throw e;
  }
};

const getAllTasks = async () => {
  try {
    let tasks = await getCache(CACHE_KEYS.MISSION.ALL_TASKS);
    if (!tasks) {
      const dbTasks = await Task.findAll({
        include: [{ model: User, attributes: ["id", "username"] }],
      });
      tasks = dbTasks.map((task) => task.toJSON());
      await setCache(CACHE_KEYS.MISSION.ALL_TASKS, tasks);
    }
    return tasks;
  } catch (e) {
    throw e;
  }
};

const getTaskById = async (id) => {
  try {
    if (!id) throw new BadRequestError("Task ID is required");
    let task = await getCache(CACHE_KEYS.MISSION.TASK_BY_ID(id));
    if (!task) {
      const dbTask = await Task.findByPk(id);
      if (!dbTask) throw new NotFoundError("Task not found");
      task = dbTask.toJSON();
      await setCache(CACHE_KEYS.MISSION.TASK_BY_ID(id), task);
    }
    return task;
  } catch (e) {
    throw e;
  }
};

const updateTask = async (id, data) => {
  try {
    if (!id) throw new BadRequestError("Task ID is required");
    let { title, content, description, coins, difficulty, total, status } = data;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (description) updateFields.description = description;

    if (coins !== undefined) {
      if (Number(coins) < 0) {
        throw new BadRequestError("Coins must be a positive number");
      }
      updateFields.coins = Number(coins);
    }
    if (difficulty !== undefined) {
      const validDifficulties = ["easy", "medium", "hard", "event"];
      if (!validDifficulties.includes(difficulty)) {
        throw new BadRequestError("Difficulty must be easy/medium/hard");
      }
      updateFields.difficulty = difficulty;
    }
    if (total !== undefined) {
      if (Number(total) < 0) {
        throw new BadRequestError("Total must be a positive number");
      }
      updateFields.total = Number(total);
    }
    if (status !== undefined) {
      const validStatuses = ["public", "private"];
      if (!validStatuses.includes(status)) {
        throw new BadRequestError("Status must be public/private");
      }
      updateFields.status = status;
    }

    const task = await Task.findByPk(id);
    if (!task) throw new NotFoundError("Task not found");
    await task.update(updateFields);
    const taskData = task.toJSON();
    await setCache(CACHE_KEYS.MISSION.TASK_BY_ID(id), taskData);
    await deleteCache(CACHE_KEYS.MISSION.ALL_TASKS);
    return taskData;
  } catch (e) {
    throw e;
  }
};

const deleteTask = async (id) => {
  try {
    if (!id) throw new BadRequestError("Task ID is required");
    const task = await Task.findByPk(id);
    if (!task) throw new NotFoundError("Task not found");
    const public_id = task.public_id;
    await task.destroy();
    await deleteCache(CACHE_KEYS.MISSION.TASK_BY_ID(id));
    await deleteCache(CACHE_KEYS.MISSION.TASK_BY_PUBLIC_ID(public_id));
    await deleteCache(CACHE_KEYS.MISSION.ALL_TASKS);
    return { message: "Task deleted successfully" };
  } catch (e) {
    throw e;
  }
};

const acceptTask = async (task_id, user_id) => {
  try {
    if (!task_id || !user_id) throw new BadRequestError("Task ID and User ID are required");

    task_id = Number(task_id);
    user_id = Number(user_id);
    if (!Number.isInteger(task_id) || !Number.isInteger(user_id)) {
      throw new BadRequestError("Task ID and User ID must be integers");
    }
    const task = await Task.findByPk(task_id);
    if (!task) throw new NotFoundError("Task not found");
    const user = await User.findByPk(user_id);
    if (!user) throw new NotFoundError("User not found");
    const result = await TaskUser.create({ user_id, task_id });

    await setCache(CACHE_KEYS.MISSION.USER_TASK(result.id), result);

    let all_user_task_ids = await getCache(CACHE_KEYS.MISSION.TASKS_BY_USER_ID(user_id));
    if (!Array.isArray(all_user_task_ids)) {
      all_user_task_ids = [];
    }
    all_user_task_ids.push(result.id);
    await setCache(CACHE_KEYS.MISSION.TASKS_BY_USER_ID(user_id), all_user_task_ids);

    return result;
  } catch (e) {
    throw e;
  }
};

const submitTask = async (task_id, user_id, description, files) => {
  try {
    const taskId = Number(task_id);
    const userId = Number(user_id);
    const taskUser = await acceptTask(taskId, userId);
    if (!files || files.length === 0) throw new BadRequestError("No files provided.");
    const newTaskSubmit = await TaskSubmit.create({
      task_user_id: taskUser.id,
      description: description || "",
      status: "pending",
      submitted_at: new Date(),
    });
    const uploadedImages = await uploadImages(files, newTaskSubmit.id, "taskSubmit");
    const taskSubmitData = newTaskSubmit.toJSON();
    await setCache(CACHE_KEYS.MISSION.SUBMISSION(taskSubmitData.id), taskSubmitData);
    return { taskSubmit: taskSubmitData, images: uploadedImages };
  } catch (error) {
    console.error("Error submitting task:", error.message);
    throw error;
  }
};

const completeTask = async (taskUser, user) => {
  try {
    if (!taskUser || !taskUser.user_id) {
      throw new BadRequestError("TaskUser and User ID are required");
    }
    taskUser.status = "done";
    taskUser.completed_at = new Date();
    await taskUser.save();
    const taskUserData = taskUser.toJSON();
    await setCache(CACHE_KEYS.MISSION.USER_TASK(taskUserData.id), taskUserData);

    let newStreak = user.streak || 0;
    if (user.last_completed_task) {
      let lastCompletedTaskDate = new Date(user.last_completed_task);
      lastCompletedTaskDate.setHours(0, 0, 0, 0);
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let differenceInDays = (today - lastCompletedTaskDate) / (1000 * 60 * 60 * 24);
      if (differenceInDays > 1) {
        newStreak = 1;
      } else if (differenceInDays === 1) {
        newStreak += 1;
      }
    } else {
      newStreak = 1;
    }
    await user.update({
      streak: newStreak,
      last_completed_task: new Date(),
    });
    // User cache assumed to be handled elsewhere
    return;
  } catch (e) {
    throw e;
  }
};

const increaseProgressCount = async (task_user_id) => {
  try {
    if (!task_user_id) throw new BadRequestError("Missing task_user_id.");
    const taskUser = await TaskUser.findByPk(task_user_id, {
      include: [{ model: Task, as: "tasks" }],
    });
    if (!taskUser) throw new NotFoundError("Task user not found.");
    if (!taskUser.tasks) throw new NotFoundError("Task not found.");
    if (taskUser.progress_count >= taskUser.tasks.total) {
      throw new BadRequestError("Task is already completed.");
    }
    await taskUser.update({ progress_count: taskUser.progress_count + 1 });
    if (taskUser.progress_count >= taskUser.tasks.total) {
      const user = await User.findByPk(taskUser.user_id, {
        include: [{ model: db.Coin, as: "coins" }],
      });
      if (!user) throw new NotFoundError("User not found.");
      await completeTask(taskUser, user);
      const user_coins_id = user.coins_id;
      const coins = taskUser.tasks.coins;
      await coinService.updateIncreaseCoin(user_coins_id, coins);
    }
    const taskUserData = taskUser.toJSON();
    await setCache(CACHE_KEYS.MISSION.USER_TASK(taskUserData.id), taskUserData);
    return taskUserData;
  } catch (error) {
    console.error("Error increasing progress count:", error.message);
    throw error;
  }
};

const updateDecisionTaskSubmit = async (task_submit_id, decision) => {
  try {
    if (!task_submit_id) throw new BadRequestError("Missing task_submit_id.");
    if (!decision) throw new BadRequestError("Missing decision.");
    const validDecisions = ["approved", "rejected"];
    if (!validDecisions.includes(decision)) {
      throw new BadRequestError("Decision must be either 'approved' or 'rejected'.");
    }
    const taskSubmit = await TaskSubmit.findByPk(task_submit_id, {
      include: [{ model: TaskUser, as: "task_user" }],
    });
    if (!taskSubmit) throw new NotFoundError("Task submit not found.");
    taskSubmit.status = decision;
    await taskSubmit.save();
    const taskSubmitData = taskSubmit.toJSON();
    await setCache(CACHE_KEYS.MISSION.SUBMISSION(taskSubmitData.id), taskSubmitData);
    if (decision === "approved") {
      await increaseProgressCount(taskSubmit.task_user_id);
    }
    return taskSubmitData;
  } catch (error) {
    console.error("Error updating task submit:", error.message);
    throw error;
  }
};

const getAllTasksByTypeName = async (type_name) => {
  try {
    if (!type_name) throw new BadRequestError("Missing type name");
    const cacheKey = CACHE_KEYS.MISSION.TASKS_BY_TYPE(type_name);
    let tasks = await getCache(cacheKey);
    if (!tasks) {
      const type = await Type.findOne({ where: { name: type_name } });
      if (!type) throw new NotFoundError("Type not found");
      const taskTypes = await TaskType.findAll({
        where: { type_id: type.id },
        include: [{ model: Task }],
      });
      tasks = taskTypes.map((tt) => tt.Task.toJSON());
      await setCache(cacheKey, tasks, 300); // 5 minutes TTL
    }
    return tasks;
  } catch (error) {
    throw error;
  }
};

const getAllTasksByDifficultyName = async (difficulty_name) => {
  try {
    if (!difficulty_name) throw new BadRequestError("Missing difficulty name");
    const validDifficulties = ["easy", "medium", "hard", "event"];
    if (!validDifficulties.includes(difficulty_name)) {
      throw new BadRequestError("Difficulty name must be easy/medium/hard");
    }
    const cacheKey = CACHE_KEYS.MISSION.TASKS_BY_DIFFICULTY(difficulty_name);
    let tasks = await getCache(cacheKey);
    if (!tasks) {
      const dbTasks = await Task.findAll({
        where: { difficulty: difficulty_name },
      });
      tasks = dbTasks.map((task) => task.toJSON());
      await setCache(cacheKey, tasks, 300);
    }
    return tasks;
  } catch (error) {
    throw error;
  }
};

const getTaskByPublicId = async (public_id) => {
  try {
    if (!public_id) throw new BadRequestError("Task Public ID is required");
    const taskId = await getCache(CACHE_KEYS.MISSION.TASK_BY_PUBLIC_ID(public_id));
    if (taskId) {
      const task = await getCache(CACHE_KEYS.MISSION.TASK_BY_ID(taskId));
      if (task) return task;
    }
    const dbTask = await Task.findOne({ where: { public_id } });
    if (!dbTask) throw new NotFoundError("Task not found");
    const taskData = dbTask.toJSON();
    await setCache(CACHE_KEYS.MISSION.TASK_BY_ID(dbTask.id), taskData);
    await setCache(CACHE_KEYS.MISSION.TASK_BY_PUBLIC_ID(public_id), dbTask.id);
    return taskData;
  } catch (e) {
    throw e;
  }
};

const updateTaskByPublicId = async (public_id, data) => {
  try {
    if (!public_id) throw new BadRequestError("Task Public ID is required");
    const task = await Task.findOne({ where: { public_id } });
    if (!task) throw new NotFoundError("Task not found");
    return await updateTask(task.id, data);
  } catch (e) {
    throw e;
  }
};

const deleteTaskByPublicId = async (public_id) => {
  try {
    if (!public_id) throw new BadRequestError("Task Public ID is required");
    const task = await Task.findOne({ where: { public_id } });
    if (!task) throw new NotFoundError("Task not found");
    return await deleteTask(task.id);
  } catch (e) {
    throw e;
  }
};

const getAllTasksStatus = async (status) => {
  if (!status) throw new BadRequestError("Status is required");
  const validStatuses = ["public", "private"];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError("Status must be public/private");
  }
  try {
    const cacheKey = CACHE_KEYS.MISSION.TASKS_BY_STATUS(status);
    let tasks = await getCache(cacheKey);
    if (!tasks) {
      const dbTasks = await Task.findAll({ where: { status } });
      tasks = dbTasks.map((task) => task.toJSON());
      await setCache(cacheKey, tasks, 300);
    }
    return tasks;
  } catch (e) {
    throw e;
  }
};

const getAllTasksStatusPublic = async () => {
  return await getAllTasksStatus("public");
};

const getAllTasksStatusPrivate = async () => {
  return await getAllTasksStatus("private");
};

const getAllTasksOfCustomer = async (customer_id) => {
  try {
    if (!customer_id) throw new BadRequestError("Customer ID is required");
    const cacheKey = CACHE_KEYS.MISSION.TASKS_BY_CUSTOMER(customer_id);
    let tasks = await getCache(cacheKey);
    if (!tasks) {
      const dbTasks = await Task.findAll({
        where: { creator_id: customer_id },
      });
      tasks = dbTasks.map((task) => task.toJSON());
      await setCache(cacheKey, tasks, 300);
    }
    return tasks;
  } catch (e) {
    throw e;
  }
};

const changeTaskStatus = async (task_id, status) => {
  try {
    if (!task_id) throw new BadRequestError("Task ID is required");
    if (!status) throw new BadRequestError("Status is required");
    const validStatuses = ["public", "private"];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError("Status must be public/private");
    }
    const task = await Task.findByPk(task_id);
    if (!task) throw new NotFoundError("Task not found");
    task.status = status;
    await task.save();
    const taskData = task.toJSON();
    await setCache(CACHE_KEYS.MISSION.TASK_BY_ID(task_id), taskData);
    await deleteCache(CACHE_KEYS.MISSION.ALL_TASKS);
    return taskData;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  acceptTask,
  completeTask,
  submitTask,
  updateDecisionTaskSubmit,
  increaseProgressCount,
  getAllTasksByTypeName,
  getAllTasksByDifficultyName,
  getTaskByPublicId,
  updateTaskByPublicId,
  deleteTaskByPublicId,
  getAllTasksStatusPublic,
  getAllTasksStatusPrivate,
  getAllTasksOfCustomer,
  changeTaskStatus,
};
