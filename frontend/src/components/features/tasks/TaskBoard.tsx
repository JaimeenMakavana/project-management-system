'use client';

import React from 'react';
import { Task } from '@/graphql/types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskBoard({ tasks, onTaskClick }: TaskBoardProps) {
  const columns = [
    { status: 'TODO', title: 'To Do', color: 'bg-gray-100' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'bg-yellow-50' },
    { status: 'DONE', title: 'Done', color: 'bg-green-50' },
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
            <div className={`${column.color} rounded-t-lg px-4 py-3 border-b-2 border-gray-300`}>
              <h3 className="font-semibold text-gray-900">
                {column.title}
                <span className="ml-2 text-sm text-gray-600">({columnTasks.length})</span>
              </h3>
            </div>
            
            <div className="space-y-3 p-4 bg-gray-50 rounded-b-lg min-h-[400px]">
              {columnTasks.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-8">No tasks</p>
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

