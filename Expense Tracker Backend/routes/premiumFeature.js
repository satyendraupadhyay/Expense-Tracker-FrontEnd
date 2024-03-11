const path = require('path');

const express = require('express');

const premiumController = require('../controllers/premiumFeature');

const authMiddleware = require('../middleware/auth')

const router = express.Router();

router.get('/premium/showleaderboard', premiumController.getUserLeaderBoard);

module.exports = router;