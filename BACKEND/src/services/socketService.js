require("dotenv").config();
let io;
const Redis = require("ioredis");
let subscriber = new Redis(process.env.URL_REDIS || "redis://redis:6379");

const emitStockUpdate = (itemId, newStock, itemDetails) => {
  console.log("Emitting stock update event to item:", itemId);
  if (io) {
    io.to(`item-${itemId}`).emit("stock-update", {
      itemId,
      stock: newStock,
      ...itemDetails,
    });
  }
};

const initSocketManager = (socketIo) => {
  io = socketIo;

  // Set up subscription
  subscriber.subscribe("stock-update", (err, count) => {
    if (err) {
      console.error("Failed to subscribe to stock-update channel:", err);
      return;
    }
    console.log(`Subscribed to stock-update channel. Count: ${count}`);
  });

  subscriber.on("message", (channel, message) => {
    if (channel === "stock-update") {
      const data = JSON.parse(message);
      emitStockUpdate(data.itemId, data.newStock, data);
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected with id:", socket.id);

    // Test event
    socket.on("client-message", (data) => {
      socket.join("test-room");
      console.log("Received message from client:", data);
      // Emit back to client
      io.to("test-room").emit("server-response", {
        message: "Server received: " + data.message,
        timestamp: new Date(),
      });
    });

    socket.on("leave-test-room", () => {
      socket.leave("test-room");
      console.log("User left test room");
    });

    // Join room for specific item updates
    socket.on("join-item-room", (itemId) => {
      socket.join(`item-${itemId}`);
      console.log(`User ${socket.id} joined room for item ${itemId}`);
    });

    // Leave room for specific item updates
    socket.on("leave-item-room", (itemId) => {
      socket.leave(`item-${itemId}`);
      console.log(`User ${socket.id} left room for item ${itemId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = {
  initSocketManager,
  emitStockUpdate,
};
