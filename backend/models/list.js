const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Task = require('./Task'); 

const List = sequelize.define('List', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

List.hasMany(Task, { foreignKey: 'listId', onDelete: 'CASCADE' });
Task.belongsTo(List, { foreignKey: 'listId' });

module.exports = List;