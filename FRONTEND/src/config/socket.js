import { io } from "socket.io-client";

const socket = io({
  path: "/socket.io",
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});

// Socket event handlers
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from socket server:", reason);
  if (reason === "io server disconnect") {
    // Server initiated disconnect, try to reconnect
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Reconnected to socket server after", attemptNumber, "attempts");
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("Attempting to reconnect:", attemptNumber);
});

export { socket };
