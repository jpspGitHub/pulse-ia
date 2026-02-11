const { Client } = require('pg');
const path = require('node:path');
const { readdir, readFile } = require('node:fs/promises');
require('dotenv').config();

async function runMigrations(client) {
  const migrationsDir = path.resolve(__dirname, '..', '..', 'packages', 'db', 'migrations');
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    console.log(`Running migration: ${file}`);
    await client.query(sql);
  }
}

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
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is required.');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    console.log('Resetting database schema...');
    await client.query('DROP SCHEMA IF EXISTS public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO public');

    await runMigrations(client);
    await runSeeds(client);
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
