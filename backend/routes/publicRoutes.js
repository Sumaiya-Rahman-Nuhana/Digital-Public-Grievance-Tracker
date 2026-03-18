const express = require('express');
const router = express.Router();
const { getPublicFeed } = require('../controllers/publicController');

router.get('/feed', getPublicFeed);

module.exports = router;