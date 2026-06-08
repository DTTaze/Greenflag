"use client";

import React, { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "@/src/utils/api";

import DataTable from "../../../components/DataTable";
import { taskColumns } from "../../../components/HeaderColumn";
import TaskForm from "./TaskForm";

export default function TasksManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getAllTasks();
      if (res.success) {
        setTasks(res.data);
      } else {
        console.log(res.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditTask = (task) => {
    setFormMode("edit");
    setEditData(task);
    setFormOpen(true);
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        const res = await deleteTask(task.id);
        if (res.success) {
          alert("Xóa nhiệm vụ thành công!");
          setTasks((prev) => prev.filter((t) => t.id !== task.id));
        } else {
          alert("Xóa nhiệm vụ thất bại!");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSubmitTask = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createTask(data);
        if (result.success) {
          alert("Thêm nhiệm vụ thành công!");
          fetchTasks();
        } else {
          alert("Thêm nhiệm vụ thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateTask(data.id, data);
        if (result.success) {
          alert("Cập nhật nhiệm vụ thành công!");
          fetchTasks();
        } else {
          alert("Cập nhật nhiệm vụ thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    }
    setFormOpen(false);
  };

  return (
    <div>
      <DataTable
        title="Tasks"
        columns={taskColumns}
        rows={tasks}
        onAdd={handleAddTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        loading={loading}
      />
      <TaskForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitTask}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}
