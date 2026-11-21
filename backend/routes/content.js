const express = require('express');
const { getDatabase } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await getDatabase().collection('site_content').find().toArray();
    const content = {};

    for (const row of rows) {
      content[row.page] ||= {};
      content[row.page][row.language] ||= {};

      try {
        content[row.page][row.language][row.content_key] =
          JSON.parse(row.content_value);
      } catch {
        content[row.page][row.language][row.content_key] = row.content_value;
      }
    }

    return res.json(content);
  } catch (error) {
    console.error('Site content load error:', error);
    return res.status(500).json({
      message: 'Website content could not be loaded.'
    });
  }
});

module.exports = router;
