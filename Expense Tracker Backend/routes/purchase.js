const path = require('path');

const express = require('express');

const purchaseController = require('../controllers/purchase');

const authMiddleware = require('../middleware/auth')

const router = express.Router();

router.get('/purchase/premiummembership', authMiddleware.authenticate, purchaseController.purchasepremium);

router.post('/purchase/updatetransactionstatus', authMiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;