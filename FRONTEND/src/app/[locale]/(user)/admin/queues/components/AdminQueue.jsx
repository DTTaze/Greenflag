import "../../styles/index.css";

import React from "react";

function AdminQueue() {
  return (
    <div style={{ height: "60vh" }}>
      <iframe
        src={`${process.env.NEXT_PUBLIC_NESTJS_API_URL || "http://localhost:3030"}/api/admin/queues`}
        title="Admin Queue Dashboard"
        style={{ width: "100%", height: "100%", border: "none" }}
      ></iframe>
    </div>
  );
}

export default AdminQueue;
