const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret-123', {
    expiresIn: '30d',
  });
};

const login = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user
      user = await User.create({
        email: normalizedEmail,
        name: name.trim(),
        role: 'user'
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = {
  login
};
