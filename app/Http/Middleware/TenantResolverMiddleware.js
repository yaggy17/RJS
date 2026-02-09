module.exports = function tenantResolver(req, res, next) {
  const tenantId = req.auth && req.auth.tenant_id;
  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context missing" });
  }

  req.tenantId = tenantId;
  return next();
};
