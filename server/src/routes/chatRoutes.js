const express = require('express');
const router = express.Router();
const { createConversation, getConversations, addMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All chat routes are protected

router.route('/conversation')
  .post(createConversation)
  .get(getConversations);

router.route('/message')
  .post(addMessage);

router.route('/:conversationId/messages')
  .get(getMessages);

module.exports = router;
