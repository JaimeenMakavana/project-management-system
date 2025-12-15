"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CREATE_PROJECT, UPDATE_PROJECT } from "@/graphql/mutations";
import { GET_PROJECTS } from "@/graphql/queries";
import { Project } from "@/graphql/types";

interface ProjectFormProps {
  project?: Project;
  organizationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectForm({
  project,
  organizationId,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "ACTIVE",
    dueDate: project?.dueDate || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS, variables: { organizationId } }],
  });

  const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS, variables: { organizationId } }],
  });

  const loading = creating || updating;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (project) {
        await updateProject({
          variables: {
            id: parseInt(project.id),
            ...formData,
            dueDate: formData.dueDate || null,
          },
        });
      } else {
        await createProject({
          variables: {
            organizationId,
            ...formData,
            dueDate: formData.dueDate || null,
          },
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving project:", error);
      setErrors({ submit: "Failed to save project. Please try again." });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
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
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Enter project name"
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        placeholder="Enter project description"
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={[
          { value: "ACTIVE", label: "Active" },
          { value: "COMPLETED", label: "Completed" },
          { value: "ON_HOLD", label: "On Hold" },
        ]}
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
          {loading
            ? "Saving..."
            : project
            ? "Update Project"
            : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
