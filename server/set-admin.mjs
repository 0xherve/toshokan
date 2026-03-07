import { Pool } from "pg";

const email = process.argv[2];

if (!email) {
  console.error("Usage: bun run auth:make-admin -- <email>");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  password: process.env.DATABASE_PASSWORD || undefined,
});

try {
  const { rows } = await pool.query(
    `update "user"
      set role = 'admin'
      where lower(email) = lower($1)
      returning id, email, role`,
    [email],
  );

  if (rows.length === 0) {
    console.error(`No user found for ${email}`);
    process.exitCode = 1;
  } else {
    console.log(`Updated ${rows[0].email} to role=${rows[0].role}`);
  }
} finally {
  await pool.end();
}
