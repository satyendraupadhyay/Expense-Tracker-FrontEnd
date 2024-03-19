const expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
const S3Services = require('../services/s3services');
const Files = require('../models/files');

exports.downloadexpense = async (req, res) => {
    try {
        const expenses = await expense.findAll({ where: { userId: req.user.id } });
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);

        const userId = req.user.id

        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
        console.log(fileURL);
        const files = await Files.create({
            fileURL,
            userId
        })
        res.status(200).json({ fileURL,showFiles: files ,success: true })
    } catch (err) {
        console.log(err);
        res.status(500).json({fileURL: '', success: false, err: err})
    }

}

exports.getFiles = async (req, res) => {
    
    try {
        const files = await Files.findAll({ where: { userId: req.user.id } });
        res.json(files);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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
    const page = +req.query.page || 1;
    let totalItems;
    const limit = parseInt(req.query.limit);

    try {
        // Count total items before fetching the data
        totalItems = await expense.count({ where: { userId: req.user.id } });

        const expenses = await expense.findAll({ 
            where: { 
                userId: req.user.id,
            },
            offset: (page - 1) * limit,
            limit
        });

        res.json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: limit * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / limit),
            limit
        });
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
        return res.status(400).json({ success: false });
    }

    try {
        await expense.destroy({ where: { id: expenseid, userId: req.user.id } }, { transaction: t });

        const totalExpense = Number(req.user.totalExpenses) - Number(expense.amount);

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
