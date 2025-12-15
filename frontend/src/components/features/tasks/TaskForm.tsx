"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CREATE_TASK, UPDATE_TASK } from "@/graphql/mutations";
import { GET_TASKS_BY_PROJECT, GET_PROJECT } from "@/graphql/queries";
import { Task } from "@/graphql/types";

interface TaskFormProps {
  task?: Task;
  projectId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TaskForm({
  task,
  projectId,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "TODO",
    priority: task?.priority || "MEDIUM",
    assigneeEmail: task?.assigneeEmail || "",
    dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK, {
    refetchQueries: [
      { query: GET_TASKS_BY_PROJECT, variables: { projectId } },
      { query: GET_PROJECT, variables: { id: projectId } },
    ],
  });

  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK, {
    refetchQueries: [
      { query: GET_TASKS_BY_PROJECT, variables: { projectId } },
      { query: GET_PROJECT, variables: { id: projectId } },
    ],
  });

  const loading = creating || updating;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (
      formData.assigneeEmail &&
      !/\S+@\S+\.\S+/.test(formData.assigneeEmail)
    ) {
      newErrors.assigneeEmail = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (task) {
        await updateTask({
          variables: {
            id: parseInt(task.id),
            title: formData.title,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
            assigneeEmail: formData.assigneeEmail || null,
            dueDate: formData.dueDate ? `${formData.dueDate}T00:00:00` : null,
          },
        });
      } else {
        await createTask({
          variables: {
            projectId,
            title: formData.title,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
            assigneeEmail: formData.assigneeEmail || null,
            dueDate: formData.dueDate ? `${formData.dueDate}T00:00:00` : null,
          },
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving task:", error);
      setErrors({ submit: "Failed to save task. Please try again." });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {errors.submit}
        </div>
      )}

      <Input
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="Enter task title"
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        placeholder="Enter task description"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: "TODO", label: "To Do" },
            { value: "IN_PROGRESS", label: "In Progress" },
            { value: "DONE", label: "Done" },
          ]}
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: "LOW", label: "🟢 Low" },
            { value: "MEDIUM", label: "🟡 Medium" },
            { value: "HIGH", label: "🟠 High" },
            { value: "URGENT", label: "🔴 Urgent" },
          ]}
        />
      </div>

      <Input
        label="Assignee Email"
        name="assigneeEmail"
        type="email"
        value={formData.assigneeEmail}
        onChange={handleChange}
        error={errors.assigneeEmail}
        placeholder="assignee@example.com"
      />

      <Input
        label="Due Date"
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
