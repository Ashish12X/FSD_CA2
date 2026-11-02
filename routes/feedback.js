const express = require('express');
const {
  createFeedback,
  getFeedbacks,
  updateFeedbackStatus
} = require('../controllers/feedbackController');

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getFeedbacks);
router.patch('/:id', updateFeedbackStatus);

module.exports = router;