const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try {
        const expenses = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpenses']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['totalExpenses', 'DESC']] // Add proper ordering based on the totalExpenses column
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
