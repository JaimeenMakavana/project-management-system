# GraphQL Query & Mutation Examples

Complete examples for testing the API in GraphiQL (http://localhost:8000/graphql)

## Organizations

### 1. Create Organization
```graphql
mutation {
  createOrganization(
    name: "Acme Corporation"
    contactEmail: "contact@acme.com"
    slug: "acme-corp"
  ) {
    success
    message
    organization {
      id
      name
      slug
      contactEmail
      projectCount
      activeProjectCount
      createdAt
    }
  }
}
```

### 2. List All Organizations
```graphql
query {
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
```

### 3. Get Organization by ID
```graphql
query {
  organization(id: 1) {
    id
    name
    slug
    contactEmail
    projects {
      id
      name
      status
    }
  }
}
```

### 4. Get Organization by Slug
```graphql
query {
  organizationBySlug(slug: "acme-corp") {
    id
    name
    contactEmail
  }
}
```

### 5. Get Organization Statistics
```graphql
query {
  organizationStats(organizationId: 1) {
    totalProjects
    activeProjects
    completedProjects
    totalTasks
    completedTasks
  }
}
```

### 6. Update Organization
```graphql
mutation {
  updateOrganization(
    id: 1
    name: "Acme Corporation Inc."
    contactEmail: "info@acme.com"
  ) {
    success
    message
    organization {
      id
      name
      contactEmail
    }
  }
}
```

## Projects

### 1. Create Project
```graphql
mutation {
  createProject(
    organizationId: 1
    name: "Website Redesign"
    description: "Complete redesign of company website"
    status: "ACTIVE"
    dueDate: "2025-12-31"
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
        name
      }
    }
  }
}
```

### 2. List All Projects
```graphql
query {
  projects {
    id
    name
    description
    status
    dueDate
    taskCount
    completedTasks
    completionRate
    organization {
      name
    }
  }
}
```

### 3. List Projects by Organization
```graphql
query {
  projectsByOrganization(organizationId: 1) {
    id
    name
    status
    taskCount
    completedTasks
    inProgressTasks
    todoTasks
    completionRate
    dueDate
  }
}
```

### 4. List Projects by Status
```graphql
query {
  projects(organizationId: 1, status: "ACTIVE") {
    id
    name
    status
    taskCount
  }
}
```

### 5. Get Single Project
```graphql
query {
  project(id: 1) {
    id
    name
    description
    status
    dueDate
    taskCount
    completedTasks
    completionRate
    organization {
      id
      name
    }
    tasks {
      id
      title
      status
    }
  }
}
```

### 6. Get Project Statistics
```graphql
query {
  projectStats(projectId: 1) {
    projectId
    totalTasks
    todoTasks
    inProgressTasks
    completedTasks
    completionRate
  }
}
```

### 7. Update Project
```graphql
mutation {
  updateProject(
    id: 1
    name: "Website Redesign v2"
    status: "IN_PROGRESS"
    description: "Updated description"
  ) {
    success
    message
    project {
      id
      name
      status
      description
    }
  }
}
```

### 8. Update Project with Organization Check
```graphql
mutation {
  updateProject(
    id: 1
    organizationId: 1
    status: "COMPLETED"
  ) {
    success
    message
    project {
      id
      status
    }
  }
}
```

### 9. Delete Project
```graphql
mutation {
  deleteProject(id: 1, organizationId: 1) {
    success
    message
  }
}
```

## Tasks

### 1. Create Task
```graphql
mutation {
  createTask(
    projectId: 1
    title: "Design homepage mockup"
    description: "Create initial mockup for the homepage with new branding"
    status: "TODO"
    assigneeEmail: "designer@acme.com"
    dueDate: "2025-12-20T17:00:00"
    organizationId: 1
  ) {
    success
    message
    task {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      project {
        name
      }
    }
  }
}
```

### 2. List All Tasks
```graphql
query {
  tasks {
    id
    title
    status
    assigneeEmail
    dueDate
    commentCount
    project {
      name
      organization {
        name
      }
    }
  }
}
```

### 3. List Tasks by Project
```graphql
query {
  tasksByProject(projectId: 1) {
    id
    title
    description
    status
    assigneeEmail
    dueDate
    commentCount
  }
}
```

### 4. List Tasks by Organization
```graphql
query {
  tasksByOrganization(organizationId: 1) {
    id
    title
    status
    assigneeEmail
    project {
      name
    }
  }
}
```

### 5. Filter Tasks by Status
```graphql
query {
  tasks(projectId: 1, status: "IN_PROGRESS") {
    id
    title
    status
    assigneeEmail
  }
}
```

### 6. Filter Tasks by Assignee
```graphql
query {
  tasksByProject(
    projectId: 1
    assigneeEmail: "designer@acme.com"
  ) {
    id
    title
    status
  }
}
```

### 7. Get Single Task with Comments
```graphql
query {
  task(id: 1) {
    id
    title
    description
    status
    assigneeEmail
    dueDate
    commentCount
    project {
      name
      organization {
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
```

### 8. Update Task
```graphql
mutation {
  updateTask(
    id: 1
    status: "IN_PROGRESS"
    assigneeEmail: "developer@acme.com"
  ) {
    success
    message
    task {
      id
      status
      assigneeEmail
    }
  }
}
```

### 9. Update Task with Status Validation
```graphql
mutation {
  updateTask(
    id: 1
    status: "DONE"
    validateTransition: true
    organizationId: 1
  ) {
    success
    message
    task {
      id
      status
    }
  }
}
```

### 10. Delete Task
```graphql
mutation {
  deleteTask(id: 1, organizationId: 1) {
    success
    message
  }
}
```

## Task Comments

### 1. Add Comment to Task
```graphql
mutation {
  addTaskComment(
    taskId: 1
    content: "I've started working on the mockup. Should have initial version by tomorrow."
    authorEmail: "designer@acme.com"
    organizationId: 1
  ) {
    success
    message
    comment {
      id
      content
      authorEmail
      createdAt
      task {
        title
      }
    }
  }
}
```

### 2. List Comments for Task
```graphql
query {
  taskComments(taskId: 1) {
    id
    content
    authorEmail
    createdAt
    task {
      title
    }
  }
}
```

### 3. Update Comment
```graphql
mutation {
  updateTaskComment(
    id: 1
    content: "Updated: Mockup is complete and ready for review."
  ) {
    success
    message
    comment {
      id
      content
      authorEmail
    }
  }
}
```

### 4. Delete Comment
```graphql
mutation {
  deleteTaskComment(id: 1) {
    success
    message
  }
}
```

## Complex Queries

### 1. Full Organization Overview
```graphql
query {
  organization(id: 1) {
    id
    name
    slug
    contactEmail
    projectCount
    activeProjectCount
    projects {
      id
      name
      status
      taskCount
      completedTasks
      completionRate
      tasks {
        id
        title
        status
        assigneeEmail
        commentCount
      }
    }
  }
}
```

### 2. Dashboard Summary
```graphql
query {
  organizationStats(organizationId: 1) {
    totalProjects
    activeProjects
    completedProjects
    totalTasks
    completedTasks
  }
  
  projectsByOrganization(organizationId: 1, status: "ACTIVE") {
    id
    name
    taskCount
    completedTasks
    completionRate
  }
  
  tasksByOrganization(organizationId: 1, status: "TODO") {
    id
    title
    assigneeEmail
    project {
      name
    }
  }
}
```

### 3. Project Detail with All Tasks and Comments
```graphql
query {
  project(id: 1) {
    id
    name
    description
    status
    dueDate
    completionRate
    organization {
      name
      contactEmail
    }
    tasks {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      commentCount
      comments {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
}
```

### 4. User's Tasks (by email)
```graphql
query {
  tasks(assigneeEmail: "developer@acme.com") {
    id
    title
    status
    dueDate
    project {
      name
      organization {
        name
      }
    }
  }
}
```

### 5. Overdue Tasks Report
```graphql
query {
  tasksByOrganization(organizationId: 1) {
    id
    title
    status
    dueDate
    assigneeEmail
    project {
      name
    }
  }
}
```

## Testing Multi-Tenancy

### 1. Create Two Organizations
```graphql
mutation {
  org1: createOrganization(
    name: "Company A"
    contactEmail: "contact@companya.com"
    slug: "company-a"
  ) {
    success
    organization { id name }
  }
  
  org2: createOrganization(
    name: "Company B"
    contactEmail: "contact@companyb.com"
    slug: "company-b"
  ) {
    success
    organization { id name }
  }
}
```

### 2. Create Projects in Different Organizations
```graphql
mutation {
  project1: createProject(
    organizationId: 1
    name: "Company A Project"
  ) {
    success
    project { id name }
  }
  
  project2: createProject(
    organizationId: 2
    name: "Company B Project"
  ) {
    success
    project { id name }
  }
}
```

### 3. Try to Access Wrong Organization (Should Fail)
```graphql
mutation {
  updateProject(
    id: 1
    organizationId: 2
    name: "Trying to update another org's project"
  ) {
    success
    message
  }
}
```

Expected result: `success: false` with organization mismatch error.

## Tips for Testing

1. **Start with Organizations**: Create at least one organization first
2. **Build Hierarchy**: Organization → Projects → Tasks → Comments
3. **Test Filters**: Use different filter combinations to verify queries
4. **Test Multi-tenancy**: Try accessing resources from wrong organizations
5. **Check Statistics**: Verify computed fields and statistics are accurate
6. **Test Validations**: Try invalid status transitions, missing fields, etc.

## Quick Test Workflow

```graphql
# 1. Create Organization
mutation { createOrganization(name: "Test Org", contactEmail: "test@test.com") { success organization { id } } }

# 2. Create Project
mutation { createProject(organizationId: 1, name: "Test Project") { success project { id } } }

# 3. Create Task
mutation { createTask(projectId: 1, title: "Test Task") { success task { id } } }

# 4. Add Comment
mutation { addTaskComment(taskId: 1, content: "Test comment", authorEmail: "test@test.com") { success comment { id } } }

# 5. View Everything
query {
  organization(id: 1) {
    name
    projects {
      name
      tasks {
        title
        comments {
          content
        }
      }
    }
  }
}
```

## Error Handling Examples

All mutations return structured responses:

```json
{
  "success": false,
  "message": "Detailed error message here",
  "object": null
}
```

Common errors:
- Organization mismatch (wrong org trying to access resource)
- Invalid status transition (e.g., TODO → DONE without going through IN_PROGRESS when validation enabled)
- Missing required fields
- Invalid foreign key references

