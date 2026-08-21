const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get author profile + their stories
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid author ID' });

    const author = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: { stories: true },
        },
      },
    });

    if (!author) return res.status(404).json({ error: 'Author not found' });

    const stories = await prisma.story.findMany({
      where: {
        authorId: id,
        isPublished: true,
        category: { not: 'Poetry' },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        chapters: { select: { id: true } },
      },
    });

    const storiesWithCount = stories.map((story) => ({
      ...story,
      chapterCount: story.chapters.length,
      chapters: undefined,
    }));

    res.json({
      author: {
        ...author,
        storyCount: author._count.stories,
      },
      stories: storiesWithCount,
    });
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get authors list
router.get('/', async (req, res) => {
  try {
    const authors = await prisma.user.findMany({
      where: {
        stories: { some: { isPublished: true } },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        _count: {
          select: { stories: true },
        },
      },
      orderBy: { stories: { _count: 'desc' } },
      take: 50,
    });
    res.json({ authors });
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;