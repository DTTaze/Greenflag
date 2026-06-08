const TASK_DIFFICULTY = Object.freeze({
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  EVENT: "event",
});

const TASK_VISIBILITY = Object.freeze({
  PUBLIC: "public",
  PRIVATE: "private",
});

const TASK_SUBMIT_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

module.exports = {
  TASK_DIFFICULTY,
  TASK_VISIBILITY,
  TASK_SUBMIT_STATUS,
};
