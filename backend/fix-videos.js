const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// ===== WORKING VIDEO URLs =====
const videoUrls = [
  'https://www.youtube.com/embed/mU6anWqZJcc',
  'https://www.youtube.com/embed/1Rs2ND1ryYc',
  'https://www.youtube.com/embed/3YW65K6Lc4Q',
  'https://www.youtube.com/embed/EFafSYg-PkI',
  'https://www.youtube.com/embed/srvUrASNj0s',
  'https://www.youtube.com/embed/PkZNo7MFNFg',
  'https://www.youtube.com/embed/xUJ2xYZUf9I',
  'https://www.youtube.com/embed/0ik6X4DJKCc',
  'https://www.youtube.com/embed/NCwa_xi0Uu8',
  'https://www.youtube.com/embed/V_Kr9OSfDeU',
  'https://www.youtube.com/embed/Ttf3CEsEwuo',
  'https://www.youtube.com/embed/Ke90Tje7VS0',
  'https://www.youtube.com/embed/O6P86uwfdCI',
  'https://www.youtube.com/embed/9L8FFZtDn6E',
  'https://www.youtube.com/embed/5LrDIWkK_Bc',
  'https://www.youtube.com/embed/ULcM3bHnP2Y',
  'https://www.youtube.com/embed/Oe421EPjeBE',
  'https://www.youtube.com/embed/L72fhGm1tfE',
  'https://www.youtube.com/embed/pKd0Rpw7O48',
  'https://www.youtube.com/embed/mbsmsi7l3r4',
  'https://www.youtube.com/embed/ExcRbA7fy_A',
  'https://www.youtube.com/embed/qZXt1Aom3Cs',
  'https://www.youtube.com/embed/Fn4XlVZOfq4',
  'https://www.youtube.com/embed/3dHNOWTI7H8',
  'https://www.youtube.com/embed/oxUyIzDbZts',
  'https://www.youtube.com/embed/m1_ih43p24s',
  'https://www.youtube.com/embed/0eWrpsCLMJQ',
  'https://www.youtube.com/embed/2I1xTTRZxLo',
  'https://www.youtube.com/embed/jgXHH4-ulYw',
  'https://www.youtube.com/embed/1WmNXEVia8I',
  'https://www.youtube.com/embed/OwqWwCj_zS0',
  'https://www.youtube.com/embed/2bUJmpFYqHs',
  'https://www.youtube.com/embed/1tG-t7dSVBE',
  'https://www.youtube.com/embed/Yk4DpS3A3Bw',
  'https://www.youtube.com/embed/ahCwqrYpIuM',
  'https://www.youtube.com/embed/2pZmKW9-I_k',
  'https://www.youtube.com/embed/jBmrduvX5YI',
  'https://www.youtube.com/embed/5PmHRvA8w20',
  'https://www.youtube.com/embed/ed8SzALpx1Q',
  'https://www.youtube.com/embed/lAJWHHUz8B8',
  'https://www.youtube.com/embed/_9RgH85qEdc',
  'https://www.youtube.com/embed/EjD7O8RUE04',
  'https://www.youtube.com/embed/ZVrHVFNjB6E',
  'https://www.youtube.com/embed/F5mRW0jo-U4',
  'https://www.youtube.com/embed/jBz9oRjzG2c',
  'https://www.youtube.com/embed/3t2wO7Ujf_o',
  'https://www.youtube.com/embed/s1kVUj6-XQ8',
  'https://www.youtube.com/embed/f8zDNU2wE7s',
  'https://www.youtube.com/embed/Z1RJmh_OqeA',
  'https://www.youtube.com/embed/mqhxxeeTbu0',
  'https://www.youtube.com/embed/UIJKdCIkUZU',
  'https://www.youtube.com/embed/71EU8gnZqZQ',
  'https://www.youtube.com/embed/6iFiS4gpvoo',
  'https://www.youtube.com/embed/OK_JCtrrv-c',
  'https://www.youtube.com/embed/lX1Qmb_-C1U',
  'https://www.youtube.com/embed/yPu6qV5byu4',
  'https://www.youtube.com/embed/2eebptXfEvw',
  'https://www.youtube.com/embed/BrD2qG0XG98',
  'https://www.youtube.com/embed/1I1sYyQdVrM',
  'https://www.youtube.com/embed/A5sfyQiABrY',
  'https://www.youtube.com/embed/FJZvJ7ShyMs',
  'https://www.youtube.com/embed/NUVsL6e2Fj8',
  'https://www.youtube.com/embed/4Sso4H8Txns',
  'https://www.youtube.com/embed/2uV4K3jIl0M',
  'https://www.youtube.com/embed/gT0Lh1eYk78',
  'https://www.youtube.com/embed/Sw8IpK4NwDA',
  'https://www.youtube.com/embed/aook54S7hho',
  'https://www.youtube.com/embed/VQraviuw_rU',
  'https://www.youtube.com/embed/0ohtVzCSHbo',
  'https://www.youtube.com/embed/PWAVGjNkR6M',
  'https://www.youtube.com/embed/T1qT4P4E3oE',
  'https://www.youtube.com/embed/2jqok-WgelI',
  'https://www.youtube.com/embed/GoXgl9r0Kjk',
  'https://www.youtube.com/embed/1RTwnZ8FyX4',
  'https://www.youtube.com/embed/LHBE6Q9XlzI',
  'https://www.youtube.com/embed/QUT1VHiLmmI',
  'https://www.youtube.com/embed/vmEHCJofslg',
  'https://www.youtube.com/embed/3Xc3CA655Y4',
  'https://www.youtube.com/embed/r-uOLxNrNk8',
  'https://www.youtube.com/embed/GwIo3gDZCVQ',
  'https://www.youtube.com/embed/zM4VZR0px8E',
  'https://www.youtube.com/embed/7VeUPuFGJHk',
  'https://www.youtube.com/embed/4b5d3muPQmA',
  'https://www.youtube.com/embed/0P7UXWArWPE',
  'https://www.youtube.com/embed/aircAruvnKk',
  'https://www.youtube.com/embed/YRhxdVk_sIs',
  'https://www.youtube.com/embed/8HyCNIVRbSU',
  'https://www.youtube.com/embed/TQQlZhbC5ps',
  'https://www.youtube.com/embed/0a5y4oKv7qg',
  'https://www.youtube.com/embed/c9Wg6Cb_YlU',
  'https://www.youtube.com/embed/2Hp8Zcsk-Sc',
  'https://www.youtube.com/embed/3q3FV65ZrUs',
  'https://www.youtube.com/embed/5vK2_0mHYC8',
  'https://www.youtube.com/embed/9fC1c9PK2MQ',
  'https://www.youtube.com/embed/2LksZ7Y7mHw',
  'https://www.youtube.com/embed/UHpPvKxsF5A',
  'https://www.youtube.com/embed/4s1w9Tz_Ris',
  'https://www.youtube.com/embed/5f6c_7w0pZk',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/embed/8XkH2o4xX9Q',
];

async function fix() {
  console.log('🎬 Fixing videos...');
  
  const lessons = await prisma.lesson.findMany();
  console.log(`📚 Found ${lessons.length} lessons`);

  let updated = 0;
  for (let i = 0; i < lessons.length; i++) {
    await prisma.lesson.update({
      where: { id: lessons[i].id },
      data: { videoUrl: videoUrls[i % videoUrls.length] },
    });
    updated++;
  }

  console.log(`✅ Updated ${updated} lessons!`);
  console.log('🎉 Done! Refresh your frontend.');
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());