const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

const poems = [
  {
    title: "The Road Not Taken",
    author: "Robert Frost",
    content: `Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same,

And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.

I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.`
  },
  {
    title: "Still I Rise",
    author: "Maya Angelou",
    content: `You may write me down in history
With your bitter, twisted lies,
You may trod me in the very dirt
But still, like dust, I'll rise.

Does my sassiness upset you?
Why are you beset with gloom?
'Cause I walk like I've got oil wells
Pumping in my living room.

Just like moons and like suns,
With the certainty of tides,
Just like hopes springing high,
Still I'll rise.

Did you want to see me broken?
Bowed head and lowered eyes?
Shoulders falling down like teardrops,
Weakened by my soulful cries?

Does my haughtiness offend you?
Don't you take it awful hard
'Cause I laugh like I've got gold mines
Diggin' in my own back yard.

You may shoot me with your words,
You may cut me with your eyes,
But still, like air, I'll rise.`
  },
  {
    title: "The Raven",
    author: "Edgar Allan Poe",
    content: `Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
While I nodded, nearly napping, suddenly there came a tapping,
As of some one gently rapping, rapping at my chamber door.
"'Tis some visitor," I muttered, "tapping at my chamber door—
            Only this and nothing more."

Ah, distinctly I remember it was in the bleak December;
And each separate dying ember wrought its ghost upon the floor.
Eagerly I wished the morrow;—vainly I had sought to borrow
From my books surcease of sorrow—sorrow for the lost Lenore—
For the rare and radiant maiden whom the angels name Lenore—
            Nameless here for evermore.

And the silken, sad, uncertain rustling of each purple curtain
Thrilled me—filled me with fantastic terrors never felt before;
So that now, to still the beating of my heart, I stood repeating
"'Tis some visitor entreating entrance at my chamber door—
Some late visitor entreating entrance at my chamber door;—
            This it is and nothing more."`
  },
  {
    title: "Invictus",
    author: "William Ernest Henley",
    content: `Out of the night that covers me,
Black as the pit from pole to pole,
I thank whatever gods may be
For my unconquerable soul.

In the fell clutch of circumstance
I have not winced nor cried aloud.
Under the bludgeonings of chance
My head is bloody, but unbowed.

Beyond this place of wrath and tears
Looms but the Horror of the shade,
And yet the menace of the years
Finds and shall find me unafraid.

It matters not how strait the gate,
How charged with punishments the scroll,
I am the master of my fate,
I am the captain of my soul.`
  },
  {
    title: "Hope is the thing with feathers",
    author: "Emily Dickinson",
    content: `"Hope" is the thing with feathers –
That perches in the soul –
And sings the tune without the words –
And never stops – at all –

And sweetest – in the Gale – is heard –
And sore must be the storm –
That could abash the little Bird
That kept so many warm –

I've heard it in the chillest land –
And on the strangest Sea –
Yet, never, in Extremity,
It asked a crumb – of Me.`
  },
  {
    title: "I Wandered Lonely as a Cloud",
    author: "William Wordsworth",
    content: `I wandered lonely as a cloud
That floats on high o'er vales and hills,
When all at once I saw a crowd,
A host, of golden daffodils;
Beside the lake, beneath the trees,
Fluttering and dancing in the breeze.

Continuous as the stars that shine
And twinkle on the milky way,
They stretched in never-ending line
Along the margin of a bay:
Ten thousand saw I at a glance,
Tossing their heads in sprightly dance.

The waves beside them danced; but they
Out-did the sparkling waves in glee:
A poet could not but be gay,
In such a jocund company:
I gazed—and gazed—but little thought
What wealth the show to me had brought:

For oft, when on my couch I lie
In vacant or in pensive mood,
They flash upon that inward eye
Which is the bliss of solitude;
And then my heart with pleasure fills,
And dances with the daffodils.`
  },
  {
    title: "Do Not Go Gentle into That Good Night",
    author: "Dylan Thomas",
    content: `Do not go gentle into that good night,
Old age should burn and rave at close of day;
Rage, rage against the dying of the light.

Though wise men at their end know dark is right,
Because their words had forked no lightning they
Do not go gentle into that good night.

Good men, the last wave by, crying how bright
Their frail deeds might have danced in a green bay,
Rage, rage against the dying of the light.

Wild men who caught and sang the sun in flight,
And learn, too late, they grieved it on its way,
Do not go gentle into that good night.

Grave men, near death, who see with blinding sight
Blind eyes could blaze like meteors and be gay,
Rage, rage against the dying of the light.

And you, my father, there on the sad height,
Curse, bless, me now with your fierce tears, I pray.
Do not go gentle into that good night.
Rage, rage against the dying of the light.`
  },
  {
    title: "Because I could not stop for Death",
    author: "Emily Dickinson",
    content: `Because I could not stop for Death –
He kindly stopped for me –
The Carriage held but just Ourselves –
And Immortality.

We slowly drove – He knew no haste
And I had put away
My labor and my leisure too,
For His Civility –

We passed the School, where Children strove
At Recess – in the Ring –
We passed the Fields of Gazing Grain –
We passed the Setting Sun –

Or rather – He passed Us –
The Dews drew quivering and Chill –
For only Gossamer, my Gown –
My Tippet – only Tulle –

We paused before a House that seemed
A Swelling of the Ground –
The Roof was scarcely visible –
The Cornice – in the Ground –

Since then – 'tis Centuries – and yet
Feels shorter than the Day
I first surmised the Horses' Heads
Were toward Eternity –`
  }
];

async function main() {
  console.log('📝 Seeding poems...');

  const admin = await prisma.user.findFirst({
    where: { email: 'admin@storyteller.com' }
  });

  if (!admin) {
    console.log('❌ Admin not found. Please run generateStories.js first.');
    return;
  }

  let added = 0;
  for (const poem of poems) {
    const slug = poem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const exists = await prisma.story.findUnique({ where: { slug } });
    if (exists) {
      await prisma.story.update({
        where: { id: exists.id },
        data: {
          title: poem.title,
          description: `A classic poem by ${poem.author}`,
          content: poem.content,
          category: 'Poetry',
          author: poem.author,
          authorId: admin.id,
          userId: admin.id,
          isPublished: true,
          status: 'Completed',
          chapters: {
            deleteMany: {},
            create: {
              title: poem.title,
              chapterNumber: 1,
              content: poem.content,
              wordCount: poem.content.trim().split(/\s+/).length,
            },
          },
        },
      });
      added++;
      console.log(`⏭️ Skipping "${poem.title}" (already exists)`);
      continue;
    }
    await prisma.story.create({
      data: {
        slug,
        title: poem.title,
        description: `A classic poem by ${poem.author}`,
        content: poem.content,
        category: 'Poetry',
        author: poem.author,
        authorId: admin.id,
        userId: admin.id,
        isPublished: true,
        totalReaders: Math.floor(Math.random() * 5000) + 100,
        views: Math.floor(Math.random() * 10000) + 500,
        likes: Math.floor(Math.random() * 200) + 10,
        rating: 4.5,
        publishedYear: 1800 + Math.floor(Math.random() * 200),
        status: 'Completed',
        chapters: {
          create: {
            title: poem.title,
            chapterNumber: 1,
            content: poem.content,
            wordCount: poem.content.trim().split(/\s+/).length,
          },
        },
      },
    });
    added++;
    console.log(`✅ Added poem: "${poem.title}"`);
  }
  console.log(`📊 Added ${added} poems.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
