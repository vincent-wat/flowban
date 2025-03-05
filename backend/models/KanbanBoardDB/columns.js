const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Board = require('./boards'); // Adjust the path as necessary

const Column = sequelize.define('Column', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Board,
            key: 'id'
        }
    }
}, {
    tableName: 'columns',
    timestamps: false
});
// Sync the model with the database
// not sure if neccessary
// (async () => {
//     await sequelize.sync({ force: false }); // Set `force: true` to drop and recreate tables
//     console.log("Database synced");
//   })();

module.exports = Column;