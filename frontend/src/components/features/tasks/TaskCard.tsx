"use client";

import React from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Task } from "@/graphql/types";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card hover className="cursor-pointer" onClick={onClick}>
      <CardBody>
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 flex-1 mr-2">
            {task.title}
          </h4>
          <StatusBadge status={task.status} />
        </div>

        {task.priority && (
          <div className="mb-2">
            <PriorityBadge priority={task.priority} />
          </div>
        )}

        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          {task.assigneeEmail && (
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{task.assigneeEmail}</span>
            </div>
          )}

          {task.dueDate && (
            <div className="flex items-center space-x-1 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {task.commentCount > 0 && (
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{task.commentCount}</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
