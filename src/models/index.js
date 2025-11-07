import User from "./user.js";
import Customer from "./customer.js";
import Farmer from "./farmer.js";
import Admin from "./admin.js";
import Produce from "./produce.js";
import Verification from "./verification.js";

/* User relations */
User.hasOne(Customer, { foreignKey: "user_uuid", as: "customer" });
User.hasOne(Farmer, { foreignKey: "user_uuid", as: "farmer" });
User.hasOne(Admin, { foreignKey: "user_uuid", as: "admin" });

Customer.belongsTo(User, { foreignKey: "user_uuid", as: "user" });
Farmer.belongsTo(User, { foreignKey: "user_uuid", as: "user" });
Admin.belongsTo(User, { foreignKey: "user_uuid", as: "user" });

/* Farmer - produce */
Farmer.hasMany(Produce, { foreignKey: "farmer_uuid", as: "produces" });
Produce.belongsTo(Farmer, { foreignKey: "farmer_uuid", as: "farmer" });

/* Farmer - customers (optional links) */
Farmer.hasMany(Customer, { foreignKey: "favoriteFarmerUuid", as: "customers" });
Customer.belongsTo(Farmer, { foreignKey: "favoriteFarmerUuid", as: "favoriteFarmer" });

/* Customer - verification */
Customer.hasMany(Verification, { foreignKey: "customer_uuid", as: "verifications" });
Verification.belongsTo(Customer, { foreignKey: "customer_uuid", as: "customer" });

export default { User, Customer, Farmer, Admin, Produce, Verification };
