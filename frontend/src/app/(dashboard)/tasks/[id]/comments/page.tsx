"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Header } from "@/components/layout/Header";
import { CommentSection } from "@/components/features/tasks/CommentSection";
import { Loading, LoadingPage } from "@/components/ui/Loading";
import { GET_TASK } from "@/graphql/queries";
import type { GetTaskResponse, GetTaskVariables } from "@/graphql/types";

export default function TaskCommentsPage() {
  const params = useParams<{ id: string }>();
  const taskId = parseInt(params.id, 10);

  const { data, loading, error, refetch } = useQuery<
    GetTaskResponse,
    GetTaskVariables
  >(GET_TASK, {
    variables: { id: taskId },
    skip: Number.isNaN(taskId),
  });

  if (Number.isNaN(taskId)) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Invalid task id.
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Error loading task: {error.message}
        </div>
      </div>
    );
  }

  const task = data?.task;

  if (!task) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          Task not found.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={`Comments - ${task.title}`}
        subtitle="View and add comments for this task"
      />

      <div className="p-4 space-y-4 max-w-3xl">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-3 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {task.title}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {task.project?.name}
            </p>
          </div>

          {task.description && (
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
              {task.description}
            </p>
          )}

          <hr className="my-4" />

          <CommentSection
            taskId={taskId}
            comments={task.comments || []}
            onCommentAdded={() => refetch()}
          />
        </div>
      </div>
    </div>
  );
}
