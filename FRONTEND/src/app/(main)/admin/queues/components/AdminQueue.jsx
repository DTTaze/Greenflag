import "@/src/styles/pages/admin.css";

import React from "react";

function AdminQueue() {
  return (
    <div style={{ height: "60vh" }}>
      <iframe
        src="http://localhost:6060/api/admin/queues"
        title="Admin Queue Dashboard"
        style={{ width: "100%", height: "100%", border: "none" }}
      ></iframe>
    </div>
  );
}

export default AdminQueue;
