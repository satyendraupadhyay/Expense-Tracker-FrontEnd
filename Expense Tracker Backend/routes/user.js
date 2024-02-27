const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/user/signup', userController.signup);

router.get('/user/get-signup', userController.getSignup);

router.post('/user/login', userController.login);

module.exports = router;