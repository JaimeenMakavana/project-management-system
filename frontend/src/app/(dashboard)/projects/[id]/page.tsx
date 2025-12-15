"use client";

import { useState, use } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Header } from "@/components/layout/Header";
import { GET_PROJECT } from "@/graphql/queries";
import { DELETE_TASK } from "@/graphql/mutations";
import { ProjectStats } from "@/components/features/projects/ProjectStats";
import { TaskBoard } from "@/components/features/tasks/TaskBoard";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "@/components/features/tasks/TaskForm";
import { CommentSection } from "@/components/features/tasks/CommentSection";
import { LoadingPage } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Task } from "@/graphql/types";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
          <p className="text-gray-600">Project not found</p>
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

  return (
    <div>
      <Header
        title={project.name}
        subtitle={project.description}
        actions={
          <div className="flex items-center space-x-3">
            <StatusBadge status={project.status} />
            <Button onClick={() => setIsCreateTaskOpen(true)}>Add Task</Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>
          <TaskBoard
            tasks={project.tasks || []}
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
              <div className="flex justify-end space-x-2 pb-2 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteTask}
                  disabled={deleting}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
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
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              {selectedTask.assigneeEmail && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Assignee
                  </h3>
                  <p className="text-gray-700">{selectedTask.assigneeEmail}</p>
                </div>
              )}

              {selectedTask.dueDate && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Due Date
                  </h3>
                  <p className="text-gray-700">
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
