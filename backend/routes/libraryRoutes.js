const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

const verifyToken = async (req, res, next) => {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Authentication is required.' });
  }

  try {
    const decoded = jwt.verify(match[1], JWT_SECRET);
    const userId = parsePositiveInteger(decoded.id);

    if (!userId || typeof decoded.email !== 'string') {
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    // Checking both ID and email prevents a token from a pre-reset database
    // from being accepted if that numeric ID is later assigned to another user.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user || user.email !== decoded.email) {
      return res.status(401).json({ error: 'Your session is no longer valid. Please log in again.' });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Your session is invalid or has expired. Please log in again.' });
  }
};

const getStoryId = (value, res) => {
  const storyId = parsePositiveInteger(value);
  if (!storyId) {
    res.status(400).json({ error: 'storyId must be a positive integer.' });
    return null;
  }
  return storyId;
};

router.post('/', verifyToken, async (req, res) => {
  const storyId = getStoryId(req.body?.storyId, res);
  if (!storyId) return;

  try {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found.' });
    }

    const existing = await prisma.savedStory.findFirst({
      where: { userId: req.userId, storyId },
      select: { id: true },
    });

    if (existing) {
      return res.json({ message: 'Already saved.', saved: true });
    }

    await prisma.savedStory.create({
      data: { userId: req.userId, storyId },
    });

    return res.status(201).json({ message: 'Saved.', saved: true });
  } catch (error) {
    console.error('Save library error:', error);
    return res.status(500).json({ error: 'Unable to save this story.' });
  }
});

router.delete('/:storyId', verifyToken, async (req, res) => {
  const storyId = getStoryId(req.params.storyId, res);
  if (!storyId) return;

  try {
    const result = await prisma.savedStory.deleteMany({
      where: { userId: req.userId, storyId },
    });

    return res.json({ message: result.count ? 'Removed.' : 'Already removed.', saved: false });
  } catch (error) {
    console.error('Remove library error:', error);
    return res.status(500).json({ error: 'Unable to remove this story.' });
  }
});

router.get('/check/:storyId', verifyToken, async (req, res) => {
  const storyId = getStoryId(req.params.storyId, res);
  if (!storyId) return;

  try {
    const saved = await prisma.savedStory.findFirst({
      where: { userId: req.userId, storyId },
      select: { id: true },
    });
    return res.json({ saved: Boolean(saved) });
  } catch (error) {
    console.error('Check library error:', error);
    return res.status(500).json({ error: 'Unable to check this story.' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const savedStories = await prisma.savedStory.findMany({
      where: { userId: req.userId },
      include: { story: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ stories: savedStories.map(({ story }) => story).filter(Boolean) });
  } catch (error) {
    console.error('Fetch library error:', error);
    return res.status(500).json({ error: 'Unable to fetch the library.' });
  }
});

module.exports = router;
