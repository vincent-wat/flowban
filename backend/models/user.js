const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password_reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = User;

const Role = require("./Role");

User.belongsToMany(Role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
  timestamps: false,
});
