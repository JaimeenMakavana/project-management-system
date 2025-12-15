/**
 * TypeScript types for GraphQL responses
 */

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  projectCount?: number;
  activeProjectCount?: number;
  createdAt: string;
  projects?: Project[];
}

export interface OrganizationStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  dueDate?: string;
  taskCount: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
  createdAt: string;
  updatedAt?: string;
  organization?: {
    id: string;
    name: string;
    slug?: string;
  };
  tasks?: Task[];
}

export interface ProjectStats {
  projectId: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  completionRate: number;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assigneeEmail?: string;
  dueDate?: string;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  project: {
    id: string;
    name: string;
    organization?: {
      id: string;
      name: string;
    };
  };
  comments?: TaskComment[];
}

// TaskComment Types
export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
  task?: {
    id: string;
    title: string;
  };
}

// Mutation Response Types
export interface MutationResponse {
  success: boolean;
  message: string;
}

export interface OrganizationMutationResponse extends MutationResponse {
  organization?: Organization;
}

export interface ProjectMutationResponse extends MutationResponse {
  project?: Project;
}

export interface TaskMutationResponse extends MutationResponse {
  task?: Task;
}

export interface TaskCommentMutationResponse extends MutationResponse {
  comment?: TaskComment;
}

// Query Variables Types
export interface GetProjectsVariables {
  organizationId?: number;
  status?: string;
}

export interface GetProjectVariables {
  id: number;
}

export interface GetTasksVariables {
  projectId?: number;
  organizationId?: number;
  status?: string;
  assigneeEmail?: string;
}

export interface GetTaskVariables {
  id: number;
}

export interface GetTasksByProjectVariables {
  projectId: number;
  status?: string;
  assigneeEmail?: string;
}

export interface GetTaskCommentsVariables {
  taskId: number;
}

export interface GetOrganizationVariables {
  id: number;
}

export interface GetOrganizationStatsVariables {
  organizationId: number;
}

export interface GetProjectStatsVariables {
  projectId: number;
}

// Mutation Variables Types
export interface CreateOrganizationVariables {
  name: string;
  contactEmail: string;
  slug?: string;
}

export interface UpdateOrganizationVariables {
  id: number;
  name?: string;
  contactEmail?: string;
  slug?: string;
}

export interface CreateProjectVariables {
  organizationId: number;
  name: string;
  description?: string;
  status?: string;
  dueDate?: string;
}

export interface UpdateProjectVariables {
  id: number;
  organizationId?: number;
  name?: string;
  description?: string;
  status?: string;
  dueDate?: string;
}

export interface DeleteProjectVariables {
  id: number;
  organizationId?: number;
}

export interface CreateTaskVariables {
  projectId: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeEmail?: string;
  dueDate?: string;
  organizationId?: number;
}

export interface UpdateTaskVariables {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeEmail?: string;
  dueDate?: string;
  organizationId?: number;
  validateTransition?: boolean;
}

export interface DeleteTaskVariables {
  id: number;
  organizationId?: number;
}

export interface AddTaskCommentVariables {
  taskId: number;
  content: string;
  authorEmail: string;
  organizationId?: number;
}

export interface UpdateTaskCommentVariables {
  id: number;
  content: string;
}

export interface DeleteTaskCommentVariables {
  id: number;
}

// Apollo Query Response Types
export interface GetProjectsResponse {
  projects: Project[];
}

export interface GetProjectResponse {
  project: Project;
}

export interface GetTasksResponse {
  tasks: Task[];
}

export interface GetTaskResponse {
  task: Task;
}

export interface GetTasksByProjectResponse {
  tasksByProject: Task[];
}

export interface GetTaskCommentsResponse {
  taskComments: TaskComment[];
}

export interface GetOrganizationsResponse {
  organizations: Organization[];
}

export interface GetOrganizationResponse {
  organization: Organization;
}

export interface GetOrganizationStatsResponse {
  organizationStats: OrganizationStats;
}

export interface GetProjectStatsResponse {
  projectStats: ProjectStats;
}

// Form Types
export interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  dueDate: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeEmail: string;
  dueDate: string;
}

export interface CommentFormData {
  content: string;
  authorEmail: string;
}

// Filter Types
export interface ProjectFilters {
  organizationId?: number;
  status?: string;
  search?: string;
}

export interface TaskFilters {
  projectId?: number;
  organizationId?: number;
  status?: string;
  assigneeEmail?: string;
  search?: string;
}

// Utility Types
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface FormErrors {
  [key: string]: string;
}
