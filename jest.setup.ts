import { Client } from 'pg';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

config({ path: '.env.test' });

const TEMPLATE_DATABASE_NAME = process.env.DATABASE_NAME!;
const GENERATED_DATABASE_NAME = `${TEMPLATE_DATABASE_NAME}-${randomUUID()}`;

const LOCK_FILE = path.join(__dirname, '.db-lock');

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: Number.parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

async function acquireLock(retries = 10): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.writeFile(LOCK_FILE, process.pid.toString(), { flag: 'wx' });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));
    }
  }
  throw new Error('Failed to acquire DB lock');
}

async function releaseLock(): Promise<void> {
  try {
    await fs.unlink(LOCK_FILE);
  } catch {
    console.error('Failed to release DB lock');
  }
}

beforeAll(async () => {
  await client.connect();

  await acquireLock();

  try {
    await client.query(
      `CREATE DATABASE "${GENERATED_DATABASE_NAME}" TEMPLATE "${TEMPLATE_DATABASE_NAME}";`,
    );
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await releaseLock();
  }

  process.env.DATABASE_NAME = GENERATED_DATABASE_NAME;
}, 100_000);

afterAll(async () => {
  await client.query(
    `DROP DATABASE IF EXISTS "${GENERATED_DATABASE_NAME}" WITH (FORCE);`,
  );
  await client.end();
}, 100_000);
