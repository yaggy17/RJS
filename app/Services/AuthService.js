const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserRepository = require("../Repositories/UserRepository");
const PasswordResetRepository = require("../Repositories/PasswordResetRepository");

const AuthService = {
  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return { error: "Invalid credentials" };
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return { error: "Invalid credentials" };
    }

    const token = jwt.sign(
      { user_id: user.id, role: user.role, tenant_id: user.tenant_id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "8h" }
    );

    return { token };
  },

  async requestOtp({ phone, tenantId }) {
    const user = await UserRepository.findByPhone(tenantId, phone);
    if (!user) {
      return { error: "User not found" };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await PasswordResetRepository.create({ tenantId, userId: user.id, phone, otpCode });

    return { message: "OTP generated", otp: otpCode };
  },

  async verifyOtp({ phone, otpCode, tenantId }) {
    const record = await PasswordResetRepository.verify({ tenantId, phone, otpCode });
    if (!record) {
      return { error: "Invalid or expired OTP" };
    }

    return { message: "OTP verified", user_id: record.user_id };
  },

  async resetPassword({ userId, newPassword, tenantId }) {
    const hash = await bcrypt.hash(newPassword, 10);
    await UserRepository.updatePassword(tenantId, userId, hash);
    await PasswordResetRepository.invalidate(tenantId, userId);

    return { message: "Password updated" };
  }
};

module.exports = AuthService;
