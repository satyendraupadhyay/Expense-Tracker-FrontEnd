const expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {

    const { amount, description, category } = req.body;

    const data = await expense.create({amount: amount, description: description, category: category, userId: req.user.id});
    res.status(201).json({ newExpenseDetail: data });

}

exports.getExpense = async (req, res, next) => {
    console.log('See here >>>', req.user.id);
    try {
        const expenses = await expense.findAll({ where : { userId: req.user.id } });
        res.json(expenses);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.deleteExpense =  async (req, res) => {
    const uId = req.params.id;
    await expense.destroy({where: {id: uId}});
    res.sendStatus(200);
}