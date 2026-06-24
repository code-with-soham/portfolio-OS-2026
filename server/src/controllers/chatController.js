const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      userId: req.user.id,
      title: title || 'New Conversation'
    });
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error creating conversation' });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

const addMessage = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;
    const message = await Message.create({
      conversationId,
      role,
      content
    });
    
    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error adding message' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

module.exports = {
  createConversation,
  getConversations,
  addMessage,
  getMessages
};
