const request = require("supertest");
const app = require("../../src/server");
const db = require("../../src/models");

describe("Auth Integration Tests", () => {
  const registerPayload = {
    email: "testuser@example.com",
    password: "password123",
    username: "testuser",
    full_name: "Test User",
    role_id: 2, // Standard regular user role ID
  };

  beforeEach(async () => {
    // Delete any users created by tests to keep tests isolated
    await db.User.destroy({ where: { email: registerPayload.email } });
  });

  describe("POST /api/auth/register", () => {
    it("should successfully register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(registerPayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("email", registerPayload.email);
      expect(res.body.data).toHaveProperty("username", registerPayload.username);
    });

    it("should fail to register if validation checks fail", async () => {
      const invalidPayload = { ...registerPayload, email: "invalid-email" };
      const res = await request(app)
        .post("/api/auth/register")
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create user directly in database to log in
      const bcrypt = require("bcryptjs");
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(registerPayload.password, salt);

      const rank = await db.Rank.create({ amount: 0, order: 9999 });
      const user = await db.User.create({
        email: registerPayload.email,
        password: hashPassword,
        username: registerPayload.username,
        full_name: registerPayload.full_name,
        role_id: registerPayload.role_id,
        rank_id: rank.id,
        public_id: "test-user-pub-id",
      });
      await rank.update({ user_id: user.id });
      await db.Coin.create({ amount: 100, user_id: user.id });
    });

    it("should successfully log in and return access cookies", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: registerPayload.email,
          password: registerPayload.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("access_token");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should reject incorrect login credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: registerPayload.email,
          password: "wrong-password",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should clear auth cookies and log out successfully", async () => {
      const { getAuthHeaders } = require("../helpers/authHelper");
      const bcrypt = require("bcryptjs");
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(registerPayload.password, salt);

      const rank = await db.Rank.create({ amount: 0, order: 9999 });
      const user = await db.User.create({
        email: registerPayload.email,
        password: hashPassword,
        username: registerPayload.username,
        full_name: registerPayload.full_name,
        role_id: registerPayload.role_id,
        rank_id: rank.id,
        public_id: "logout-user-pub-id",
      });
      await rank.update({ user_id: user.id });
      await db.Coin.create({ amount: 100, user_id: user.id });

      const authHeaders = getAuthHeaders(user.id);

      const res = await request(app)
        .post("/api/auth/logout")
        .set(authHeaders);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });
});
