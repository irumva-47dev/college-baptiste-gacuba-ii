const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const router = express.Router();

router.post('/', async (req, res) => {
  const fullName = typeof req.body.fullname === 'string'
    ? req.body.fullname.trim()
    : '';
  const email = typeof req.body.email === 'string'
    ? req.body.email.trim().toLowerCase()
    : '';
  const phone = typeof req.body.phone === 'string'
    ? req.body.phone.trim()
    : '';
  const password = typeof req.body.password === 'string'
    ? req.body.password
    : '';

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({
      message: 'Amazina, imeyili, telefoni n’ijambo ry’ibanga birakenewe.'
    });
  }

  if (fullName.length > 150 || email.length > 150 || phone.length > 30) {
    return res.status(400).json({
      message: 'Hari amakuru arenze umubare wemerewe w’inyuguti.'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Ijambo ry’ibanga rigomba kugira nibura inyuguti 6.'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)',
      [fullName, email, phone, passwordHash]
    );

    return res.status(201).json({
      message: 'Konti yafunguwe neza.',
      user: {
        id: result.insertId,
        full_name: fullName,
        email,
        phone
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Iyi meyili isanzwe ifite konti.'
      });
    }

    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Kwiyandikisha ntibyakunze. Ongera ugerageze.'
    });
  }
});

module.exports = router;
