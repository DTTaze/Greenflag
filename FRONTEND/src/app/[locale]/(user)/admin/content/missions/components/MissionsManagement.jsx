"use client";

import React, { useState } from "react";

import {
  useAdminCreateTaskMutation,
  useAdminDeleteTaskMutation,
  useAdminTasksQuery,
  useAdminUpdateTaskMutation,
} from "@/src/queries/task/useTaskQueries";

import DataTable from "../../../components/DataTable";
import { taskColumns } from "../../../components/HeaderColumn";
import TaskForm from "./TaskForm";

export default function TasksManagement() {
  const [showDeleted, setShowDeleted] = useState(false);
  const { data: tasks = [], isLoading: loading } = useAdminTasksQuery(showDeleted);
  const createTaskMutation = useAdminCreateTaskMutation();
  const updateTaskMutation = useAdminUpdateTaskMutation();
  const deleteTaskMutation = useAdminDeleteTaskMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

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
        await deleteTaskMutation.mutateAsync(task.id);
        alert("Xóa nhiệm vụ thành công!");
      } catch (e) {
        console.error(e);
        alert(e.message || "Xóa nhiệm vụ thất bại!");
      }
    }
  };

  const handleSubmitTask = async (data, mode) => {
    if (mode === "add") {
      try {
        await createTaskMutation.mutateAsync(data);
        alert("Thêm nhiệm vụ thành công!");
      } catch (e) {
        alert(e.message || "Thêm nhiệm vụ thất bại!");
      }
    } else if (mode === "edit") {
      try {
        await updateTaskMutation.mutateAsync({ id: data.id, payload: data });
        alert("Cập nhật nhiệm vụ thành công!");
      } catch (e) {
        alert(e.message || "Cập nhật nhiệm vụ thất bại!");
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
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
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
