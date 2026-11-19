const express = require('express');
const db = require('../config/database');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();
const pages = new Set([
  'home',
  'about',
  'services',
  'contact',
  'login',
  'register',
  'navbar',
  'footer',
  'gallery',
  'admissions'
]);

router.use(requireAdmin);

router.get('/overview', async (req, res) => {
  try {
    const [[admissions], [users]] = await Promise.all([
      db.execute(
        `SELECT id, applicant_name, email, phone, gender, religion, course,
          study_level, village, district, sector, province, parent_names, parent_phone, status,
          registration_fee, payment_status, application_date
         FROM admissions ORDER BY application_date DESC`
      ),
      db.execute(
        `SELECT id, full_name, email, role, is_active, created_at
         FROM users ORDER BY created_at DESC`
      )
    ]);

    return res.json({
      admissions,
      users,
      adminEmail: process.env.ADMIN_EMAIL.trim().toLowerCase()
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return res.status(500).json({
      message: 'Admin information could not be loaded. Check database migrations.'
    });
  }
});

router.get('/contacts', async (req, res) => {
  try {
    const [messages] = await db.execute(
      `SELECT id, name, email, subject, message, created_at
       FROM contact_messages ORDER BY created_at DESC LIMIT 100`
    );
    return res.json(messages);
  } catch (error) {
    console.error('Admin contact messages error:', error);
    return res.status(500).json({
      message: 'Contact messages could not be loaded. Check database migrations.'
    });
  }
});

router.patch('/admissions/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { status, paymentStatus } = req.body;

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ message: 'Invalid application ID.' });
  }

  if (
    (status !== undefined && !['pending', 'approved', 'rejected'].includes(status)) ||
    (paymentStatus !== undefined && !['unpaid', 'confirmed'].includes(paymentStatus)) ||
    (status === undefined && paymentStatus === undefined)
  ) {
    return res.status(400).json({ message: 'Invalid application update.' });
  }

  try {
    const updates = [];
    const values = [];
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (paymentStatus !== undefined) {
      updates.push('payment_status = ?');
      values.push(paymentStatus);
    }
    values.push(id);

    const [result] = await db.execute(
      `UPDATE admissions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (!result.affectedRows) {
      const [rows] = await db.execute(
        'SELECT id FROM admissions WHERE id = ?',
        [id]
      );
      if (!rows.length) {
        return res.status(404).json({ message: 'Application not found.' });
      }
    }

    return res.json({ message: 'Application updated.' });
  } catch (error) {
    console.error('Admin application update error:', error);
    return res.status(500).json({ message: 'Application could not be updated.' });
  }
});

router.patch('/users/:id/active', async (req, res) => {
  const id = Number(req.params.id);
  const { isActive } = req.body;

  if (!Number.isSafeInteger(id) || id < 1 || typeof isActive !== 'boolean') {
    return res.status(400).json({ message: 'Invalid account update.' });
  }

  try {
    const [users] = await db.execute(
      'SELECT email FROM users WHERE id = ?',
      [id]
    );

    if (!users.length) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    if (users[0].email.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase()) {
      return res.status(403).json({ message: 'The administrator account cannot be disabled here.' });
    }

    await db.execute(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [isActive ? 1 : 0, id]
    );

    return res.json({ message: 'Account updated.' });
  } catch (error) {
    console.error('Admin account update error:', error);
    return res.status(500).json({ message: 'Account could not be updated.' });
  }
});

router.get('/content', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT page, language, content_key, content_value FROM site_content'
    );
    return res.json(rows);
  } catch (error) {
    console.error('Admin content load error:', error);
    return res.status(500).json({ message: 'Content could not be loaded.' });
  }
});

router.put('/content', async (req, res) => {
  const { page, language, content } = req.body;

  if (
    !pages.has(page) ||
    !['en', 'rw'].includes(language) ||
    !content ||
    typeof content !== 'object' ||
    Array.isArray(content)
  ) {
    return res.status(400).json({ message: 'Invalid page content.' });
  }

  const entries = Object.entries(content);
  if (entries.length > 100 || entries.some(([key, value]) =>
    !/^[a-zA-Z0-9_]{1,80}$/.test(key) ||
    !(typeof value === 'string' || (Array.isArray(value) && value.every(item => typeof item === 'string'))) ||
    JSON.stringify(value).length > 5000
  )) {
    return res.status(400).json({ message: 'Some content fields are invalid or too long.' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const [key, value] of entries) {
      await connection.execute(
        `INSERT INTO site_content (page, language, content_key, content_value)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)`,
        [page, language, key, JSON.stringify(value)]
      );
    }
    await connection.commit();
    return res.json({ message: 'Website text saved.' });
  } catch (error) {
    await connection.rollback();
    console.error('Admin content save error:', error);
    return res.status(500).json({ message: 'Website text could not be saved.' });
  } finally {
    connection.release();
  }
});

router.delete('/content/:page/:language', async (req, res) => {
  const { page, language } = req.params;
  if (!pages.has(page) || !['en', 'rw'].includes(language)) {
    return res.status(400).json({ message: 'Invalid page or language.' });
  }

  try {
    await db.execute(
      'DELETE FROM site_content WHERE page = ? AND language = ?',
      [page, language]
    );
    return res.json({ message: 'Default website text restored.' });
  } catch (error) {
    console.error('Admin content reset error:', error);
    return res.status(500).json({ message: 'Website text could not be restored.' });
  }
});

module.exports = router;
