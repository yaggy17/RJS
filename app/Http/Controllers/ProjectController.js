const ProjectService = require("../../Services/ProjectService");

const ProjectController = {
  async list(req, res) {
    const projects = await ProjectService.list(req.tenantId);
    return res.json(projects);
  },

  async create(req, res) {
    const project = await ProjectService.create(req.tenantId, req.body);
    return res.status(201).json(project);
  },

  async detail(req, res) {
    const project = await ProjectService.detail(req.tenantId, req.params.id);
    return res.json(project);
  }
};

module.exports = ProjectController;
