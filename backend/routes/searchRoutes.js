const express = require('express');
const router = express.Router();
const { searchGrievances } = require('../controllers/searchController');

router.get('/', searchGrievances);

module.exports = router;