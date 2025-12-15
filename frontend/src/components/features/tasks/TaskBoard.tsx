"use client";

import React from "react";
import { Task } from "@/graphql/types";
import { TaskCard } from "./TaskCard";

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskBoard({ tasks, onTaskClick }: TaskBoardProps) {
  const columns = [
    { status: "TODO", title: "To Do", color: "bg-[var(--badge-bg)]" },
    { status: "IN_PROGRESS", title: "In Progress", color: "bg-yellow-50" },
    { status: "DONE", title: "Done", color: "bg-green-50" },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);

        return (
          <div key={column.status} className="flex flex-col">
            <div
              className={`${column.color} rounded-t-lg px-4 py-3 border-b-2 border-[var(--border-subtle)]`}
            >
              <h3 className="font-semibold text-[var(--text-primary)]">
                {column.title}
                <span className="ml-2 text-sm text-[var(--text-secondary)]">
                  ({columnTasks.length})
                </span>
              </h3>
            </div>

            <div className="space-y-3 p-4 bg-[var(--bg-main)] rounded-b-lg min-h-[400px]">
              {columnTasks.length === 0 ? (
                <p className="text-center text-[var(--text-secondary)] text-sm py-8">
                  No tasks
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
