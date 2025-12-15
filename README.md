# 🎉 Multi-Tenant Project Management System

A **complete full-stack** project management tool with modern technologies.

## 🚨 Prerequisites

**Local PostgreSQL Required** - This application requires a local PostgreSQL installation.

### Required Software

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 14+** (installed and running locally)
- Git

## 🚀 Quick Start (10 minutes)

### Step 1: Database Setup (2 minutes)

```bash
# Create PostgreSQL database
createdb project_management_db

# Optional: Create dedicated user
psql postgres
CREATE USER pm_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE project_management_db TO pm_user;
\q
```

### Step 2: Backend Setup (4 minutes)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOL
DB_NAME=project_management_db
DB_USER=pm_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=django-insecure-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
EOL

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (follow prompts)
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

✅ **Backend running at:**

- GraphQL API: http://localhost:8000/graphql
- Admin Panel: http://localhost:8000/admin

### Step 3: Frontend Setup (3 minutes)

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
EOL

# Start frontend server
npm run dev
```

✅ **Frontend running at:** http://localhost:3000

### Step 4: Create Test Data

1. Open http://localhost:8000/admin
2. Login with superuser credentials
3. Create an Organization
4. Create a Project for that organization
5. Create some Tasks for the project
6. Go to http://localhost:3000 to see your data!

### Optional: Test Backend with Postman Collection

For convenient GraphQL testing, you can use the included Postman collection:

1. Open Postman and import `project-management-api.postman_collection.json` from the project root.
2. Ensure the backend is running at `http://localhost:8000`.
3. In Postman, set the `baseUrl` collection variable to `http://localhost:8000` (if not already set).
4. Run the requests (for example, the “🚀 Quick Setup Workflow” folder) to create demo organizations, projects, tasks, and comments via the GraphQL endpoint.

## 📁 Project Structure

```
project-management-system/
│
├── backend/                          # Django 5.2 + GraphQL
│   ├── apps/                        # Business Logic
│   │   ├── organizations/          # Organization domain
│   │   ├── projects/               # Project domain
│   │   └── tasks/                  # Task domain
│   ├── graphql_api/                # GraphQL API Layer
│   └── config/                     # Django configuration
│
├── frontend/                        # Next.js 16 + React 19
│   └── src/
│       ├── app/                    # Next.js pages
│       ├── components/             # React components
│       ├── graphql/                # GraphQL operations
│       └── lib/                    # Apollo Client
│
└── [Documentation files]
```

## 🎯 Features Implemented

### Backend Features

- ✅ **4 Django Models** (Organization, Project, Task, TaskComment)
- ✅ **GraphQL API** (13 queries + 8 mutations)
- ✅ **Multi-tenancy** (Organization-based data isolation)
- ✅ **Service Layer** (18 business logic methods)
- ✅ **Statistics** (Task counts, completion rates)
- ✅ **20+ Tests** (pytest with coverage)

### Frontend Features

- ✅ **7 Pages** (Landing, Dashboard, Projects, Tasks)
- ✅ **18 Components** (UI + Feature components)
- ✅ **Apollo Client** (GraphQL integration)
- ✅ **Kanban Board** (Drag-ready task board)
- ✅ **Comments System** (Real-time comments)
- ✅ **Responsive Design** (Mobile + Desktop)
- ✅ **Form Validation** (Client-side validation)
- ✅ **Loading States** (Skeleton loaders)

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest                 # Run all tests
pytest --cov          # With coverage report
pytest -v             # Verbose output
```

### Frontend Type Check

```bash
cd frontend
npm run type-check    # TypeScript validation
npm run lint          # ESLint check
npm run build         # Production build test
```

## 📝 API Examples

### Create Project (GraphQL)

```graphql
mutation {
  createProject(
    organizationId: 1
    name: "Website Redesign"
    description: "Complete website overhaul"
    status: "ACTIVE"
  ) {
    success
    project {
      id
      name
      taskCount
    }
  }
}
```

### Get Projects (GraphQL)

```graphql
query {
  projects(organizationId: 1) {
    id
    name
    status
    taskCount
    completionRate
  }
}
```

See [GRAPHQL_EXAMPLES.md](./backend/GRAPHQL_EXAMPLES.md) for more examples.

## 📚 Documentation

Comprehensive documentation is included:

### Getting Started

- **README.md** (this file) - Quick start guide
- **SETUP_GUIDE.md** - Detailed setup instructions
- **FULL_STACK_COMPLETE.md** - Complete implementation summary

### Backend

- **BACKEND_IMPLEMENTATION.md** - Backend implementation details
- **GRAPHQL_EXAMPLES.md** - Complete query/mutation examples
- **API_DOCUMENTATION.md** - API reference

### Frontend

- **FRONTEND_IMPLEMENTATION.md** - Frontend implementation guide

### Architecture

- **TECHNICAL_SUMMARY.md** - Architecture decisions
- **PROJECT_STRUCTURE.md** - Folder structure explanation

## 🛠 Tech Stack

### Backend

- **Django 5.2 LTS** - Web framework
- **Graphene-Django 3.2** - GraphQL implementation
- **PostgreSQL 14+** - Database
- **pytest** - Testing framework

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library (latest version)
- **TypeScript 5** - Type safety
- **Apollo Client 3** - GraphQL client
- **TailwindCSS 3** - Utility-first CSS

## 📸 What's Built

Based on your design mockup:

### ✅ Project Dashboard

- Grid layout with project cards
- Status badges (ACTIVE, COMPLETED, ON_HOLD)
- Task count display
- "View Project" and "Create Project" buttons
- Responsive 3-column grid

### ✅ Project Detail Page

- Project statistics (task counts, completion rate)
- Kanban board (To Do, In Progress, Done)
- Add task functionality
- Task detail modals
- Comment system

### ✅ Task Management

- Task board with three columns
- Task cards with assignee and comments
- Click to view task details
- Add comments to tasks
- Filter by status and assignee

## 🎓 Demo Guide

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Visit**: http://localhost:3000
3. **Create data** via admin panel or GraphQL
4. **Explore features**:
   - Dashboard with projects
   - Project detail with tasks
   - Kanban board
   - Task comments
   - Filtering and search

## 📞 Support

For detailed information, see:

- Setup issues: `SETUP_GUIDE.md`
- API usage: `backend/GRAPHQL_EXAMPLES.md`
- Architecture: `TECHNICAL_SUMMARY.md`
- Full details: `FULL_STACK_COMPLETE.md`
