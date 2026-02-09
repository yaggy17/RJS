CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'member')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  UNIQUE (tenant_id, email)
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  project_id INTEGER NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  priority TEXT NOT NULL,
  deadline DATE,
  estimated_hours INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
  eisenhower_label TEXT
);

CREATE TABLE task_assignments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  assigned_hours INTEGER DEFAULT 0
);

CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_task_assignments_tenant_id ON task_assignments(tenant_id);
CREATE INDEX idx_password_resets_tenant_id ON password_resets(tenant_id);
