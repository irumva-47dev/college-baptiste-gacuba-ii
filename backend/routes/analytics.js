const express = require('express');
const { getDatabase } = require('../config/database');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.post('/visit', async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const sessionId = typeof body.sessionId === 'string'
    ? body.sessionId.trim().slice(0, 100)
    : '';
  const path = typeof body.path === 'string'
    ? body.path.trim().slice(0, 500)
    : '';

  if (!sessionId || !path || !path.startsWith('/')) {
    return res.status(400).json({ message: 'Invalid visit data.' });
  }

  try {
    await getDatabase().collection('page_visits').insertOne({
      session_id: sessionId,
      path,
      name: typeof body.name === 'string' ? body.name.slice(0, 100) : path,
      referrer: typeof body.referrer === 'string'
        ? body.referrer.slice(0, 500)
        : '',
      visited_at: new Date()
    });
    return res.status(201).json({ message: 'Visit recorded.' });
  } catch (error) {
    console.error('Page visit save error:', error);
    return res.status(500).json({ message: 'Visit could not be recorded.' });
  }
});

router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const visits = getDatabase().collection('page_visits');
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);

    const [total, today, week, sessions, byPath, recent] = await Promise.all([
      visits.countDocuments({}),
      visits.countDocuments({ visited_at: { $gte: todayStart } }),
      visits.countDocuments({ visited_at: { $gte: weekStart } }),
      visits.distinct('session_id'),
      visits.aggregate([
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]).toArray(),
      visits.find().sort({ visited_at: -1 }).limit(100).toArray()
    ]);

    return res.json({
      total,
      today,
      week,
      uniqueSessions: sessions.length,
      byPath: byPath.map(item => ({ path: item._id, count: item.count })),
      recent: recent.map(item => ({
        id: item._id.toString(),
        path: item.path,
        name: item.name,
        referrer: item.referrer,
        visited_at: item.visited_at
      }))
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return res.status(500).json({ message: 'Visit statistics could not be loaded.' });
  }
});

module.exports = router;
