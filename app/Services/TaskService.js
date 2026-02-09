const TaskRepository = require("../Repositories/TaskRepository");

const TaskService = {
  list(tenantId, userId) {
    return TaskRepository.list(tenantId, userId);
  },

  create(tenantId, payload) {
    return TaskRepository.create(tenantId, payload);
  },

  updateStatus(tenantId, taskId, payload) {
    return TaskRepository.updateStatus(tenantId, taskId, payload);
  },

  assign(tenantId, taskId, payload) {
    return TaskRepository.assign(tenantId, taskId, payload);
  },

  eisenhower(tenantId) {
    return TaskRepository.eisenhower(tenantId);
  },

  gantt(tenantId) {
    return TaskRepository.gantt(tenantId);
  },

  allocations(tenantId) {
    return TaskRepository.allocations(tenantId);
  }
};

module.exports = TaskService;
