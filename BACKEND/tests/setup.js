const path = require("path");
// Ensure .test.env is loaded BEFORE anything else
require("dotenv").config({ path: path.resolve(__dirname, "../.test.env") });

// Track all created mock Redis instances to close them after tests
const redisInstances = [];
jest.mock("ioredis", () => {
  const RedisMock = require("ioredis-mock");
  return jest.fn().mockImplementation(function (...args) {
    const instance = new RedisMock(...args);
    redisInstances.push(instance);
    return instance;
  });
});

const processors = {};

// Mock bullmq
jest.mock("bullmq", () => ({
  Queue: jest.fn().mockImplementation((name) => ({
    name,
    add: jest.fn().mockImplementation(async (jobName, data) => {
      const processor = processors[name];
      if (processor) {
        try {
          // Run processor synchronously in tests
          await processor({ data, id: "mock-job-id" });
        } catch (err) {
          const BadRequestError = require("../src/errors/BadRequestError");
          throw new BadRequestError(err.message);
        }
      }
      return { id: "mock-job-id" };
    }),
    close: jest.fn().mockResolvedValue(),
  })),
  Worker: jest.fn().mockImplementation((name, processor) => {
    processors[name] = processor;
    return {
      name,
      close: jest.fn().mockResolvedValue(),
      on: jest.fn().mockReturnThis(),
    };
  }),
}));

// Mock multer-storage-cloudinary
jest.mock("multer-storage-cloudinary", () => {
  return jest.fn().mockImplementation(() => ({}));
});

// Mock multer to bypass stream hanging issues under test while still parsing request body
jest.mock("multer", () => {
  const actualMulter = jest.requireActual("multer");
  const mockMulter = (options) => {
    const uploader = actualMulter({ storage: actualMulter.memoryStorage() });
    const mockMethod = (fn) => (req, res, next) => {
      return fn(req, res, (err) => {
        if (err) return next(err);
        if (req.file) {
          req.file.path = "https://res.cloudinary.com/mock-path/image.jpg";
        }
        if (req.files) {
          if (Array.isArray(req.files)) {
            req.files.forEach((f) => {
              f.path = "https://res.cloudinary.com/mock-path/image.jpg";
            });
          } else {
            Object.keys(req.files).forEach((key) => {
              req.files[key].forEach((f) => {
                f.path = "https://res.cloudinary.com/mock-path/image.jpg";
              });
            });
          }
        }
        next();
      });
    };

    return {
      any: () => mockMethod(uploader.any()),
      array: (name, maxCount) => mockMethod(uploader.array(name, maxCount)),
      fields: (fields) => mockMethod(uploader.fields(fields)),
      none: () => mockMethod(uploader.none()),
      single: (name) => mockMethod(uploader.single(name)),
    };
  };
  Object.assign(mockMulter, actualMulter);
  return mockMulter;
});

// Mock cloudinary v2 SDK
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: "https://res.cloudinary.com/mock-path/image.jpg",
        public_id: "mock-public-id",
      }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));

// Ensure workers are required so that their Worker instances are registered
require("../src/jobs/workers/purchaseWorker");
require("../src/jobs/workers/orderSyncWorker");

const { Client } = require("pg");
const db = require("../src/models");
const { seedRoles } = require("./helpers/seedHelper");

const ensureTestDatabaseExists = async () => {
  const client = new Client({
    host: process.env.TEST_DB_HOST || process.env.DB_HOST || "localhost",
    port: process.env.TEST_DB_PORT || process.env.DB_PORT || 5432,
    user: process.env.TEST_DB_USERNAME || process.env.DB_USERNAME || "postgres",
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || "postgres",
    database: "postgres",
  });

  try {
    await client.connect();
    const dbName = process.env.TEST_DB_NAME || "techsolve25_test";
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Test database "${dbName}" created successfully.`);
    }
  } catch (error) {
    console.error("Failed to ensure test database exists:", error);
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Ignore
    }
  }
};

// Sync Database before tests
beforeAll(async () => {
  try {
    await ensureTestDatabaseExists();
    await db.sequelize.sync({ force: true });
    await seedRoles();
    console.log("Test database synchronized and roles seeded successfully.");
  } catch (error) {
    console.error("Failed to sync test database:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Close all mock Redis connections
    for (const redisInstance of redisInstances) {
      try {
        await redisInstance.quit();
      } catch (e) {
        // Ignore
      }
    }
    await db.sequelize.close();
  } catch (error) {
    console.error("Failed to close test database connection:", error);
  }
});
