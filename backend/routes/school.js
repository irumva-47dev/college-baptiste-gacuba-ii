const express = require('express');
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/database');
const requireAdmin = require('../middleware/requireAdmin');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

const publicCollections = {
  announcements: 'announcements',
  calendar: 'school_calendar',
  teachers: 'teachers',
  parents: 'parent_information'
};

router.get('/results/me', requireAuth, async (req, res) => {
  try {
    const results = await getDatabase().collection('results')
      .find({ student_email: req.user.email.toLowerCase() })
      .sort({ term: -1, subject: 1 })
      .toArray();
    return res.json(results.map(item => ({ ...item, id: item._id.toString() })));
  } catch (error) {
    console.error('Student results load error:', error);
    return res.status(500).json({ message: 'Results could not be loaded.' });
  }
});

router.get('/:type', async (req, res) => {
  const collectionName = publicCollections[req.params.type];
  if (!collectionName) {
    return res.status(404).json({ message: 'Unknown school data type.' });
  }
  try {
    const items = await getDatabase().collection(collectionName)
      .find()
      .sort({ date: -1, created_at: -1 })
      .limit(200)
      .toArray();
    return res.json(items.map(item => ({ ...item, id: item._id.toString() })));
  } catch (error) {
    console.error('School data load error:', error);
    return res.status(500).json({ message: 'School information could not be loaded.' });
  }
});

router.post('/admin/:type', requireAdmin, async (req, res) => {
  const collectionName = publicCollections[req.params.type];
  if (!collectionName) {
    return res.status(404).json({ message: 'Unknown school data type.' });
  }
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }
  try {
    const result = await getDatabase().collection(collectionName).insertOne({
      ...body,
      title,
      created_at: new Date()
    });
    return res.status(201).json({ id: result.insertedId.toString(), message: 'Information saved.' });
  } catch (error) {
    console.error('School data save error:', error);
    return res.status(500).json({ message: 'Information could not be saved.' });
  }
});

router.delete('/admin/:type/:id', requireAdmin, async (req, res) => {
  const collectionName = publicCollections[req.params.type];
  if (!collectionName || !ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid delete request.' });
  }
  try {
    const result = await getDatabase().collection(collectionName)
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) {
      return res.status(404).json({ message: 'Information not found.' });
    }
    return res.json({ message: 'Information deleted.' });
  } catch (error) {
    console.error('School data delete error:', error);
    return res.status(500).json({ message: 'Information could not be deleted.' });
  }
});

router.post('/admin/results/import', requireAdmin, async (req, res) => {
  const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
  const validRows = rows.map(row => ({
    student_email: typeof row.student_email === 'string' ? row.student_email.trim().toLowerCase() : '',
    student_name: typeof row.student_name === 'string' ? row.student_name.trim() : '',
    term: typeof row.term === 'string' ? row.term.trim() : '',
    subject: typeof row.subject === 'string' ? row.subject.trim() : '',
    score: Number(row.score),
    grade: typeof row.grade === 'string' ? row.grade.trim() : '',
    created_at: new Date()
  })).filter(row =>
    row.student_email &&
    row.term &&
    row.subject &&
    Number.isFinite(row.score)
  );

  if (!validRows.length) {
    return res.status(400).json({ message: 'No valid result rows found.' });
  }

  try {
    const collection = getDatabase().collection('results');
    for (const row of validRows) {
      await collection.updateOne(
        { student_email: row.student_email, term: row.term, subject: row.subject },
        { $set: row },
        { upsert: true }
      );
    }
    return res.json({ message: `${validRows.length} result(s) imported.`, imported: validRows.length });
  } catch (error) {
    console.error('Results import error:', error);
    return res.status(500).json({ message: 'Results could not be imported.' });
  }
});

module.exports = router;
