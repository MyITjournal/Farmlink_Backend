const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized, user not found" });
    }
    if (!req.user.role) {
      return res.status(403).json({ success: false, message: "Access denied: No role assigned" });
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Requires ${allowedRoles.join(" or ")} role(s). Your role: ${req.user.role}`,
      });
    }
    return next();
  };
};

const isAdmin = checkRole("admin");
const isFarmer = checkRole("farmer");
const isCustomer = checkRole("customer");
const isFarmerOrAdmin = checkRole("farmer", "admin");
const isCustomerOrAdmin = checkRole("customer", "admin");

export { checkRole, isAdmin, isFarmer, isCustomer, isFarmerOrAdmin, isCustomerOrAdmin };
