"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Header } from "@/components/layout/Header";
import { GET_TASKS } from "@/graphql/queries";
import { DELETE_TASK } from "@/graphql/mutations";
import { TaskBoard } from "@/components/features/tasks/TaskBoard";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "@/components/features/tasks/TaskForm";
import { CommentSection } from "@/components/features/tasks/CommentSection";
import { Loading, LoadingPage } from "@/components/ui/Loading";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Task } from "@/graphql/types";
import { Input } from "@/components/ui/Input";
import { useOrganization } from "@/hooks/useOrganization";

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const { organizationId, loading: orgLoading } = useOrganization();

  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    variables: {
      organizationId,
      assigneeEmail: emailFilter || null,
    },
    skip: !organizationId,
  });

  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      refetch();
    },
  });

  if (orgLoading || !organizationId) {
    return (
      <div>
        <Header title="My Tasks" subtitle="View and manage all your tasks" />
        <div className="p-8 flex justify-center">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (loading) return <LoadingPage />;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Error loading tasks: {error.message}
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
    refetch();
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
      <Header title="My Tasks" subtitle="View and manage all your tasks" />

      <div className="p-8">
        {/* Filter */}
        <div className="mb-6 max-w-md">
          <Input
            label="Filter by Assignee"
            placeholder="Enter email to filter"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>

        {/* Task Board */}
        {data?.tasks && (
          <TaskBoard
            tasks={data.tasks}
            onTaskClick={(task) => {
              setSelectedTask(task);
              setIsEditMode(false);
            }}
          />
        )}
      </div>

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
              projectId={parseInt(selectedTask.project.id)}
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

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Project
                </h3>
                <p className="text-gray-700">{selectedTask.project.name}</p>
              </div>

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
                onCommentAdded={() => refetch()}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
