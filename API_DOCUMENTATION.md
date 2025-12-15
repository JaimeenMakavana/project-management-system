# API Documentation

## GraphQL Endpoint

**Base URL**: `http://localhost:8000/graphql`

**GraphiQL Interface**: Available at the same URL when accessed via browser in development mode

## Schema Overview

### Types

#### Organization

```graphql
type OrganizationType {
  id: ID!
  name: String!
  slug: String!
  contactEmail: String!
  createdAt: DateTime!
}
```

#### Project

```graphql
type ProjectType {
  id: ID!
  organization: OrganizationType!
  name: String!
  description: String
  status: String! # ACTIVE, COMPLETED, ON_HOLD
  dueDate: Date
  createdAt: DateTime!
  taskCount: Int
  completedTasks: Int
}
```

#### Task

```graphql
type TaskType {
  id: ID!
  project: ProjectType!
  title: String!
  description: String
  status: String! # TODO, IN_PROGRESS, DONE
  assigneeEmail: String
  dueDate: DateTime
  createdAt: DateTime!
}
```

#### TaskComment

```graphql
type TaskCommentType {
  id: ID!
  task: TaskType!
  content: String!
  authorEmail: String!
  createdAt: DateTime!
}
```

## Queries

### Organizations

#### Get all organizations

```graphql
query {
  organizations {
    id
    name
    slug
    contactEmail
    createdAt
  }
}
```

#### Get single organization

```graphql
query {
  organization(id: 1) {
    id
    name
    slug
    contactEmail
  }
}
```

### Projects

#### Get all projects (organization-scoped)

```graphql
query {
  projects {
    id
    name
    description
    status
    dueDate
    organization {
      name
    }
  }
}
```

#### Get single project

```graphql
query {
  project(id: 1) {
    id
    name
    description
    status
    taskCount
    completedTasks
  }
}
```

### Tasks

#### Get all tasks

```graphql
query {
  tasks {
    id
    title
    description
    status
    assigneeEmail
    project {
      name
    }
  }
}
```

#### Get single task

```graphql
query {
  task(id: 1) {
    id
    title
    description
    status
    assigneeEmail
    comments {
      id
      content
      authorEmail
      createdAt
    }
  }
}
```

## Mutations

### Organizations

#### Create Organization

```graphql
mutation {
  createOrganization(
    name: "Acme Corp"
    slug: "acme-corp"
    contactEmail: "contact@acme.com"
  ) {
    organization {
      id
      name
      slug
    }
  }
}
```

### Projects

#### Create Project

```graphql
mutation {
  createProject(
    organizationId: 1
    name: "Website Redesign"
    description: "Complete redesign of company website"
    status: "ACTIVE"
    dueDate: "2025-12-31"
  ) {
    project {
      id
      name
      status
    }
  }
}
```

#### Update Project

```graphql
mutation {
  updateProject(id: 1, name: "Updated Project Name", status: "COMPLETED") {
    project {
      id
      name
      status
    }
  }
}
```

### Tasks

#### Create Task

```graphql
mutation {
  createTask(
    projectId: 1
    title: "Design homepage mockup"
    description: "Create initial mockup for homepage"
    status: "TODO"
    assigneeEmail: "designer@acme.com"
  ) {
    task {
      id
      title
      status
    }
  }
}
```

#### Update Task Status

```graphql
mutation {
  updateTask(id: 1, status: "IN_PROGRESS") {
    task {
      id
      status
    }
  }
}
```

#### Add Comment to Task

```graphql
mutation {
  addTaskComment(
    taskId: 1
    content: "Started working on this"
    authorEmail: "developer@acme.com"
  ) {
    comment {
      id
      content
      authorEmail
      createdAt
    }
  }
}
```

## Statistics Queries

### Project Statistics

```graphql
query {
  projectStats(projectId: 1) {
    totalTasks
    completedTasks
    inProgressTasks
    todoTasks
    completionRate
  }
}
```

### Organization Statistics

```graphql
query {
  organizationStats(organizationId: 1) {
    totalProjects
    activeProjects
    completedProjects
    totalTasks
    overdueTasks
  }
}
```

## Error Handling

All mutations and queries follow this error response format:

```graphql
{
  "errors": [
    {
      "message": "Error description",
      "locations": [{"line": 2, "column": 3}],
      "path": ["fieldName"]
    }
  ],
  "data": null
}
```

## Multi-tenancy

All operations are scoped to an organization. When making requests:

1. Projects must belong to a valid organization
2. Tasks must belong to a project within the same organization
3. Cross-organization access is not permitted

## Rate Limiting

Currently no rate limiting in development. Production limits TBD.

## Authentication

To be implemented: JWT-based authentication will be required for all mutations and organization-scoped queries.

## Testing the API

### Using GraphiQL (Browser)

1. Navigate to `http://localhost:8000/graphql`
2. Use the interactive interface to explore schema and test queries

### Using curl

```bash
curl -X POST http://localhost:8000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ organizations { id name } }"
  }'
```

### Using Apollo Client (Frontend)

See `frontend/src/graphql/` for example implementations.
