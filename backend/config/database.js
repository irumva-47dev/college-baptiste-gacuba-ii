
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { MongoClient } = require('mongodb');

let client;
let database;

async function connectDatabase() {
  if (database) {
    return database;
  }

  const uri = process.env.MONGODB_URI?.trim();
  const databaseName = process.env.MONGODB_DB_NAME?.trim();

  if (!uri) {
    throw new Error('MONGODB_URI must be configured before starting the API.');
  }
  if (!databaseName) {
    throw new Error('MONGODB_DB_NAME must be configured before starting the API.');
  }

  const nextClient = new MongoClient(uri);

  try {
    await nextClient.connect();
    const nextDatabase = nextClient.db(databaseName);
    await Promise.all([
      nextDatabase.collection('users').createIndex({ email: 1 }, { unique: true }),
      nextDatabase.collection('admissions').createIndex({ application_date: -1 }),
      nextDatabase.collection('contact_messages').createIndex({ created_at: -1 }),
      nextDatabase.collection('page_visits').createIndex({ visited_at: -1 }),
      nextDatabase.collection('page_visits').createIndex({ session_id: 1, visited_at: -1 }),
      nextDatabase.collection('page_visits').createIndex({ path: 1, visited_at: -1 }),
      nextDatabase.collection('site_content').createIndex(
        { page: 1, language: 1, content_key: 1 },
        { unique: true }
      )
    ]);
    client = nextClient;
    database = nextDatabase;
    return database;
  } catch (error) {
    await nextClient.close();
    throw error;
  }
}

async function closeDatabase() {
  if (client) {
    await client.close();
  }
  client = undefined;
  database = undefined;
}

function getDatabase() {
  if (!database) {
    throw new Error('MongoDB is not connected.');
  }
  return database;
}

module.exports = { connectDatabase, closeDatabase, getDatabase };
