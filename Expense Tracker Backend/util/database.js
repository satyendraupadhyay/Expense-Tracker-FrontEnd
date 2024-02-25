const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses', 'root', 'seekersu', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;