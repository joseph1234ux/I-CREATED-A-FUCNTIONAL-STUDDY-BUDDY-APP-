const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

const genres = [
  'Drama', 'Romance', 'Fantasy', 'Sci-Fi', 'Thriller',
  'Mystery', 'Adventure', 'Comedy', 'Historical', 'Horror',
  'Coming of Age', 'Slice of Life', 'Action', 'Crime',
  'Psychological', 'Life-Changing'
];

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Sophia', 'Jackson', 'Lucas', 'Mia', 'Ethan', 'Charlotte', 'Logan', 'Amelia', 'Oliver', 'Ella', 'James', 'Grace', 'Benjamin', 'Chloe', 'Alexander', 'Lily', 'Daniel', 'Zoe', 'Matthew', 'Nora', 'Joseph', 'Riley', 'Samuel', 'Aria', 'David', 'Emily', 'Michael', 'Abigail', 'Andrew', 'Ellie', 'Joshua', 'Hannah', 'William', 'Sofia', 'Gabriel', 'Madison', 'Robert', 'Evelyn', 'Nathan', 'Mila', 'Elijah', 'Leah', 'Caleb', 'Avery', 'Harper', 'Henry', 'Ella', 'Scarlett', 'Wyatt', 'Luna', 'Carter', 'Aurora', 'Julian', 'Hazel', 'Isaac', 'Nova', 'Levi', 'Amara', 'Eli', 'Isla', 'Sebastian', 'Aria', 'Owen', 'Maya', 'Leo', 'Sage', 'Ezra', 'Iris', 'Miles', 'Athena', 'Finn', 'Willow', 'Jasper', 'Elara', 'Silas', 'Nova', 'Declan', 'Freya', 'Kai', 'Lyra', 'Micah', 'Zara', 'Rowan', 'Thea', 'Asher', 'Selene', 'Griffin', 'Aurora', 'Bodhi', 'Luna', 'Wilder', 'Ivy'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Turner', 'Phillips', 'Evans', 'Collins', 'Edwards', 'Stewart', 'Morris', 'Murphy', 'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'James', 'Reyes', 'Cruz', 'Hughes', 'Price', 'Myers', 'Long', 'Foster', 'Sanders', 'Ross', 'Powell', 'Sullivan', 'Russell', 'Ortiz', 'Jenkins', 'Perry', 'Butler', 'Barnes', 'Fisher', 'Henderson', 'Coleman', 'Simmons', 'Patterson', 'Jordan', 'Reynolds', 'Hamilton', 'Graham'];

const titlePrefixes = ['The', 'A', 'One', 'My', 'Her', 'His', 'Our', 'Your', 'Their', 'When', 'Where', 'How', 'Why', 'Before', 'After', 'Through', 'Beyond', 'Into', 'Between', 'Among', 'Upon', 'Within', 'Without'];
const titleWords = ['Love', 'Lost', 'Found', 'Dream', 'Shadow', 'Light', 'Dark', 'Heart', 'Soul', 'Fire', 'Ice', 'Storm', 'Wind', 'Sky', 'Earth', 'Sea', 'Star', 'Moon', 'Sun', 'Night', 'Day', 'Time', 'Hope', 'Faith', 'Truth', 'Destiny', 'Fate', 'Journey', 'Quest', 'Secret', 'Silence', 'Echo', 'Whisper', 'Promise', 'Legacy', 'Crown', 'Throne', 'Empire', 'Kingdom', 'Garden', 'Forest', 'Mountain', 'River', 'Bridge', 'Door', 'Window', 'Mirror', 'Clock', 'Key', 'Song', 'Dance', 'Memory', 'Dreams', 'Wings', 'Flame', 'Ghost', 'Angel', 'Hero', 'Legend', 'Myth', 'Tale', 'Story'];

const statuses = ['Completed', 'Ongoing'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTitle() {
  const prefix = getRandomItem(titlePrefixes);
  const word1 = getRandomItem(titleWords);
  const word2 = getRandomItem(titleWords);
  return `${prefix} ${word1} ${word2}`;
}

function generateDescription(genre) {
  const templates = [
    `A captivating ${genre.toLowerCase()} story about love, loss, and the human spirit.`,
    `When everything changes, one person must find the courage to ${getRandomItem(['hope', 'believe', 'dream', 'overcome'])}.`,
    `In a world where ${getRandomItem(['nothing is as it seems', 'everyone has a secret', 'fate plays its hand', 'dreams come true'])}, one ${getRandomItem(['heart', 'soul', 'journey', 'destiny'])} will ${getRandomItem(['change everything', 'find its way', 'rise again', 'never be the same'])}.`,
    `A ${genre.toLowerCase()} that will ${getRandomItem(['break your heart', 'make you believe', 'stay with you forever', 'change how you see the world'])}.`
  ];
  return getRandomItem(templates);
}

function generateAuthor() {
  return `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
}

function generateStory(index) {
  const genre = getRandomItem(genres);
  const title = generateTitle();
  const status = getRandomItem(statuses);
  
  return {
    title: `${title}`,
    category: genre,
    author: generateAuthor(),
    description: generateDescription(genre),
    content: `This is the story of ${generateAuthor()} who discovered that ${getRandomItem(['love conquers all', 'fate has a plan', 'courage comes from within', 'family is everything', 'truth will set you free', 'hope never dies'])}...`,
    status: status,
    isPublished: true,
    totalReaders: Math.floor(Math.random() * 50000) + 500,
    views: Math.floor(Math.random() * 100000) + 1000,
    likes: Math.floor(Math.random() * 5000) + 100,
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    publishedYear: 2010 + Math.floor(Math.random() * 16),
  };
}

async function main() {
  console.log('🌱 Seeding 500 stories...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@storyteller.com' },
    update: {},
    create: {
      email: 'admin@storyteller.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user ready:', admin.email);

  const batchSize = 50;
  let count = 0;

  for (let i = 0; i < 500; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, 500); j++) {
      const data = generateStory(j + 1);
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + `-${j + 1}`;
      batch.push({
        slug: slug,
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        author: data.author,
        authorId: admin.id,
        userId: admin.id,
        isPublished: data.isPublished,
        totalReaders: data.totalReaders,
        views: data.views,
        likes: data.likes,
        rating: data.rating,
        publishedYear: data.publishedYear,
        status: data.status,
      });
    }

    await prisma.story.createMany({
      data: batch,
      skipDuplicates: true,
    });

    count += batch.length;
    console.log(`✅ ${count}/500 stories added...`);
  }

  const storyCount = await prisma.story.count();
  console.log(`🌱 Seeding complete! ${storyCount} stories ready.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

const genres = [
  'Drama', 'Romance', 'Fantasy', 'Sci-Fi', 'Thriller',
  'Mystery', 'Adventure', 'Comedy', 'Historical', 'Horror',
  'Coming of Age', 'Slice of Life', 'Action', 'Crime',
  'Psychological', 'Life-Changing'
];

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Sophia', 'Jackson', 'Lucas', 'Mia', 'Ethan', 'Charlotte', 'Logan', 'Amelia', 'Oliver', 'Ella', 'James', 'Grace', 'Benjamin', 'Chloe', 'Alexander', 'Lily', 'Daniel', 'Zoe', 'Matthew', 'Nora', 'Joseph', 'Riley', 'Samuel', 'Aria', 'David', 'Emily', 'Michael', 'Abigail', 'Andrew', 'Ellie', 'Joshua', 'Hannah', 'William', 'Sofia', 'Gabriel', 'Madison', 'Robert', 'Evelyn', 'Nathan', 'Mila', 'Elijah', 'Leah', 'Caleb', 'Avery', 'Harper', 'Henry', 'Ella', 'Scarlett', 'Wyatt', 'Luna', 'Carter', 'Aurora', 'Julian', 'Hazel', 'Isaac', 'Nova', 'Levi', 'Amara', 'Eli', 'Isla', 'Sebastian', 'Aria', 'Owen', 'Maya', 'Leo', 'Sage', 'Ezra', 'Iris', 'Miles', 'Athena', 'Finn', 'Willow', 'Jasper', 'Elara', 'Silas', 'Nova', 'Declan', 'Freya', 'Kai', 'Lyra', 'Micah', 'Zara', 'Rowan', 'Thea', 'Asher', 'Selene', 'Griffin', 'Aurora', 'Bodhi', 'Luna', 'Wilder', 'Ivy'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Turner', 'Phillips', 'Evans', 'Collins', 'Edwards', 'Stewart', 'Morris', 'Murphy', 'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'James', 'Reyes', 'Cruz', 'Hughes', 'Price', 'Myers', 'Long', 'Foster', 'Sanders', 'Ross', 'Powell', 'Sullivan', 'Russell', 'Ortiz', 'Jenkins', 'Perry', 'Butler', 'Barnes', 'Fisher', 'Henderson', 'Coleman', 'Simmons', 'Patterson', 'Jordan', 'Reynolds', 'Hamilton', 'Graham'];

const titlePrefixes = ['The', 'A', 'One', 'My', 'Her', 'His', 'Our', 'Your', 'Their', 'When', 'Where', 'How', 'Why', 'Before', 'After', 'Through', 'Beyond', 'Into', 'Between', 'Among', 'Upon', 'Within', 'Without'];
const titleWords = ['Love', 'Lost', 'Found', 'Dream', 'Shadow', 'Light', 'Dark', 'Heart', 'Soul', 'Fire', 'Ice', 'Storm', 'Wind', 'Sky', 'Earth', 'Sea', 'Star', 'Moon', 'Sun', 'Night', 'Day', 'Time', 'Hope', 'Faith', 'Truth', 'Destiny', 'Fate', 'Journey', 'Quest', 'Secret', 'Silence', 'Echo', 'Whisper', 'Promise', 'Legacy', 'Crown', 'Throne', 'Empire', 'Kingdom', 'Garden', 'Forest', 'Mountain', 'River', 'Bridge', 'Door', 'Window', 'Mirror', 'Clock', 'Key', 'Song', 'Dance', 'Memory', 'Dreams', 'Wings', 'Flame', 'Ghost', 'Angel', 'Hero', 'Legend', 'Myth', 'Tale', 'Story'];

const statuses = ['Completed', 'Ongoing'];

// ===== COVER GENERATION =====
const coverGradients = [
  'linear-gradient(135deg, #E50914, #8B5CF6)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
  'linear-gradient(135deg, #22C55E, #14B8A6)',
  'linear-gradient(135deg, #F59E0B, #F97316)',
  'linear-gradient(135deg, #3B82F6, #06B6D4)',
  'linear-gradient(135deg, #EC4899, #D946EF)',
  'linear-gradient(135deg, #6366F1, #8B5CF6)',
  'linear-gradient(135deg, #84CC16, #22C55E)',
  'linear-gradient(135deg, #F43F5E, #FB7185)',
  'linear-gradient(135deg, #0EA5E9, #38BDF8)',
];

const coverEmojis = [
  '📖', '📚', '📕', '📗', '📘', '📙', '📓', '📔',
  '❤️', '🔥', '⭐', '🌟', '💫', '✨', '🌈', '🎯',
  '📝', '🎭', '🎨', '🎬', '🎵', '🎶', '🎸', '🎪',
];

function getCoverGradient(id) {
  return coverGradients[id % coverGradients.length];
}

function getCoverEmoji(id) {
  return coverEmojis[id % coverEmojis.length];
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTitle() {
  const prefix = getRandomItem(titlePrefixes);
  const word1 = getRandomItem(titleWords);
  const word2 = getRandomItem(titleWords);
  return `${prefix} ${word1} ${word2}`;
}

function generateDescription(genre) {
  const templates = [
    `A captivating ${genre.toLowerCase()} story about love, loss, and the human spirit.`,
    `When everything changes, one person must find the courage to ${getRandomItem(['hope', 'believe', 'dream', 'overcome'])}.`,
    `In a world where ${getRandomItem(['nothing is as it seems', 'everyone has a secret', 'fate plays its hand', 'dreams come true'])}, one ${getRandomItem(['heart', 'soul', 'journey', 'destiny'])} will ${getRandomItem(['change everything', 'find its way', 'rise again', 'never be the same'])}.`,
    `A ${genre.toLowerCase()} that will ${getRandomItem(['break your heart', 'make you believe', 'stay with you forever', 'change how you see the world'])}.`
  ];
  return getRandomItem(templates);
}

function generateAuthor() {
  return `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
}

function generateStory(index) {
  const genre = getRandomItem(genres);
  const title = generateTitle();
  const status = getRandomItem(statuses);
  
  return {
    title: `${title}`,
    category: genre,
    author: generateAuthor(),
    description: generateDescription(genre),
    content: `This is the story of ${generateAuthor()} who discovered that ${getRandomItem(['love conquers all', 'fate has a plan', 'courage comes from within', 'family is everything', 'truth will set you free', 'hope never dies'])}...`,
    status: status,
    isPublished: true,
    totalReaders: Math.floor(Math.random() * 50000) + 500,
    views: Math.floor(Math.random() * 100000) + 1000,
    likes: Math.floor(Math.random() * 5000) + 100,
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    publishedYear: 2010 + Math.floor(Math.random() * 16),
    cover: `${getCoverGradient(index)}|${getCoverEmoji(index)}`, // ← ADDED COVER
  };
}

async function main() {
  console.log('🌱 Seeding 500 stories...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@storyteller.com' },
    update: {},
    create: {
      email: 'admin@storyteller.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user ready:', admin.email);

  const batchSize = 50;
  let count = 0;

  for (let i = 0; i < 500; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, 500); j++) {
      const data = generateStory(j + 1);
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + `-${j + 1}`;
      batch.push({
        slug: slug,
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        author: data.author,
        authorId: admin.id,
        userId: admin.id,
        isPublished: data.isPublished,
        totalReaders: data.totalReaders,
        views: data.views,
        likes: data.likes,
        rating: data.rating,
        publishedYear: data.publishedYear,
        status: data.status,
        cover: data.cover, // ← ADDED COVER
      });
    }

    await prisma.story.createMany({
      data: batch,
      skipDuplicates: true,
    });

    count += batch.length;
    console.log(`✅ ${count}/500 stories added...`);
  }

  const storyCount = await prisma.story.count();
  console.log(`🌱 Seeding complete! ${storyCount} stories ready.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });