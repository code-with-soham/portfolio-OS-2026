const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /api/auth/login - Login or register using name and email
router.post('/login', login);

module.exports = router;
