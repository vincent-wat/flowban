const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Columns = require('./columns');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    column_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Columns,
            key: 'id'
        },
        allowNull: false
    }
}, {
    tableName: 'tasks',
    timestamps: false
}
);
// Sync the model with the database
// not sure if neccessary
// (async () => {
//     await sequelize.sync({ force: false }); // Set `force: true` to drop and recreate tables
//     console.log("Database synced");
//   })();

module.exports = Task;