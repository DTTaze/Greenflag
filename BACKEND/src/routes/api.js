const express = require("express");
const authRoutes = require("../routes/authRoutes.js");
const userRoutes = require("../routes/userRoutes.js");
const taskRoutes = require("../routes/taskRoutes.js");
const itemRoutes = require("../routes/itemRoutes.js");
const imageRoutes = require("../routes/imageRoutes.js");
const avatarRoutes = require("../routes/avatarRoutes.js");
const jwtAuth = require("../middlewares/jwtAuth.js");
const responseFormatter = require("../middlewares/responseFormatter.js");
const homeController = require("../controllers/homeController.js");
const roleRoutes = require("./roleRoutes.js");
const permissionRoutes = require("./permissionRoutes.js");
const transactionRoutes = require("./transactionRoutes.js");
const coinRoutes = require("./coinRoutes.js");
const rankRoutes = require("./rankRoutes.js");
const qrRoutes = require("./qrRoutes.js");
const eventRoutes = require("./eventRoutes.js");
const productRoutes = require("./productRoutes.js");
const deliveryRoutes = require("./deliveryRoutes.js");

const router = express.Router();

const initWebRoutes = (app) => {
  app.use(responseFormatter);
  app.use(jwtAuth);

  router.get("/", homeController.handleHome);

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/roles", roleRoutes);
  app.use("/api/permissions", permissionRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/avatars", avatarRoutes);
  app.use("/api/images", imageRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/coins", coinRoutes);
  app.use("/api/ranks", rankRoutes);
  app.use("/api/qr", qrRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/delivery", deliveryRoutes);

  return app.use("/api", router);
};

module.exports = initWebRoutes;
