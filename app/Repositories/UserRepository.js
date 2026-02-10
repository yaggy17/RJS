const db = require("./db");

const UserRepository = {
  async findByEmail(email) {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    );
    return result.rows[0];
  },

  async findByPhone(tenantId, phone) {
    const result = await db.query(
      "SELECT * FROM users WHERE tenant_id = $1 AND phone = $2 LIMIT 1",
      [tenantId, phone]
    );
    return result.rows[0];
  },

  async list(tenantId) {
    const result = await db.query(
      "SELECT id, name, email, role, status FROM users WHERE tenant_id = $1",
      [tenantId]
    );
    return result.rows;
  },

  async create(tenantId, payload) {
    const { name, email, phone, role, status, password_hash } = payload;
    const result = await db.query(
      "INSERT INTO users (tenant_id, name, email, phone, role, status, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, status",
      [tenantId, name, email, phone, role, status, password_hash]
    );
    return result.rows[0];
  },

  async update(tenantId, userId, payload) {
    const { role, status } = payload;
    const result = await db.query(
      "UPDATE users SET role = $1, status = $2 WHERE tenant_id = $3 AND id = $4 RETURNING id, name, email, role, status",
      [role, status, tenantId, userId]
    );
    return result.rows[0];
  },

  async updatePassword(tenantId, userId, hash) {
    await db.query(
      "UPDATE users SET password_hash = $1 WHERE tenant_id = $2 AND id = $3",
      [hash, tenantId, userId]
    );
  }
};

module.exports = UserRepository;
