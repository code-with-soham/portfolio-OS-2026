const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: 1 }); // Oldest to newest
      
    res.json({ success: true, messages });
  } catch (err) {
    console.error('Get Messages Error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching messages.' });
  }
};

module.exports = {
  getMessages
};
