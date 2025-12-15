import React from "react";
import { Card, CardBody } from "@/components/ui/Card";

interface ProjectStatsProps {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  completionRate: number;
}

export function ProjectStats({
  totalTasks,
  todoTasks,
  inProgressTasks,
  completedTasks,
  completionRate,
}: ProjectStatsProps) {
  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      color: "text-[var(--text-primary)]",
    },
    { label: "To Do", value: todoTasks, color: "text-[var(--text-secondary)]" },
    {
      label: "In Progress",
      value: inProgressTasks,
      color: "text-[var(--accent-purple)]",
    },
    {
      label: "Completed",
      value: completedTasks,
      color: "text-[var(--accent-lime)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="">
        <CardBody>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[var(--text-secondary)]">
              Completion Rate
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {completionRate.toFixed(1)}%
            </p>
          </div>
          <div className="w-full bg-[var(--badge-bg)] rounded-full h-3">
            <div
              className="bg-[var(--accent-lime)] h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </CardBody>
      </Card>

      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardBody>
            <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
