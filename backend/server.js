require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------- ROUTES -------------------
const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const authorRoutes = require('./routes/authorRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/upload', uploadRoutes);

// ------------------- HEALTH CHECK -------------------
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', db: 'connected', message: 'Backend is running!' });
  } catch (error) {
    console.error('❌ DB health check failed:', error.message);
    res.status(503).json({ status: 'DEGRADED', db: 'disconnected', message: error.message });
  }
});

// ------------------- ROOT -------------------
app.get('/', (req, res) => {
  res.json({ message: 'StoryTeller API is running!' });
});

// ------------------- ERROR HANDLING -------------------
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ------------------- START SERVER -------------------
async function start() {
  let dbConnected = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
      console.log('✅ Database connected successfully');
      break;
    } catch (error) {
      console.error(`⚠️ DB connection attempt ${attempt}/3 failed: ${error.message}`);
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 Stories: http://localhost:${PORT}/api/stories`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
    if (!dbConnected) {
      console.log('⚠️ WARNING: Database NOT connected. Stories will fail to load.');
      console.log('   The Railway MySQL may be asleep. Try again in ~30 seconds.');
    }
  });
}

start();