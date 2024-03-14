const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const authMiddleware = require('../middleware/auth');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/user/signup', userController.signup);

router.get('/user/get-signup', userController.getSignup);

router.post('/user/login', userController.login);

router.get('/user/download', authMiddleware.authenticate, expenseController.downloadexpense);

module.exports = router;