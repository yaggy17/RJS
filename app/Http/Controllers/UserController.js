const UserService = require("../../Services/UserService");

const UserController = {
  async list(req, res) {
    const users = await UserService.list(req.tenantId);
    return res.json(users);
  },

  async create(req, res) {
    const user = await UserService.create(req.tenantId, req.body);
    return res.status(201).json(user);
  },

  async update(req, res) {
    const user = await UserService.update(req.tenantId, req.params.id, req.body);
    return res.json(user);
  }
};

module.exports = UserController;
