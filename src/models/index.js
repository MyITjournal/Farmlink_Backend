import User from "./user.js";
import Customer from "./customer.js";
import Farmer from "./farmer.js";
import Admin from "./admin.js";
import Produce from "./produce.js";
import Verification from "./verification.js";

// User relationships
User.hasOne(Customer, { foreignKey: "userId", as: "customer" });
User.hasOne(Farmer, { foreignKey: "userId", as: "farmer" });

// Customer relationships
Customer.hasMany(Verification, { foreignKey: "customerId" });
Customer.belongsTo(User, { foreignKey: "userId", as: "user" });
Customer.belongsTo(Farmer, { foreignKey: "farmerId", as: "farmer" });

// Farmer relationships
Farmer.belongsTo(User, { foreignKey: "userId", as: "user" });
Farmer.hasOne(Admin, { foreignKey: "userId" });
Farmer.hasMany(Produce, { foreignKey: "farmerId" });
Farmer.hasMany(Customer, { foreignKey: "farmerId", as: "customers" });

// Admin relationships
Admin.belongsTo(Farmer, { foreignKey: "userId" });

// Produce relationships
Produce.belongsTo(Farmer, { foreignKey: "farmerId" });

// Customer ↔ Verification relationship (one-to-many)
Verification.belongsTo(Customer, { foreignKey: "customerId" });

export default { User, Customer, Farmer, Admin, Produce, Verification };
