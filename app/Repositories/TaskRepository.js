const db = require("./db");

const TaskRepository = {
  async list(tenantId, userId) {
    const result = await db.query(
      `SELECT t.*
       FROM tasks t
       LEFT JOIN task_assignments ta ON t.id = ta.task_id AND t.tenant_id = ta.tenant_id
       WHERE t.tenant_id = $1 AND ($2::int IS NULL OR ta.user_id = $2)
       ORDER BY t.deadline ASC`,
      [tenantId, userId || null]
    );
    return result.rows;
  },

  async create(tenantId, payload) {
    const { project_id, title, priority, deadline, estimated_hours } = payload;
    const result = await db.query(
      "INSERT INTO tasks (tenant_id, project_id, title, priority, deadline, estimated_hours, status) VALUES ($1, $2, $3, $4, $5, $6, 'todo') RETURNING *",
      [tenantId, project_id, title, priority, deadline, estimated_hours]
    );
    return result.rows[0];
  },

  async updateStatus(tenantId, taskId, payload) {
    const { status } = payload;
    const result = await db.query(
      "UPDATE tasks SET status = $1 WHERE tenant_id = $2 AND id = $3 RETURNING *",
      [status, tenantId, taskId]
    );
    return result.rows[0];
  },

  async assign(tenantId, taskId, payload) {
    const { user_id, assigned_hours } = payload;
    const result = await db.query(
      "INSERT INTO task_assignments (tenant_id, task_id, user_id, assigned_hours) VALUES ($1, $2, $3, $4) RETURNING *",
      [tenantId, taskId, user_id, assigned_hours]
    );
    return result.rows[0];
  },

  async eisenhower(tenantId) {
    const result = await db.query(
      "SELECT * FROM tasks WHERE tenant_id = $1",
      [tenantId]
    );
    return result.rows;
  },

  async gantt(tenantId) {
    const result = await db.query(
      "SELECT * FROM tasks WHERE tenant_id = $1 ORDER BY deadline",
      [tenantId]
    );
    return result.rows;
  },

  async allocations(tenantId) {
    const result = await db.query(
      `SELECT u.id, u.name, COALESCE(SUM(ta.assigned_hours), 0) AS assigned_hours
       FROM users u
       LEFT JOIN task_assignments ta ON u.id = ta.user_id AND u.tenant_id = ta.tenant_id
       WHERE u.tenant_id = $1
       GROUP BY u.id, u.name`,
      [tenantId]
    );
    return result.rows;
  }
};

module.exports = TaskRepository;
