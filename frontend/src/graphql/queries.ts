/**
 * GraphQL Query operations
 */
import { gql } from "@apollo/client";

// Organization Queries
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      projectCount
      activeProjectCount
      createdAt
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($id: Int!) {
    organization(id: $id) {
      id
      name
      slug
      contactEmail
      projectCount
      activeProjectCount
      createdAt
      projects {
        id
        name
        status
        taskCount
        completedTasks
      }
    }
  }
`;

export const GET_ORGANIZATION_STATS = gql`
  query GetOrganizationStats($organizationId: Int!) {
    organizationStats(organizationId: $organizationId) {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
    }
  }
`;

// Project Queries
export const GET_PROJECTS = gql`
  query GetProjects($organizationId: Int, $status: String) {
    projects(organizationId: $organizationId, status: $status) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasks
      inProgressTasks
      todoTasks
      completionRate
      createdAt
      organization {
        id
        name
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: Int!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasks
      inProgressTasks
      todoTasks
      completionRate
      createdAt
      organization {
        id
        name
        slug
      }
      tasks {
        id
        title
        description
        status
        priority
        assigneeEmail
        dueDate
        commentCount
        createdAt
        comments {
          id
          content
          authorEmail
          createdAt
        }
      }
    }
  }
`;

export const GET_PROJECT_STATS = gql`
  query GetProjectStats($projectId: Int!) {
    projectStats(projectId: $projectId) {
      projectId
      totalTasks
      todoTasks
      inProgressTasks
      completedTasks
      completionRate
    }
  }
`;

// Task Queries
export const GET_TASKS = gql`
  query GetTasks(
    $projectId: Int
    $organizationId: Int
    $status: String
    $assigneeEmail: String
  ) {
    tasks(
      projectId: $projectId
      organizationId: $organizationId
      status: $status
      assigneeEmail: $assigneeEmail
    ) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      commentCount
      createdAt
      comments {
        id
        content
        authorEmail
        createdAt
      }
      project {
        id
        name
        organization {
          id
          name
        }
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: Int!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      commentCount
      createdAt
      project {
        id
        name
        organization {
          id
          name
        }
      }
      comments {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;

export const GET_TASKS_BY_PROJECT = gql`
  query GetTasksByProject(
    $projectId: Int!
    $status: String
    $assigneeEmail: String
  ) {
    tasksByProject(
      projectId: $projectId
      status: $status
      assigneeEmail: $assigneeEmail
    ) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      commentCount
      createdAt
      comments {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: Int!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
      task {
        id
        title
      }
    }
  }
`;
