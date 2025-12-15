# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:

- ✅ Python 3.11+ installed (`python --version`)
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL 14+ installed and running (`psql --version`)
- ✅ Git installed (`git --version`)

## Step-by-Step Setup

### 1. Database Setup (5 minutes)

#### Windows (PowerShell):

```powershell
# Start PostgreSQL service (if not running)
# Usually done via Services or pgAdmin

# Create database using psql
psql -U postgres
```

#### Then in psql:

```sql
CREATE DATABASE project_management_db;
CREATE USER pm_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE project_management_db TO pm_user;
\q
```

### 2. Backend Setup (10 minutes)

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy the content below and save as backend/.env
```

**Create `backend/.env` file:**

```env
DB_NAME=project_management_db
DB_USER=pm_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=django-insecure-replace-this-with-random-string
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

```powershell
# Run migrations
python manage.py migrate

# Create superuser for admin panel
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

**Verify backend:** Open http://localhost:8000/graphql (you should see GraphiQL interface)

### 3. Frontend Setup (10 minutes)

Open a NEW terminal:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
# Copy the content below and save as frontend/.env.local
```

**Create `frontend/.env.local` file:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
```

```powershell
# Start frontend development server
npm run dev
```

**Verify frontend:** Open http://localhost:3000

## Verification Steps

### Backend Verification

1. **GraphQL Interface**: http://localhost:8000/graphql

   - Should show GraphiQL interface
   - Try a test query:

   ```graphql
   query {
     __schema {
       types {
         name
       }
     }
   }
   ```

2. **Admin Panel**: http://localhost:8000/admin
   - Login with superuser credentials
   - Should see Organizations, Projects, Tasks models

### Frontend Verification

1. **Home Page**: http://localhost:3000

   - Should display "Project Management System"

2. **Dashboard**: http://localhost:3000/dashboard

   - Should display dashboard layout

3. **Projects**: http://localhost:3000/projects
   - Should display projects page placeholder

## Common Issues & Solutions

### Issue: "psycopg2-binary" installation fails

**Solution:**

```powershell
# Windows: Install Visual C++ Build Tools
# Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# Alternative: Use binary wheel
pip install psycopg2-binary --no-cache-dir
```

### Issue: PostgreSQL connection refused

**Solution:**

- Check PostgreSQL service is running
- Verify credentials in `.env` file
- Check port 5432 is not blocked by firewall

### Issue: Port 8000 or 3000 already in use

**Solution:**

```powershell
# Find process using port
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different ports:
# Backend: python manage.py runserver 8001
# Frontend: npm run dev -- -p 3001
```

### Issue: npm install fails

**Solution:**

```powershell
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After successful setup:

1. **Create test data** via Django admin panel:

   - Create an Organization
   - Create a Project for that organization
   - Create Tasks for the project

2. **Test GraphQL queries** in GraphiQL:

   ```graphql
   query {
     organizations {
       id
       name
       projects {
         id
         name
       }
     }
   }
   ```

3. **Start implementing features** following the requirements

## Development Workflow

### Running Tests

**Backend:**

```powershell
cd backend
pytest
```

**Frontend:**

```powershell
cd frontend
npm test
```

### Code Quality Checks

**Backend:**

```powershell
# Format code
black apps/ graphql_api/

# Sort imports
isort apps/ graphql_api/

# Lint
flake8 apps/ graphql_api/
```

**Frontend:**

```powershell
# Lint
npm run lint

# Type check
npm run type-check
```

### Creating Migrations

```powershell
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Project Structure Overview

```
project-management-system/
├── backend/              # Django + GraphQL API
│   ├── apps/            # Business logic (models, services)
│   ├── graphql_api/     # GraphQL layer (types, queries, mutations)
│   └── config/          # Django settings
│
└── frontend/            # Next.js + React
    └── src/
        ├── app/         # Next.js pages & layouts
        ├── components/  # React components
        ├── graphql/     # GraphQL queries & mutations
        ├── lib/         # Apollo client setup
        └── hooks/       # Custom React hooks
```

## Resources

- **Django Documentation**: https://docs.djangoproject.com/
- **Graphene-Django**: https://docs.graphene-python.org/projects/django/
- **Next.js Documentation**: https://nextjs.org/docs
- **Apollo Client**: https://www.apollographql.com/docs/react/
- **TailwindCSS**: https://tailwindcss.com/docs

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review this guide's "Common Issues" section
3. Check the project's README.md
4. Review the TECHNICAL_SUMMARY.md for architecture decisions

Good luck with your implementation! 🚀
