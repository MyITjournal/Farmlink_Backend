// Role-based middleware
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no user found",
      });
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Not authorized, insufficient permissions",
      });
    }

    next();
  };
};

// Specific role middlewares
const isAdmin = checkRole("admin");
const isFarmer = checkRole("farmer");
const isCustomer = checkRole("customer");
const isFarmerOrAdmin = checkRole("farmer", "admin");
const isCustomerOrAdmin = checkRole("customer", "admin");

export {
  checkRole,
  isAdmin,
  isFarmer,
  isCustomer,
  isFarmerOrAdmin,
  isCustomerOrAdmin,
};
