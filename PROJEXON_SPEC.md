# PROJEXON — Where Projects Take Shape

## 0) Technology Stack (Updated Backend)
**Frontend**
- HTML5
- CSS3 (Flexbox / Grid)
- Vanilla JavaScript
- Chart.js
- Icon library (Font Awesome / Heroicons)

**Backend (Updated)**
- Node.js
- Express.js (MVC-style layering)
- RESTful API
- Middleware-based request handling

**Database**
- PostgreSQL (relational, tenant-scoped)

**Authentication & Security**
- JWT
- OTP-based password reset
- Role-based access control (RBAC)
- Tenant-based data isolation

---

## 1) Multi-Tenant SaaS Architecture (True Isolation)
### 1.1 Core Tenancy Model
- **Single codebase, multiple tenants**: All tenants share the same deployed application instance.
- **Tenant context** is resolved on every request via JWT and enforced by middleware.
- **Data isolation**: Every table includes `tenant_id` and every query filters by it.
- **Cross-tenant access is forbidden** by middleware + query-level constraints.

### 1.2 Request Lifecycle (Conceptual, Express-style MVC)
1. **Client request** → includes `Authorization: Bearer <JWT>`.
2. **Auth middleware** validates JWT signature and expiry.
3. **Tenant resolver middleware** extracts `tenant_id` and loads tenant context.
4. **RBAC middleware** verifies role permissions for the target endpoint.
5. **Controller** calls **Service** → **Repository** → **DB** (all queries scoped by `tenant_id`).
6. **Response** returns JSON to frontend.

### 1.3 Backend Layering (Express-style)
- **Routes** (API): `routes/api.js`
- **Controllers**: thin orchestration of request → service
- **Services**: business logic (e.g., task classification, allocation)
- **Repositories**: data access using `tenant_id` filter
- **Middleware**: JWT verification, tenant resolution, role checks

### 1.4 Tenant Isolation Rules (Non-Negotiable)
- Every request must include JWT.
- JWT must include: `user_id`, `role`, `tenant_id`.
- Every query must filter by `tenant_id`.
- Foreign keys always include `tenant_id` in relationships.
- DB constraints enforce tenant consistency.

---

## 2) Authentication & OTP Reset (High Importance)
### 2.1 Login Flow
1. User submits email + password.
2. Backend validates credentials.
3. Backend fetches user’s `role` + `tenant_id`.
4. JWT generated with `user_id`, `role`, `tenant_id`.
5. Token returned to frontend.
6. Token sent with every API request.

### 2.2 JWT Payload Example
```json
{
  "user_id": 42,
  "role": "manager",
  "tenant_id": 7,
  "exp": 1700000000
}
```

### 2.3 OTP-Based Password Reset (Mandatory)
1. User enters registered phone number.
2. Backend validates phone number **within tenant**.
3. OTP generated and stored in `password_resets` with expiry.
4. OTP sent via SMS (simulated).
5. User submits OTP.
6. Backend validates OTP + expiry.
7. User sets new password + confirm.
8. Password updated securely (hash).
9. OTP invalidated.
10. Redirect to login.

---

## 3) Role-Based Access Control (RBAC)
### Roles (Tenant-scoped)
1. **Admin** (Tenant Administrator)
2. **Manager**
3. **Team Member**

### Role Permissions
| Role | Create Projects | Create Tasks | Assign Tasks | Update Task Status | Manage Users |
|------|-----------------|--------------|--------------|--------------------|--------------|
| Admin | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manager | ✅ | ✅ | ✅ | ❌ (Only on assignment tasks) | ❌ |
| Team Member | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 4) Page-wise UI Behavior (Every Page & Action Defined)

### 4.1 Public/Auth Pages
**Login Page**
- Inputs: email, password
- Button: **Login** → calls `/api/auth/login`
- Link: **Forgot Password?**

**Forgot Password Page**
- Input: phone number
- Button: **Send OTP** → `/api/auth/request-otp`

**OTP Verification Page**
- Input: OTP
- Button: **Verify OTP** → `/api/auth/verify-otp`

**Reset Password Page**
- Inputs: new password, confirm password
- Button: **Reset Password** → `/api/auth/reset-password`

### 4.2 Admin Pages
**Admin Dashboard**
- View tenant stats (total users, active projects, tasks distribution)
- Chart.js charts: user roles breakdown, project counts

**User Management Page**
- Actions: Add user, assign role, enable/disable user
- Table: name, email, role, status
- API: `/api/users`

**Project Overview Page**
- Read-only list of projects in tenant

### 4.3 Manager Pages
**Manager Dashboard**
- KPIs: active projects, overdue tasks, utilization
- Chart.js charts: workload per user, task status

**Project Page**
- Create project (title, description, start/end date)
- View project details

**Task Page**
- Create task (title, priority, deadline, estimate hours)
- Assign tasks to team members
- View task status and details

**Eisenhower Matrix Page**
- Automatically classifies tasks into 4 quadrants
- Drag & drop simulation optional

**Gantt Chart Page**
- Visual timeline based on task start/end derived from estimates

**Resource Management Page**
- Show hours allocated vs capacity
- Highlight over-allocated users

### 4.4 Team Member Pages
**Team Dashboard**
- View task count by status
- Quick links to “My Tasks”

**My Tasks Page**
- List tasks assigned to user
- Update status (To Do / In Progress / Done)

---

## 5) Backend API (RESTful Intent)

### Auth
- `POST /api/auth/login` → JWT
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`

### Users (Admin only)
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/{id}` (enable/disable, role)

### Projects (Manager only; Admin read-only)
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/{id}`

### Tasks (Manager create/assign; Team updates)
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/{id}` (status updates)
- `POST /api/tasks/{id}/assign`

### Eisenhower Matrix
- `GET /api/tasks/eisenhower`

### Gantt
- `GET /api/tasks/gantt`

### Resource Management
- `GET /api/resources/allocations`

---

## 6) Core Logic: Eisenhower Matrix
Classification based on:
- **Priority** (High/Medium/Low)
- **Deadline proximity** (e.g., due within 48 hours = urgent)

| Priority | Deadline | Quadrant |
|----------|----------|----------|
| High | Near | Urgent & Important |
| High | Far | Important but Not Urgent |
| Low/Med | Near | Urgent but Not Important |
| Low/Med | Far | Neither Urgent nor Important |

---

## 7) Project Scheduling (Gantt)
- Task duration derived from `estimated_hours`.
- Tasks mapped onto timelines using project start date.
- Output formatted for Chart.js Gantt visualization.

---

## 8) Resource Management Logic
- Each task assignment adds `estimated_hours` to user’s workload.
- Compare assigned hours to `capacity_hours` (weekly).
- Over-allocation flagged if assigned > capacity.

---

## 9) PostgreSQL Schema (Multi-Tenant)

### 9.1 Tables (All include tenant_id)
**tenants**
- id (PK)
- name
- slug
- created_at

**users**
- id (PK)
- tenant_id (FK)
- name
- email (unique per tenant)
- phone
- password_hash
- role (admin/manager/member)
- status (active/inactive)

**projects**
- id (PK)
- tenant_id (FK)
- name
- description
- start_date
- end_date

**tasks**
- id (PK)
- tenant_id (FK)
- project_id (FK)
- title
- priority
- deadline
- estimated_hours
- status (todo/in_progress/done)
- eisenhower_label

**task_assignments**
- id (PK)
- tenant_id (FK)
- task_id (FK)
- user_id (FK)
- assigned_hours

**password_resets**
- id (PK)
- tenant_id (FK)
- user_id (FK)
- phone
- otp_code
- expires_at
- used_at

### 9.2 Constraints
- Unique: `(tenant_id, email)` in users
- Foreign keys include `tenant_id` on related tables
- Check constraints for role/status
- Indexes on `tenant_id`, `project_id`, `task_id`

---

## 10) Final-Year Project Justification
- **Academic depth**: demonstrates multi-tenant SaaS design, RBAC, JWT security, OTP reset flows, and DB normalization.
- **Practical relevance**: mirrors real-world project management tools with proper isolation.
- **Full stack coverage**: frontend, backend, middleware, database, auth.
- **Evaluation-ready**: all pages, actions, and logic clearly defined.
- **Stack constraint compliance**: backend uses Node.js with Express-style MVC to align with the updated backend requirement while still supporting secure JWT/RBAC and OTP flows.

---

## 11) Code Structure Outline (Conceptual)
```
/README.md
/app
  /Http
    /Controllers
      AuthController.js
      UserController.js
      ProjectController.js
      TaskController.js
    /Middleware
      JwtAuthMiddleware.js
      TenantResolverMiddleware.js
      RoleMiddleware.js
  /Services
    AuthService.js
    TaskService.js
    ProjectService.js
  /Repositories
    UserRepository.js
    ProjectRepository.js
    TaskRepository.js
/routes
  api.js
/database
  schema.sql
/public
  index.html
  /assets
    /css
    /js
```

---

## 12) Notes for Implementation
- Frontend will use vanilla JS + Chart.js to render dashboards.
- All buttons and pages map to API endpoints as defined.
- API responses must include tenant-scoped data only.
