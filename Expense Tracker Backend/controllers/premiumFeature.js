const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
    try {
        const expenses = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        });

        console.log(expenses);
        res.status(200).json(expenses);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard
}
