const express = require('express');
const { getCities } = require('../controllers/city.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, getCities);

module.exports = router;