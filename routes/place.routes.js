const express = require('express');
const { getPlaces, getPlaceById, searchPlaces } = require('../controllers/place.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, getPlaces);
router.get('/search', authMiddleware, searchPlaces);
router.get('/:id', authMiddleware, getPlaceById);

module.exports = router;