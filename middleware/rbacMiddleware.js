// middleware/rbacMiddleware.js
const allowRoles = (...roles) => {
  return (req, res, next) => {
    console.log(` [${req.method}] ${req.originalUrl} | User: ${req.user.role} | Allowed:`, roles);

    if (!roles.includes(req.user.role)) {
      console.log("Access denied for role:", req.user.role);
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};



module.exports = { allowRoles };
