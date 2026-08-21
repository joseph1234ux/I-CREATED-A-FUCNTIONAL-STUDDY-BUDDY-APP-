const mysql = require('mysql2');
const { exec } = require('child_process');

console.log('🌱 Waking up database...');

const conn = mysql.createConnection(
  'mysql://root:trPSFyhpruAAiEcUgqmnplHBLgfhehfW@sakura.proxy.rlwy.net:41516/railway'
);

conn.connect((err) => {
  if (err) {
    console.log('❌ Failed to connect:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Database awake! Running seed...');
  conn.end();

  // Run seed immediately
  const seed = exec('npm run seed', (error, stdout, stderr) => {
    console.log(stdout);
    if (error) {
      console.error('❌ Seed error:', error);
    }
  });
});