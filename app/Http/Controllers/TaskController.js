const TaskService = require("../../Services/TaskService");

const TaskController = {
  async list(req, res) {
    const tasks = await TaskService.list(req.tenantId, req.auth.user_id);
    return res.json(tasks);
  },

  async create(req, res) {
    const task = await TaskService.create(req.tenantId, req.body);
    return res.status(201).json(task);
  },

  async updateStatus(req, res) {
    const task = await TaskService.updateStatus(req.tenantId, req.params.id, req.body);
    return res.json(task);
  },

  async assign(req, res) {
    const assignment = await TaskService.assign(req.tenantId, req.params.id, req.body);
    return res.status(201).json(assignment);
  },

  async eisenhower(req, res) {
    const data = await TaskService.eisenhower(req.tenantId);
    return res.json(data);
  },

  async gantt(req, res) {
    const data = await TaskService.gantt(req.tenantId);
    return res.json(data);
  },

  async allocations(req, res) {
    const data = await TaskService.allocations(req.tenantId);
    return res.json(data);
  }
};

module.exports = TaskController;
