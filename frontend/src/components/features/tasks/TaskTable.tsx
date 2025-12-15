import React from "react";
import Link from "next/link";
import { Task } from "@/graphql/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { MessageCircle } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskTable({ tasks, onTaskClick }: TaskTableProps) {
  const hasTasks = tasks && tasks.length > 0;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="cursor-default">
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasTasks ? (
            <TableRow className="cursor-default">
              <TableCell
                colSpan={6}
                className="text-center text-[var(--text-secondary)]"
              >
                No tasks yet for this project.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                onClick={() => onTaskClick?.(task)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium text-[var(--text-primary)]">
                  {task.title}
                </TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  {task.priority && (
                    <PriorityBadge priority={task.priority} size="sm" />
                  )}
                </TableCell>
                <TableCell className="text-[var(--text-secondary)]">
                  {task.assigneeEmail || "-"}
                </TableCell>
                <TableCell className="text-[var(--text-secondary)]">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </TableCell>
                <TableCell className="text-right text-[var(--text-secondary)]">
                  <div className="flex items-center justify-end gap-2">
                    <span>{task.commentCount}</span>
                    {task.commentCount > 0 && (
                      <Link
                        href={`/tasks/${task.id}/comments`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center rounded-md border border-[var(--border-subtle)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-main)] hover:text-[var(--text-primary)]"
                      >
                        <MessageCircle
                          className="w-3 h-3 mr-1"
                          strokeWidth={1}
                        />
                        View
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
