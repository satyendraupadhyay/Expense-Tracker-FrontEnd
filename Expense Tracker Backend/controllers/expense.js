const expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database')

exports.addExpense = async (req, res, next) => {
    try {
        const t = await sequelize.transaction(); // Await the transaction initialization
        const { amount, description, category } = req.body;

        try {
            const createdExpense = await expense.create({
                amount: amount,
                description: description,
                category: category,
                userId: req.user.id,
            }, {
                transaction: t
            });

            const totalExpense = Number(req.user.totalExpenses) + Number(amount);

            await User.update({
                totalExpenses: totalExpense
            }, {
                where: { id: req.user.id },
                transaction: t
            });

            await t.commit(); // Commit the transaction if everything is successful
            res.status(201).json({ newExpenseDetail: createdExpense });
        } catch (err) {
            console.error(err);
            await t.rollback(); // Rollback the transaction in case of an error
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    } catch (transactionError) {
        console.error(transactionError);
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
    const t = await sequelize.transaction();
    const expenseid = req.params.id;
    console.log('See here >>>>>>>>>>>>>>>>>>>>', expenseid);
    console.log(req.user.id);
    
    if (expenseid == undefined || expenseid === 0) {
        return res.status(400).json({success: false});
    }

    try {
        await expense.destroy({ where: { id: expenseid, userId: req.user.id } }, {transaction: t});

        const totalExpense = Number(req.user.totalExpenses) - Number(amount);

        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        });

        await t.commit();
        res.sendStatus(200);
    } catch (err) {
            console.error(err);
            await t.rollback(); // Rollback the transaction in case of an error
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    
};
