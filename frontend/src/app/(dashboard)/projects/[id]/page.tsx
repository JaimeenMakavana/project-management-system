"use client";

import { useState, use } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Header } from "@/components/layout/Header";
import { GET_PROJECT } from "@/graphql/queries";
import { DELETE_TASK } from "@/graphql/mutations";
import { ProjectStats } from "@/components/features/projects/ProjectStats";
import { TaskTable } from "@/components/features/tasks/TaskTable";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "@/components/features/tasks/TaskForm";
import { CommentSection } from "@/components/features/tasks/CommentSection";
import { LoadingPage } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import type { Task, TaskStatus, TaskPriority } from "@/graphql/types";
import { Pencil, Trash2 } from "lucide-react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">(
    "ALL"
  );

  const resolvedParams = use(params);
  const projectId = parseInt(resolvedParams.id);

  const { data, loading, error, refetch } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_PROJECT, variables: { id: projectId } }],
  });

  if (loading) return <LoadingPage />;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Error loading project: {error.message}
        </div>
      </div>
    );
  }

  const project = data?.project;

  if (!project) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">Project not found</p>
        </div>
      </div>
    );
  }

  const handleCloseTaskModal = () => {
    setSelectedTask(null);
    setIsEditMode(false);
  };

  const handleEditSuccess = () => {
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask({
          variables: { id: parseInt(selectedTask.id) },
        });
        handleCloseTaskModal();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const allTasks = project.tasks || [];
  const filteredTasks = allTasks.filter((task: Task) => {
    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="relative">
      <Header
        title={project?.name}
        subtitle={project.description}
        actions={
          <div className="flex justify-end items-center space-x-2">
            <StatusBadge status={project.status} />
            <Button onClick={() => setIsCreateTaskOpen(true)}>Add Task</Button>
          </div>
        }
      />

      <div className="p-4 space-y-6">
        {/* Statistics */}
        <ProjectStats
          totalTasks={project.taskCount}
          todoTasks={project.todoTasks}
          inProgressTasks={project.inProgressTasks}
          completedTasks={project.completedTasks}
          completionRate={project.completionRate}
        />

        {/* Task Board */}
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Tasks
            </h2>
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as TaskStatus | "ALL")
                }
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-secondary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-[var(--accent-blue)]"
              >
                <option value="ALL">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="BLOCKED">Blocked</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value as TaskPriority | "ALL")
                }
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-secondary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-[var(--accent-blue)]"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <TaskTable
            tasks={filteredTasks}
            onTaskClick={(task) => {
              setSelectedTask(task);
              setIsEditMode(false);
            }}
          />
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        title="Create New Task"
        size="lg"
      >
        <TaskForm
          projectId={projectId}
          onSuccess={() => setIsCreateTaskOpen(false)}
          onCancel={() => setIsCreateTaskOpen(false)}
        />
      </Modal>

      {/* Task Detail/Edit Modal */}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onClose={handleCloseTaskModal}
          title={isEditMode ? "Edit Task" : selectedTask.title}
          size="lg"
        >
          {isEditMode ? (
            <TaskForm
              task={selectedTask}
              projectId={projectId}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditMode(false)}
            />
          ) : (
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-2 pb-2 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                >
                  <Pencil className="w-4 h-4 mr-1" strokeWidth={1} />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteTask}
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4 mr-1" strokeWidth={1} />
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>

              {/* Status & Priority */}
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={selectedTask.status} />
                {selectedTask.priority && (
                  <PriorityBadge priority={selectedTask.priority} size="md" />
                )}
              </div>

              {selectedTask.description && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    Description
                  </h3>
                  <p className="text-[var(--text-secondary)] whitespace-pre-wrap">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              {selectedTask.assigneeEmail && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    Assignee
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {selectedTask.assigneeEmail}
                  </p>
                </div>
              )}

              {selectedTask.dueDate && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    Due Date
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {new Date(selectedTask.dueDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

              <hr className="my-4" />

              <CommentSection
                taskId={parseInt(selectedTask.id)}
                comments={selectedTask.comments || []}
                projectId={projectId}
                onCommentAdded={() => refetch()}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
