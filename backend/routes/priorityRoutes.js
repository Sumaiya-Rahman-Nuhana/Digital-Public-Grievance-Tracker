const express = require('express');
const router = express.Router();
const { getPriorityAreas } = require('../controllers/priorityController');

router.get('/areas', getPriorityAreas);

module.exports = router;