const UserRepository = require("../Repositories/UserRepository");

const UserService = {
  list(tenantId) {
    return UserRepository.list(tenantId);
  },

  create(tenantId, payload) {
    return UserRepository.create(tenantId, payload);
  },

  update(tenantId, userId, payload) {
    return UserRepository.update(tenantId, userId, payload);
  }
};

module.exports = UserService;
