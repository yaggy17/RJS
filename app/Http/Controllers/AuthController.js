const AuthService = require("../../Services/AuthService");

const AuthController = {
  async login(req, res) {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    return res.json(result);
  },

  async requestOtp(req, res) {
    const { phone, tenant_id } = req.body;
    const result = await AuthService.requestOtp({ phone, tenantId: tenant_id });
    return res.json(result);
  },

  async verifyOtp(req, res) {
    const { phone, otp_code, tenant_id } = req.body;
    const result = await AuthService.verifyOtp({ phone, otpCode: otp_code, tenantId: tenant_id });
    return res.json(result);
  },

  async resetPassword(req, res) {
    const { user_id, new_password, tenant_id } = req.body;
    const result = await AuthService.resetPassword({ userId: user_id, newPassword: new_password, tenantId: tenant_id });
    return res.json(result);
  }
};

module.exports = AuthController;
