const express = require('express');
const router = express.Router();
const { getMapMarkers, getAreaStats } = require('../controllers/mapController');

router.get('/markers', getMapMarkers);
router.get('/stats', getAreaStats);

module.exports = router;