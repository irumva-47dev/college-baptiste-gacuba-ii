
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const databaseName = process.env.MONGODB_DB_NAME || 'colleg_baptiste_gacuba';

const client = new MongoClient(uri);
let database;

async function connectDatabase() {
  if (!database) {
    await client.connect();
    database = client.db(databaseName);
    await Promise.all([
      database.collection('users').createIndex({ email: 1 }, { unique: true }),
      database.collection('admissions').createIndex({ application_date: -1 }),
      database.collection('contact_messages').createIndex({ created_at: -1 }),
      database.collection('page_visits').createIndex({ visited_at: -1 }),
      database.collection('page_visits').createIndex({ session_id: 1, visited_at: -1 }),
      database.collection('page_visits').createIndex({ path: 1, visited_at: -1 }),
      database.collection('site_content').createIndex(
        { page: 1, language: 1, content_key: 1 },
        { unique: true }
      )
    ]);
  }
  return database;
}

async function closeDatabase() {
  await client.close();
  database = undefined;
}

function getDatabase() {
  if (!database) {
    throw new Error('MongoDB is not connected.');
  }
  return database;
}

module.exports = { connectDatabase, closeDatabase, getDatabase };
