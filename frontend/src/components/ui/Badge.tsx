import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-[var(--badge-bg)] text-[var(--text-primary)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status:
    | "ACTIVE"
    | "COMPLETED"
    | "ON_HOLD"
    | "TODO"
    | "IN_PROGRESS"
    | "DONE"
    | "CANCELLED"
    | "BLOCKED";
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const statusConfig = {
    ACTIVE: { variant: "success" as const, label: "Active", dot: true },
    COMPLETED: { variant: "info" as const, label: "Completed", dot: false },
    ON_HOLD: { variant: "warning" as const, label: "On Hold", dot: false },
    CANCELLED: { variant: "error" as const, label: "Cancelled", dot: false },
    TODO: { variant: "default" as const, label: "To Do", dot: false },
    IN_PROGRESS: {
      variant: "warning" as const,
      label: "In Progress",
      dot: true,
    },
    DONE: { variant: "success" as const, label: "Done", dot: false },
    BLOCKED: { variant: "error" as const, label: "Blocked", dot: true },
  };

  const config = statusConfig[status] || statusConfig.TODO;

  return (
    <Badge variant={config.variant} className={className}>
      {config.dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      )}
      {config.label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  className?: string;
  size?: "sm" | "md";
}

export function PriorityBadge({
  priority,
  className = "",
  size = "sm",
}: PriorityBadgeProps) {
  const priorityConfig = {
    LOW: { variant: "success" as const, label: "Low", icon: "🟢" },
    MEDIUM: { variant: "warning" as const, label: "Medium", icon: "🟡" },
    HIGH: { variant: "error" as const, label: "High", icon: "🟠" },
    URGENT: { variant: "error" as const, label: "Urgent", icon: "🔴" },
  };

  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <Badge variant={config.variant} size={size} className={className}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}
