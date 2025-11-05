import sequelize from "../config/db_files.js";

import Customer from "./customer.js";
import Farmer from "./farmer.js";
import * as AdminModule from "./admin.js";
const Admin = AdminModule.default || null;

const models = {
  Customer,
  Farmer,
  Admin,
};

export { sequelize };
export default models;
