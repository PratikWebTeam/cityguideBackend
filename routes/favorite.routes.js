const express = require('express');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favorite.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, addFavorite);
router.get('/', authMiddleware, getFavorites);
router.delete('/:id', authMiddleware, removeFavorite);

module.exports = router;