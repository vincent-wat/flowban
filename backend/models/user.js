"use strict";

module.exports = (sequelize, DataTypes) => {
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
    organization_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'organizations',
        key: 'id'
      },
      allowNull: true,
    },    
  }, {
    tableName: "users",
    timestamps: true,
    underscored: true,
  });

  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      through: "user_roles",
      foreignKey: "user_id",
      otherKey: "role_id",
      as: "roles",
      timestamps: false,
    });
    User.belongsTo(models.Organization, {
    foreignKey: 'organization_id'
    });
  };
  
  

  return User;
};
