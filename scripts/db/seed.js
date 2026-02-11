const { readdir, readFile } = require('node:fs/promises');
const path = require('node:path');
const { Client } = require('pg');
const { loadEnv } = require('./env');

async function runSeeds(client) {
  const seedsDir = path.resolve(__dirname, '..', '..', 'packages', 'db', 'seeds');
  const files = (await readdir(seedsDir)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = await readFile(path.join(seedsDir, file), 'utf8');
    console.log(`Running seed: ${file}`);
    await client.query(sql);
  }
}

async function run() {
  const env = loadEnv();
  const databaseUrl = env.databaseUrl;
  if (!databaseUrl) {
    console.error('DATABASE_URL is required.');
    console.error(`Loaded env files: ${env.loaded.length > 0 ? env.loaded.join(', ') : 'none'}`);
    console.error(`Checked paths: ${env.candidates.join(', ')}`);
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await runSeeds(client);
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
