const { DataTypes } = require("sequelize");
const sequelize = require("../database"); 

const Board = sequelize.define("Board", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'boards'
});

// Sync the model with the database
// not sure if neccessary
// (async () => {
//     await sequelize.sync({ force: false }); // Set `force: true` to drop and recreate tables
//     console.log("Database synced");
//   })();

module.exports = Board;