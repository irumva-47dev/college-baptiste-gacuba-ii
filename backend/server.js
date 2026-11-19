
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const contactRoutes = require('./routes/contact');
const admissionsRoutes = require('./routes/admissions');
const adminRoutes = require('./routes/admin');
const contentRoutes = require('./routes/content');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json());

// Login API
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

// Test API
app.get('/', (req, res) => {
  res.json({
    message: 'College Baptiste Gacuba II Backend is running.'
  });
});

// Connect to MySQL before starting server
async function startServer() {
  try {
    const connection = await db.getConnection();

    console.log('MySQL connected successfully!');

    connection.release();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    
  }
}

startServer();
