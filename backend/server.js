
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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://college-baptiste-gacuba-ii.vercel.app',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

// API Routes
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

// Start server
async function startServer() {
  try {
    await connectDatabase();
    console.log('MongoDB connected successfully!');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

startServer();
