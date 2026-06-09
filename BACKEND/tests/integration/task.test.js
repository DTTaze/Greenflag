const request = require("supertest");
const app = require("../../src/server");
const db = require("../../src/models");
const { getAuthHeaders } = require("../helpers/authHelper");

describe("Task Integration Tests", () => {
  let adminUser;
  let regularUser;
  let adminHeaders;
  let regularHeaders;

  beforeEach(async () => {
    // Seed admin
    const adminRole = await db.Role.findOne({ where: { name: "admin" } });
    const rank1 = await db.Rank.create({ amount: 0, order: 1001 });
    adminUser = await db.User.create({
      email: "admin@example.com",
      username: "adminuser",
      password: "password123",
      full_name: "Admin User",
      role_id: adminRole.id,
      rank_id: rank1.id,
      public_id: "admin-pub-id",
    });
    await rank1.update({ user_id: adminUser.id });
    await db.Coin.create({ amount: 500, user_id: adminUser.id });
    adminHeaders = getAuthHeaders(adminUser.id);

    // Seed regular user
    const userRole = await db.Role.findOne({ where: { name: "user" } });
    const rank2 = await db.Rank.create({ amount: 0, order: 1002 });
    regularUser = await db.User.create({
      email: "user@example.com",
      username: "regularuser",
      password: "password123",
      full_name: "Regular User",
      role_id: userRole.id,
      rank_id: rank2.id,
      public_id: "user-pub-id",
    });
    await rank2.update({ user_id: regularUser.id });
    await db.Coin.create({ amount: 100, user_id: regularUser.id });
    regularHeaders = getAuthHeaders(regularUser.id);
  });

  afterEach(async () => {
    // Clean database tables
    await db.TaskUser.destroy({ where: {} });
    await db.TaskSubmit.destroy({ where: {} });
    await db.Task.destroy({ where: {} });
    await db.User.destroy({ where: {} });
    await db.Coin.destroy({ where: {} });
    await db.Rank.destroy({ where: {} });
  });

  describe("POST /api/tasks/upload", () => {
    it("should allow an admin to create a new task", async () => {
      const taskData = {
        title: "Test Green Task",
        content: "Detailed task instructions.",
        description: "Task description.",
        coins: 50,
        difficulty: "easy",
        total: 10,
      };

      const res = await request(app)
        .post("/api/tasks/upload")
        .set(adminHeaders)
        .send(taskData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("title", taskData.title);
    });

    it("should forbid a regular user from creating a task", async () => {
      const res = await request(app)
        .post("/api/tasks/upload")
        .set(regularHeaders)
        .send({
          title: "Forbid Task",
          content: "Instructions",
          description: "Desc",
          coins: 10,
          difficulty: "easy",
          total: 5,
        });

      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/tasks/accept/:id", () => {
    let task;

    beforeEach(async () => {
      task = await db.Task.create({
        title: "Acceptable Task",
        content: "Task Content",
        description: "Task Description",
        coins: 20,
        difficulty: "easy",
        total: 5,
        creator_id: adminUser.id,
        status: "public",
        public_id: "test-task-pub-id",
      });
    });

    it("should allow a regular user to accept a task", async () => {
      const res = await request(app)
        .post(`/api/tasks/accept/${task.id}`)
        .set(regularHeaders);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify that TaskUser record was created
      const taskUser = await db.TaskUser.findOne({
        where: { task_id: task.id, user_id: regularUser.id },
      });
      expect(taskUser).toBeDefined();
    });
  });

  describe("POST /api/tasks/submit/:task_id", () => {
    let task;
    let taskUser;

    beforeEach(async () => {
      task = await db.Task.create({
        title: "Submittable Task",
        content: "Task Content",
        description: "Task Description",
        coins: 20,
        difficulty: "easy",
        total: 5,
        creator_id: adminUser.id,
        status: "public",
        public_id: "test-task-submit-id",
      });

      taskUser = await db.TaskUser.create({
        task_id: task.id,
        user_id: regularUser.id,
        status: "ongoing",
        progress_count: 0,
        target_count: 1,
      });
    });

    it("should allow a user to submit a task with description and images", async () => {
      const res = await request(app)
        .post(`/api/tasks/submit/${task.id}`)
        .set(regularHeaders)
        .field("description", "I completed the task.")
        .attach("images", Buffer.from("proof content"), "proof.jpg");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const submission = await db.TaskSubmit.findOne({
        where: { task_user_id: taskUser.id },
      });
      expect(submission).toBeDefined();
      expect(submission.description).toBe("I completed the task.");
    });
  });
});
