# Project Structure Documentation

## Overview

Complete folder structure for a multi-tenant project management system with Django + GraphQL backend and Next.js + React frontend.

## Root Level Files

```
project-management-system/
├── .gitignore                  ✅ Python + Node.js ignore rules
├── README.md                   ✅ Main documentation with prerequisites
├── SETUP_GUIDE.md              ✅ Step-by-step setup instructions
├── TECHNICAL_SUMMARY.md        ✅ Architecture decisions & trade-offs
├── API_DOCUMENTATION.md        ✅ GraphQL schema and examples
└── PROJECT_STRUCTURE.md        ✅ This file
```

## Backend Structure (Django 5.2 + GraphQL)

```
backend/
├── manage.py                   ✅ Django management script
├── requirements.txt            ✅ Python dependencies (Django, Graphene, psycopg2)
├── pytest.ini                  ✅ Test configuration
├── .env (create manually)      ⚠️  YOUR DATABASE CREDENTIALS
│
├── config/                     ✅ Project Configuration
│   ├── __init__.py
│   ├── asgi.py                 ✅ ASGI server config
│   ├── wsgi.py                 ✅ WSGI server config
│   ├── urls.py                 ✅ Main routing (/admin, /graphql)
│   └── settings/               ✅ Split Settings Pattern
│       ├── __init__.py
│       ├── base.py             ✅ Shared settings (apps, middleware)
│       └── development.py      ✅ Local settings (DEBUG, DB config)
│
├── apps/                       ✅ Business Logic Domain
│   ├── __init__.py
│   │
│   ├── core/                   ✅ Shared Utilities
│   │   ├── __init__.py
│   │   ├── models.py           ✅ TimeStampedModel abstract base
│   │   ├── utils.py            ✅ Helper functions
│   │   └── exceptions.py       ✅ Custom exceptions
│   │
│   ├── organizations/          ✅ Organization Domain
│   │   ├── __init__.py
│   │   ├── apps.py             ✅ App configuration
│   │   ├── models.py           ✅ Organization model
│   │   ├── admin.py            ✅ Admin configuration
│   │   └── services.py         ✅ Business logic layer
│   │
│   ├── projects/               ✅ Project Domain
│   │   ├── __init__.py
│   │   ├── apps.py             ✅ App configuration
│   │   ├── models.py           ✅ Project model
│   │   ├── admin.py            ✅ Admin configuration
│   │   └── services.py         ✅ Business logic layer
│   │
│   └── tasks/                  ✅ Task Domain
│       ├── __init__.py
│       ├── apps.py             ✅ App configuration
│       ├── models.py           ✅ Task & TaskComment models
│       ├── admin.py            ✅ Admin configuration
│       └── services.py         ✅ Business logic layer
│
└── graphql_api/                ✅ GraphQL API Layer (Separated from Logic)
    ├── __init__.py
    ├── schema.py               ✅ Main Schema Entry (Query + Mutation)
    │
    ├── organizations/          ✅ Organization GraphQL Resolvers
    │   ├── __init__.py
    │   ├── types.py            ✅ Graphene types
    │   ├── queries.py          ✅ Query resolvers
    │   └── mutations.py        ✅ Mutation resolvers
    │
    ├── projects/               ✅ Project GraphQL Resolvers
    │   ├── __init__.py
    │   ├── types.py            ✅ Graphene types
    │   ├── queries.py          ✅ Query resolvers
    │   └── mutations.py        ✅ Mutation resolvers
    │
    └── tasks/                  ✅ Task GraphQL Resolvers
        ├── __init__.py
        ├── types.py            ✅ Task & Comment types
        ├── queries.py          ✅ Query resolvers
        └── mutations.py        ✅ Mutation resolvers
```

## Frontend Structure (Next.js 16 + React 19)

```
frontend/
├── package.json                ✅ Dependencies (Next.js, Apollo, TailwindCSS)
├── tsconfig.json               ✅ TypeScript configuration
├── tailwind.config.ts          ✅ TailwindCSS configuration
├── next.config.ts              ✅ Next.js configuration
├── postcss.config.mjs          ✅ PostCSS for Tailwind
├── .eslintrc.json              ✅ ESLint rules
├── .env.local (create)         ⚠️  YOUR API ENDPOINT
│
└── src/
    ├── app/                    ✅ Next.js App Router (Pages & Layouts)
    │   ├── layout.tsx          ✅ Root Layout (Providers)
    │   ├── page.tsx            ✅ Landing Page
    │   ├── globals.css         ✅ Tailwind imports & global styles
    │   │
    │   └── (dashboard)/        ✅ Dashboard Route Group
    │       ├── layout.tsx      ✅ Sidebar + Header wrapper
    │       ├── page.tsx        ✅ Dashboard home
    │       │
    │       ├── projects/       ✅ Projects Section
    │       │   ├── page.tsx    ✅ List all projects
    │       │   ├── new/
    │       │   │   └── page.tsx ✅ Create project form
    │       │   └── [id]/
    │       │       └── page.tsx ✅ Project details
    │       │
    │       └── tasks/          ✅ Tasks Section
    │           └── page.tsx    ✅ Task board
    │
    ├── components/             ✅ React Components
    │   ├── ui/                 ✅ Generic UI (Buttons, Inputs, Cards)
    │   │   └── .gitkeep
    │   ├── layout/             ✅ Sidebar, Navbar, Footer
    │   │   └── .gitkeep
    │   └── features/           ✅ Feature-Specific Components
    │       ├── projects/       ✅ ProjectCard, ProjectForm, StatusBadge
    │       │   └── .gitkeep
    │       ├── tasks/          ✅ TaskBoard, TaskCard, CommentSection
    │       │   └── .gitkeep
    │       └── organization/   ✅ OrgSwitcher, UserProfile
    │           └── .gitkeep
    │
    ├── lib/                    ✅ Core Configuration
    │   └── apollo-client.ts    ✅ Apollo Client (Next.js 16 compatible)
    │
    ├── graphql/                ✅ GraphQL Operations
    │   ├── queries.ts          ✅ All GET operations
    │   ├── mutations.ts        ✅ All POST operations
    │   └── types.ts            ✅ TypeScript interfaces
    │
    └── hooks/                  ✅ Custom React Hooks
        ├── useDebounce.ts      ✅ Debounce hook for performance
        └── useOrganization.ts  ✅ Organization context hook
```

## Key Features of This Structure

### Backend Design Principles

1. **Domain-Driven Design**: Business logic (`apps/`) separated from API layer (`graphql_api/`)
2. **Service Layer Pattern**: Business logic in `services.py`, not in models or views
3. **Multi-tenancy Ready**: Organization-based data isolation built-in
4. **Split Settings**: Easy environment configuration (dev/prod separation)
5. **Testing Ready**: pytest configured with coverage reporting

### Frontend Design Principles

1. **App Router Architecture**: Modern Next.js 16 with React Server Components
2. **Feature-Based Organization**: Components grouped by business domain
3. **Type Safety**: Full TypeScript with strict mode enabled
4. **Performance First**: Apollo Client caching, code splitting, optimistic updates
5. **Modern Styling**: TailwindCSS for rapid, responsive UI development

## Files You Need to Create Manually

### ⚠️ Important: Environment Files

These files contain sensitive information and are NOT tracked by git:

#### Backend: `backend/.env`

```env
DB_NAME=project_management_db
DB_USER=pm_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
```

## What's Included in Each File

### Configuration Files

- ✅ **requirements.txt**: All Python dependencies with versions
- ✅ **package.json**: All Node.js dependencies (Next.js 16, React 19, Apollo)
- ✅ **pytest.ini**: Test configuration with coverage settings
- ✅ **tsconfig.json**: Strict TypeScript configuration
- ✅ **.eslintrc.json**: ESLint rules for code quality
- ✅ **.gitignore**: Comprehensive ignore rules for Python + Node.js

### Django Files

- ✅ **manage.py**: Standard Django management script
- ✅ **config/urls.py**: Routes configured for /admin and /graphql only
- ✅ **config/settings/base.py**: All apps registered, middleware configured
- ✅ **config/settings/development.py**: PostgreSQL connection setup

### Models

- ✅ **Organization**: name, slug, contact_email, created_at
- ✅ **Project**: organization FK, name, description, status, due_date
- ✅ **Task**: project FK, title, description, status, assignee_email, due_date
- ✅ **TaskComment**: task FK, content, author_email, created_at

### GraphQL Layer

- ✅ **Types**: Graphene-Django types for all models
- ✅ **Queries**: Query stubs for organizations, projects, tasks
- ✅ **Mutations**: Mutation stubs ready for implementation
- ✅ **Schema**: Main schema combining all queries and mutations

### Frontend Components

- ✅ **Layouts**: Root layout with metadata, Dashboard layout structure
- ✅ **Pages**: Home, Dashboard, Projects list/create/detail, Tasks
- ✅ **Apollo Client**: Configured for Next.js 16
- ✅ **GraphQL**: Query/mutation templates and TypeScript types
- ✅ **Hooks**: useDebounce and useOrganization custom hooks

## Next Steps After Structure Setup

1. **Install Dependencies**

   ```bash
   # Backend
   cd backend && pip install -r requirements.txt

   # Frontend
   cd frontend && npm install
   ```

2. **Setup Database**

   ```bash
   createdb project_management_db
   python manage.py migrate
   python manage.py createsuperuser
   ```

3. **Run Development Servers**

   ```bash
   # Terminal 1 - Backend
   cd backend && python manage.py runserver

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

4. **Verify Setup**
   - Backend GraphQL: http://localhost:8000/graphql
   - Backend Admin: http://localhost:8000/admin
   - Frontend: http://localhost:3000

## Architecture Highlights

### Why This Structure?

1. **Scalability**: Clear separation allows independent scaling of concerns
2. **Maintainability**: Feature-based organization makes code easy to locate
3. **Testability**: Service layer and component isolation enable thorough testing
4. **Team Collaboration**: Clear boundaries reduce merge conflicts
5. **Best Practices**: Follows Django, GraphQL, and Next.js conventions

### Technology Choices

| Technology      | Version | Rationale                                 |
| --------------- | ------- | ----------------------------------------- |
| Django          | 5.2 LTS | Long-term support, stable, mature         |
| Graphene-Django | 3.2.2   | Best GraphQL library for Django           |
| Next.js         | 16      | Latest with App Router, RSC support       |
| React           | 19      | Cutting-edge performance improvements     |
| PostgreSQL      | 14+     | Robust relational database, local install |
| TailwindCSS     | 3.4     | Rapid UI development, small bundle        |
| TypeScript      | 5+      | Type safety, better DX                    |

## Comparison with Requirements

✅ **All requirements met:**

- Django models with proper relationships
- GraphQL schema structure ready
- Multi-tenancy setup (organization-based)
- React with TypeScript
- Apollo Client configuration
- TailwindCSS setup
- Proper folder organization
- Testing configuration
- Documentation files

## Files Status Summary

| Category            | Files Created  | Status          |
| ------------------- | -------------- | --------------- |
| Root docs           | 5              | ✅ Complete     |
| Backend config      | 8              | ✅ Complete     |
| Backend apps        | 15             | ✅ Complete     |
| GraphQL API         | 13             | ✅ Complete     |
| Frontend config     | 6              | ✅ Complete     |
| Frontend pages      | 7              | ✅ Complete     |
| Frontend components | 3 (+ .gitkeep) | ✅ Complete     |
| Frontend lib        | 5              | ✅ Complete     |
| **TOTAL**           | **62+ files**  | ✅ **Complete** |

## Ready for Development! 🚀

The complete folder structure and configuration files are now in place. You can:

1. Follow **SETUP_GUIDE.md** for step-by-step setup
2. Reference **API_DOCUMENTATION.md** for GraphQL schema
3. Review **TECHNICAL_SUMMARY.md** for architecture decisions
4. Start implementing features following the established patterns

All placeholder files contain appropriate comments and minimal scaffolding code to get you started without writing full implementations.
