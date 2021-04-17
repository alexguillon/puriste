const express = require('express');
const router = express.Router();
const quizzController = require('../controllers/quizzController');

router.get('/ask', quizzController.question);
router.post('/answer', quizzController.answer);
router.post('/start', quizzController.start);

module.exports = router; 