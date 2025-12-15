"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ADD_TASK_COMMENT } from "@/graphql/mutations";
import { GET_TASK_COMMENTS } from "@/graphql/queries";
import { TaskComment } from "@/graphql/types";

interface CommentSectionProps {
  taskId: number;
  comments: TaskComment[];
  projectId?: number;
  onCommentAdded?: () => void;
}

export function CommentSection({
  taskId,
  comments,
  projectId,
  onCommentAdded,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  const [addComment, { loading }] = useMutation(ADD_TASK_COMMENT, {
    refetchQueries: [{ query: GET_TASK_COMMENTS, variables: { taskId } }],
    onCompleted: () => {
      setNewComment("");
      if (onCommentAdded) {
        onCommentAdded();
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !authorEmail.trim()) return;

    try {
      await addComment({
        variables: {
          taskId,
          content: newComment,
          authorEmail,
        },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        Comments ({comments.length})
      </h3>

      {/* Comment List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-sm py-4 text-center">
            No comments yet
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-[var(--bg-main)] rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[var(--badge-bg)] rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[var(--text-secondary)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {comment.authorEmail}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Add your email..."
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          rows={1}
          required
        />
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          required
        />
        <Button
          type="submit"
          disabled={loading || !newComment.trim() || !authorEmail.trim()}
        >
          {loading ? "Adding..." : "Add Comment"}
        </Button>
      </form>
    </div>
  );
}
