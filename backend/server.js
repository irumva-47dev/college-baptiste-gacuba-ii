
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./config/database');

const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const contactRoutes = require('./routes/contact');
const admissionsRoutes = require('./routes/admissions');
const adminRoutes = require('./routes/admin');
const contentRoutes = require('./routes/content');
const analyticsRoutes = require('./routes/analytics');
const schoolRoutes = require('./routes/school');

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
app.use('/api/analytics', analyticsRoutes);
app.use('/api/school-data', schoolRoutes);
app.use('/api/admin', adminRoutes);

// Test API
app.get('/', (req, res) => {
  res.json({
    message: 'College Baptiste Gacuba II Backend is running.'
  });
});

// Connect to MongoDB before starting server
async function startServer() {
  try {
    await connectDatabase();
    console.log('MongoDB connected successfully!');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exitCode = 1;
  }
}

startServer();
