/**
 * GraphQL Mutation operations
 */
import { gql } from "@apollo/client";

// Organization Mutations
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $name: String!
    $contactEmail: String!
    $slug: String
  ) {
    createOrganization(name: $name, contactEmail: $contactEmail, slug: $slug) {
      success
      message
      organization {
        id
        name
        slug
        contactEmail
      }
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization(
    $id: Int!
    $name: String
    $contactEmail: String
    $slug: String
  ) {
    updateOrganization(
      id: $id
      name: $name
      contactEmail: $contactEmail
      slug: $slug
    ) {
      success
      message
      organization {
        id
        name
        slug
        contactEmail
      }
    }
  }
`;

// Project Mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $organizationId: Int!
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      organizationId: $organizationId
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      success
      message
      project {
        id
        name
        description
        status
        dueDate
        organization {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: Int!
    $organizationId: Int
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      organizationId: $organizationId
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      success
      message
      project {
        id
        name
        description
        status
        dueDate
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: Int!, $organizationId: Int) {
    deleteProject(id: $id, organizationId: $organizationId) {
      success
      message
    }
  }
`;

// Task Mutations
export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: Int!
    $title: String!
    $description: String
    $status: String
    $priority: String
    $assigneeEmail: String
    $dueDate: DateTime
    $organizationId: Int
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      priority: $priority
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
      organizationId: $organizationId
    ) {
      success
      message
      task {
        id
        title
        description
        status
        priority
        assigneeEmail
        dueDate
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: Int!
    $title: String
    $description: String
    $status: String
    $priority: String
    $assigneeEmail: String
    $dueDate: DateTime
    $organizationId: Int
    $validateTransition: Boolean
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      priority: $priority
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
      organizationId: $organizationId
      validateTransition: $validateTransition
    ) {
      success
      message
      task {
        id
        title
        description
        status
        priority
        assigneeEmail
        dueDate
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!, $organizationId: Int) {
    deleteTask(id: $id, organizationId: $organizationId) {
      success
      message
    }
  }
`;

// Task Comment Mutations
export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment(
    $taskId: Int!
    $content: String!
    $authorEmail: String!
    $organizationId: Int
  ) {
    addTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
      organizationId: $organizationId
    ) {
      success
      message
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;

export const UPDATE_TASK_COMMENT = gql`
  mutation UpdateTaskComment($id: Int!, $content: String!) {
    updateTaskComment(id: $id, content: $content) {
      success
      message
      comment {
        id
        content
        authorEmail
      }
    }
  }
`;

export const DELETE_TASK_COMMENT = gql`
  mutation DeleteTaskComment($id: Int!) {
    deleteTaskComment(id: $id) {
      success
      message
    }
  }
`;
