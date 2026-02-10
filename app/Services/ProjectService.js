const ProjectRepository = require("../Repositories/ProjectRepository");

const ProjectService = {
  list(tenantId) {
    return ProjectRepository.list(tenantId);
  },

  create(tenantId, payload) {
    return ProjectRepository.create(tenantId, payload);
  },

  detail(tenantId, projectId) {
    return ProjectRepository.detail(tenantId, projectId);
  }
};

module.exports = ProjectService;
