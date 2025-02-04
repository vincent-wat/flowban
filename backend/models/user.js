const { DataTypes } = require("sequelize");
const sequelize = require("./database");  // Import the sequelize instance
//const Role = require("./Role");  // Import the Role model

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
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9\-+()]*$/,  // Validates phone number format
    },
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,  // Default role (e.g., 'User')
    references: {
      model: "roles",
      key: "id",
    },
  },
  password_reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Define association between User and Role
//User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

module.exports = User;
