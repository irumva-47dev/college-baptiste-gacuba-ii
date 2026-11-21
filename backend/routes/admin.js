const express = require('express');
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/database');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();
const pages = new Set([
  'home', 'about', 'services', 'contact', 'login', 'register',
  'navbar', 'footer', 'gallery', 'admissions'
]);

router.use(requireAdmin);

function withStringId(document) {
  if (!document) return document;
  return { ...document, id: document._id.toString() };
}

router.get('/overview', async (req, res) => {
  try {
    const database = getDatabase();
    const [admissions, users] = await Promise.all([
      database.collection('admissions').find().sort({ application_date: -1 }).toArray(),
      database.collection('users')
        .find({}, { projection: { password: 0 } })
        .sort({ created_at: -1 })
        .toArray()
    ]);

    return res.json({
      admissions: admissions.map(withStringId),
      users: users.map(withStringId),
      adminEmail: process.env.ADMIN_EMAIL.trim().toLowerCase()
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return res.status(500).json({ message: 'Admin information could not be loaded.' });
  }
});

router.get('/contacts', async (req, res) => {
  try {
    const messages = await getDatabase().collection('contact_messages')
      .find().sort({ created_at: -1 }).limit(100).toArray();
    return res.json(messages.map(withStringId));
  } catch (error) {
    console.error('Admin contact messages error:', error);
    return res.status(500).json({ message: 'Contact messages could not be loaded.' });
  }
});

router.patch('/admissions/:id', async (req, res) => {
  const { status, paymentStatus } = req.body;
  if (
    (status !== undefined && !['pending', 'approved', 'rejected'].includes(status)) ||
    (paymentStatus !== undefined && !['unpaid', 'confirmed'].includes(paymentStatus)) ||
    (status === undefined && paymentStatus === undefined)
  ) {
    return res.status(400).json({ message: 'Invalid application update.' });
  }

  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (paymentStatus !== undefined) updates.payment_status = paymentStatus;
    const result = await getDatabase().collection('admissions').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );
    if (!result.matchedCount) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    return res.json({ message: 'Application updated.' });
  } catch (error) {
    console.error('Admin application update error:', error);
    return res.status(500).json({ message: 'Application could not be updated.' });
  }
});

router.patch('/users/:id/active', async (req, res) => {
  const { isActive } = req.body;
  if (!ObjectId.isValid(req.params.id) || typeof isActive !== 'boolean') {
    return res.status(400).json({ message: 'Invalid account update.' });
  }

  try {
    const users = getDatabase().collection('users');
    const user = await users.findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ message: 'Account not found.' });
    if (user.email.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase()) {
      return res.status(403).json({ message: 'The administrator account cannot be disabled here.' });
    }
    await users.updateOne(
      { _id: user._id },
      { $set: { is_active: isActive } }
    );
    return res.json({ message: 'Account updated.' });
  } catch (error) {
    console.error('Admin account update error:', error);
    return res.status(500).json({ message: 'Account could not be updated.' });
  }
});

router.delete('/data', async (req, res) => {
  try {
    const database = getDatabase();
    const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const [admissions, messages, users] = await Promise.all([
      database.collection('admissions').deleteMany({}),
      database.collection('contact_messages').deleteMany({}),
      database.collection('users').deleteMany({ email: { $ne: adminEmail } })
    ]);
    const visits = await database.collection('page_visits').deleteMany({});
    return res.json({
      message: 'All operational data has been deleted.',
      deleted: {
        admissions: admissions.deletedCount,
        contactMessages: messages.deletedCount,
        users: users.deletedCount,
        pageVisits: visits.deletedCount
      }
    });
  } catch (error) {
    console.error('Admin data deletion error:', error);
    return res.status(500).json({ message: 'Data could not be deleted.' });
  }
});

router.get('/content', async (req, res) => {
  try {
    const rows = await getDatabase().collection('site_content').find().toArray();
    return res.json(rows.map(row => ({
      page: row.page,
      language: row.language,
      content_key: row.content_key,
      content_value: row.content_value
    })));
  } catch (error) {
    console.error('Admin content load error:', error);
    return res.status(500).json({ message: 'Content could not be loaded.' });
  }
});

router.put('/content', async (req, res) => {
  const { page, language, content } = req.body;
  if (!pages.has(page) || !['en', 'rw'].includes(language) ||
      !content || typeof content !== 'object' || Array.isArray(content)) {
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

  try {
    const collection = getDatabase().collection('site_content');
    for (const [key, value] of entries) {
      await collection.updateOne(
        { page, language, content_key: key },
        { $set: { page, language, content_key: key, content_value: JSON.stringify(value), updated_at: new Date() } },
        { upsert: true }
      );
    }
    return res.json({ message: 'Website text saved.' });
  } catch (error) {
    console.error('Admin content save error:', error);
    return res.status(500).json({ message: 'Website text could not be saved.' });
  }
});

router.delete('/content/:page/:language', async (req, res) => {
  const { page, language } = req.params;
  if (!pages.has(page) || !['en', 'rw'].includes(language)) {
    return res.status(400).json({ message: 'Invalid page or language.' });
  }
  try {
    await getDatabase().collection('site_content').deleteMany({ page, language });
    return res.json({ message: 'Default website text restored.' });
  } catch (error) {
    console.error('Admin content reset error:', error);
    return res.status(500).json({ message: 'Website text could not be restored.' });
  }
});

module.exports = router;
