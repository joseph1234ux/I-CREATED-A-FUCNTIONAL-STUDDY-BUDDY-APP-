const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();
const genres = ['Drama', 'Romance', 'Fantasy', 'Sci-Fi', 'Thriller', 'Mystery', 'Adventure', 'Comedy', 'Historical', 'Horror', 'Coming of Age', 'Slice of Life', 'Action', 'Crime', 'Psychological', 'Life-Changing'];
const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Sophia', 'Jackson', 'Lucas', 'Mia', 'Ethan'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const titleFor = () => `${randomItem(['The', 'A', 'One', 'My', 'Her', 'His', 'Our'])} ${randomItem(['Love', 'Lost', 'Found', 'Dream', 'Shadow', 'Light', 'Heart', 'Soul', 'Fire', 'Storm'])} ${randomItem(['Love', 'Lost', 'Found', 'Dream', 'Shadow', 'Light', 'Heart', 'Soul', 'Fire', 'Storm'])}`;
const authorFor = () => `${randomItem(firstNames)} ${randomItem(lastNames)}`;

function chapterContent(number, total, title) {
  const phase = number / total;
  const opening = phase < 0.25
    ? `The story of ${title} began on a quiet morning, before anyone understood how much could change in a single day.`
    : phase < 0.75
      ? `The middle of ${title} brought challenges that tested every promise the characters had made to themselves and one another.`
      : `As ${title} approached its climax, every choice carried the weight of everything that had come before it.`;
  return `${opening}\n\nThe road ahead was uncertain, but the details around them were unmistakably real: a familiar room, a half-finished conversation, and the memory of a decision that could no longer be avoided. They stopped long enough to listen, then chose to move forward together.\n\nEach step revealed a new truth. A small act of kindness changed the tone of the day, while an old fear surfaced at exactly the wrong moment. Rather than turn away, they faced it and discovered that courage was not the absence of fear, but the willingness to continue.\n\nBy the end of this chapter, the journey had changed everyone involved. The answer was still out of reach, but the next direction was finally clear.`;
}

function chaptersFor(count, title) {
  return Array.from({ length: count }, (_, index) => {
    const chapterNumber = index + 1;
    return {
      title: `Chapter ${chapterNumber}`,
      chapterNumber,
      content: chapterContent(chapterNumber, count, title),
    };
  });
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storyteller.com' },
    update: {},
    create: { email: 'admin@storyteller.com', passwordHash: await bcrypt.hash('admin123', 10), name: 'Admin User', role: 'ADMIN' },
  });

  for (let index = 1; index <= 20; index += 1) {
    const title = titleFor();
    const chapterCount = 110 + Math.floor(Math.random() * 11);
    const slug = `generated-story-${String(index).padStart(2, '0')}`;
    const storyData = {
      title,
      description: `A captivating ${randomItem(genres).toLowerCase()} story about love, loss, and the human spirit.`,
      category: randomItem(genres),
      author: authorFor(),
      authorId: admin.id,
      userId: admin.id,
      isPublished: true,
      totalReaders: Math.floor(Math.random() * 50000) + 500,
      views: Math.floor(Math.random() * 100000) + 1000,
      likes: Math.floor(Math.random() * 5000) + 100,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      publishedYear: 2010 + Math.floor(Math.random() * 16),
      status: randomItem(['Completed', 'Ongoing']),
    };

    // Nested writes are atomic: a story is never left behind without its chapters.
    const story = await prisma.story.upsert({
      where: { slug },
      update: {
        ...storyData,
        chapters: { deleteMany: {}, create: chaptersFor(chapterCount, title) },
      },
      create: {
        slug,
        ...storyData,
        chapters: { create: chaptersFor(chapterCount, title) },
      },
      include: { _count: { select: { chapters: true } } },
    });

    if (story._count.chapters !== chapterCount) throw new Error(`Story ${story.id} has an incomplete chapter set.`);
    console.log(`Created ${story.title}: ${story._count.chapters} chapters`);
  }

  const storiesWithoutChapters = await prisma.story.findMany({
    where: { category: { not: 'Poetry' }, chapters: { none: {} } },
    select: { id: true, title: true },
  });

  for (const story of storiesWithoutChapters) {
    const chapterCount = 110 + Math.floor(Math.random() * 11);
    await prisma.chapter.createMany({
      data: chaptersFor(chapterCount, story.title).map((chapter) => ({ ...chapter, storyId: story.id })),
    });
    console.log(`Repaired ${story.title}: ${chapterCount} chapters`);
  }

  const [stories, chapters] = await Promise.all([prisma.story.count(), prisma.chapter.count()]);
  console.log(`Story seed complete: ${stories} stories and ${chapters} chapters.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
