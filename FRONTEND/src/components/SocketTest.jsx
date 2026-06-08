import React, { useContext, useEffect, useState } from "react";

import { SocketContext } from "../contexts/socket.context";

export default function SocketTest() {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for server responses
    socket.on("server-response", (data) => {
      setResponses((prev) => [...prev, data]);
    });

    return () => {
      socket.off("server-response");
      socket.emit("leave-test-room");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!socket || !message) return;

    socket.emit("client-message", { message });
    setMessage("");
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mr-2 border p-2"
          placeholder="Enter message"
        />
        <button
          onClick={sendMessage}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Send
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">Server Responses:</h3>
        {responses.map((response, index) => (
          <div key={index} className="rounded bg-gray-100 p-2">
            <p>{response.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(response.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
