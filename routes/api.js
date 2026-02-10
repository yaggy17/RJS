const express = require("express");
const AuthController = require("../app/Http/Controllers/AuthController");
const UserController = require("../app/Http/Controllers/UserController");
const ProjectController = require("../app/Http/Controllers/ProjectController");
const TaskController = require("../app/Http/Controllers/TaskController");
const jwtAuth = require("../app/Http/Middleware/JwtAuthMiddleware");
const tenantResolver = require("../app/Http/Middleware/TenantResolverMiddleware");
const { requireRole } = require("../app/Http/Middleware/RoleMiddleware");

const router = express.Router();

// Auth
router.post("/auth/login", AuthController.login);
router.post("/auth/request-otp", AuthController.requestOtp);
router.post("/auth/verify-otp", AuthController.verifyOtp);
router.post("/auth/reset-password", AuthController.resetPassword);

// Protected routes
router.use(jwtAuth, tenantResolver);

// Users (Admin only)
router.get("/users", requireRole(["admin"]), UserController.list);
router.post("/users", requireRole(["admin"]), UserController.create);
router.patch("/users/:id", requireRole(["admin"]), UserController.update);

// Projects (Manager only; Admin read-only)
router.get("/projects", requireRole(["admin", "manager"]), ProjectController.list);
router.post("/projects", requireRole(["manager"]), ProjectController.create);
router.get("/projects/:id", requireRole(["admin", "manager"]), ProjectController.detail);

// Tasks (Manager create/assign; Team updates status)
router.get("/tasks", requireRole(["manager", "member"]), TaskController.list);
router.post("/tasks", requireRole(["manager"]), TaskController.create);
router.patch("/tasks/:id", requireRole(["manager", "member"]), TaskController.updateStatus);
router.post("/tasks/:id/assign", requireRole(["manager"]), TaskController.assign);

// Eisenhower Matrix
router.get("/tasks/eisenhower", requireRole(["manager"]), TaskController.eisenhower);

// Gantt
router.get("/tasks/gantt", requireRole(["manager"]), TaskController.gantt);

// Resource Management
router.get("/resources/allocations", requireRole(["manager"]), TaskController.allocations);

module.exports = router;
