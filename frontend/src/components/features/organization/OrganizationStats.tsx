import React from "react";
import { Card, CardBody } from "@/components/ui/Card";
import type { OrganizationStats as OrganizationStatsType } from "@/graphql/types";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface OrganizationStatsProps {
  stats: OrganizationStatsType;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// Color palette matching your theme
const COLORS = {
  completed: "hsl(var(--accent-lime-hsl, 84 81% 44%))",
  active: "hsl(var(--accent-purple-hsl, 258 90% 66%))",
  onHold: "hsl(var(--text-secondary-hsl, 240 5% 64%))",
  inProgress: "hsl(var(--accent-purple-hsl, 258 90% 66%))",
  primary: "hsl(var(--text-primary-hsl, 222 47% 11%))",
};

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
  const activeTasksCount = totalTasks - completedTasks;
  const onHoldProjects = totalProjects - activeProjects - completedProjects;

  // Data for Task Completion Radial Chart
  const taskCompletionData = [
    {
      name: "Completion",
      value: completionRate,
      fill: COLORS.completed,
    },
  ];

  // Data for Project Status Pie Chart
  const projectStatusData = [
    { name: "Completed", value: completedProjects, color: COLORS.completed },
    { name: "Active", value: activeProjects, color: COLORS.active },
    { name: "On Hold", value: onHoldProjects, color: COLORS.onHold },
  ].filter((item) => item.value > 0);

  // Data for Task Breakdown Bar Chart
  const taskBreakdownData = [
    {
      name: "Tasks",
      Completed: completedTasks,
      "In Progress": activeTasksCount,
    },
  ];

  // Data for Overview Bar Chart
  const overviewData = [
    {
      name: "Projects",
      Total: totalProjects,
      Active: activeProjects,
      Completed: completedProjects,
    },
    {
      name: "Tasks",
      Total: totalTasks,
      Active: activeTasksCount,
      Completed: completedTasks,
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {payload[0].name}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {payload[0].value}
            {payload[0].name.includes("Completion") ? "%" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          Organization Overview
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          Visual insights into project and task activity across your
          organization.
        </p>
      </div>
      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Card>
            <CardBody className="text-center p-4">
              <p className="text-xs text-[var(--text-secondary)] mb-1">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {totalProjects}
              </p>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardBody className="text-center p-4">
              <p className="text-xs text-[var(--text-secondary)] mb-1">
                Active Projects
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: COLORS.active }}
              >
                {activeProjects}
              </p>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Card>
            <CardBody className="text-center p-4">
              <p className="text-xs text-[var(--text-secondary)] mb-1">
                Total Tasks
              </p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {totalTasks}
              </p>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card>
            <CardBody className="text-center p-4">
              <p className="text-xs text-[var(--text-secondary)] mb-1">
                Completed Tasks
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: COLORS.completed }}
              >
                {completedTasks}
              </p>
            </CardBody>
          </Card>
        </motion.div>
      </div>
      {/* Top Row - Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion - Radial Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full">
            <CardBody className="p-6">
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Task Completion Rate
              </p>

              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={24}
                    data={taskCompletionData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={30}
                      fill={COLORS.completed}
                    />
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-4xl font-bold"
                      fill="currentColor"
                    >
                      {completionRate.toFixed(1)}%
                    </text>
                    <text
                      x="50%"
                      y="58%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm"
                      fill="var(--text-secondary)"
                    >
                      completion
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2 border-t border-[var(--border-color)] pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">
                    Completed
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: COLORS.completed }}
                  >
                    {completedTasks}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">
                    In Progress
                  </span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {activeTasksCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--badge-bg)]">
                  <span className="text-[var(--text-secondary)]">
                    Total Tasks
                  </span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {totalTasks}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Project Status - Pie Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardBody className="p-6">
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Project Status Distribution
              </p>

              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${((percent ?? 0) * 100).toFixed(
                        0
                      )}%)`
                    }
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
                {projectStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {item.name}
                    </span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border-color)] text-center">
                <span className="text-sm text-[var(--text-secondary)]">
                  Total Projects
                </span>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                  {totalProjects}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Middle Row - Task Breakdown */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Task Breakdown
            </p>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={taskBreakdownData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--text-secondary)"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="Completed"
                  fill={COLORS.completed}
                  radius={[0, 8, 8, 0]}
                />
                <Bar
                  dataKey="In Progress"
                  fill={COLORS.inProgress}
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </motion.div>

      {/* Bottom Row - Overview Comparison */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Projects vs Tasks Overview
            </p>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={overviewData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="Total"
                  fill={COLORS.primary}
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="Active"
                  fill={COLORS.active}
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="Completed"
                  fill={COLORS.completed}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
