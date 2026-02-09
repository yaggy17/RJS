function requireRole(roles) {
  return function roleCheck(req, res, next) {
    const role = req.auth && req.auth.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}

module.exports = { requireRole };
