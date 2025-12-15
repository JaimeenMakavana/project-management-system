import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';

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
    { label: 'Total Tasks', value: totalTasks, color: 'text-gray-900' },
    { label: 'To Do', value: todoTasks, color: 'text-gray-600' },
    { label: 'In Progress', value: inProgressTasks, color: 'text-yellow-600' },
    { label: 'Completed', value: completedTasks, color: 'text-green-600' },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardBody>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </CardBody>
        </Card>
      ))}
      
      <Card className="md:col-span-4">
        <CardBody>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-sm font-semibold text-gray-900">{completionRate.toFixed(1)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

