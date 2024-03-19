const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const userAuth = require('../middleware/auth')

const router = express.Router();

// router.post('/expense/add-expense', userAuth.authenticate, expenseController.addExpense);

router.get('/expense/files',userAuth.authenticate ,expenseController.getFiles);

// router.delete('/expense/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;