import { DataTypes } from "sequelize";
import { sequelize } from "../config/db_files.js";
import Customer from "./customer.js";

const Verification = sequelize.define("Verification", {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true,
},

customerId: {
type: DataTypes.UUID,
allowNull: false,
references: {
model: Customer,
key: "id",
},
onDelete: "CASCADE",
},

token: {
type: DataTypes.STRING,
allowNull: false,
unique: true,
},

type: {
type: DataTypes.ENUM("email_verification", "password_reset"),
allowNull: false,
},

expiresAt: {
type: DataTypes.DATE,
allowNull: false,
},

used: {
type: DataTypes.BOOLEAN,
defaultValue: false,
},
}, {
tableName: "Verifications",
timestamps: true,
});


Customer.hasMany(Verification, { foreignKey: "customerId" });
Verification.belongsTo(Customer, { foreignKey: "customerId" });

export default Verification;