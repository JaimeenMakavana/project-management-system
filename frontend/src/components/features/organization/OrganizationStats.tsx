import React from "react";
import { Card, CardBody } from "@/components/ui/Card";
import type { OrganizationStats as OrganizationStatsType } from "@/graphql/types";

interface OrganizationStatsProps {
  stats: OrganizationStatsType;
}

export function OrganizationStats({ stats }: OrganizationStatsProps) {
  const {
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    completedTasks,
  } = stats;

  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const projectStats = [
    {
      label: "Total Projects",
      value: totalProjects,
      color: "text-[var(--text-primary)]",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      color: "text-[var(--accent-purple)]",
    },
    {
      label: "Completed Projects",
      value: completedProjects,
      color: "text-[var(--accent-lime)]",
    },
  ];

  const taskStats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      color: "text-[var(--text-primary)]",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      color: "text-[var(--accent-lime)]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          Organization Overview
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          High-level snapshot of project and task activity in this organization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Task Completion Rate
            </p>
            <div className="flex items-end justify-between mb-3">
              <p className="text-3xl font-bold text-[var(--accent-lime)]">
                {completionRate.toFixed(1)}%
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="w-full bg-[var(--badge-bg)] rounded-full h-3">
              <div
                className="bg-[var(--accent-lime)] h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(completionRate, 100)}%` }}
              ></div>
            </div>
          </CardBody>
        </Card>

        {projectStats.map((stat) => (
          <Card key={stat.label}>
            <CardBody>
              <p className="text-sm text-[var(--text-secondary)]">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {taskStats.map((stat) => (
          <Card key={stat.label}>
            <CardBody>
              <p className="text-sm text-[var(--text-secondary)]">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
