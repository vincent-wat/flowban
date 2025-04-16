module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define('Organization', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    });
  
    Organization.associate = (models) => {
      Organization.hasMany(models.User, {
        foreignKey: 'organization_id'
      });
    };
  
    return Organization;
  };
  