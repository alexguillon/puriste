const express = require('express');
const router = express.Router();
const quizzController = require('../controllers/quizzController');

router.get('/', quizzController.newQuizz);

module.exports = router; 