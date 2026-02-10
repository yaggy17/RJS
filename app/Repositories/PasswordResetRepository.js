const db = require("./db");

const PasswordResetRepository = {
  async create({ tenantId, userId, phone, otpCode }) {
    await db.query(
      "INSERT INTO password_resets (tenant_id, user_id, phone, otp_code, expires_at) VALUES ($1, $2, $3, $4, NOW() + interval '10 minutes')",
      [tenantId, userId, phone, otpCode]
    );
  },

  async verify({ tenantId, phone, otpCode }) {
    const result = await db.query(
      `SELECT * FROM password_resets
       WHERE tenant_id = $1 AND phone = $2 AND otp_code = $3 AND used_at IS NULL AND expires_at > NOW()
       ORDER BY id DESC
       LIMIT 1`,
      [tenantId, phone, otpCode]
    );
    return result.rows[0];
  },

  async invalidate(tenantId, userId) {
    await db.query(
      "UPDATE password_resets SET used_at = NOW() WHERE tenant_id = $1 AND user_id = $2",
      [tenantId, userId]
    );
  }
};

module.exports = PasswordResetRepository;
