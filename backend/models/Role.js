"use strict";

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  /**
   * Add associations here by attaching a static associate method.
   * This will be called automatically by `models/index.js`
   * AFTER all models are loaded.
   */
  Role.associate = (models) => {
    // Notice we reference `models.User` instead of `User`
    Role.belongsToMany(models.User, {
      through: "user_roles",
      foreignKey: "role_id",
      otherKey: "user_id",
      as: "users",
      timestamps: false,
    });
  };

  return Role;
};
