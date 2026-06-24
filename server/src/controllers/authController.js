const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret-123', {
    expiresIn: '30d',
  });
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Decode the Google JWT
    const decoded = jwt.decode(credential);
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid Google credential' });
    }

    const { sub: googleId, email, name, picture } = decoded;

    // Check if user exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create new user
      user = await User.create({
        googleId,
        email,
        name,
        picture,
        role: 'user'
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = {
  googleLogin
};
