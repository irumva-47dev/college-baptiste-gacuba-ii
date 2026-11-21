
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');

const router = express.Router();

// POST /api/login
router.post('/', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';
    const { password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    // Find user in database
    const user = await getDatabase().collection('users').findOne({ email });

    if (!user || !user.is_active) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }


    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('Login error: JWT_SECRET is not configured.');
      return res.status(503).json({ message: 'Login is not configured on the server.' });
    }

    const configuredAdminEmail = process.env.ADMIN_EMAIL
      ? process.env.ADMIN_EMAIL.trim().toLowerCase()
      : '';
    const role = configuredAdminEmail && user.email.toLowerCase() === configuredAdminEmail
      ? 'admin'
      : (user.role === 'admin' ? 'student' : user.role);

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response without password
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id.toString(),
        full_name: user.full_name,
        email: user.email,
        role
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'Server error during login.'
    });
  }
});

module.exports = router;
