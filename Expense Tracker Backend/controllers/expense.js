const expense = require('../models/expense');
const User = require('../models/user');

exports.addExpense = async (req, res, next) => {
    const { amount, description, category } = req.body;

    try {
        const createdExpense = await expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        });

        const totalExpense = Number(req.user.totalExpenses) + Number(amount);

        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id }
        });

        res.status(201).json({ newExpenseDetail: createdExpense });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.getExpense = async (req, res, next) => {
    console.log('See here >>>', req.user.id);
    try {
        const expenses = await expense.findAll({ where: { userId: req.user.id } });
        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const uId = req.params.id;
    await expense.destroy({ where: { id: uId } });
    res.sendStatus(200);
};
