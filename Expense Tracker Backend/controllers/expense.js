const expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {

    const { amount, description, category } = req.body;

    const data = await expense.create({amount: amount, description: description, category: category});
    res.status(201).json({ newExpenseDetail: data });

}

exports.getExpense = async (req, res, next) => {
    try {
        const expenses = await expense.findAll();
        res.json(expenses);

    } catch (err) {
        console.log(err);
    }
}

exports.deleteExpense =  async (req, res) => {
    const uId = req.params.id;
    await expense.destroy({where: {id: uId}});
    res.sendStatus(200);
}