# PROJEXON Complete Package (Demo-Ready)

This repository now includes:

- **Frontend (Vanilla JS + HTML/CSS + Chart.js)**
  - Login, forgot/reset password pages
  - Admin, manager, and team member dashboards
  - User, project, task, matrix, gantt, and resource pages
- **Backend (Node.js + Express)**
  - REST APIs in `routes/api.js`
  - Middleware for JWT auth, tenant resolution, and RBAC
  - Controllers, services, and repositories
- **Database (PostgreSQL)**
  - Multi-tenant schema with `tenant_id` in all core tables

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000/login.html`.

## Notes

- Frontend is wired as a demonstration package with realistic page flows.
- Backend and DB layers are scaffolded for full integration and production hardening.
