import sequelize from '../config/db.js';

// Import only the core user models to avoid loading model files that may have
// inconsistent import paths (we won't modify existing model files).
import Customer from './customer.js';
import Farmer from './farmer.js';
import * as AdminModule from './admin.js';
const Admin = AdminModule.default || null;

const models = {
  Customer,
  Farmer,
  Admin,
};

export { sequelize };
export default models;
