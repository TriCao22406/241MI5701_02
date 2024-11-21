const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

// GET: Lấy tất cả các products
router.get('/', collectionController.getAllCollections);

module.exports = router;
