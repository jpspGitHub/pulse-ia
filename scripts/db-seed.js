const { readdir, readFile } = require('node:fs/promises');
const path = require('node:path');
const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is required.');
    process.exit(1);
  }

  const seedsDir = path.resolve(__dirname, '..', 'packages', 'db', 'seeds');
  const files = (await readdir(seedsDir)).filter((file) => file.endsWith('.sql')).sort();

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    for (const file of files) {
      const sql = await readFile(path.join(seedsDir, file), 'utf8');
      console.log(`Running seed: ${file}`);
      await client.query(sql);
    }
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
