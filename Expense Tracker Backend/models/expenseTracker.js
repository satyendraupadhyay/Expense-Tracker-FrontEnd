const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const expense = sequelize.define('expenseTracker', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING

      },
      email: {
        type: Sequelize.STRING

      },
      password: {
        type: Sequelize.STRING,
        // allowNull: false
      }
      
});

module.exports = expense;