const db = require("./db");

const ProjectRepository = {
  async list(tenantId) {
    const result = await db.query(
      "SELECT * FROM projects WHERE tenant_id = $1 ORDER BY start_date DESC",
      [tenantId]
    );
    return result.rows;
  },

  async create(tenantId, payload) {
    const { name, description, start_date, end_date } = payload;
    const result = await db.query(
      "INSERT INTO projects (tenant_id, name, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [tenantId, name, description, start_date, end_date]
    );
    return result.rows[0];
  },

  async detail(tenantId, projectId) {
    const result = await db.query(
      "SELECT * FROM projects WHERE tenant_id = $1 AND id = $2",
      [tenantId, projectId]
    );
    return result.rows[0];
  }
};

module.exports = ProjectRepository;
