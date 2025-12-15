import React from "react";
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
                  {task.commentCount}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
