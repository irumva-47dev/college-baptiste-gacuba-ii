require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const bcrypt = require('bcryptjs');
const { connectDatabase, closeDatabase } = require('../config/database');

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL
    ? process.env.ADMIN_EMAIL.trim().toLowerCase()
    : '';
  const adminName = process.env.ADMIN_NAME
    ? process.env.ADMIN_NAME.trim()
    : 'College Baptiste Gacuba II Admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '';

  if (!adminEmail || adminPassword.length < 8) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD with at least 8 characters.');
  }

  await connectDatabase();
  const { getDatabase } = require('../config/database');
  const database = getDatabase();
  const users = database.collection('users');

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const result = await users.updateOne(
    { email: adminEmail },
    {
      $set: {
        full_name: adminName,
        email: adminEmail,
        phone: '',
        password: passwordHash,
        role: 'admin',
        is_active: true,
        updated_at: new Date()
      },
      $setOnInsert: { created_at: new Date() }
    },
    { upsert: true }
  );

  await Promise.all([
    database.collection('admissions').createIndex({ application_date: -1 }),
    database.collection('contact').createIndex({ created_at: -1 }),
    database.collection('contact_messages').createIndex({ created_at: -1 }),
    database.collection('gallery').createIndex({ created_at: -1 }),
    database.collection('login').createIndex({ created_at: -1 }),
    database.collection('services').createIndex({ created_at: -1 }),
    users.createIndex({ email: 1 }, { unique: true })
  ]);

  console.log(result.upsertedCount
    ? 'Admin account created in MongoDB.'
    : 'Admin account updated in MongoDB.');
}

seed()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(closeDatabase);
